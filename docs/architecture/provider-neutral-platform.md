# Platforma neutralna względem dostawców

CloudOps Lab jest produktem edukacyjnym, a nie interfejsem konkretnego dostawcy chmury. Obecne materiały dotyczą Amazon Web Services, ponieważ AWS Foundations jest pierwszą ukończoną ścieżką. Architektura rozdziela jednak markę platformy od katalogu dostawców i treści edukacyjnych. Dzięki temu globalna nawigacja, silnik quizów, postęp oraz rekomendacje nie muszą znać reguł jednej chmury.

## Provider, track i module

`CloudProvider` opisuje dostawcę, na przykład AWS, Azure lub Google Cloud. Informuje, jak dostawca nazywa się w interfejsie i czy jego zawartość jest już dostępna. Sama obecność dostawcy w katalogu nie oznacza istnienia tutoriali. Azure i Google Cloud mają obecnie status planowany i nie otrzymują aktywnych tras.

`LearningTrack` jest uporządkowanym programem nauki. Może należeć do dostawcy, jak `aws-foundations`, albo w przyszłości być niezależny od dostawców, jak Cloud Security czy Infrastructure as Code. Ścieżka przechowuje listę identyfikatorów modułów, dzięki czemu postęp i rekomendacje są obliczane tylko w jej obrębie.

`LearningModule` jest najmniejszą jednostką katalogu. Posiada unikalny identyfikator, dostawcę, ścieżkę, publiczny slug, kolejność i informację o dostępności quizu. Przykładowe ID `aws:iam` odróżnia moduł od przyszłych treści o podobnym slugu u innych dostawców. Szczegółowa zawartość tutorialu pozostaje oddzielona od katalogowych metadanych modułu.

## Aktualna ścieżka AWS Foundations

AWS Foundations zawiera kolejno IAM, S3, EC2, VPC, Lambda i CloudWatch. Quizy mają obecnie IAM oraz S3. Postęp jest liczony przez `getTrackProgress(trackId, progress)`, a następny moduł wybiera `getRecommendedModule(trackId, progress)`. Funkcje otrzymują ID ścieżki, więc ukończenie AWS Foundations nie może przypadkowo rozpocząć rekomendacji modułu Azure.

W przyszłości Azure Foundations i Google Cloud Foundations otrzymają własne wpisy `LearningTrack` i `LearningModule`. Dodanie ich nie powinno wymagać warunków w `QuizRunner`. Definicja quizu przekazuje neutralne `providerId`, `trackId` oraz `moduleId`, a silnik obsługuje pytania niezależnie od technologii.

## Trasy i kompatybilność

Publiczne adresy `/learn/iam`, `/learn/s3` i pozostałe są zachowane, aby nie łamać istniejących linków. Katalog już przechowuje pełne ID modułów, więc przyszła wersja może wprowadzić adresy takie jak `/learn/aws/iam` i `/learn/azure/entra-id`. Taka migracja powinna obejmować przekierowania i nie jest częścią obecnego etapu.

Klucz `aws-cloud-lab-progress` oraz klucze modułów `iam` i `s3` pozostają niezmienione. `getModuleStorageKey()` mapuje nowe ID katalogowe na historyczny slug. Pozwala to korzystać z modelu `aws:iam` bez utraty wyników użytkowników. Przyszła wersja danych może użyć pełnych ID, ale powinna zwiększyć numer wersji, odczytać format v1, jawnie przenieść wpisy i dopiero potem zapisać nową strukturę. Migracja musi zachować najlepszy wynik, liczbę podejść i datę pierwszego ukończenia.

## Zasady rozwoju

Komponenty platformy powinny używać nazw takich jak `ModuleCard`, `TrackProgress` i `QuizRunner`. Kod ogólny nie może zawierać warunków `provider === "aws"`, chyba że dotyczą one wyłącznie prezentacji treści AWS. Dane merytoryczne mogą pozostać w plikach dostawcy, takich jak `aws-services.ts`. Silnik quizów, zapis postępu, rekomendacje i komponenty katalogu muszą działać na neutralnych identyfikatorach oraz kontekście konkretnej ścieżki.

Ścieżki niezależne od dostawcy mogą nie mieć `providerId`. Przykładowo DevOps Foundations może łączyć zagadnienia CI/CD, kontenery i obserwowalność bez przypisywania ich do jednej chmury. Moduły takiej ścieżki powinny otrzymać stabilną przestrzeń identyfikatorów ustaloną przed wdrożeniem, zamiast wykorzystywać prefiks istniejącego dostawcy.

Warstwa interfejsu powinna zawsze rozróżniać dostępność od planów. Wpis dostawcy lub ścieżki z `available: false` może być pokazany jako zapowiedź, ale nie powinien tworzyć aktywnego linku ani sugerować istnienia materiałów. Dodanie nowej chmury obejmuje kolejno konfigurację dostawcy, ścieżkę, moduły i zawartość. Dopiero kompletna ścieżka może zostać oznaczona jako dostępna. Takie podejście utrzymuje katalog spójny i zapobiega rozrzucaniu nazw dostawców oraz specjalnych warunków po komponentach.
