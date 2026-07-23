import type { QuizDefinition } from "@/types/quiz";

export const lambdaQuiz = {
  id: "lambda-foundations",
  providerId: "aws",
  trackId: "aws-foundations",
  moduleId: "aws:lambda",
  moduleSlug: "lambda",
  title: "Quiz Lambda",
  description: "Sprawdź podstawową wiedzę o AWS Lambda, triggerach, Execution Role, Timeout, sekretach i integracji z VPC.",
  passingScore: 4,
  questions: [
    {
      id: "lambda-s3-execution-role",
      question: "Funkcja Lambda musi odczytywać obiekty z jednego bucketa Amazon S3. Jak najbezpieczniej nadać jej dostęp?",
      answers: [
        { id: "limited-execution-role", text: "Przypisać funkcji Execution Role zezwalającą tylko na wymagane operacje i zasoby w tym bucketcie." },
        { id: "keys-in-code", text: "Zapisać Access Keys użytkownika IAM bezpośrednio w kodzie funkcji." },
        { id: "keys-in-environment", text: "Umieścić stałe Access Keys w zmiennych środowiskowych funkcji." },
        { id: "administrator-role", text: "Nadać Execution Role pełne uprawnienia administratora, aby uniknąć błędów dostępu." },
      ],
      correctAnswerId: "limited-execution-role",
      explanation: "Execution Role dostarcza funkcji tymczasowe poświadczenia. Zgodnie z zasadą Least Privilege rola powinna zezwalać tylko na potrzebne operacje wobec wskazanego bucketa, bez stałych Access Keys w kodzie lub konfiguracji.",
    },
    {
      id: "lambda-trigger-definition",
      question: "Czym jest Trigger w AWS Lambda?",
      answers: [
        { id: "invocation-configuration", text: "Konfiguracją powodującą wywołanie funkcji po określonym zdarzeniu, na przykład dodaniu obiektu do S3." },
        { id: "language-runtime", text: "Środowiskiem wykonawczym wybranego języka programowania." },
        { id: "entry-point", text: "Punktem wejścia w kodzie, który odbiera dane zdarzenia." },
        { id: "permission-role", text: "Rolą IAM określającą, do jakich zasobów funkcja ma dostęp." },
      ],
      correctAnswerId: "invocation-configuration",
      explanation: "Trigger łączy źródło zdarzenia z funkcją i określa, kiedy ma nastąpić wywołanie. Runtime uruchamia kod, Handler jest jego punktem wejścia, a Execution Role nadaje funkcji uprawnienia.",
    },
    {
      id: "lambda-timeout-investigation",
      question: "Funkcja regularnie kończy wykonanie, zanim zdąży przetworzyć dane. Co należy sprawdzić w pierwszej kolejności?",
      answers: [
        { id: "timeout-and-duration", text: "Ustawienie Timeout oraz rzeczywisty czas działania i wydajność kodu." },
        { id: "broader-permissions", text: "Czy Execution Role ma pełne uprawnienia administratora." },
        { id: "different-trigger", text: "Czy Trigger można zastąpić innym Runtime." },
        { id: "public-function", text: "Czy funkcję można udostępnić publicznie bez uwierzytelniania." },
      ],
      correctAnswerId: "timeout-and-duration",
      explanation: "Timeout wyznacza maksymalny czas pojedynczego wykonania. Trzeba porównać go z czasem pracy funkcji i znaleźć przyczynę opóźnienia; szersze uprawnienia nie rozwiązują przekroczenia czasu.",
    },
    {
      id: "lambda-external-system-secret",
      question: "Funkcja Lambda potrzebuje hasła do zewnętrznego systemu. Które rozwiązanie jest najbezpieczniejsze?",
      answers: [
        { id: "managed-secret-limited-role", text: "Przechować hasło w usłudze do zarządzania sekretami i nadać funkcji ograniczony dostęp przez Execution Role." },
        { id: "password-in-repository", text: "Zapisać hasło w pliku konfiguracyjnym i dodać go do repozytorium." },
        { id: "password-in-source", text: "Umieścić hasło jako stałą w kodzie Handlera." },
        { id: "password-in-logs", text: "Wypisać hasło w CloudWatch Logs, aby funkcja mogła je później odczytać." },
      ],
      correctAnswerId: "managed-secret-limited-role",
      explanation: "Sekret powinien trafić do AWS Secrets Manager lub odpowiednio użytego Systems Manager Parameter Store. Execution Role powinna pozwalać odczytać tylko wymagany sekret, którego nie należy umieszczać w repozytorium ani logach.",
    },
    {
      id: "lambda-vpc-public-api",
      question: "Po podłączeniu funkcji Lambda do prywatnego subnetu funkcja przestała łączyć się z publicznym API w internecie. Jakie jest najbardziej prawdopodobne wyjaśnienie?",
      answers: [
        { id: "missing-outbound-route", text: "Subnet nie ma poprawnej trasy wychodzącej, na przykład przez NAT Gateway; samo podłączenie do VPC nie zapewnia internetu." },
        { id: "lambda-cannot-use-internet", text: "Funkcje Lambda nigdy nie mogą łączyć się z internetem po podłączeniu do VPC." },
        { id: "execution-role-needs-admin", text: "Execution Role musi otrzymać pełne uprawnienia administratora, aby otwierać połączenia HTTPS." },
        { id: "private-subnet-is-enough", text: "Prywatny subnet automatycznie zapewnia dostęp wychodzący, więc przyczyną musi być Runtime." },
      ],
      correctAnswerId: "missing-outbound-route",
      explanation: "Funkcja podłączona do VPC korzysta z jego konfiguracji sieciowej. Dostęp do publicznego API z prywatnego subnetu wymaga właściwego routingu, zwykle przez NAT Gateway; należy też sprawdzić Security Groups i Network ACL.",
    },
  ],
} satisfies QuizDefinition;
