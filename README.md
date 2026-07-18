# AWS Cloud Lab

Polski portal edukacyjny do nauki podstawowych usług AWS. Projekt prowadzi początkującego użytkownika przez krótkie, uporządkowane tutoriale w ramach ścieżki AWS Foundations.

> Projekt jest niezależnym materiałem edukacyjnym i nie jest oficjalnym produktem AWS.

## Zakres MVP

- responsywna strona główna z katalogiem sześciu usług,
- ścieżka AWS Foundations: IAM → S3 → EC2 → VPC → Lambda → CloudWatch,
- statycznie generowane tutoriale z pojęciami, zastosowaniami i typowymi ryzykami,
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

- logowanie,
- quizy,
- scenariusze awarii,
- zapisywanie postępu,
- achievementy,
- prawdziwe laboratoria AWS.
