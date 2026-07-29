import type { ScenarioDefinition } from "@/types/scenario";

export const lambdaVpcNoInternetScenario = {
  id: "aws:lambda-vpc-no-internet",
  slug: "lambda-vpc-no-internet",
  providerId: "aws",
  trackId: "aws-foundations",
  title: "Lambda w VPC nie ma dostępu do internetu",
  summary: "Po podłączeniu funkcji Lambda do prywatnej bazy danych funkcja przestała łączyć się z zewnętrznym API. Przeanalizuj subnety i routing.",
  moduleCallout: "Przećwicz diagnozę ruchu wychodzącego z funkcji Lambda podłączonej do VPC.",
  difficulty: "intermediate",
  estimatedMinutes: 15,
  relatedModuleIds: ["aws:lambda", "aws:vpc", "aws:cloudwatch"],
  learningObjectives: [
    "wyjaśnić wpływ podłączenia Lambda do VPC",
    "rozpoznać private subnet",
    "rozumieć rolę NAT Gateway",
    "odróżnić NAT Gateway od Internet Gateway",
    "diagnozować timeout połączenia wychodzącego",
  ],
  briefing: {
    incidentTitle: "Lambda w VPC nie ma dostępu do internetu",
    situation: "Funkcja payment-status-sync wcześniej działała poza VPC. Została podłączona do prywatnych subnetów, aby uzyskać dostęp do prywatnej bazy danych.",
    expectedBehavior: "Funkcja powinna odczytać dane z prywatnej bazy i pobrać status płatności z publicznego API partnera.",
    observedBehavior: "Od podłączenia do VPC żądanie do https://api.partner.example/status kończy się timeoutem po 10 sekundach.",
    task: "Przeanalizuj konfigurację Lambda, Security Group, subnety i Route Tables. Wskaż jedyną przyczynę braku dostępu wychodzącego oraz poprawną architekturę naprawy.",
  },
  evidence: [
    {
      id: "cloudwatch-timeout",
      type: "log",
      label: "Symulowany log CloudWatch",
      title: "Timeout synchronizacji",
      description: "Uproszczony materiał diagnostyczny; nie jest eksportem z prawdziwego środowiska AWS.",
      content: `INFO Starting partner API synchronization
ERROR Request timed out after 10 seconds
Target: https://api.partner.example/status`,
    },
    {
      id: "lambda-configuration",
      type: "configuration",
      label: "Configuration",
      title: "Konfiguracja funkcji Lambda",
      description: "Execution Role ma wymagane uprawnienia aplikacyjne. Dowody nie wskazują problemu IAM.",
      language: "yaml",
      content: `functionName: payment-status-sync
vpcId: vpc-020example
subnetIds:
  - subnet-020private-a
  - subnet-020private-b
subnetType: private
securityGroupIds:
  - sg-020lambda-egress
timeoutSeconds: 10
executionRole: payment-status-sync-role
executionRoleStatus: required permissions present`,
    },
    {
      id: "lambda-security-group",
      type: "configuration",
      label: "Configuration",
      title: "Security Group funkcji",
      description: "Ruch wychodzący HTTPS jest dozwolony. Brak reguł inbound nie blokuje połączenia inicjowanego przez funkcję.",
      content: `OUTBOUND
Protocol  Port  Destination
TCP       443   0.0.0.0/0

INBOUND
No rules`,
    },
    {
      id: "private-route-table",
      type: "configuration",
      label: "Configuration",
      title: "Route Table prywatnych subnetów",
      description: "Tablica nie zawiera trasy domyślnej 0.0.0.0/0 do NAT Gateway.",
      content: `Destination   Target
10.20.0.0/16  local`,
    },
    {
      id: "public-route-table",
      type: "configuration",
      label: "Configuration",
      title: "Route Table publicznego subnetu",
      description: "Internet Gateway jest podłączony do VPC, a publiczny subnet ma poprawną trasę internetową.",
      content: `Destination   Target
10.20.0.0/16  local
0.0.0.0/0    igw-020example`,
    },
    {
      id: "nat-configuration",
      type: "architecture",
      label: "Architecture",
      title: "Konfiguracja NAT",
      description: "Sam Internet Gateway nie tworzy ścieżki wyjścia dla prywatnej funkcji Lambda.",
      content: `NAT Gateway for private subnets: NOT CREATED
Private route 0.0.0.0/0 -> nat-...: MISSING
Internet Gateway attached to VPC: YES`,
    },
    {
      id: "partner-api-test",
      type: "request",
      label: "Symulowany test",
      title: "Test API partnera z innego środowiska",
      description: "DNS rozwiązuje nazwę, a publiczne API odpowiada poprawnie. Nie pozostaje alternatywna przyczyna po stronie partnera.",
      language: "http",
      content: `GET https://api.partner.example/status

DNS: resolved
HTTP/1.1 200 OK
Content-Type: application/json`,
    },
  ],
  questions: [
    {
      id: "vpc-attachment-effect",
      type: "single-choice",
      prompt: "Co zmieniło się po podłączeniu funkcji Lambda do VPC?",
      evidenceIds: ["lambda-configuration", "private-route-table"],
      answers: [
        { id: "uses-selected-network", text: "Funkcja zaczęła korzystać z konfiguracji sieciowej wskazanych subnetów i Security Groups." },
        { id: "gets-public-ip", text: "Funkcja automatycznie otrzymała stały publiczny adres IPv4 w każdym wybranym subnetcie." },
        { id: "loses-execution-role", text: "Lambda przestała używać Execution Role i wszystkie wywołania wymagają Access Keys w kodzie." },
        { id: "api-becomes-private", text: "Publiczne API partnera zostało automatycznie przeniesione do tego samego VPC." },
      ],
      correctAnswerId: "uses-selected-network",
      explanation: "Po podłączeniu do VPC ruch funkcji korzysta z interfejsów sieciowych, routingu wskazanych subnetów i reguł Security Groups. Dostęp internetowy zależy od tej konfiguracji sieciowej.",
    },
    {
      id: "security-group-egress-sufficiency",
      type: "single-choice",
      prompt: "Czy outbound HTTPS w Security Group wystarcza?",
      evidenceIds: ["lambda-security-group", "private-route-table"],
      answers: [
        { id: "route-also-required", text: "Nie. Potrzebna jest również poprawna trasa sieciowa." },
        { id: "sg-is-enough", text: "Tak. Reguła Security Group samodzielnie tworzy NAT Gateway i trasę do internetu." },
        { id: "inbound-https-required", text: "Nie. Trzeba przede wszystkim dodać publiczny inbound TCP/443 do funkcji." },
        { id: "iam-required", text: "Nie. Każde połączenie HTTPS wymaga nadania funkcji AdministratorAccess." },
      ],
      correctAnswerId: "route-also-required",
      explanation: "Security Group zezwala na ruch, ale go nie trasuje. Pakiet nadal potrzebuje trasy z private subnetu do urządzenia zapewniającego wyjście do internetu.",
    },
    {
      id: "internet-gateway-insufficient",
      type: "single-choice",
      prompt: "Dlaczego Internet Gateway nie wystarcza prywatnej Lambdzie?",
      evidenceIds: ["private-route-table", "public-route-table", "nat-configuration"],
      answers: [
        { id: "no-direct-route-or-public-addressing", text: "Prywatny subnet nie ma bezpośredniej trasy i publicznego adresowania potrzebnego do takiego wyjścia." },
        { id: "igw-only-supports-http", text: "Internet Gateway obsługuje wyłącznie HTTP na porcie 80, a nie HTTPS." },
        { id: "igw-requires-admin", text: "Internet Gateway działa tylko dla zasobów z przypisaną polityką AdministratorAccess." },
        { id: "lambda-cannot-use-vpc", text: "Funkcje Lambda nigdy nie mogą komunikować się z internetem po podłączeniu do VPC." },
      ],
      correctAnswerId: "no-direct-route-or-public-addressing",
      explanation: "Dołączony IGW obsługuje publiczny subnet, lecz prywatna funkcja nie dostaje publicznego IP ani trasy prowadzącej bezpośrednio przez IGW. Dla internetowego egressu potrzebuje ścieżki przez NAT.",
    },
    {
      id: "egress-root-cause",
      type: "single-choice",
      prompt: "Jaka jest główna przyczyna timeoutu?",
      evidenceIds: ["private-route-table", "nat-configuration", "partner-api-test"],
      answers: [
        { id: "missing-nat-route", text: "Brak trasy z private subnet do NAT Gateway." },
        { id: "partner-api-down", text: "Publiczne API partnera nie odpowiada z żadnego środowiska." },
        { id: "https-egress-blocked", text: "Security Group nie pozwala na outbound TCP/443." },
        { id: "execution-role-denied", text: "Execution Role zawiera jawny Deny dla połączeń TCP." },
      ],
      correctAnswerId: "missing-nat-route",
      explanation: "API i DNS działają, Security Group pozwala na HTTPS, a konfiguracja IAM nie jest źródłem błędu. Private Route Table ma wyłącznie trasę local i w VPC brakuje NAT Gateway, więc nie istnieje ścieżka do publicznego API.",
    },
    {
      id: "correct-egress-fix",
      type: "single-choice",
      prompt: "Jaka jest poprawna naprawa?",
      evidenceIds: ["private-route-table", "public-route-table", "nat-configuration"],
      answers: [
        { id: "nat-in-public-route-private", text: "Utworzyć NAT Gateway w public subnet i skierować trasę 0.0.0.0/0 prywatnego subnetu do NAT Gateway." },
        { id: "public-subnet-assumption", text: "Przenieść funkcję do public subnetu i założyć, że Lambda automatycznie otrzyma publiczny adres IPv4." },
        { id: "open-inbound", text: "Otworzyć inbound TCP/443 z 0.0.0.0/0 w Security Group funkcji." },
        { id: "make-database-public", text: "Udostępnić prywatną bazę danych publicznie, aby odłączyć funkcję od VPC." },
      ],
      correctAnswerId: "nat-in-public-route-private",
      explanation: "NAT Gateway w publicznym subnetcie korzysta z jego trasy do IGW, a private Route Table kieruje do NAT ruch internetowy funkcji. Jeśli funkcja komunikuje się wyłącznie z obsługiwaną usługą AWS, VPC Endpoint może być bezpieczniejszy i tańszy, ale nie jest ogólnym rozwiązaniem dostępu do dowolnego publicznego API.",
    },
  ],
  passingScore: 4,
  debrief: {
    rootCause: "Lambda została podłączona do private subnetów bez ścieżki wyjścia do internetu. Private Route Table zawierała wyłącznie trasę local, a w VPC nie istniał NAT Gateway. Security Group, DNS, publiczne API i uprawnienia funkcji były poprawne, więc brak trasy do NAT był jedyną przyczyną timeoutu.",
    correctFix: "Utworzyć NAT Gateway w publicznym subnetcie, który ma trasę do Internet Gateway, a następnie dodać w Route Table prywatnych subnetów trasę 0.0.0.0/0 wskazującą NAT Gateway. Docelowy przepływ: Lambda → private subnet → private Route Table → NAT Gateway → public subnet → Internet Gateway → publiczne API.",
    fixExamples: [
      {
        id: "lambda-egress-architecture",
        type: "architecture",
        label: "Architecture",
        title: "Poprawna ścieżka egress",
        content: `Lambda
  -> private subnet
  -> private Route Table (0.0.0.0/0 -> NAT Gateway)
  -> NAT Gateway
  -> public subnet
  -> Internet Gateway
  -> public API`,
      },
    ],
    whyItWorks: "NAT Gateway wykonuje translację adresów dla połączeń inicjowanych przez prywatne zasoby i przekazuje je przez publiczny subnet oraz Internet Gateway. Odpowiedzi wracają do funkcji w ramach rozpoczętego połączenia, ale internet nie może wykorzystać NAT Gateway do rozpoczęcia połączenia przychodzącego do Lambdy.",
    unsafeFixes: [
      "Umieszczenie sekretów API w kodzie nie tworzy trasy sieciowej, a dodatkowo naraża długotrwałe poświadczenia na wyciek.",
      "AdministratorAccess zmienia autoryzację AWS, ale nie naprawia Route Table ani internetowego egressu.",
      "Otwarcie inbound w Security Group nie pomaga połączeniu inicjowanemu przez funkcję i niepotrzebnie poszerza ekspozycję.",
      "Publiczne udostępnienie bazy danych usuwa jej ważną granicę bezpieczeństwa zamiast poprawić kontrolowaną ścieżkę wyjścia.",
      "Przeniesienie Lambdy do public subnetu nie oznacza automatycznego przydzielenia jej publicznego adresu i nie gwarantuje dostępu do internetu.",
    ],
    prevention: [
      "Utrzymuj aktualny diagram przepływu sieciowego dla integracji zewnętrznych.",
      "Sprawdzaj powiązania subnetów z Route Tables podczas każdej zmiany konfiguracji VPC.",
      "Automatyzuj testy egressu do wymaganych endpointów.",
      "Podłączaj Lambda do VPC świadomie, tylko gdy wymaga dostępu do zasobów w tej sieci.",
      "Analizuj dostępność i koszt NAT Gateway, również w architekturze wielostrefowej.",
      "Używaj VPC Endpoints dla odpowiednich, obsługiwanych usług AWS zamiast kierować taki ruch przez internet.",
      "Monitoruj timeouty i błędy integracji w CloudWatch.",
    ],
  },
} as const satisfies ScenarioDefinition;
