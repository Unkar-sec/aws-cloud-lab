import type { ScenarioDefinition } from "@/types/scenario";

const productionFunction = "payment-status-sync-prod";
const testFunction = "payment-status-sync-test";

export const cloudwatchWrongLambdaDimensionScenario = {
  id: "aws:cloudwatch-wrong-lambda-dimension",
  slug: "cloudwatch-wrong-lambda-dimension",
  providerId: "aws",
  trackId: "aws-foundations",
  title: "Alarm CloudWatch obserwuje niewłaściwą funkcję",
  summary: "Funkcja Lambda generuje błędy, ale alarm CloudWatch nadal pozostaje w stanie OK. Przeanalizuj metryki, Dimensions i konfigurację alarmu, aby znaleźć przyczynę.",
  metadataDescription: "Przeanalizuj metryki AWS Lambda i konfigurację alarmu CloudWatch, aby znaleźć błędny Dimension FunctionName.",
  moduleCallout: "Przećwicz diagnozę alarmu obserwującego niewłaściwy zasób.",
  difficulty: "intermediate",
  estimatedMinutes: 15,
  relatedModuleIds: ["aws:cloudwatch", "aws:lambda"],
  learningObjectives: [
    "wyjaśnić rolę Namespace, MetricName i Dimensions",
    "rozpoznać, że ta sama metryka może dotyczyć różnych zasobów",
    "porównać dane alarmu z danymi właściwej funkcji",
    "odróżnić błędną konfigurację alarmu od braku danych",
    "wskazać poprawną zmianę FunctionName",
  ],
  briefing: {
    incidentTitle: "Alarm pozostaje w stanie OK mimo błędów funkcji",
    situation: "Zespół utrzymuje funkcję Lambda odpowiedzialną za synchronizację statusów płatności. Dla błędów funkcji skonfigurowano alarm CloudWatch payment-status-sync-errors.",
    expectedBehavior: "Alarm powinien przejść w stan ALARM, gdy w pięciominutowym okresie wystąpi co najmniej jeden błąd funkcji produkcyjnej.",
    observedBehavior: "Funkcja produkcyjna generuje błędy, ale alarm nadal pozostaje w stanie OK i powiadomienie nie jest uruchamiane.",
    task: "Przeanalizuj logi, dane metryk, listę funkcji, konfigurację alarmu i wartości Dimensions. Ustal, dlaczego alarm nie reaguje, i wskaż bezpieczną naprawę.",
  },
  evidence: [
    {
      id: "incident-report",
      type: "alert",
      label: "Symulowane zgłoszenie",
      title: "Zgłoszenie incydentu monitoringu",
      description: "Materiał symulowany; nie pochodzi z prawdziwego systemu zgłoszeń ani konta AWS.",
      content: `Incydent: wzrost błędów synchronizacji płatności

Zespół aplikacyjny potwierdza, że funkcja:
${productionFunction}

zaczęła zwracać błędy około 10 minut temu.

Alarm:
payment-status-sync-errors

nadal pozostaje w stanie OK.`,
    },
    {
      id: "production-function-logs",
      type: "log",
      label: "Symulowany log",
      title: "Logi funkcji produkcyjnej",
      description: "Uproszczone, fikcyjne wpisy CloudWatch Logs bez sekretów i danych klientów.",
      content: `2026-07-29T09:20:13.151Z ERROR Partner API request failed
function=${productionFunction}
requestId=req-8fc201
statusCode=503

2026-07-29T09:21:08.441Z ERROR Partner API request failed
function=${productionFunction}
requestId=req-21da19
statusCode=503

2026-07-29T09:22:56.904Z ERROR Synchronization failed
function=${productionFunction}
requestId=req-c61b40
retryable=true`,
    },
    {
      id: "production-errors-metric",
      type: "configuration",
      label: "Symulowane dane metryki",
      title: "Szereg czasowy funkcji produkcyjnej",
      description: "Tekstowy widok punktów danych metryki Errors.",
      content: `Namespace: AWS/Lambda
MetricName: Errors
Dimension:
  FunctionName: ${productionFunction}
Period: 5 minutes
Statistic: Sum

Time   Errors
09:10  0
09:15  2
09:20  7
09:25  9

Errors in the last two periods: 18`,
    },
    {
      id: "test-errors-metric",
      type: "configuration",
      label: "Symulowane dane metryki",
      title: "Szereg czasowy funkcji testowej",
      description: "Metryka istnieje i zawiera punkty danych, więc nie występuje stan INSUFFICIENT_DATA ani opóźnienie propagacji.",
      content: `Namespace: AWS/Lambda
MetricName: Errors
Dimension:
  FunctionName: ${testFunction}
Period: 5 minutes
Statistic: Sum

Time   Errors
09:10  0
09:15  0
09:20  0
09:25  0`,
    },
    {
      id: "alarm-configuration",
      type: "configuration",
      label: "Symulowana konfiguracja",
      title: "Konfiguracja alarmu payment-status-sync-errors",
      description: "Odczytana konfiguracja symulowanego alarmu; akcja powiadomienia jest skonfigurowana poprawnie.",
      language: "json",
      content: `{
  "AlarmName": "payment-status-sync-errors",
  "Namespace": "AWS/Lambda",
  "MetricName": "Errors",
  "Dimensions": [
    {
      "Name": "FunctionName",
      "Value": "${testFunction}"
    }
  ],
  "Statistic": "Sum",
  "Period": 300,
  "EvaluationPeriods": 1,
  "DatapointsToAlarm": 1,
  "Threshold": 1,
  "ComparisonOperator": "GreaterThanOrEqualToThreshold",
  "TreatMissingData": "notBreaching",
  "StateValue": "OK",
  "AlarmActionStatus": "configured"
}`,
    },
    {
      id: "lambda-function-list",
      type: "configuration",
      label: "Symulowana konfiguracja",
      title: "Lista funkcji Lambda",
      description: "Zestawienie aktywności obu fikcyjnych funkcji z ostatnich 10 minut.",
      content: `${productionFunction}
Environment: production
Invocations, last 10 minutes: 240
Errors, last 10 minutes: 18

${testFunction}
Environment: test
Invocations, last 10 minutes: 0
Errors, last 10 minutes: 0`,
    },
    {
      id: "monitoring-requirement",
      type: "note",
      label: "Symulowane wymaganie",
      title: "Zakres monitoringu produkcyjnego",
      description: "Notatka właściciela usługi opisująca oczekiwany zasób alarmu.",
      content: `Alarm powinien monitorować błędy produkcyjnej funkcji:
${productionFunction}

Funkcja testowa nie powinna być źródłem metryki dla alarmu produkcyjnego.`,
    },
    {
      id: "alarm-state",
      type: "alert",
      label: "Symulowany stan alarmu",
      title: "Bieżąca ocena alarmu",
      description: "CloudWatch ocenia skonfigurowany szereg czasowy bez błędu i bez opóźnienia danych.",
      content: `Alarm: payment-status-sync-errors
Current state: OK
Reason:
Threshold Crossed: no datapoints were greater than or equal to the threshold
for metric Errors with FunctionName ${testFunction}.`,
    },
  ],
  questions: [
    {
      id: "confirm-production-errors",
      type: "single-choice",
      prompt: "Który dowód najlepiej potwierdza, że funkcja produkcyjna rzeczywiście generuje błędy?",
      evidenceIds: ["production-function-logs", "production-errors-metric"],
      answers: [
        { id: "prod-metric-and-logs", text: `Metryka Errors i logi dla ${productionFunction}.` },
        { id: "alarm-state-only", text: "Sam stan OK alarmu payment-status-sync-errors." },
        { id: "test-no-invocations", text: `Brak wywołań funkcji ${testFunction}.` },
        { id: "alarm-name-only", text: "Sama nazwa alarmu, bez sprawdzania metryki i logów." },
      ],
      correctAnswerId: "prod-metric-and-logs",
      explanation: "Logi zawierają konkretne błędy funkcji produkcyjnej, a jej szereg czasowy AWS/Lambda Errors pokazuje 18 błędów w dwóch ostatnich okresach. Te niezależne materiały potwierdzają objaw dla właściwego zasobu.",
    },
    {
      id: "function-name-dimension-role",
      type: "single-choice",
      prompt: "Do czego służy Dimension FunctionName w metryce AWS/Lambda?",
      evidenceIds: ["production-errors-metric", "test-errors-metric"],
      answers: [
        { id: "selects-specific-function", text: "Wskazuje konkretną funkcję Lambda, której dane metryki są analizowane." },
        { id: "renames-alarm", text: "Zmienia wyświetlaną nazwę alarmu bez wpływu na analizowany szereg czasowy." },
        { id: "selects-log-level", text: "Określa poziom logowania ERROR dla wszystkich funkcji na koncie." },
        { id: "grants-permissions", text: "Nadaje funkcji uprawnienia IAM do publikowania metryk." },
      ],
      correctAnswerId: "selects-specific-function",
      explanation: "Ta sama metryka Errors w przestrzeni AWS/Lambda występuje dla wielu funkcji. Dimension FunctionName wybiera szereg czasowy należący do konkretnej funkcji.",
    },
    {
      id: "why-alarm-is-ok",
      type: "single-choice",
      prompt: "Dlaczego alarm pozostaje w stanie OK mimo błędów funkcji produkcyjnej?",
      evidenceIds: ["alarm-configuration", "test-errors-metric", "alarm-state"],
      answers: [
        { id: "observes-test-function", text: `Alarm analizuje metrykę Errors dla ${testFunction}, która nie generuje błędów.` },
        { id: "metric-delayed", text: "Metryka funkcji produkcyjnej jeszcze nie dotarła do CloudWatch." },
        { id: "insufficient-data", text: "Alarm znajduje się w stanie INSUFFICIENT_DATA." },
        { id: "notification-broken", text: "Błędna akcja powiadomienia wymusza stan OK alarmu." },
      ],
      correctAnswerId: "observes-test-function",
      explanation: "Alarm działa zgodnie z konfiguracją i ocenia punkty danych funkcji testowej. Wszystkie mają wartość 0, dlatego próg co najmniej 1 nie został przekroczony.",
    },
    {
      id: "incorrect-alarm-element",
      type: "single-choice",
      prompt: "Który element konfiguracji alarmu jest nieprawidłowy?",
      evidenceIds: ["alarm-configuration", "monitoring-requirement"],
      answers: [
        { id: "function-name-value", text: "Wartość Dimension FunctionName." },
        { id: "namespace", text: "Namespace AWS/Lambda." },
        { id: "metric-name", text: "MetricName Errors." },
        { id: "statistic", text: "Statistic Sum." },
      ],
      correctAnswerId: "function-name-value",
      explanation: `Namespace, MetricName i Statistic są odpowiednie. Wartość FunctionName wybiera jednak ${testFunction}, podczas gdy wymaganie wskazuje ${productionFunction}.`,
    },
    {
      id: "correct-alarm-fix",
      type: "single-choice",
      prompt: "Jaka jest najlepsza naprawa?",
      evidenceIds: ["alarm-configuration", "monitoring-requirement", "production-errors-metric"],
      answers: [
        { id: "change-dimension-to-prod", text: `Zmienić wartość Dimension FunctionName z ${testFunction} na ${productionFunction} i zweryfikować stan alarmu.` },
        { id: "threshold-zero", text: "Ustawić Threshold na 0 bez sprawdzania wybranego szeregu czasowego." },
        { id: "delete-alarm", text: "Usunąć cały alarm i zrezygnować z monitorowania błędów." },
        { id: "admin-and-timeout", text: "Nadać funkcji AdministratorAccess i zwiększyć jej Timeout bez zmiany alarmu." },
      ],
      correctAnswerId: "change-dimension-to-prod",
      explanation: "Zmiana wymiaru wybiera szereg czasowy właściwej funkcji bez naruszania poprawnych parametrów alarmu. Po zmianie należy porównać punkty danych, wykonać kontrolowany test i sprawdzić historię stanów.",
    },
  ],
  passingScore: 4,
  debrief: {
    rootCause: `Alarm był skonfigurowany dla poprawnego Namespace AWS/Lambda i metryki Errors, ale Dimension FunctionName = ${testFunction} wskazywał funkcję testową. Błędy występowały w funkcji ${productionFunction}. CloudWatch oceniał więc prawidłową metrykę dla niewłaściwego zasobu. Alarm pozostawał w stanie OK, ponieważ wskazana funkcja testowa nie generowała błędów.`,
    correctFix: `Zmienić wartość Dimension FunctionName z ${testFunction} na ${productionFunction}, zachowując Namespace AWS/Lambda, MetricName Errors, Statistic Sum, Period 300, Threshold 1, EvaluationPeriods 1 i DatapointsToAlarm 1. Następnie zweryfikować wybraną metrykę, potwierdzić funkcję punktów danych, przeprowadzić kontrolowany test alarmu i sprawdzić historię zmian stanu.`,
    fixExamples: [
      {
        id: "correct-function-dimension",
        type: "configuration",
        label: "Symulowana poprawka",
        title: "Poprawny wymiar metryki alarmu",
        language: "json",
        content: `{
  "Name": "FunctionName",
  "Value": "${productionFunction}"
}`,
      },
    ],
    whyItWorks: "AWS/Lambda jest przestrzenią nazw metryk Lambda, Errors określa typ mierzonego zdarzenia, a FunctionName wybiera konkretną funkcję. Alarm analizuje wyłącznie szereg czasowy odpowiadający pełnej kombinacji Namespace + MetricName + Dimensions. Po wskazaniu funkcji produkcyjnej zaczyna oceniać jej punkty Errors względem istniejącego progu.",
    unsafeFixes: [
      "Ustawienie Threshold na 0 bez analizy może powodować alarmowanie dla prawidłowych wartości i nadal nie naprawia wyboru niewłaściwej funkcji.",
      "Usunięcie alarmu eliminuje ochronę monitoringową zamiast skorygować jeden błędny wymiar.",
      "Zmiana Namespace na przypadkową wartość wybierze nieistniejącą lub niepowiązaną metrykę.",
      "Zwiększenie Timeout funkcji nie zmienia szeregu czasowego obserwowanego przez alarm i nie naprawia monitoringu.",
      "Dodatkowe uprawnienia IAM nie wpływają na wartość FunctionName skonfigurowaną w alarmie.",
      "Wiele podobnych alarmów bez spójnego nazewnictwa zwiększa ryzyko ponownego powiązania alarmu z niewłaściwym środowiskiem.",
      "Stan OK oznacza jedynie, że skonfigurowany szereg nie narusza progu; nie dowodzi braku błędów w całej aplikacji.",
    ],
    prevention: [
      "Twórz alarmy przez Infrastructure as Code.",
      "Stosuj wspólne nazewnictwo funkcji i alarmów.",
      "Używaj referencji do zasobów zamiast ręcznego wpisywania nazw funkcji.",
      "Przeglądaj razem Namespace, MetricName i wszystkie Dimensions.",
      "Kontroluj i testuj alarmy, aby potwierdzać ich przejścia między stanami.",
      "Utrzymuj dashboard porównujący metryki funkcji z przypisanymi alarmami.",
      "Dokumentuj właściciela każdego alarmu i oczekiwaną reakcję.",
      "Monitoruj historię zmian konfiguracji alarmów.",
      "Utrzymuj osobne, jednoznacznie nazwane alarmy dla środowisk prod i test.",
      "Wymagaj code review dla zmian monitoringu.",
    ],
  },
} as const satisfies ScenarioDefinition;
