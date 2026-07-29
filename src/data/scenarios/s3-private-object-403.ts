import type { ScenarioDefinition } from "@/types/scenario";

const bucketName = "cloudops-customer-reports";
const objectKey = "reports/customer-1024/monthly-report.pdf";
const objectUrl = `https://${bucketName}.s3.eu-central-1.amazonaws.com/${objectKey}`;

export const s3PrivateObject403Scenario = {
  id: "aws:s3-private-object-403",
  slug: "s3-private-object-403",
  providerId: "aws",
  trackId: "aws-foundations",
  title: "Prywatny obiekt S3 zwraca 403",
  summary: "Aplikacja wyświetla bezpośredni adres obiektu S3, ale użytkownik otrzymuje błąd 403 Access Denied. Przeanalizuj konfigurację bucketu i wybierz bezpieczny sposób udostępnienia pliku.",
  moduleCallout: "Przećwicz diagnozę problemu z dostępem do prywatnego obiektu S3.",
  difficulty: "beginner",
  estimatedMinutes: 12,
  relatedModuleIds: ["aws:s3", "aws:iam"],
  learningObjectives: [
    "wyjaśnić różnicę między adresem obiektu a publicznym dostępem",
    "rozpoznać rolę Block Public Access",
    "odróżnić dostęp anonimowy od uwierzytelnionego",
    "wskazać zastosowanie presigned URL",
    "unikać publicznego udostępniania prywatnych raportów",
  ],
  briefing: {
    incidentTitle: "Prywatny obiekt S3 zwraca 403",
    situation: "Aplikacja przechowuje prywatne raporty klientów w Amazon S3. Raport PDF znajduje się w bucketcie cloudops-customer-reports pod kluczem reports/customer-1024/monthly-report.pdf.",
    expectedBehavior: "Zalogowany użytkownik powinien móc pobrać wyłącznie swój raport.",
    observedBehavior: "Frontend wyświetla bezpośredni adres obiektu. Kliknięcie linku prowadzi do błędu 403 Access Denied.",
    task: "Ustal, dlaczego bezpośredni adres nie działa, i wybierz bezpieczną metodę udostępnienia pliku.",
  },
  evidence: [
    {
      id: "http-response",
      type: "request",
      label: "Symulowany request",
      title: "Odpowiedź HTTP",
      description: "Symulowany materiał diagnostyczny. Nie jest zapisem żądania do prawdziwego zasobu AWS.",
      language: "http",
      content: `GET /${objectKey}

HTTP/1.1 403 Forbidden
x-amz-error-code: AccessDenied
x-amz-error-message: Access Denied`,
    },
    {
      id: "frontend-url",
      type: "request",
      label: "Request",
      title: "Adres używany przez frontend",
      description: "Frontend otwiera ten adres bez podpisu i bez poświadczeń AWS, więc przeglądarka wysyła anonimowe żądanie.",
      content: objectUrl,
    },
    {
      id: "block-public-access",
      type: "configuration",
      label: "Configuration",
      title: "Block Public Access",
      description: "Wszystkie zabezpieczenia przed publicznym udostępnieniem są włączone.",
      language: "json",
      content: `{
  "BlockPublicAcls": true,
  "IgnorePublicAcls": true,
  "BlockPublicPolicy": true,
  "RestrictPublicBuckets": true
}`,
    },
    {
      id: "bucket-policy",
      type: "policy",
      label: "Policy",
      title: "Bucket Policy",
      description: "Bucket nie posiada publicznego Allow ani innej reguły przyznającej anonimowy odczyt.",
      language: "json",
      content: `{
  "Version": "2012-10-17",
  "Statement": []
}`,
    },
    {
      id: "object-properties",
      type: "configuration",
      label: "Configuration",
      title: "Właściwości obiektu",
      description: "Symulowane, techniczne metadane obiektu; nie zawierają realnych danych użytkownika.",
      language: "yaml",
      content: `bucket: ${bucketName}
key: ${objectKey}
contentType: application/pdf
objectStatus: available
publicAcl: none
objectOwner: bucket-owner`,
    },
    {
      id: "business-requirement",
      type: "note",
      label: "Wymaganie biznesowe",
      title: "Izolacja raportów klientów",
      description: "Publiczny bucket byłby niezgodny z wymaganym modelem dostępu.",
      content: "Raporty zawierają dane klientów. Każdy użytkownik może pobrać wyłącznie pliki przypisane do własnego konta.",
    },
  ],
  questions: [
    {
      id: "anonymous-request",
      type: "single-choice",
      prompt: "Dlaczego użytkownik otrzymuje 403?",
      evidenceIds: ["http-response", "frontend-url", "bucket-policy"],
      answers: [
        { id: "private-anonymous", text: "Żądanie jest anonimowe, a obiekt nie jest publiczny." },
        { id: "missing-object", text: "Obiekt na pewno nie istnieje, ponieważ S3 zawsze zwraca 403 tylko dla brakujących kluczy." },
        { id: "invalid-pdf", text: "S3 odrzuca plik, ponieważ Content-Type application/pdf wymaga publicznego ACL." },
        { id: "wrong-region", text: "Każde żądanie do regionalnego adresu S3 wymaga wyłączenia Block Public Access." },
      ],
      correctAnswerId: "private-anonymous",
      explanation: "Zwykłe otwarcie URL-a nie przekazuje tożsamości AWS ani podpisu. Ponieważ obiekt jest prywatny i żadna polityka nie zezwala na anonimowy s3:GetObject, S3 odmawia dostępu.",
    },
    {
      id: "url-vs-public-access",
      type: "single-choice",
      prompt: "Czy sam adres HTTPS obiektu oznacza, że obiekt jest publiczny?",
      evidenceIds: ["frontend-url", "object-properties"],
      answers: [
        { id: "authorization-still-applies", text: "Nie. Adres identyfikuje obiekt, ale dostęp nadal podlega autoryzacji." },
        { id: "https-means-public", text: "Tak. Każdy zasób dostępny przez HTTPS jest z definicji publiczny." },
        { id: "pdf-means-public", text: "Tak, jeśli obiekt ma typ application/pdf." },
        { id: "regional-url-bypasses-policy", text: "Tak. Regionalny URL omija Bucket Policy i ACL." },
      ],
      correctAnswerId: "authorization-still-applies",
      explanation: "URL wskazuje endpoint, bucket i klucz, lecz nie nadaje uprawnień. S3 nadal ocenia tożsamość żądającego, polityki i pozostałe mechanizmy kontroli dostępu.",
    },
    {
      id: "block-public-access-role",
      type: "single-choice",
      prompt: "Co oznacza obecna konfiguracja Block Public Access?",
      evidenceIds: ["block-public-access", "bucket-policy"],
      answers: [
        { id: "prevents-accidental-public-access", text: "Chroni bucket przed przypadkowym publicznym udostępnieniem." },
        { id: "blocks-all-authenticated-access", text: "Blokuje również każdy uwierzytelniony dostęp przez IAM i presigned URL." },
        { id: "deletes-public-objects", text: "Automatycznie usuwa obiekty, które wcześniej miały publiczny ACL." },
        { id: "creates-public-policy", text: "Dodaje publiczny Allow do Bucket Policy, ale ukrywa go w konsoli." },
      ],
      correctAnswerId: "prevents-accidental-public-access",
      explanation: "Włączone ustawienia Block Public Access ograniczają publiczne ACL-e i polityki. Nie zastępują precyzyjnej autoryzacji uwierzytelnionych żądań i w tym przypadku działają zgodnie z założeniem.",
    },
    {
      id: "best-business-solution",
      type: "single-choice",
      prompt: "Jakie rozwiązanie najlepiej spełnia wymaganie biznesowe?",
      evidenceIds: ["frontend-url", "business-requirement", "object-properties"],
      answers: [
        { id: "authorized-presigned-url", text: "Backend po autoryzacji użytkownika generuje krótkotrwały presigned URL do konkretnego obiektu." },
        { id: "public-bucket", text: "Frontend wyłącza Block Public Access i udostępnia cały bucket anonimowo." },
        { id: "browser-access-keys", text: "Aplikacja umieszcza stałe AWS Access Keys w JavaScript wysyłanym do przeglądarki." },
        { id: "shared-permanent-url", text: "Administrator tworzy jeden stały, współdzielony link do wszystkich raportów klientów." },
      ],
      correctAnswerId: "authorized-presigned-url",
      explanation: "Backend może najpierw sprawdzić sesję i przypisanie raportu, a następnie podpisać na krótki czas wyłącznie operację odczytu konkretnego klucza. Bucket pozostaje prywatny.",
    },
    {
      id: "unsafe-fix",
      type: "single-choice",
      prompt: "Która naprawa jest niebezpieczna?",
      evidenceIds: ["block-public-access", "bucket-policy", "business-requirement"],
      answers: [
        { id: "disable-and-publicize", text: "Wyłączenie Block Public Access i publiczne udostępnienie całego bucketu." },
        { id: "short-lived-url", text: "Wygenerowanie krótkotrwałego presigned URL po sprawdzeniu uprawnień użytkownika." },
        { id: "controlled-delivery", text: "Dostarczenie pliku przez kontrolowaną warstwę aplikacyjną, która sprawdza dostęp." },
        { id: "private-cloudfront-origin", text: "Użycie CloudFront z prywatnym originem i kontrolowanym dostępem." },
      ],
      correctAnswerId: "disable-and-publicize",
      explanation: "Publiczne udostępnienie całego bucketu omija wymaganą izolację raportów klientów i zwiększa zasięg potencjalnego wycieku. Pozostałe rozwiązania mogą zachować prywatność originu oraz kontrolę dostępu.",
    },
  ],
  passingScore: 4,
  debrief: {
    rootCause: "Frontend próbował otworzyć prywatny obiekt przez zwykły, niepodpisany URL. Żądanie nie zawierało tożsamości ani podpisu pozwalającego S3 przyznać dostęp. Sam fakt istnienia adresu HTTPS nie oznacza publicznego dostępu, a Block Public Access działał zgodnie z założeniem.",
    correctFix: "Po sprawdzeniu sesji i uprawnień użytkownika backend powinien wygenerować krótkotrwały presigned URL do konkretnego obiektu. Alternatywnie plik może dostarczać kontrolowana warstwa aplikacyjna lub CloudFront z prywatnym originem.",
    whyItWorks: "Presigned URL zawiera czasowo ograniczony podpis pozwalający wykonać określoną operację na konkretnym zasobie. Uprawniona warstwa aplikacji decyduje wcześniej, czy użytkownik może otrzymać taki dostęp, a bucket nie musi stać się publiczny.",
    unsafeFixes: [
      "Wyłączenie Block Public Access usuwa ważną ochronę przed przypadkowym upublicznieniem i nie realizuje autoryzacji użytkownika.",
      "Publiczne udostępnienie całego bucketu pozwoliłoby anonimowym odbiorcom próbować pobierać raporty i naruszałoby wymaganie izolacji danych klientów.",
      "Publiczne s3:GetObject na * daje anonimowy odczyt całego wskazanego zakresu zamiast dostępu do jednego raportu po autoryzacji.",
      "Access Keys umieszczone we frontendzie są przekazywane każdemu użytkownikowi aplikacji i mogą zostać skopiowane oraz wykorzystane poza nią.",
      "Stałe poświadczenia w JavaScript przeglądarki są długotrwałym sekretem poza kontrolą backendu i nie powinny służyć do dostępu do prywatnych raportów.",
    ],
    prevention: [
      "Utrzymuj buckety jako prywatne domyślnie.",
      "Pozostaw Block Public Access włączony.",
      "Sprawdzaj uprawnienia do raportu w backendzie przed wydaniem dostępu.",
      "Ustawiaj krótki czas ważności presigned URL.",
      "Loguj próby dostępu do raportów.",
      "Rozdzielaj dane klientów prefixami i wiąż je z regułami autoryzacji.",
      "Testuj, czy anonimowe żądania są odrzucane.",
    ],
  },
} as const satisfies ScenarioDefinition;
