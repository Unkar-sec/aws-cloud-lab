import type { ScenarioDefinition } from "@/types/scenario";

const bucketName = "cloudops-imports-prod";
const objectKey = "uploads/customer-data.csv";
const functionName = "customer-import-processor";

export const s3EventNotificationPrefixMismatchScenario = {
  id: "aws:s3-event-notification-prefix-mismatch",
  slug: "s3-event-notification-prefix-mismatch",
  providerId: "aws",
  trackId: "aws-foundations",
  title: "S3 nie uruchamia funkcji Lambda",
  summary: "Plik został poprawnie zapisany w Amazon S3, ale funkcja Lambda nie została wywołana. Przeanalizuj klucz obiektu, Event Notification, filtry oraz metryki funkcji.",
  metadataDescription: "Przeanalizuj klucz obiektu, filtry Event Notification i metryki Lambda, aby znaleźć przyczynę braku wywołania funkcji.",
  moduleCallout: "Przećwicz diagnozę integracji S3 Event Notification z funkcją Lambda.",
  difficulty: "intermediate",
  estimatedMinutes: 15,
  relatedModuleIds: ["aws:s3", "aws:lambda", "aws:cloudwatch"],
  learningObjectives: [
    "wyjaśnić rolę Event Notification w Amazon S3",
    "odróżnić pełny klucz obiektu od nazwy pliku",
    "rozumieć działanie filtrów prefix i suffix",
    "rozpoznać różnicę między brakiem wywołania a błędem wykonania funkcji",
    "dobrać naprawę zgodną z rzeczywistą strukturą danych",
  ],
  briefing: {
    incidentTitle: "S3 nie uruchamia funkcji Lambda",
    situation: "Aplikacja importuje dane klientów z plików CSV przesyłanych do Amazon S3. Event Notification ma automatycznie uruchamiać funkcję customer-import-processor.",
    expectedBehavior: "Po zapisaniu pliku CSV funkcja customer-import-processor powinna zostać automatycznie uruchomiona i przetworzyć dane.",
    observedBehavior: "Plik istnieje w bucketcie, ale funkcja nie została wywołana, nie ma nowych logów, a import nie został wykonany.",
    task: "Przeanalizuj nazwę bucketu, pełny klucz obiektu, konfigurację Event Notification, filtry prefix i suffix, uprawnienie do wywołania, metryki Lambda oraz logi. Ustal, dlaczego zdarzenie nie uruchomiło funkcji, i wybierz poprawną naprawę.",
  },
  evidence: [
    {
      id: "incident-report",
      type: "alert",
      label: "Symulowane zgłoszenie",
      title: "Zgłoszenie incydentu importu",
      description: "Materiał symulowany; nie pochodzi z prawdziwego systemu ani konta AWS.",
      content: `Incydent: import pliku nie został rozpoczęty

Bucket:
${bucketName}

Przesłany obiekt:
${objectKey}

Oczekiwano uruchomienia funkcji:
${functionName}

Funkcja nie została wywołana.`,
    },
    {
      id: "s3-object-properties",
      type: "configuration",
      label: "Symulowana konfiguracja",
      title: "Właściwości obiektu S3",
      description: "Obiekt został prawidłowo zapisany i jest dostępny. Pełny klucz zawiera prefix uploads/.",
      content: `Bucket: ${bucketName}
Key: ${objectKey}
Size: 84 KB
Content-Type: text/csv
Last modified: 2026-07-29T10:41:22Z
Object status: available`,
    },
    {
      id: "event-notification-configuration",
      type: "configuration",
      label: "Symulowana konfiguracja",
      title: "Konfiguracja Event Notification",
      description: "Numer konta oraz ARN są przykładowe. Typ zdarzenia, region i funkcja docelowa są poprawne.",
      language: "json",
      content: `{
  "Id": "process-customer-imports",
  "Events": [
    "s3:ObjectCreated:*"
  ],
  "Filter": {
    "Key": {
      "FilterRules": [
        {
          "Name": "prefix",
          "Value": "incoming/"
        },
        {
          "Name": "suffix",
          "Value": ".csv"
        }
      ]
    }
  },
  "LambdaFunctionArn": "arn:aws:lambda:eu-central-1:123456789012:function:${functionName}"
}`,
    },
    {
      id: "object-filter-comparison",
      type: "configuration",
      label: "Symulowana analiza",
      title: "Porównanie właściwości obiektu z filtrami",
      description: "Wynik technicznego porównania pełnego klucza z oboma warunkami konfiguracji.",
      content: `Object key:
${objectKey}

Required prefix:
incoming/

Required suffix:
.csv

Prefix match: false
Suffix match: true`,
    },
    {
      id: "lambda-invocations",
      type: "configuration",
      label: "Symulowane dane metryki",
      title: "Metryka Invocations funkcji",
      description: "Brak nowego wywołania oznacza, że kod funkcji nie rozpoczął działania po przesłaniu obiektu.",
      content: `FunctionName: ${functionName}
Metric: Invocations
Statistic: Sum

Time   Invocations
10:30  0
10:35  0
10:40  0
10:45  0`,
    },
    {
      id: "cloudwatch-log-state",
      type: "log",
      label: "Symulowany stan logów",
      title: "Aktywność CloudWatch Logs",
      description: "Log group działa poprawnie. Brak nowego wpisu jest skutkiem braku wywołania, a nie awarii logowania.",
      content: `Log group:
/aws/lambda/${functionName}

Latest log stream:
2026/07/29/[$LATEST]91f2a67c

Last event:
2026-07-29T09:58:11Z

No new log events after object upload.`,
    },
    {
      id: "lambda-resource-policy",
      type: "policy",
      label: "Symulowana policy",
      title: "Uprawnienie do wywołania funkcji",
      description: "Resource-based policy poprawnie pozwala wskazanemu bucketowi S3 wywołać funkcję.",
      language: "json",
      content: `{
  "Effect": "Allow",
  "Principal": {
    "Service": "s3.amazonaws.com"
  },
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:eu-central-1:123456789012:function:${functionName}",
  "Condition": {
    "ArnLike": {
      "AWS:SourceArn": "arn:aws:s3:::${bucketName}"
    }
  }
}`,
    },
    {
      id: "manual-function-test",
      type: "request",
      label: "Symulowany test",
      title: "Kontrolowany test funkcji",
      description: "Ręczne wywołanie potwierdza sprawność kodu, Execution Role, czasu wykonania i zapisu logów.",
      language: "json",
      content: `Manual test invocation: success

Status: Succeeded
Duration: 412 ms

Result:
{
  "processedRecords": 3,
  "status": "completed"
}`,
    },
    {
      id: "business-requirement",
      type: "note",
      label: "Symulowane wymaganie",
      title: "Docelowa lokalizacja importów",
      description: "Wymaganie określa rzeczywistą strukturę kluczy, do której powinna pasować konfiguracja zdarzenia.",
      content: `Proces importu powinien obsługiwać pliki umieszczane pod:
uploads/

Dozwolony format:
.csv`,
    },
  ],
  questions: [
    {
      id: "no-invocation-meaning",
      type: "single-choice",
      prompt: "Co najbardziej prawdopodobnie oznacza brak nowych wywołań Lambda i brak nowych logów po przesłaniu pliku?",
      evidenceIds: ["lambda-invocations", "cloudwatch-log-state"],
      answers: [
        { id: "before-handler", text: "Funkcja nie została uruchomiona, więc problem występuje przed wykonaniem jej kodu." },
        { id: "handler-exception", text: "Handler rozpoczął działanie i zgłosił wyjątek przed zapisaniem jakiegokolwiek logu." },
        { id: "timeout-too-low", text: "Timeout funkcji przerwał każde wywołanie po 412 ms." },
        { id: "cpu-overload", text: "Przeciążenie CPU usunęło metrykę Invocations i istniejące wpisy logów." },
      ],
      correctAnswerId: "before-handler",
      explanation: "Metryka Invocations nie wzrosła i nie powstał nowy log stream, więc Lambda nie rozpoczęła obsługi zdarzenia. Błędu należy szukać na ścieżce przed kodem funkcji, między zapisem obiektu a wywołaniem.",
    },
    {
      id: "full-object-key",
      type: "single-choice",
      prompt: "Jaki jest pełny klucz przesłanego obiektu?",
      evidenceIds: ["s3-object-properties"],
      answers: [
        { id: "uploads-key", text: "uploads/customer-data.csv" },
        { id: "filename-only", text: "customer-data.csv" },
        { id: "bucket-name", text: "cloudops-imports-prod" },
        { id: "configured-prefix", text: "incoming/customer-data.csv" },
      ],
      correctAnswerId: "uploads-key",
      explanation: "Key obejmuje całą wartość wewnątrz bucketu, w tym logiczny prefix uploads/. Sama końcowa nazwa pliku ani nazwa bucketu nie są pełnym kluczem.",
    },
    {
      id: "combined-filter-behavior",
      type: "single-choice",
      prompt: "Jak S3 ocenia jednocześnie ustawiony prefix incoming/ i suffix .csv?",
      evidenceIds: ["event-notification-configuration", "object-filter-comparison"],
      answers: [
        { id: "both-must-match", text: "Klucz obiektu musi spełniać oba warunki." },
        { id: "either-can-match", text: "Wystarczy, że pasuje prefix albo suffix." },
        { id: "suffix-ignored", text: "Po ustawieniu prefixu S3 zawsze ignoruje suffix." },
        { id: "filename-only", text: "S3 porównuje oba filtry wyłącznie z nazwą pliku po ostatnim ukośniku." },
      ],
      correctAnswerId: "both-must-match",
      explanation: "Prefix dotyczy początku pełnego klucza, a suffix jego końca. Przy obu filtrach klucz musi spełnić oba; tutaj końcówka .csv pasuje, lecz początek incoming/ nie.",
    },
    {
      id: "notification-root-cause",
      type: "single-choice",
      prompt: "Dlaczego przesłanie pliku nie uruchomiło funkcji Lambda?",
      evidenceIds: ["s3-object-properties", "event-notification-configuration", "object-filter-comparison"],
      answers: [
        { id: "prefix-mismatch", text: "Klucz uploads/customer-data.csv nie pasuje do wymaganego prefixu incoming/." },
        { id: "suffix-mismatch", text: "Plik nie ma wymaganego suffixu .csv." },
        { id: "invoke-policy-deny", text: "Resource-based policy zabrania bucketowi wywołania funkcji." },
        { id: "function-code-failure", text: "Kod funkcji zgłasza błąd przy każdym uruchomieniu." },
      ],
      correctAnswerId: "prefix-mismatch",
      explanation: "Obiekt istnieje, suffix pasuje, policy pozwala na wywołanie, a funkcja przechodzi test ręczny. Zdarzenie nie spełnia jedynie filtra początku pełnego klucza.",
    },
    {
      id: "correct-prefix-fix",
      type: "single-choice",
      prompt: "Jaka jest najlepsza naprawa zgodna z wymaganiem, że importy trafiają do uploads/?",
      evidenceIds: ["event-notification-configuration", "business-requirement"],
      answers: [
        { id: "change-prefix-to-uploads", text: "Zmienić filtr prefixu Event Notification z incoming/ na uploads/ i zweryfikować działanie kontrolowanym plikiem testowym." },
        { id: "administrator-access", text: "Nadać funkcji AdministratorAccess, pozostawiając niedopasowany filtr." },
        { id: "remove-all-filters", text: "Usunąć wszystkie filtry bez analizy i uruchamiać funkcję dla każdego obiektu." },
        { id: "public-and-timeout", text: "Udostępnić bucket publicznie i zwiększyć Timeout funkcji." },
      ],
      correctAnswerId: "change-prefix-to-uploads",
      explanation: "Wymaganie biznesowe wskazuje uploads/, dlatego Event Notification powinno obserwować ten prefix i zachować suffix .csv. Po zmianie należy przesłać nowy kontrolowany plik i sprawdzić metrykę, logi oraz wynik importu.",
    },
  ],
  passingScore: 4,
  debrief: {
    rootCause: `Event Notification było skonfigurowane dla obiektów spełniających jednocześnie prefix incoming/ i suffix .csv. Przesłany obiekt miał klucz ${objectKey}. Suffix .csv pasował, ale prefix incoming/ nie. Ponieważ obiekt nie spełnił wszystkich warunków filtra, Amazon S3 nie wysłał zdarzenia do funkcji Lambda. Funkcja nie została uruchomiona, dlatego liczba Invocations nie wzrosła, nie powstały nowe logi, a kod nie miał możliwości przetworzenia pliku.`,
    correctFix: "Zmienić filtr prefixu Event Notification z incoming/ na uploads/. Następnie przesłać nowy testowy plik .csv do uploads/, sprawdzić metrykę Invocations i nowy Log Stream, potwierdzić przetworzenie danych oraz zweryfikować, że pliki spoza uploads/ nie uruchamiają funkcji.",
    fixExamples: [
      {
        id: "correct-event-filter",
        type: "configuration",
        label: "Symulowana poprawka",
        title: "Docelowe reguły filtra",
        language: "json",
        content: `{
  "FilterRules": [
    {
      "Name": "prefix",
      "Value": "uploads/"
    },
    {
      "Name": "suffix",
      "Value": ".csv"
    }
  ]
}`,
      },
    ],
    whyItWorks: `Amazon S3 analizuje pełny klucz obiektu. Prefix dotyczy początku klucza, suffix jego końca, a przy jednoczesnym ustawieniu obu filtrów obiekt musi spełnić oba. ${objectKey} zaczyna się od uploads/ i kończy na .csv, więc po poprawieniu prefixu zdarzenie pasuje do konfiguracji i S3 może wywołać funkcję.`,
    unsafeFixes: [
      "AdministratorAccess rozszerza uprawnienia funkcji, ale nie wpływa na dopasowanie filtra Event Notification.",
      "Publiczne udostępnienie bucketu nie jest wymagane dla integracji S3 z Lambda i niepotrzebnie eksponuje dane.",
      "Access Keys w kodzie tworzą długotrwały sekret i nie naprawiają selekcji zdarzeń.",
      "Zwiększenie Timeout nie pomaga, gdy funkcja w ogóle nie została wywołana.",
      "Usunięcie wszystkich filtrów bez analizy może uruchamiać funkcję dla nieobsługiwanych obiektów i zwiększać koszt.",
      "Zmiana Handlera przed potwierdzeniem dostarczenia zdarzenia skupia diagnozę na warstwie, która nie rozpoczęła działania.",
      "Brak nowych logów nie oznacza awarii CloudWatch Logs, gdy równocześnie metryka Invocations pozostaje bez zmian.",
      "Stałe ręczne wywoływanie funkcji omija automatyzację i ukrywa niedopasowaną konfigurację zdarzenia.",
    ],
    prevention: [
      "Definiuj bucket, Event Notification i funkcję wspólnie przez Infrastructure as Code.",
      "Uruchamiaj testy integracyjne z pełnym, rzeczywistym kluczem obiektu.",
      "Dokumentuj wymagane prefixy dla każdego procesu importu.",
      "Stosuj spójne nazewnictwo logicznych katalogów między środowiskami.",
      "Monitoruj metrykę Invocations funkcji.",
      "Alarmuj o braku oczekiwanych wywołań po dostarczeniu plików.",
      "Kontroluj konfigurację Event Notification podczas code review.",
      "Testuj pliki pasujące i niepasujące do filtrów.",
      "Obserwuj liczbę przetworzonych plików jako custom metric.",
      "Loguj identyfikator bucketu i pełny klucz obsługiwanego obiektu.",
      "Unikaj ręcznego konfigurowania filtrów niezależnie w wielu środowiskach.",
    ],
  },
} as const satisfies ScenarioDefinition;
