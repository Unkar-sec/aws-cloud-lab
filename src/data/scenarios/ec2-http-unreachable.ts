import type { ScenarioDefinition } from "@/types/scenario";

export const ec2HttpUnreachableScenario = {
  id: "aws:ec2-http-unreachable",
  slug: "ec2-http-unreachable",
  providerId: "aws",
  trackId: "aws-foundations",
  title: "EC2 nie odpowiada przez HTTP",
  summary: "Instancja EC2 działa, aplikacja nasłuchuje na porcie 80, ale strona nie otwiera się z internetu. Przeanalizuj sieć i znajdź brakującą regułę.",
  moduleCallout: "Przećwicz metodyczną diagnozę braku dostępu HTTP do instancji EC2.",
  difficulty: "beginner",
  estimatedMinutes: 15,
  relatedModuleIds: ["aws:ec2", "aws:vpc"],
  learningObjectives: [
    "rozpoznać warstwy wymagane do publicznego dostępu EC2",
    "odróżnić działającą aplikację od dostępnej aplikacji",
    "analizować reguły Security Group",
    "unikać niepotrzebnego otwierania wszystkich portów",
    "dobrać minimalną regułę inbound",
  ],
  briefing: {
    incidentTitle: "EC2 nie odpowiada przez HTTP",
    situation: "Publiczna strona demonstracyjna działa na instancji EC2 web-prod-01. Instancja znajduje się w publicznym subnetcie i ma publiczny adres IPv4.",
    expectedBehavior: "Użytkownik internetu powinien móc otworzyć stronę przez HTTP na porcie TCP/80.",
    observedBehavior: "Przeglądarka próbuje połączyć się z publicznym adresem instancji, ale połączenie kończy się timeoutem.",
    task: "Prześledź drogę od internetu do aplikacji, odrzuć sprawne warstwy i wskaż jedyną przyczynę oraz minimalną naprawę.",
  },
  evidence: [
    {
      id: "browser-timeout",
      type: "request",
      label: "Symulowany request",
      title: "Wynik w przeglądarce",
      description: "Adres 203.0.113.25 należy do zakresu dokumentacyjnego i nie wskazuje prawdziwej instancji.",
      content: `Connection timed out
http://203.0.113.25`,
    },
    {
      id: "instance-state",
      type: "configuration",
      label: "Configuration",
      title: "Stan instancji EC2",
      description: "Symulowany widok właściwości instancji web-prod-01.",
      language: "yaml",
      content: `name: web-prod-01
state: running
statusChecks: 2/2 passed
publicIpv4: 203.0.113.25
privateIpv4: 10.0.1.25
subnetId: subnet-0abc1234example
subnetType: public
securityGroupId: sg-0123456789example`,
    },
    {
      id: "application-listener",
      type: "log",
      label: "Symulowana konsola",
      title: "Proces nasłuchujący",
      description: "Symulowany wynik polecenia wykonanego na instancji.",
      language: "text",
      content: `$ sudo ss -lntp

LISTEN 0 511 0.0.0.0:80 0.0.0.0:* users:(("nginx",pid=812,fd=6))`,
    },
    {
      id: "localhost-test",
      type: "request",
      label: "Symulowany test",
      title: "Lokalny test HTTP",
      description: "Symulowany test wykonany wewnątrz instancji.",
      language: "http",
      content: `$ curl http://localhost

HTTP/1.1 200 OK
Server: nginx`,
    },
    {
      id: "route-table",
      type: "configuration",
      label: "Configuration",
      title: "Route Table publicznego subnetu",
      description: "Subnet instancji jest powiązany z tą tablicą routingu.",
      content: `Destination    Target
10.0.0.0/16   local
0.0.0.0/0     igw-0123456789example`,
    },
    {
      id: "security-group",
      type: "configuration",
      label: "Configuration",
      title: "Security Group sg-0123456789example",
      description: "Inbound dopuszcza wyłącznie administracyjny SSH. Nie istnieje reguła dla TCP/80.",
      content: `INBOUND
Protocol  Port  Source
TCP       22    203.0.113.10/32

OUTBOUND
Protocol  Port  Destination
All       All   0.0.0.0/0`,
    },
    {
      id: "network-acl",
      type: "configuration",
      label: "Configuration",
      title: "Network ACL publicznego subnetu",
      description: "Bezstanowa NACL pozwala na przychodzący HTTP i wychodzący ruch odpowiedzi. Nie jest źródłem timeoutu.",
      content: `INBOUND
Rule  Protocol  Port range   Source       Action
100   TCP       80           0.0.0.0/0    ALLOW
110   TCP       1024-65535   0.0.0.0/0    ALLOW

OUTBOUND
Rule  Protocol  Port range   Destination  Action
100   TCP       80           0.0.0.0/0    ALLOW
110   TCP       1024-65535   0.0.0.0/0    ALLOW`,
    },
  ],
  questions: [
    {
      id: "status-checks-meaning",
      type: "single-choice",
      prompt: "Co potwierdzają status checks 2/2?",
      evidenceIds: ["instance-state", "browser-timeout"],
      answers: [
        { id: "instance-basics-only", text: "AWS nie wykrywa problemu systemowego ani podstawowego problemu instancji, ale nie potwierdza to dostępności aplikacji z internetu." },
        { id: "http-publicly-available", text: "Port HTTP jest na pewno dostępny publicznie i Security Group zawiera poprawną regułę." },
        { id: "all-network-layers", text: "Internet Gateway, Route Table, NACL i wszystkie firewalle zostały kompleksowo przetestowane." },
        { id: "application-content", text: "Nginx zwraca poprawną treść każdemu klientowi internetu." },
      ],
      correctAnswerId: "instance-basics-only",
      explanation: "Status checks oceniają podstawową kondycję infrastruktury AWS i instancji. Nie wykonują pełnego testu ścieżki HTTP od przeglądarki przez wszystkie warstwy sieciowe do aplikacji.",
    },
    {
      id: "localhost-meaning",
      type: "single-choice",
      prompt: "Co potwierdza curl localhost?",
      evidenceIds: ["application-listener", "localhost-test"],
      answers: [
        { id: "application-works-locally", text: "Aplikacja działa lokalnie i nasłuchuje na instancji." },
        { id: "security-group-allows-http", text: "Security Group przepuszcza nowe połączenia TCP/80 z internetu." },
        { id: "internet-gateway-attached", text: "Internet Gateway jest dołączony do VPC i osiągalny z każdej sieci." },
        { id: "public-dns-works", text: "Publiczny DNS oraz trasa klienta internetowego działają poprawnie." },
      ],
      correctAnswerId: "application-works-locally",
      explanation: "Odpowiedź 200 z localhost oraz listener na 0.0.0.0:80 potwierdzają działanie nginx na instancji. Test lokalny nie przechodzi przez Security Group ani internetową ścieżkę klienta.",
    },
    {
      id: "internet-routing",
      type: "single-choice",
      prompt: "Czy routing do internetu wygląda poprawnie?",
      evidenceIds: ["instance-state", "route-table"],
      answers: [
        { id: "default-route-to-igw", text: "Tak, subnet ma trasę domyślną do Internet Gateway." },
        { id: "missing-default-route", text: "Nie, tablica zawiera wyłącznie trasę lokalną VPC." },
        { id: "nat-required", text: "Nie, publiczny ruch przychodzący zawsze wymaga trasy do NAT Gateway." },
        { id: "iam-route-required", text: "Nie, trasa zacznie działać dopiero po nadaniu instancji AdministratorAccess." },
      ],
      correctAnswerId: "default-route-to-igw",
      explanation: "Trasa 0.0.0.0/0 wskazuje Internet Gateway, a instancja ma publiczny IPv4 w powiązanym publicznym subnetcie. Dowody nie wskazują problemu routingu.",
    },
    {
      id: "timeout-root-cause",
      type: "single-choice",
      prompt: "Jaka jest główna przyczyna timeoutu?",
      evidenceIds: ["security-group", "network-acl", "application-listener", "route-table"],
      answers: [
        { id: "missing-http-inbound", text: "Security Group nie zawiera inbound TCP/80." },
        { id: "nginx-not-running", text: "Nginx nie działa i nic nie nasłuchuje na porcie 80." },
        { id: "nacl-blocks-http", text: "Network ACL odrzuca przychodzący TCP/80." },
        { id: "missing-igw-route", text: "Route Table nie ma trasy domyślnej do Internet Gateway." },
      ],
      correctAnswerId: "missing-http-inbound",
      explanation: "Aplikacja działa, routing prowadzi do IGW, a NACL dopuszcza HTTP i porty odpowiedzi. Jedynym niedopasowaniem jest brak reguły Security Group pozwalającej rozpocząć połączenie TCP/80.",
    },
    {
      id: "safest-fix",
      type: "single-choice",
      prompt: "Jaka jest najbezpieczniejsza naprawa?",
      evidenceIds: ["security-group", "browser-timeout"],
      answers: [
        { id: "minimal-http-source", text: "Dodać inbound TCP/80 wyłącznie ze źródła zgodnego z architekturą, np. internetu dla publicznej strony lub Security Group load balancera." },
        { id: "open-all-ports", text: "Otworzyć wszystkie porty TCP i UDP dla 0.0.0.0/0." },
        { id: "administrator-access", text: "Nadać instancji AdministratorAccess i wyłączyć wszystkie zabezpieczenia sieciowe." },
        { id: "public-ssh", text: "Udostępnić SSH na porcie 22 całemu internetowi, aby przeglądarka mogła połączyć się z nginx." },
      ],
      correctAnswerId: "minimal-http-source",
      explanation: "Reguła powinna dopuszczać tylko wymagany protokół, port i uzasadnione źródło. Dla demonstracyjnej publicznej strony może to być TCP/80 z 0.0.0.0/0; w produkcji zwykle lepszym źródłem jest Security Group load balancera, a ruchem użytkowników HTTPS.",
    },
  ],
  passingScore: 4,
  debrief: {
    rootCause: "Aplikacja działała i nasłuchiwała na 0.0.0.0:80, instancja miała publiczny IPv4, routing do Internet Gateway oraz Network ACL były poprawne. Stanowy firewall Security Group nie miał jednak reguły inbound TCP/80, więc nie pozwalał rozpocząć połączenia HTTP. Była to jedyna przyczyna timeoutu.",
    correctFix: "Dodać minimalną regułę inbound zgodną z architekturą. Dla publicznego serwera demonstracyjnego: Type HTTP, Protocol TCP, Port 80, Source 0.0.0.0/0. W produkcji często lepiej wystawić HTTPS przez load balancer i pozwolić instancji przyjmować ruch wyłącznie z Security Group tego load balancera.",
    fixExamples: [
      {
        id: "public-demo-http-rule",
        type: "configuration",
        label: "Security Group — minimalna reguła",
        title: "Publiczny serwer demonstracyjny",
        content: `Type: HTTP
Protocol: TCP
Port: 80
Source: 0.0.0.0/0`,
      },
    ],
    whyItWorks: "Security Group kontroluje możliwość rozpoczęcia połączenia do interfejsu sieciowego instancji. Po dodaniu precyzyjnego inbound TCP/80 żądanie może dotrzeć do nginx. Security Group jest stanowa, dlatego ruch odpowiedzi dla dozwolonego połączenia jest automatycznie dopuszczony.",
    unsafeFixes: [
      "Otwarcie wszystkich portów dla internetu tworzy niepotrzebną powierzchnię ataku zamiast udostępnić wyłącznie wymaganą usługę HTTP.",
      "SSH z 0.0.0.0/0 wystawia dostęp administracyjny całemu internetowi i nie jest potrzebny do obsługi ruchu HTTP.",
      "Wyłączenie Network ACL usuwa warstwę kontroli, mimo że przedstawione reguły NACL już pozwalają na wymagany ruch.",
      "Wyłączenie firewalla systemowego bez diagnozy może odsłonić inne usługi; dowody wskazują konkretnie brak reguły Security Group.",
      "Nadawanie uprawnień IAM nie naprawia ścieżki pakietów ani reguł sieciowych i nie rozwiąże timeoutu TCP.",
    ],
    prevention: [
      "Definiuj Security Groups i routing jako Infrastructure as Code oraz poddawaj zmiany przeglądowi.",
      "Stosuj checklisty wdrożeniowe obejmujące adresację, routing, NACL, Security Groups i listener aplikacji.",
      "Uruchamiaj health checki z warstwy, z której rzeczywiście ma przychodzić ruch.",
      "Monitoruj dostępność aplikacji z zewnątrz i alarmuj o timeoutach.",
      "Opisuj przeznaczenie każdej reguły oraz jej uzasadnione źródło.",
      "Rozdzielaj Security Groups między load balancer, warstwę aplikacji i zasoby administracyjne.",
    ],
  },
} as const satisfies ScenarioDefinition;
