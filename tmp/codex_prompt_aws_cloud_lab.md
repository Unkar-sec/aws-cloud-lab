# Prompt dla Codexa — AWS Cloud Lab

Pracujesz w istniejącym repozytorium aplikacji:

`~/Projects/aws-cloud-lab`

Projekt korzysta z:

- Next.js 15
- App Router
- TypeScript
- Tailwind CSS 4
- pnpm
- katalogu `src/app`

Najpierw przeanalizuj aktualną strukturę projektu i istniejące pliki. Nie inicjalizuj nowego projektu, nie zmieniaj wersji Next.js i nie usuwaj konfiguracji pnpm.

## Cel

Zastąp domyślną stronę Next.js pierwszą wersją portalu edukacyjnego AWS.

Portal ma umożliwiać początkującemu użytkownikowi:

1. zobaczenie podstawowych usług AWS w formie kafelków,
2. kliknięcie kafelka i przejście do prostego tutorialu,
3. rozpoczęcie uporządkowanej ścieżki „AWS Foundations”.

Na tym etapie nie implementuj logowania, bazy danych, API, AWS SDK, quizów ani prawdziwych laboratoriów. Użyj statycznych danych lokalnych.

## Język interfejsu

Cały interfejs i treść mają być po polsku.

Nazwy usług AWS, takie jak IAM, EC2, S3, VPC, Lambda i CloudWatch, pozostaw w oryginalnej formie.

## Strona główna `/`

Przygotuj nowoczesną, czytelną i responsywną stronę w stylistyce Cloud/DevOps.

Preferowany wygląd:

- ciemne tło,
- jasna typografia,
- delikatne obramowania i gradienty,
- niebieskie lub błękitne akcenty,
- dużo przestrzeni,
- bez przesadnych animacji,
- profesjonalny wygląd odpowiedni do projektu portfolio.

### Nagłówek

Dodaj prosty pasek nawigacyjny zawierający:

- nazwę projektu: `AWS Cloud Lab`,
- link „Usługi” prowadzący do sekcji kafelków,
- link „Jak to działa” prowadzący do odpowiedniej sekcji,
- przycisk „Rozpocznij naukę”.

Na urządzeniach mobilnych nawigacja ma pozostać czytelna. Nie musisz tworzyć rozbudowanego menu hamburgerowego, jeżeli prostsza wersja będzie działała dobrze.

### Sekcja hero

Dodaj:

Nagłówek:

`Naucz się AWS poprzez praktykę`

Opis:

`Poznaj podstawowe usługi chmurowe, sprawdź swoją wiedzę i przygotuj się do rozwiązywania realistycznych problemów w środowisku AWS.`

Główny przycisk:

`Rozpocznij AWS Foundations`

Przycisk ma prowadzić do:

`/learn/iam`

Dodaj także drugorzędny link lub przycisk:

`Zobacz usługi`

Ma przewijać stronę do sekcji kafelków.

W hero pokaż również niewielkie informacje, np.:

- `6 podstawowych usług`
- `Tutoriale krok po kroku`
- `Praktyczne scenariusze w kolejnych etapach`

### Sekcja podstawowych usług

Dodaj nagłówek:

`Podstawowe usługi AWS`

Opis:

`Zacznij od fundamentów. Każdy moduł wyjaśnia najważniejsze pojęcia, zastosowania i typowe problemy.`

Wyświetl sześć responsywnych kafelków:

1. IAM
   - opis: `Użytkownicy, role, polityki i kontrola dostępu`
   - kategoria: `Bezpieczeństwo`

2. S3
   - opis: `Przechowywanie plików i obiektów w chmurze`
   - kategoria: `Storage`

3. EC2
   - opis: `Wirtualne serwery i pełna kontrola nad systemem`
   - kategoria: `Compute`

4. VPC
   - opis: `Sieci, subnety, routing i komunikacja zasobów`
   - kategoria: `Networking`

5. Lambda
   - opis: `Uruchamianie kodu bez zarządzania serwerami`
   - kategoria: `Serverless`

6. CloudWatch
   - opis: `Logi, metryki, monitoring i alarmy`
   - kategoria: `Observability`

Każdy kafelek powinien zawierać:

- skrót lub prostą ikonę,
- nazwę usługi,
- kategorię,
- krótki opis,
- informację `Poziom: Podstawowy`,
- przycisk lub link `Poznaj usługę`.

Kafelki mają prowadzić odpowiednio do:

- `/learn/iam`
- `/learn/s3`
- `/learn/ec2`
- `/learn/vpc`
- `/learn/lambda`
- `/learn/cloudwatch`

Dodaj subtelny efekt hover, ale zadbaj o dostępność i widoczny focus klawiatury.

### Sekcja „Jak działa nauka”

Pokaż cztery kroki:

1. `Poznaj usługę`
2. `Sprawdź wiedzę`
3. `Rozwiąż scenariusz`
4. `Zdobądź osiągnięcie`

Dodaj informację, że w pierwszej wersji projektu dostępne są tutoriale, a quizy, scenariusze i achievementy zostaną podłączone w kolejnych etapach.

