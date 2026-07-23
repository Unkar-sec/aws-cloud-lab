import type { QuizDefinition } from "@/types/quiz";

export const vpcQuiz = {
  id: "vpc-foundations",
  providerId: "aws",
  trackId: "aws-foundations",
  moduleId: "aws:vpc",
  moduleSlug: "vpc",
  title: "Quiz VPC",
  description: "Sprawdź podstawową wiedzę o Amazon VPC, subnetach, routingu, Internet Gateway, NAT Gateway i zabezpieczeniach sieciowych.",
  passingScore: 4,
  questions: [
    {
      id: "vpc-public-subnet-routing",
      question: "Co sprawia, że subnet w Amazon VPC jest publiczny?",
      answers: [
        { id: "route-to-igw", text: "Powiązana Route Table zawiera trasę ruchu internetowego do Internet Gateway podłączonego do VPC." },
        { id: "public-name", text: "Nazwa subnetu zawiera słowo „public”." },
        { id: "instance-public-ip", text: "Co najmniej jedna instancja w subnecie ma publiczny adres IPv4." },
        { id: "allow-all-sg", text: "Security Group dowolnego zasobu zezwala na cały ruch przychodzący." },
      ],
      correctAnswerId: "route-to-igw",
      explanation: "Publiczny subnet definiuje routing: jego Route Table prowadzi ruch internetowy do Internet Gateway. Nazwa subnetu ani publiczny adres pojedynczej instancji nie określają typu subnetu.",
    },
    {
      id: "vpc-private-instance-outbound-internet",
      question: "Instancja EC2 w private subnet musi pobierać aktualizacje z internetu, ale nie powinna być dostępna bezpośrednio z internetu. Która konfiguracja to umożliwi?",
      answers: [
        { id: "private-route-nat-public-igw", text: "Trasa z private subnet prowadzi do NAT Gateway w public subnet, którego Route Table ma trasę do Internet Gateway." },
        { id: "private-route-direct-igw", text: "Trasa z private subnet prowadzi bezpośrednio do Internet Gateway, a instancja nie ma publicznego adresu." },
        { id: "nat-in-private-subnet", text: "NAT Gateway znajduje się w private subnet bez trasy do Internet Gateway." },
        { id: "security-group-only", text: "Wystarczy zezwolić na ruch wychodzący w Security Group instancji, bez zmiany routingu." },
      ],
      correctAnswerId: "private-route-nat-public-igw",
      explanation: "Prywatny subnet kieruje ruch internetowy do NAT Gateway umieszczonego w publicznym subnecie, a ten ma drogę przez Internet Gateway. NAT Gateway pozwala instancji inicjować połączenia, lecz nie udostępnia jej bezpośrednio internetowi.",
    },
    {
      id: "vpc-security-group-vs-nacl",
      question: "Które stwierdzenie poprawnie porównuje Security Group i Network ACL?",
      answers: [
        { id: "stateful-eni-stateless-subnet", text: "Security Group jest stanowa i działa przy interfejsie sieciowym zasobu, a Network ACL jest bezstanowa i działa na poziomie subnetu." },
        { id: "both-stateful", text: "Oba mechanizmy są stanowe, działają na poziomie instancji i obsługują wyłącznie reguły allow." },
        { id: "sg-deny-nacl-allow", text: "Security Group obsługuje reguły allow i deny, a Network ACL wyłącznie allow." },
        { id: "sg-subnet-nacl-interface", text: "Security Group działa na poziomie subnetu, a Network ACL wyłącznie przy interfejsie sieciowym zasobu." },
      ],
      correctAnswerId: "stateful-eni-stateless-subnet",
      explanation: "Security Group jest stanowa, działa przy interfejsie zasobu i używa reguł allow. Network ACL filtruje ruch subnetu, jest bezstanowa oraz obsługuje uporządkowane reguły allow i deny dla obu kierunków.",
    },
    {
      id: "vpc-public-ec2-missing-route",
      question: "Instancja EC2 ma publiczny adres IPv4, a jej Security Group zezwala na ruch HTTP na porcie 80. Dlaczego mimo to może nie odpowiadać z internetu?",
      answers: [
        { id: "missing-default-route-to-igw", text: "Route Table subnetu nie ma trasy 0.0.0.0/0 do Internet Gateway podłączonego do VPC." },
        { id: "public-ip-blocks-http", text: "Publiczny adres IPv4 automatycznie blokuje port 80." },
        { id: "security-groups-require-deny", text: "Security Group musi zawierać dodatkową regułę deny dla ruchu wychodzącego." },
        { id: "ec2-needs-nat-inbound", text: "Każda publiczna instancja EC2 wymaga NAT Gateway do odbierania ruchu z internetu." },
      ],
      correctAnswerId: "missing-default-route-to-igw",
      explanation: "Publiczny adres i reguła Security Group nie tworzą ścieżki sieciowej. Subnet potrzebuje Route Table z trasą 0.0.0.0/0 do podłączonego Internet Gateway, a pozostałe warstwy konfiguracji także muszą zezwalać na ruch.",
    },
    {
      id: "vpc-subnet-availability-zone",
      question: "Jak subnety odnoszą się do Availability Zones w Amazon VPC?",
      answers: [
        { id: "one-az-per-subnet", text: "Jeden subnet należy do jednej Availability Zone, VPC może obejmować wiele AZ, a wysoka dostępność zwykle wymaga subnetów w więcej niż jednej AZ." },
        { id: "subnet-spans-all-az", text: "Każdy subnet automatycznie obejmuje wszystkie Availability Zones regionu." },
        { id: "vpc-one-az", text: "Całe VPC może działać tylko w jednej Availability Zone." },
        { id: "az-independent", text: "Subnet nie jest związany z żadną Availability Zone, dopóki nie uruchomisz w nim EC2." },
      ],
      correctAnswerId: "one-az-per-subnet",
      explanation: "VPC jest zasobem regionalnym i może obejmować wiele Availability Zones, ale każdy subnet tworzysz w dokładnie jednej AZ. Rozłożenie warstw aplikacji na subnety w kilku AZ pomaga zwiększyć odporność.",
    },
  ],
} satisfies QuizDefinition;
