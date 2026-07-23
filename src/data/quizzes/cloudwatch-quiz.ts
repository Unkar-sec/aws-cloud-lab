import type { QuizDefinition } from "@/types/quiz";

export const cloudwatchQuiz = {
  id: "cloudwatch-foundations",
  providerId: "aws",
  trackId: "aws-foundations",
  moduleId: "aws:cloudwatch",
  moduleSlug: "cloudwatch",
  title: "Quiz CloudWatch",
  description: "Sprawdź podstawową wiedzę o metrykach, logach, alarmach, dashboardach i monitorowaniu usług AWS.",
  passingScore: 4,
  questions: [
    {
      id: "cloudwatch-metric-and-log",
      question: "Chcesz wykryć wzrost liczby błędów aplikacji, a następnie poznać szczegółową przyczynę konkretnych błędów. Które podejście jest najlepsze?",
      answers: [
        { id: "metric-alarm-then-logs", text: "Użyć metryki i alarmu do wykrycia wzrostu, a następnie przeanalizować logi konkretnych zdarzeń." },
        { id: "logs-only-no-metrics", text: "Przechowywać wyłącznie logi i nie tworzyć żadnych metryk ani alarmów." },
        { id: "cpu-only", text: "Monitorować wyłącznie wykorzystanie CPU, ponieważ zawsze wyjaśnia błędy aplikacji." },
        { id: "dashboard-fixes-errors", text: "Dodać dashboard, który automatycznie usunie przyczynę każdego błędu." },
      ],
      correctAnswerId: "metric-alarm-then-logs",
      explanation: "Metryka pokazuje liczbowy trend i pozwala szybko alarmować o wzroście błędów. Logi zawierają kontekst konkretnych zdarzeń i pomagają ustalić, dlaczego błąd wystąpił.",
    },
    {
      id: "cloudwatch-insufficient-data",
      question: "Co oznacza stan INSUFFICIENT_DATA alarmu CloudWatch?",
      answers: [
        { id: "not-enough-data", text: "Alarm nie ma wystarczającej ilości danych, aby ocenić zdefiniowany warunek." },
        { id: "resource-healthy", text: "Monitorowany zasób jest na pewno sprawny." },
        { id: "resource-failed", text: "Monitorowany zasób na pewno uległ awarii." },
        { id: "alarm-disabled", text: "Alarm został trwale wyłączony i nie może zmienić stanu." },
      ],
      correctAnswerId: "not-enough-data",
      explanation: "INSUFFICIENT_DATA informuje o braku danych potrzebnych do oceny warunku. Przyczyną może być między innymi brak zdarzeń, zatrzymany zasób albo problem z instrumentacją, więc stan wymaga interpretacji w kontekście metryki.",
    },
    {
      id: "cloudwatch-secret-in-logs",
      question: "Aplikacja zapisuje token dostępu w CloudWatch Logs, aby ułatwić debugowanie. Co należy zrobić?",
      answers: [
        { id: "remove-or-mask-secret", text: "Przestać logować token, usunąć lub maskować dane wrażliwe i zachować tylko potrzebny kontekst diagnostyczny." },
        { id: "log-more-tokens", text: "Logować również pozostałe tokeny, aby porównywać je podczas diagnozy." },
        { id: "longer-retention", text: "Wydłużyć retencję logów, aby token był dostępny zespołowi przez dłuższy czas." },
        { id: "change-log-level", text: "Zmienić poziom wpisu na INFO, pozostawiając pełny token w treści." },
      ],
      correctAnswerId: "remove-or-mask-secret",
      explanation: "Logi nie powinny zawierać haseł, tokenów ani kluczy dostępu. Wpis powinien przekazywać identyfikator żądania i techniczny kontekst bez ujawniania sekretu.",
    },
    {
      id: "cloudwatch-noisy-cpu-alarm",
      question: "Jednorazowy, kilkusekundowy skok CPU za każdym razem uruchamia alarm. Jak najlepiej ograniczyć taki szum bez rezygnowania z monitoringu?",
      answers: [
        { id: "tune-alarm-evaluation", text: "Przeanalizować Period, Evaluation Periods i Threshold oraz dostroić alarm do istotnych, trwających problemów." },
        { id: "delete-monitoring", text: "Usunąć alarm i przestać monitorować CPU." },
        { id: "alarm-on-every-sample", text: "Ustawić alarm tak, aby reagował na każdą pojedynczą próbkę niezależnie od czasu trwania." },
        { id: "ignore-all-alarms", text: "Pozostawić konfigurację bez zmian i poinstruować zespół, aby ignorował powiadomienia." },
      ],
      correctAnswerId: "tune-alarm-evaluation",
      explanation: "Period, próg i liczba wymaganych okresów pozwalają odróżnić krótkotrwały skok od utrzymującego się problemu. Nadmiar nieistotnych alarmów prowadzi do alarm fatigue i zwiększa ryzyko przeoczenia ważnego sygnału.",
    },
    {
      id: "cloudwatch-lambda-monitoring",
      question: "Funkcja Lambda otrzymuje wiele wywołań, a część kończy się niepowodzeniem. Który zestaw danych najlepiej pomoże ocenić skalę i znaleźć przyczynę?",
      answers: [
        { id: "lambda-metrics-and-logs", text: "Metryki Invocations i Errors, odpowiednio Duration lub Throttles oraz logi wykonania funkcji." },
        { id: "ec2-cpu-only", text: "Wyłącznie metryka CPUUtilization dowolnej instancji EC2." },
        { id: "dashboard-count", text: "Sama liczba dashboardów na koncie, bez metryk i logów funkcji." },
        { id: "log-group-name-only", text: "Wyłącznie nazwa Log Group, bez analizy wpisów ani metryk Lambda." },
      ],
      correctAnswerId: "lambda-metrics-and-logs",
      explanation: "Invocations i Errors pokazują udział niepowodzeń w całym ruchu. Duration i Throttles pomagają ocenić wydajność oraz ograniczenia, a logi wykonania dostarczają szczegółowego kontekstu błędów.",
    },
  ],
} satisfies QuizDefinition;