### Sekcja ścieżki

Dodaj prosty podgląd ścieżki:

`AWS Foundations`

Kolejność modułów:

`IAM → S3 → EC2 → VPC → Lambda → CloudWatch`

IAM oznacz jako pierwszy dostępny moduł. Pozostałe mogą być pokazane jako kolejne elementy ścieżki, ale nie blokuj możliwości wejścia na ich strony przez kafelki.

### Stopka

Dodaj prostą stopkę:

- `AWS Cloud Lab`
- `Projekt edukacyjny i portfolio Cloud/DevOps`
- aktualny rok generowany dynamicznie albo wpisany jako 2026

Nie sugeruj, że portal jest oficjalnym produktem AWS.

## Strony tutoriali

Utwórz dynamiczną trasę:

`src/app/learn/[slug]/page.tsx`

Dane usług powinny znajdować się poza komponentem strony, np.:

`src/data/aws-services.ts`

Zdefiniuj silnie typowany model TypeScript dla usługi.

Każda usługa powinna posiadać:

- `slug`
- `name`
- `shortDescription`
- `category`
- `definition`
- `concepts`
- `useCases`
- `commonMistakes`
- `nextServiceSlug`

Przygotuj treść dla wszystkich sześciu usług.

Nie twórz bardzo długich artykułów. Każda strona powinna być podstawowym, czytelnym tutorialem.

### Układ strony tutorialu

Każda strona `/learn/[slug]` powinna zawierać:

1. breadcrumb:
   `AWS Foundations / Nazwa usługi`

2. nazwę usługi i kategorię,

3. krótką definicję,

4. sekcję:
   `Najważniejsze pojęcia`

5. sekcję:
   `Kiedy używać`

6. sekcję:
   `Typowe błędy i ryzyka`

7. prosty blok:
   `Co dalej?`

8. przycisk prowadzący do następnej usługi, np.:
   `Przejdź do S3`

9. link:
   `Wróć do wszystkich usług`

Dla ostatniej usługi CloudWatch przycisk może mieć tekst:

`Zakończ podstawy`

i prowadzić na stronę główną do sekcji ścieżki.

### Przykładowe pojęcia

IAM:

- User
- Group
- Role
- Policy
- Least Privilege

S3:

- Bucket
- Object
- Key
- Versioning
- Bucket Policy

EC2:

- Instance
- AMI
- Instance Type
- EBS
- Security Group

VPC:

- VPC
- Subnet
- Route Table
- Internet Gateway
- NAT Gateway

Lambda:

- Function
- Runtime
- Trigger
- Execution Role
- Timeout

CloudWatch:

- Logs
- Metrics
- Alarms
- Dashboards
- Log Groups

## Komponenty

Wyodrębnij powtarzalne elementy do komponentów. Preferowana struktura:

- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/service-card.tsx`
- `src/components/learning-step.tsx`
- `src/components/track-preview.tsx`
- `src/data/aws-services.ts`
- `src/types/aws-service.ts`

Możesz dostosować strukturę, jeżeli znajdziesz prostsze i czytelniejsze rozwiązanie.

Nie instaluj dużej biblioteki UI. Użyj Reacta, Next.js i Tailwinda dostępnych już w projekcie.

Nie dodawaj shadcn/ui na tym etapie.

## Wymagania techniczne

- użyj Server Components tam, gdzie nie jest potrzebny stan klienta,
- nie dodawaj `"use client"` bez potrzeby,
- użyj komponentu `Link` z Next.js,
- zastosuj `generateStaticParams` dla stron usług, jeżeli pasuje do implementacji,
- obsłuż nieprawidłowy slug przez `notFound()`,
- ustaw poprawne metadane strony w `layout.tsx`,
- zmień domyślny tytuł Next.js,
- usuń niepotrzebne elementy domyślnego startera,
- zachowaj pełną responsywność,
- zadbaj o semantyczny HTML,
- zadbaj o focus states i podstawową dostępność,
- nie używaj zewnętrznych obrazów,
- nie używaj oficjalnych logotypów AWS,
- nie dodawaj sekretów ani plików `.env`,
- nie dodawaj backendu.

## README

Zaktualizuj `README.md`.

README ma zawierać:

- nazwę projektu,
- krótki opis,
- aktualny zakres MVP,
- używany stack,
- instrukcję uruchomienia:

```bash
pnpm install
pnpm dev
```

- informację o planowanych funkcjach:
  - logowanie,
  - quizy,
  - scenariusze awarii,
  - zapisywanie postępu,
  - achievementy,
  - prawdziwe laboratoria AWS

## Weryfikacja

Po zakończeniu uruchom:

```bash
pnpm lint
pnpm build
```

Napraw wszystkie błędy TypeScriptu, lintowania i budowania.

Nie wykonuj `git push`.

Na końcu przedstaw:

1. krótkie podsumowanie wykonanych zmian,
2. listę najważniejszych utworzonych lub zmienionych plików,
3. wynik `pnpm lint`,
4. wynik `pnpm build`,
5. ewentualne decyzje lub kompromisy implementacyjne.
