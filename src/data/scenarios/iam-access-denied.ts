import type { ScenarioDefinition } from "@/types/scenario";

const requestedObject = "arn:aws:s3:::cloudops-reports/private/monthly-report.csv";

export const iamAccessDeniedScenario = {
  id: "aws:iam-access-denied",
  slug: "iam-access-denied",
  providerId: "aws",
  trackId: "aws-foundations",
  title: "IAM Access Denied",
  summary: "Zdiagnozuj, dlaczego funkcja raportowa nie może odczytać prywatnego raportu z Amazon S3, i wybierz naprawę zgodną z Least Privilege.",
  difficulty: "beginner",
  estimatedMinutes: 12,
  relatedModuleIds: ["aws:iam", "aws:s3"],
  learningObjectives: [
    "odczytać Principal, Action i Resource z komunikatu AccessDenied",
    "porównać żądany ARN z zakresem Resource w IAM Policy",
    "odróżnić brak skutecznego Allow od jawnego Deny",
    "zaproponować minimalny zakres uprawnień do obiektu S3",
  ],
  briefing: {
    incidentTitle: "Funkcja raportowa nie może odczytać miesięcznego raportu",
    situation: "Funkcja Lambda generująca raporty działa z rolą IAM reporting-lambda-role. Podczas przygotowywania miesięcznego zestawienia próbuje pobrać plik CSV z bucketa cloudops-reports.",
    expectedBehavior: "Funkcja powinna odczytać miesięczny raport i kontynuować generowanie zestawienia.",
    observedBehavior: "Wywołanie kończy się błędem AccessDenied dla operacji s3:GetObject.",
    task: "Ustal tożsamość wykonującą żądanie, odrzuconą operację i zasób, znajdź jednoznaczną przyczynę w politykach oraz wybierz najbezpieczniejszą naprawę.",
  },
  evidence: [
    {
      id: "application-error",
      type: "log",
      label: "Log",
      title: "Komunikat aplikacji",
      description: "Błąd zapisany przez funkcję raportową.",
      content: `Unable to load monthly report.
AccessDenied: User:
arn:aws:sts::123456789012:assumed-role/reporting-lambda-role/reporting-function
is not authorized to perform:
s3:GetObject
on resource:
${requestedObject}`,
    },
    {
      id: "simulated-diagnostic-event",
      type: "log",
      label: "Symulowany log",
      title: "Zdarzenie diagnostyczne",
      description: "Uproszczony, symulowany materiał przypominający strukturę CloudTrail. Nie jest prawdziwym eksportem CloudTrail.",
      language: "json",
      content: `{
  "eventSource": "s3.amazonaws.com",
  "eventName": "GetObject",
  "principalArn": "arn:aws:sts::123456789012:assumed-role/reporting-lambda-role/reporting-function",
  "resource": "${requestedObject}",
  "errorCode": "AccessDenied",
  "errorMessage": "No identity-based policy allows the s3:GetObject action"
}`,
    },
    {
      id: "identity-policy",
      type: "policy",
      label: "Policy",
      title: "Identity-based policy roli",
      description: "Polityka dołączona do reporting-lambda-role.",
      language: "json",
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadPublicReports",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cloudops-reports/public/*"
    }
  ]
}`,
    },
    {
      id: "request-details",
      type: "request",
      label: "Request",
      title: "Informacje o żądaniu",
      language: "json",
      content: `{
  "Principal": "reporting-lambda-role (assumed by reporting-function)",
  "Action": "s3:GetObject",
  "Resource": "${requestedObject}",
  "Result": "AccessDenied"
}`,
    },
    {
      id: "bucket-policy",
      type: "configuration",
      label: "Configuration",
      title: "Bucket Policy",
      description: "Bucket Policy nie zawiera reguły, która dla tego Principal nadawałaby dodatkowe uprawnienie lub wprowadzała jawny Deny.",
      language: "json",
      content: `{
  "Version": "2012-10-17",
  "Statement": []
}`,
    },
  ],
  questions: [
    {
      id: "principal",
      type: "single-choice",
      prompt: "Kto wykonuje odrzucone żądanie?",
      evidenceIds: ["application-error", "simulated-diagnostic-event", "request-details"],
      answers: [
        { id: "reporting-role", text: "Rola reporting-lambda-role przyjęta przez funkcję Lambda reporting-function." },
        { id: "bucket-owner", text: "Właściciel bucketa cloudops-reports." },
        { id: "anonymous-user", text: "Anonimowy użytkownik internetu." },
        { id: "cloudtrail-service", text: "Usługa CloudTrail zapisująca zdarzenie." },
      ],
      correctAnswerId: "reporting-role",
      explanation: "ARN STS assumed-role wskazuje rolę reporting-lambda-role oraz sesję reporting-function. To ta tymczasowa tożsamość wykonuje żądanie.",
    },
    {
      id: "action",
      type: "single-choice",
      prompt: "Jaka operacja została odrzucona?",
      evidenceIds: ["application-error", "simulated-diagnostic-event", "request-details"],
      answers: [
        { id: "get-object", text: "s3:GetObject" },
        { id: "list-bucket", text: "s3:ListBucket" },
        { id: "put-object", text: "s3:PutObject" },
        { id: "assume-role", text: "sts:AssumeRole" },
      ],
      correctAnswerId: "get-object",
      explanation: "Komunikat błędu i zdarzenie diagnostyczne wskazują odczyt obiektu: s3:GetObject.",
    },
    {
      id: "resource",
      type: "single-choice",
      prompt: "Którego zasobu dotyczy odrzucone żądanie?",
      evidenceIds: ["application-error", "request-details"],
      answers: [
        { id: "private-report", text: requestedObject },
        { id: "public-prefix", text: "arn:aws:s3:::cloudops-reports/public/*" },
        { id: "bucket-only", text: "arn:aws:s3:::cloudops-reports" },
        { id: "role-arn", text: "arn:aws:iam::123456789012:role/reporting-lambda-role" },
      ],
      correctAnswerId: "private-report",
      explanation: "Resource w żądaniu jest ARN-em konkretnego obiektu private/monthly-report.csv, a nie ARN-em bucketa, roli ani publicznego prefixu.",
    },
    {
      id: "root-cause",
      type: "single-choice",
      prompt: "Dlaczego istniejące Allow nie nadaje dostępu?",
      evidenceIds: ["identity-policy", "request-details", "bucket-policy"],
      answers: [
        { id: "resource-mismatch", text: "Policy zezwala na public/*, ale żądanie dotyczy private/*. Resource nie pasuje, więc brak skutecznego Allow." },
        { id: "explicit-deny", text: "Bucket Policy zawiera jawny Deny dla roli." },
        { id: "wrong-action", text: "Policy zezwala wyłącznie na s3:PutObject." },
        { id: "expired-keys", text: "Stałe Access Keys użytkownika wygasły." },
      ],
      correctAnswerId: "resource-mismatch",
      explanation: "Action pasuje, lecz Allow obowiązuje tylko dla ARN-ów pod public/*. Żądany obiekt jest pod private/*; bez pasującego Allow decyzją jest AccessDenied.",
    },
    {
      id: "correct-fix",
      type: "single-choice",
      prompt: "Która naprawa jest najlepsza i zgodna z zasadą Least Privilege?",
      evidenceIds: ["identity-policy", "request-details"],
      answers: [
        { id: "narrow-resource", text: "Dodać s3:GetObject wyłącznie dla wymaganego obiektu albo prefixu private/*, jeśli aplikacja rzeczywiście potrzebuje wszystkich prywatnych raportów." },
        { id: "s3-star", text: "Nadać roli s3:* na wszystkie zasoby (*)." },
        { id: "administrator", text: "Dołączyć do roli AdministratorAccess." },
        { id: "access-keys", text: "Zapisać w kodzie funkcji Access Keys użytkownika z szerokimi uprawnieniami i wyłączyć zabezpieczenia bucketa." },
      ],
      correctAnswerId: "narrow-resource",
      explanation: "Minimalny Allow powinien obejmować potrzebną akcję i najmniejszy uzasadniony Resource: konkretny obiekt lub wymagany prefix.",
    },
  ],
  passingScore: 4,
  debrief: {
    rootCause: "Rola miała pozwolenie na odczyt wyłącznie obiektów w public/*. Żądanie dotyczyło private/monthly-report.csv. Action s3:GetObject pasowała, ale ARN zasobu nie pasował do Resource w identity-based policy, dlatego nie istniał skuteczny Allow. Nie było jawnego Deny ani drugiej równorzędnej przyczyny.",
    correctFix: "Przyznać roli s3:GetObject tylko do potrzebnego obiektu albo do właściwego prefixu private/*, jeśli udokumentowane wymagania aplikacji obejmują wszystkie prywatne raporty.",
    fixExamples: [
      {
        id: "exact-object-fix",
        type: "policy",
        label: "Policy — dokładny obiekt",
        title: "Najwęższy zakres",
        language: "json",
        content: `{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "${requestedObject}"
}`,
      },
      {
        id: "prefix-fix",
        type: "policy",
        label: "Policy — wymagany prefix",
        title: "Zakres dla wszystkich prywatnych raportów",
        language: "json",
        content: `{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::cloudops-reports/private/*"
}`,
      },
    ],
    whyItWorks: "Żądający Principal pozostaje rolą reporting-lambda-role, Effect jawnie zezwala, Action dokładnie odpowiada s3:GetObject, a Resource zaczyna pasować do ARN-u wymaganego obiektu. Zakres nie daje aplikacji operacji zapisu ani dostępu do innych bucketów.",
    unsafeFixes: [
      "AdministratorAccess usuwa granice uprawnień i daje funkcji możliwości niezwiązane z raportowaniem.",
      "s3:* na * pozwala wykonywać wszystkie operacje S3 na wszystkich dostępnych zasobach zamiast jednego uzasadnionego odczytu.",
      "Stałe Access Keys w kodzie tworzą długotrwały sekret podatny na wyciek; workload powinien używać roli i tymczasowych poświadczeń.",
      "Wyłączenie Block Public Access nie naprawia niedopasowania identity policy i zwiększa ryzyko przypadkowego upublicznienia danych.",
      "Publiczny bucket udostępniłby dane znacznie szerzej niż wymaga tego funkcja i nie jest rozwiązaniem problemu autoryzacji roli.",
    ],
    prevention: [
      "Testuj polityki na reprezentatywnych żądaniach przed wdrożeniem.",
      "Stosuj Least Privilege dla Action i Resource.",
      "Przeglądaj pełne ARN-y zasobów, w tym prefixy kluczy S3.",
      "Używaj czytelnych nazw Statement i wartości Sid opisujących zakres.",
      "Monitoruj zdarzenia AccessDenied i łącz je z kontekstem aplikacji.",
      "Dokumentuj wymagany zakres dostępu każdego workloadu.",
    ],
  },
} as const satisfies ScenarioDefinition;
