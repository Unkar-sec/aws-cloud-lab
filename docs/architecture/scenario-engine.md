# Silnik symulowanych scenariuszy

## Cel i granica

Silnik scenariuszy uczy diagnozy incydentu na podstawie briefingu i dowodów. Nie jest wariantem quizu: użytkownik najpierw poznaje sytuację, następnie analizuje komplet materiałów, odpowiada na pytania diagnostyczne bez natychmiastowego ujawniania rozwiązania, a dopiero po zakończeniu otrzymuje wynik i techniczny debrief.

Obecna implementacja jest lokalną symulacją. Nie łączy się z kontem AWS, SDK, CLI ani backendem i nie tworzy zasobów. Przyszły prawdziwy lab może wykorzystać ten sam katalog edukacyjny i warstwę prezentacji, lecz uruchamianie środowiska, pobieranie dowodów oraz walidacja zasobów muszą powstać jako osobna, wyraźnie oznaczona warstwa.

## Model scenariusza

`ScenarioDefinition` w `src/types/scenario.ts` jest neutralnym kontraktem danych. Stabilne `id` posiada przestrzeń nazw, publiczny `slug` buduje trasę, a dowolny `providerId` wiąże zawartość z katalogiem dostawców bez umieszczania reguł AWS w silniku. Opcjonalny `trackId` i `relatedModuleIds` łączą ćwiczenie z nauką, ale nie tworzą twardej blokady.

Definicja zawiera:

- metadane, trudność, czas i cele,
- briefing incydentu,
- dowody różnych typów, między innymi log, policy, request i configuration,
- pytania z jawnym typem `single-choice`, stabilnymi ID odpowiedzi i odwołaniami do dowodów,
- próg zaliczenia,
- debrief: Root Cause, Correct Fix, Why It Works, Unsafe Fixes i Prevention.

Pole `type` w pytaniu pozwala w przyszłości rozszerzyć unię typów bez zmiany istniejących danych. Obecna wersja celowo nie implementuje złożonych, wieloetapowych akcji.

## Katalog danych i rendering

Definicje znajdują się w `src/data/scenarios/`, po jednym pliku na scenariusz. `index.ts` udostępnia pobranie całego katalogu, wyszukiwanie po slugu, filtrowanie po `providerId` i statyczne slugi. Komponenty React nie zawierają treści konkretnego incydentu.

Trasa `/scenarios` renderuje tylko dostępne definicje. Dynamiczna trasa `/scenarios/[slug]` używa `generateStaticParams`; nieznany slug wywołuje wspólną stronę 404. `ScenarioRunner` obsługuje cztery etapy: Briefing, Dowody, Diagnoza i Wynik. Podczas diagnozy dowody są nadal widoczne, a odpowiedzi nie są oceniane aż do końca.

## Postęp

Postęp scenariuszy używa osobnego klucza `cloudops-lab-scenario-progress` i formatu w wersji 1. Biblioteka `src/lib/scenario-progress.ts` waliduje dane wejściowe, bezpiecznie obsługuje uszkodzony JSON i brak Web Storage, zachowuje najwyższy wynik oraz pierwszą datę zaliczenia. Liczba podejść i `lastAttemptAt` zmieniają się po każdym zakończonym podejściu.

Hook oparty o `useSyncExternalStore` reaguje na zdarzenie `storage` między kartami oraz lokalne zdarzenie zmiany w tej samej karcie. Ten system nie odczytuje i nie zapisuje historycznego klucza postępu tutoriali i quizów `aws-cloud-lab-progress`.

## Dodawanie następnego scenariusza

1. Utwórz plik definicji w `src/data/scenarios/` zgodny z `ScenarioDefinition`.
2. Nadaj stabilne ID wszystkim dowodom, pytaniom i odpowiedziom.
3. Dodaj definicję do tablicy katalogu w `index.ts`.
4. Powiąż ją z istniejącym `providerId`, ścieżką i modułami.
5. Sprawdź briefing, komplet dowodów, jednoznaczną przyczynę, próg oraz debrief.
6. Uruchom lint, kontrolę TypeScript i build.

Dodanie scenariusza S3 Access Denied powinno więc polegać głównie na dodaniu danych. Scenariusz „EC2 nie odpowiada” może w tej samej strukturze dostarczyć dowody typu configuration, architecture i log dotyczące Security Group, Route Table, stanu instancji oraz aplikacji.
