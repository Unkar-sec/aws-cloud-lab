import type { QuizDefinition } from "@/types/quiz";

export const ec2Quiz = {
  id: "ec2-foundations",
  providerId: "aws",
  trackId: "aws-foundations",
  moduleId: "aws:ec2",
  moduleSlug: "ec2",
  title: "Quiz EC2",
  description: "Sprawdź podstawową wiedzę o Amazon EC2, Security Groups, EBS i bezpiecznym dostępie do usług AWS.",
  passingScore: 4,
  questions: [
    {
      id: "ec2-ami-vs-instance-type",
      question: "Jaka jest różnica między AMI a Instance Type podczas tworzenia instancji EC2?",
      answers: [
        { id: "image-vs-resources", text: "AMI określa obraz systemu i podstawową konfigurację, a Instance Type określa zasoby, takie jak vCPU, RAM i możliwości sieciowe." },
        { id: "resources-vs-firewall", text: "AMI określa liczbę vCPU i RAM, a Instance Type definiuje reguły firewalla." },
        { id: "disk-vs-address", text: "AMI jest wyłącznie dyskiem z danymi, a Instance Type jest publicznym adresem IP." },
        { id: "same-purpose", text: "AMI i Instance Type są dwiema nazwami tej samej konfiguracji maszyny." },
      ],
      correctAnswerId: "image-vs-resources",
      explanation: "AMI jest szablonem startowym z systemem operacyjnym i opcjonalnym oprogramowaniem. Instance Type dobiera profil sprzętowy instancji, między innymi vCPU, pamięć i wydajność sieciową.",
    },
    {
      id: "ec2-traffic-control",
      question: "Który mechanizm najczęściej kontroluje dozwolony ruch sieciowy do interfejsu instancji EC2?",
      answers: [
        { id: "ami", text: "AMI" },
        { id: "security-group", text: "Security Group" },
        { id: "key-pair", text: "Key Pair" },
        { id: "ebs-snapshot", text: "EBS Snapshot" },
      ],
      correctAnswerId: "security-group",
      explanation: "Security Group jest stanowym firewallem przypisanym do interfejsu sieciowego. Jej reguły kontrolują dozwolony ruch przychodzący i wychodzący.",
    },
    {
      id: "ec2-s3-access-role",
      question: "Aplikacja na EC2 musi odczytywać obiekty z S3. Jak najbezpieczniej przekazać jej potrzebne uprawnienia?",
      answers: [
        { id: "instance-role", text: "Przypisać instancji IAM Role przez Instance Profile i nadać jej tylko wymagany dostęp do S3." },
        { id: "keys-in-code", text: "Zapisać stałe Access Keys bezpośrednio w kodzie aplikacji." },
        { id: "keys-in-config", text: "Umieścić stałe Access Keys w pliku konfiguracyjnym na instancji." },
        { id: "public-bucket", text: "Upublicznić bucket S3, aby aplikacja nie potrzebowała poświadczeń." },
      ],
      correctAnswerId: "instance-role",
      explanation: "Instance Profile udostępnia instancji IAM Role, a aplikacja otrzymuje automatycznie odnawiane, tymczasowe poświadczenia. Stałych Access Keys nie trzeba przechowywać w kodzie ani konfiguracji.",
    },
    {
      id: "ec2-stop-vs-terminate",
      question: "Które stwierdzenie poprawnie opisuje różnicę między Stop a Terminate dla instancji EC2?",
      answers: [
        { id: "restartable-vs-final", text: "Zatrzymaną instancję można ponownie uruchomić, natomiast zakończonej instancji nie można już uruchomić ponownie." },
        { id: "both-final", text: "Obie operacje trwale usuwają instancję i zawsze wszystkie podłączone wolumeny." },
        { id: "stop-final", text: "Stop trwale usuwa instancję, a Terminate pozwala uruchomić ją później." },
        { id: "only-reboot", text: "Stop i Terminate jedynie ponownie uruchamiają system operacyjny." },
      ],
      correctAnswerId: "restartable-vs-final",
      explanation: "Stop wyłącza instancję, ale pozwala ją później uruchomić. Terminate trwale kończy istnienie instancji. Zachowanie danych na EBS zależy między innymi od ustawienia usuwania wolumenu przy terminacji.",
    },
    {
      id: "ec2-ebs-volume",
      question: "Które stwierdzenie najlepiej opisuje Amazon EBS w kontekście EC2?",
      answers: [
        { id: "persistent-block-storage", text: "EBS zapewnia trwałe wolumeny blokowe, które mogą przechowywać dane niezależnie od tego, czy instancja aktualnie działa, zależnie od konfiguracji cyklu życia zasobu." },
        { id: "temporary-memory", text: "EBS jest pamięcią RAM, której zawartość zawsze znika po zatrzymaniu instancji." },
        { id: "network-firewall", text: "EBS jest firewallem filtrującym połączenia do instancji." },
        { id: "machine-image", text: "EBS jest gotowym obrazem systemu używanym zamiast AMI." },
      ],
      correctAnswerId: "persistent-block-storage",
      explanation: "EBS to trwały magazyn blokowy podłączany jako dysk. Wolumen jest osobnym zasobem i może pozostać po zatrzymaniu, a czasem również po terminacji instancji — zgodnie z konfiguracją jego cyklu życia.",
    },
  ],
} satisfies QuizDefinition;
