# AWS Cloud Lab

Polski portal edukacyjny do nauki podstawowych usług AWS. Projekt prowadzi początkującego użytkownika przez krótkie, uporządkowane tutoriale w ramach ścieżki AWS Foundations.

> Projekt jest niezależnym materiałem edukacyjnym i nie jest oficjalnym produktem AWS.

## Zakres MVP

- responsywna strona główna z katalogiem sześciu usług,
- ścieżka AWS Foundations: IAM → S3 → EC2 → VPC → Lambda → CloudWatch,
- statycznie generowane tutoriale sześciu usług z pojęciami, zastosowaniami i typowymi ryzykami,
- interaktywny quiz IAM z objaśnieniem każdej odpowiedzi,
- lokalny zapis najlepszego wyniku i liczby podejść w `localStorage`,
- podstawowy postęp ścieżki AWS Foundations,
- własna, spójna wizualnie strona błędu 404,
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

## Planowane funkcje

- quizy pozostałych usług,
- logowanie Cognito,
- zapis postępu w DynamoDB,
- scenariusze awarii,
- achievementy,
- prawdziwe laboratoria AWS.
