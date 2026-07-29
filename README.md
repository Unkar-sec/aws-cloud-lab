# CloudOps Lab

CloudOps Lab to niezależna platforma edukacyjna do praktycznej nauki chmury, DevOps i bezpieczeństwa. Tutoriale, quizy i symulowane scenariusze pomagają rozwijać umiejętności infrastrukturalne bez wiązania całej platformy z jednym dostawcą chmury.

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
- uniwersalny, data-driven silnik symulowanych scenariuszy,
- lista praktycznych scenariuszy: `IAM Access Denied` oraz symulowane scenariusze diagnostyczne `Prywatny obiekt S3 zwraca 403`, `EC2 nie odpowiada przez HTTP`, `Lambda w VPC nie ma dostępu do internetu`, `Alarm CloudWatch obserwuje niewłaściwą funkcję` i `S3 nie uruchamia funkcji Lambda`,
- symulowany scenariusz diagnostyczny alarmu CloudWatch obejmujący Namespace, MetricName, Dimensions oraz analizę metryk i logów funkcji Lambda,
- symulowany scenariusz diagnostyczny integracji S3 z Lambda obejmujący Event Notification, filtry prefix i suffix oraz rozróżnienie braku wywołania od błędu wykonania,
- dashboard praktycznych scenariuszy z postępem całego zestawu, trzema statusami, rekomendacją następnego ćwiczenia oraz ekranem ukończenia,
- filtrowanie scenariuszy po statusie, trudności i module oraz sortowanie bez zmiany katalogu,
- ogólne powiązania tutoriali ze scenariuszami wraz ze statusem, trudnością i czasem,
- briefing incydentu, analiza logów i polityk, diagnoza oraz pełny debrief,
- osobny, wersjonowany zapis postępu scenariuszy w `localStorage`,
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

- prawdziwe środowiska AWS i automatyczna walidacja zasobów,
- prawdziwe alarmy CloudWatch i integracja z kontem AWS,
- rzeczywiste Event Notifications,
- CDK, prawdziwe zasoby AWS, przepływ deploy/check/reset/destroy, automatyczny checker oraz automatyczny reset i cleanup środowisk,
- backend i konta użytkowników,
- synchronizacja postępu między urządzeniami.

Założenia neutralnej architektury opisuje [dokument platformy](docs/architecture/provider-neutral-platform.md), a budowę symulacji [dokument silnika scenariuszy](docs/architecture/scenario-engine.md).
