import type { AwsService } from "@/types/aws-service";

export const awsServices: AwsService[] = [
  {
    slug: "iam", name: "IAM", category: "Bezpieczeństwo", icon: "ID",
    shortDescription: "Użytkownicy, role, polityki i kontrola dostępu",
    definition: "IAM (Identity and Access Management) pozwala bezpiecznie zarządzać dostępem użytkowników i usług do zasobów AWS.",
    concepts: [
      { name: "User", description: "Tożsamość osoby lub aplikacji korzystającej z AWS." },
      { name: "Group", description: "Zbiór użytkowników współdzielących uprawnienia." },
      { name: "Role", description: "Tymczasowy zestaw uprawnień możliwy do przejęcia." },
      { name: "Policy", description: "Dokument JSON określający dozwolone i zabronione akcje." },
      { name: "Least Privilege", description: "Zasada nadawania wyłącznie niezbędnych uprawnień." },
    ],
    useCases: ["Dostęp pracowników do konsoli AWS", "Nadawanie usługom dostępu do innych zasobów", "Kontrola uprawnień między kontami"],
    commonMistakes: ["Używanie konta root do codziennej pracy", "Nadawanie zbyt szerokich uprawnień", "Brak MFA dla użytkowników uprzywilejowanych"],
    nextServiceSlug: "s3",
  },
  {
    slug: "s3", name: "S3", category: "Storage", icon: "S3",
    shortDescription: "Przechowywanie plików i obiektów w chmurze",
    definition: "Amazon S3 to skalowalna usługa przechowywania obiektów, takich jak pliki, kopie zapasowe i dane aplikacji.",
    concepts: [
      { name: "Bucket", description: "Kontener o unikalnej nazwie przechowujący obiekty." },
      { name: "Object", description: "Plik wraz z metadanymi zapisany w bucketcie." },
      { name: "Key", description: "Unikalny identyfikator obiektu wewnątrz bucketa." },
      { name: "Versioning", description: "Przechowywanie wielu wersji tego samego obiektu." },
      { name: "Bucket Policy", description: "Polityka dostępu przypisana do całego bucketa." },
    ],
    useCases: ["Hosting statycznych zasobów", "Kopie zapasowe i archiwizacja", "Data lake i wymiana danych"],
    commonMistakes: ["Przypadkowe publiczne udostępnienie danych", "Brak szyfrowania lub wersjonowania", "Nieprzemyślane reguły cyklu życia"],
    nextServiceSlug: "ec2",
  },
  {
    slug: "ec2", name: "EC2", category: "Compute", icon: "C2",
    shortDescription: "Wirtualne serwery i pełna kontrola nad systemem",
    definition: "Amazon EC2 udostępnia skalowalne maszyny wirtualne, nad którymi masz kontrolę na poziomie systemu operacyjnego.",
    concepts: [
      { name: "Instance", description: "Uruchomiona maszyna wirtualna w chmurze AWS." },
      { name: "AMI", description: "Obraz zawierający system i konfigurację startową." },
      { name: "Instance Type", description: "Zestaw zasobów CPU, pamięci, sieci i dysku." },
      { name: "EBS", description: "Trwały dysk blokowy podłączany do instancji." },
      { name: "Security Group", description: "Stanowa zapora kontrolująca ruch instancji." },
    ],
    useCases: ["Serwery aplikacji i stron WWW", "Systemy wymagające własnej konfiguracji OS", "Obliczenia wsadowe i środowiska testowe"],
    commonMistakes: ["Otwarcie portów na cały internet", "Pozostawianie nieużywanych instancji", "Brak kopii danych zapisanych na dyskach"],
    nextServiceSlug: "vpc",
  },
  {
    slug: "vpc", name: "VPC", category: "Networking", icon: "NW",
    shortDescription: "Sieci, subnety, routing i komunikacja zasobów",
    definition: "Amazon VPC pozwala zbudować logicznie odizolowaną sieć dla zasobów AWS oraz kontrolować adresację, routing i dostęp.",
    concepts: [
      { name: "VPC", description: "Prywatna sieć z wybranym zakresem adresów IP." },
      { name: "Subnet", description: "Fragment sieci przypisany do jednej Availability Zone." },
      { name: "Route Table", description: "Reguły określające kierunek ruchu sieciowego." },
      { name: "Internet Gateway", description: "Brama łącząca publiczne zasoby VPC z internetem." },
      { name: "NAT Gateway", description: "Daje prywatnym zasobom wyjście do internetu bez ruchu przychodzącego." },
    ],
    useCases: ["Izolowanie warstw aplikacji", "Łączenie chmury z siecią firmową", "Kontrola publicznego i prywatnego ruchu"],
    commonMistakes: ["Nakładające się zakresy CIDR", "Błędne trasy lub brak bramy", "Umieszczanie baz danych w publicznych subnetach"],
    nextServiceSlug: "lambda",
  },
  {
    slug: "lambda", name: "Lambda", category: "Serverless", icon: "λ",
    shortDescription: "Uruchamianie kodu bez zarządzania serwerami",
    definition: "AWS Lambda uruchamia kod w odpowiedzi na zdarzenia i automatycznie skaluje wykonania bez zarządzania serwerami.",
    concepts: [
      { name: "Function", description: "Kod wraz z konfiguracją uruchamiany przez Lambda." },
      { name: "Runtime", description: "Środowisko wykonawcze wybranego języka." },
      { name: "Trigger", description: "Źródło zdarzenia wywołującego funkcję." },
      { name: "Execution Role", description: "Rola IAM określająca dostęp funkcji do AWS." },
      { name: "Timeout", description: "Maksymalny czas pojedynczego wykonania." },
    ],
    useCases: ["Przetwarzanie plików po wysłaniu do S3", "Lekkie API i automatyzacje", "Obsługa zdarzeń i harmonogramów"],
    commonMistakes: ["Zbyt szeroka rola wykonawcza", "Ignorowanie cold startów i limitów", "Brak obsługi ponowień i duplikatów zdarzeń"],
    nextServiceSlug: "cloudwatch",
  },
  {
    slug: "cloudwatch", name: "CloudWatch", category: "Observability", icon: "CW",
    shortDescription: "Logi, metryki, monitoring i alarmy",
    definition: "Amazon CloudWatch zbiera logi i metryki zasobów oraz umożliwia tworzenie alarmów i pulpitów obserwowalności.",
    concepts: [
      { name: "Logs", description: "Zdarzenia tekstowe wysyłane przez aplikacje i usługi." },
      { name: "Metrics", description: "Wartości liczbowe mierzone w kolejnych punktach czasu." },
      { name: "Alarms", description: "Reakcje na przekroczenie ustalonych progów metryk." },
      { name: "Dashboards", description: "Wspólny widok wykresów i najważniejszych sygnałów." },
      { name: "Log Groups", description: "Kontenery grupujące strumienie powiązanych logów." },
    ],
    useCases: ["Monitorowanie kondycji aplikacji", "Alarmowanie o awariach i limitach", "Analiza logów podczas diagnozowania problemów"],
    commonMistakes: ["Brak polityk retencji logów", "Alarmy bez właściwych odbiorców", "Monitorowanie wielu metryk bez priorytetów"],
    nextServiceSlug: null,
  },
];

export function getService(slug: string) {
  return awsServices.find((service) => service.slug === slug);
}
