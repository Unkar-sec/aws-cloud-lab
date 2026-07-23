# CloudOps Lab

CloudOps Lab to niezależna platforma edukacyjna do praktycznej nauki chmury, DevOps i bezpieczeństwa. Tutoriale, quizy i przyszłe scenariusze pomagają rozwijać umiejętności infrastrukturalne bez wiązania całej platformy z jednym dostawcą chmury.

## Niezależny projekt

CloudOps Lab nie jest powiązany, sponsorowany ani zatwierdzony przez Amazon Web Services. Nazwy usług są używane informacyjnie, a materiały edukacyjne są tworzone na potrzeby projektu. Platforma nie wydaje oficjalnych certyfikatów AWS.

AWS, Amazon Web Services oraz nazwy powiązanych usług są znakami towarowymi Amazon.com, Inc. lub jej podmiotów powiązanych.

## Dostawcy chmury

Pierwsza dostępna ścieżka projektu dotyczy Amazon Web Services. Architektura platformy jest projektowana neutralnie względem dostawców, aby w przyszłości umożliwić dodanie Microsoft Azure, Google Cloud i modułów niezależnych od jednej platformy.

## Aktualna ścieżka

AWS Foundations:

- IAM
- Amazon S3
- Amazon EC2
- Amazon VPC
- AWS Lambda
- Amazon CloudWatch

## Zakres MVP

- responsywna strona główna z katalogiem ścieżek i modułów,
- sześć statycznie generowanych tutoriali AWS,
- wspólny standard tutoriali: cele nauki, praktyczne przykłady, bezpieczeństwo, typowe błędy, koszty i podsumowanie,
- quizy IAM, S3, EC2, VPC, Lambda i CloudWatch z losowaną raz na podejście kolejnością odpowiedzi,
- lokalny zapis najlepszego wyniku i liczby podejść w `localStorage`,
- postęp liczony osobno dla AWS Foundations,
- rekomendowanie kolejnego modułu w obrębie ścieżki,
- obsługa ukończenia pełnej ścieżki,
- architektura neutralna względem dostawców chmury,
- własna strona błędu 404,
- polski interfejs i dostępna nawigacja klawiaturą.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm

## Uruchomienie

```bash
pnpm install
pnpm dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

## Planowane kierunki

- rozbudowany ekran ukończenia ścieżki,
- symulowany scenariusz IAM Access Denied,
- symulowany scenariusz S3 Access Denied,
- symulowany scenariusz EC2 nie odpowiada,
- logowanie,
- backend AWS,
- prawdziwe laboratoria chmurowe.

Założenia neutralnej architektury opisuje [dokument platformy](docs/architecture/provider-neutral-platform.md).
