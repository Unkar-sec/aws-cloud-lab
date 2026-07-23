import type { LearningModuleContent } from "@/types/learning-module-content";

export const awsServices: LearningModuleContent[] = [
  {
    id: "aws:iam", providerId: "aws", trackId: "aws-foundations",
    slug: "iam", name: "IAM", category: "Bezpieczeństwo", icon: "IAM",
    shortDescription: "Użytkownicy, role, polityki i kontrola dostępu",
    definition: "AWS Identity and Access Management (IAM) kontroluje, kto może uzyskać dostęp do AWS, do jakich zasobów, jakie operacje może wykonać i pod jakimi warunkami. Uwierzytelnianie potwierdza tożsamość, a autoryzacja rozstrzyga, co ta tożsamość może zrobić. IAM jest usługą globalną, lecz jego uprawnienia kontrolują dostęp do zasobów działających także w poszczególnych regionach.",
    learningObjectives: [
      "odróżnić IAM User, IAM Group i IAM Role",
      "wyjaśnić strukturę i podstawową ocenę IAM Policy",
      "rozpoznać pierwszeństwo Explicit Deny",
      "zastosować zasadę Least Privilege",
      "wskazać bezpieczny sposób nadania uprawnień aplikacji",
      "przeprowadzić podstawową diagnozę błędu Access Denied",
    ],
    concepts: [
      { name: "Root User", description: "Pierwotna tożsamość konta z pełnym dostępem. Nie jest IAM User i powinna być używana tylko do zadań, które naprawdę jej wymagają." },
      { name: "IAM User", description: "Długoterminowa tożsamość w jednym koncie, mogąca mieć hasło konsolowe lub programowe dane dostępowe." },
      { name: "IAM Group", description: "Zbiór IAM Users ułatwiający wspólne nadawanie uprawnień; grupa nie służy do logowania." },
      { name: "IAM Role", description: "Tożsamość bez standardowych długoterminowych danych logowania, przyjmowana w celu uzyskania tymczasowych poświadczeń." },
      { name: "IAM Policy", description: "Dokument opisujący reguły Allow lub Deny dla określonych operacji, zasobów i warunków." },
      { name: "Principal", description: "Użytkownik, rola, usługa lub inna tożsamość wykonująca żądanie albo wskazana w polityce zasobowej." },
      { name: "Action", description: "Operacja API, na przykład odczyt obiektu z S3." },
      { name: "Resource", description: "Zasób, którego dotyczy operacja, identyfikowany zwykle przez ARN." },
      { name: "Condition", description: "Opcjonalne ograniczenie oceniające kontekst żądania, na przykład użycie MFA, adres IP albo tag." },
      { name: "Permission", description: "Efekt oceny polityk określający, czy konkretna operacja w danym kontekście jest dozwolona." },
      { name: "Least Privilege", description: "Zasada nadawania wyłącznie niezbędnych uprawnień." },
    ],
    useCases: ["Kontrolowanie dostępu ludzi do konsoli i API AWS", "Nadawanie EC2, Lambda i innym workloadom dostępu do usług", "Wspólne zarządzanie uprawnieniami zespołów", "Delegowanie dostępu między kontami", "Ograniczanie operacji do konkretnych zasobów i warunków"],
    commonMistakes: [
      "Codzienna praca na Root User lub brak MFA dla tożsamości uprzywilejowanych",
      "Nadawanie AdministratorAccess, Action: * lub Resource: * bez potrzeby",
      "Zapisywanie Access Keys w kodzie albo commitowanie sekretów do Git",
      "Pozostawianie nieużywanych kluczy bez rotacji i przeglądu",
      "Kopiowanie polityk do wielu IAM Users zamiast użycia grup",
      "Używanie IAM User tam, gdzie workload powinien przyjąć rolę",
      "Niezrozumienie Explicit Deny albo błędna Trust Policy",
      "Brak okresowego przeglądu faktycznie potrzebnych uprawnień",
    ],
    summary: [
      "Root User chroń przez MFA i nie używaj go do codziennej pracy.",
      "IAM User jest długoterminową tożsamością, grupa porządkuje użytkowników, a rola dostarcza tymczasowe poświadczenia.",
      "Preferuj IAM Roles zamiast stałych Access Keys w workloadach.",
      "Stosuj Least Privilege: ograniczaj Action, Resource i — gdy pomaga — Condition.",
      "Explicit Deny ma pierwszeństwo przed Allow, a brak właściwego Allow oznacza odmowę.",
      "Trust Policy odpowiada, kto przyjmuje rolę; Permissions Policy określa, co rola może zrobić.",
      "Regularnie przeglądaj uprawnienia, klucze i historię operacji.",
    ],
    sections: [
      {
        title: "Root User, IAM Users i Groups",
        paragraphs: [
          "Root User ma pełny dostęp do konta i wykonuje niektóre zadania, których nie można delegować. Nie jest zwykłym IAM User. Włącz dla niego MFA, chroń dane logowania i nie twórz Root Access Keys bez absolutnej potrzeby. Codzienną administrację wykonuj przez kontrolowane tożsamości o węższym zakresie.",
          "IAM User jest długoterminową tożsamością w jednym koncie. IAM Group pozwala wspólnie przypisywać polityki użytkownikom o podobnych obowiązkach. Grupa sama nie może się logować, nie może zawierać innych grup i nie jest rolą. Wspólne uprawnienia łatwiej utrzymać na grupie niż kopiować je każdemu użytkownikowi.",
          "W organizacjach często preferuje się federację lub IAM Identity Center zamiast tworzenia wielu lokalnych IAM Users. Pozwala to centralniej zarządzać dostępem pracowników. W tym module skupiamy się na podstawowych elementach IAM, ale warto rozpoznać, że IAM User nie jest domyślną odpowiedzią na każdy przypadek dostępu człowieka.",
        ],
      },
      {
        title: "IAM Roles i tymczasowe poświadczenia",
        paragraphs: [
          "IAM Role nie ma standardowego hasła ani długoterminowych Access Keys. Użytkownik, usługa lub workload przyjmuje rolę i otrzymuje tymczasowe poświadczenia. Dzięki ograniczonemu czasowi życia i automatycznemu dostarczaniu są one bezpieczniejszym wyborem dla aplikacji niż klucze zapisane w kodzie.",
          "Instancja EC2 może korzystać z roli przez Instance Profile, a funkcja Lambda z Execution Role. Kod pobiera dostępne poświadczenia mechanizmem środowiska wykonawczego, bez przechowywania Secret Access Key w repozytorium lub pliku konfiguracyjnym.",
        ],
        flow: ["Aplikacja na EC2", "Instance Profile", "IAM Role", "Tymczasowe poświadczenia", "Ograniczony dostęp do Amazon S3"],
      },
      {
        title: "Trust Policy a Permissions Policy",
        paragraphs: [
          "Rola odpowiada na dwa różne pytania. Trust Policy określa, jaki Principal może ją przyjąć. Może to być na przykład usługa EC2, Lambda albo zaufana tożsamość. Błędna polityka zaufania sprawi, że właściwa tożsamość nie przyjmie roli albo że zaufanie będzie szersze niż planowano.",
          "Permissions Policy określa, co rola może zrobić już po przyjęciu: jakie Action wykonać na jakim Resource i pod jakimi Condition. Zaufanie nie nadaje automatycznie dostępu do S3, a szerokie permissions nie pozwolą użyć roli Principalowi, którego Trust Policy nie akceptuje.",
        ],
      },
      {
        title: "Budowa IAM Policy",
        paragraphs: [
          "Polityka JSON zawiera Version opisującą język polityki oraz co najmniej jeden Statement. Każdy Statement może zawierać Effect, Action, Resource i opcjonalne Condition. Effect to Allow albo Deny, Action wskazuje operacje API, a Resource zasoby, których reguła dotyczy.",
          "Poniższy przykład pozwala wyłącznie odczytywać obiekty ze wskazanego bucketa. Nie nadaje prawa zapisu, usuwania ani dostępu do innych bucketów. Nazwa jest przykładowa i nie zawiera prawdziwych danych konta.",
        ],
        codeExample: {
          language: "json",
          caption: "Identity-based policy: odczyt obiektów z jednego bucketa",
          code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::example-learning-bucket/*"
  }]
}`,
        },
      },
      {
        title: "Allow, domyślna odmowa i Explicit Deny",
        paragraphs: [
          "Dostęp nie jest dozwolony tylko dlatego, że nie znaleziono zakazu. Żądanie potrzebuje odpowiedniego Allow. Jeżeli pasujące polityki nie zapewniają Allow, wynikiem jest odmowa. Uprawnienia mogą pochodzić z kilku źródeł, dlatego podczas analizy trzeba uwzględnić więcej niż jeden dokument.",
          "Explicit Deny ma pierwszeństwo przed Allow. Jeżeli polityka użytkownika pozwala na s3:GetObject, lecz inna pasująca polityka jawnie zabrania tej operacji, końcowym wynikiem jest odmowa. Ta prosta zasada jest ważniejsza na początku niż zapamiętywanie wszystkich zaawansowanych etapów ewaluacji.",
        ],
      },
      {
        title: "Identity-based i resource-based policies",
        paragraphs: [
          "Identity-based policy jest przypisana do IAM User, IAM Group albo IAM Role i opisuje, co dana tożsamość może zrobić. Resource-based policy jest przypisana do zasobu i opisuje, kto może z niego korzystać. Przykładem drugiego typu jest S3 Bucket Policy wskazująca dozwolonych Principals oraz operacje na bucketcie.",
          "Oba typy mogą współtworzyć decyzję o dostępie. Bucket Policy nie zastępuje całego IAM, a polityka roli nie usuwa ograniczeń zasobu. Przy błędzie Access Denied sprawdzaj obie strony, jeśli dana usługa obsługuje polityki zasobowe.",
        ],
      },
      {
        title: "Least Privilege, Conditions i Permissions Boundaries",
        paragraphs: [
          "Least Privilege oznacza nadawanie tylko operacji potrzebnych do zadania, tylko wobec właściwych zasobów i — gdy ma to sens — tylko w określonym kontekście. Action: * oraz Resource: * tworzą bardzo szeroki zakres. Lepsza reguła wskazuje konkretne operacje i ARN zasobu, a dostęp jest regularnie przeglądany oraz zawężany.",
          "Condition może ograniczyć regułę na podstawie użycia MFA, źródłowego adresu IP, określonego tagu lub innego kontekstu żądania. Nie każdy warunek pasuje do każdego scenariusza, dlatego trzeba rozumieć wpływ na aplikację i dostęp awaryjny.",
          "Permissions Boundary określa maksymalny zakres uprawnień, jaki może uzyskać użytkownik lub rola. Sama granica nie nadaje żadnego Allow — faktyczne uprawnienia nadal muszą wynikać z innych polityk. Jest to bezpiecznik delegowania administracji, a nie zamiennik Permissions Policy.",
        ],
        items: [
          { name: "Niebezpieczne", description: "Action: * i Resource: * pozwalają wykonywać szeroki zestaw operacji na wielu zasobach." },
          { name: "Lepsze", description: "Konkretne Action, konkretny Resource i uzasadnione Condition ograniczają możliwy wpływ błędu lub przejęcia tożsamości." },
        ],
      },
      {
        title: "Access Keys i MFA",
        paragraphs: [
          "Access Key ID identyfikuje programowe dane dostępowe, a Secret Access Key jest ich tajną częścią. Nie umieszczaj ich w kodzie, repozytorium, obrazie kontenera ani logach. Dla workloadów preferuj role i tymczasowe poświadczenia. Jeśli długoterminowy klucz jest uzasadniony, ogranicz jego uprawnienia, rotuj go i usuwaj, gdy przestaje być używany. Przykłady edukacyjne nie powinny przypominać prawdziwych sekretów.",
          "MFA wymaga dodatkowego składnika poza hasłem. Powinno chronić Root User oraz uprzywilejowane tożsamości, ponieważ ogranicza ryzyko przejęcia konta po ujawnieniu hasła. MFA nie naprawia nadmiernych uprawnień i nie zastępuje bezpiecznego zarządzania poświadczeniami, lecz stanowi ważną warstwę ochrony.",
        ],
      },
      {
        title: "IAM w AWS Foundations",
        paragraphs: [
          "IAM łączy wszystkie moduły ścieżki. EC2 używa IAM Role przez Instance Profile, Lambda używa Execution Role, S3 łączy IAM Policies z Bucket Policies, a aplikacje mogą potrzebować uprawnień do zapisu w CloudWatch Logs. Te zależności powinny być ograniczone do konkretnych działań i zasobów.",
          "IAM kontroluje autoryzację do API AWS, ale nie zastępuje sieci. Poprawne uprawnienie do bazy nie utworzy trasy w VPC, nie otworzy Security Group i nie zapewni dostępu przez NAT Gateway. Diagnoza wymaga oddzielenia problemu tożsamości od problemu łączności.",
        ],
      },
      {
        title: "Diagnozowanie Access Denied",
        paragraphs: [
          "Komunikat Access Denied jest punktem startowym, nie pełną diagnozą. Najpierw ustal odrzuconą operację i rzeczywistą tożsamość wykonującą żądanie. Następnie porównaj potrzebne Action i Resource z politykami, pamiętając o polityce zasobowej, warunkach oraz Explicit Deny.",
          "Nie rozwiązuj problemu przez natychmiastowe nadanie AdministratorAccess. Taki ruch może ukryć przyczynę i utworzyć trwałe ryzyko. Poniższy przepływ będzie podstawą przyszłego symulowanego scenariusza IAM Access Denied.",
        ],
        flow: ["Ustal odrzuconą operację", "Zidentyfikuj Principal", "Sprawdź Action i Resource", "Sprawdź identity-based policies", "Sprawdź resource-based policy", "Znajdź Explicit Deny", "Zweryfikuj Conditions i kontekst żądania"],
      },
      {
        title: "Audyt, monitoring i wpływ kosztowy",
        paragraphs: [
          "AWS CloudTrail pomaga rejestrować operacje API i wspiera ustalenie, kto wykonał zmianę. Przeglądy danych logowania, kluczy i ostatniej aktywności pomagają znajdować nieużywane poświadczenia. Historia zdarzeń jest ważna podczas diagnozy, lecz IAM i CloudTrail pełnią różne role: IAM kontroluje dostęp, a CloudTrail pomaga obserwować aktywność.",
          "Samo korzystanie z IAM zwykle nie jest głównym składnikiem rachunku, ale błędne uprawnienia mogą pozwolić na kosztowne operacje. Przejęte poświadczenia mogą posłużyć do tworzenia zasobów lub transferu danych. Bezpieczeństwo IAM ma więc bezpośredni wpływ finansowy mimo braku typowej ceny za pojedynczą politykę.",
        ],
      },
    ],
  },
  {
    id: "aws:s3", providerId: "aws", trackId: "aws-foundations",
    slug: "s3", name: "S3", category: "Storage", icon: "S3",
    shortDescription: "Przechowywanie plików i obiektów w chmurze",
    definition: "Amazon S3 jest regionalną usługą object storage do przechowywania danych jako obiektów w bucketach. Obiekt zawiera dane i metadane, a Key jest jego pełnym identyfikatorem. W przeciwieństwie do klasycznego systemu plików S3 nie udostępnia zwykłego drzewa katalogów i operacji dysku blokowego — widoczne foldery są prezentacją wspólnych prefixów kluczy.",
    learningObjectives: ["odróżnić bucket, object, key i prefix", "wyjaśnić dostęp przez IAM Policy i Bucket Policy", "rozpoznać ryzyko publicznego bucketa", "wyjaśnić Versioning i Lifecycle Rules", "dobrać podstawową Storage Class do wzorca dostępu", "wskazać główne źródła kosztów S3"],
    concepts: [
      { name: "Bucket", description: "Kontener o unikalnej nazwie przechowujący obiekty." },
      { name: "Object", description: "Plik wraz z metadanymi zapisany w bucketcie." },
      { name: "Key", description: "Unikalny identyfikator obiektu wewnątrz bucketa." },
      { name: "Versioning", description: "Przechowywanie wielu wersji tego samego obiektu." },
      { name: "Bucket Policy", description: "Polityka dostępu przypisana do całego bucketa." },
      { name: "Prefix", description: "Początkowa część Key używana do logicznego grupowania obiektów; nie jest prawdziwym folderem." },
      { name: "Metadata", description: "Informacje opisujące obiekt, na przykład typ treści lub własne atrybuty." },
      { name: "Storage Class", description: "Model przechowywania dopasowany do częstotliwości dostępu, odporności i sposobu odzyskiwania danych." },
      { name: "Lifecycle Rule", description: "Automatyczna reguła przenoszenia lub wygaszania obiektów i ich nieaktualnych wersji." },
    ],
    useCases: ["Przechowywanie plików i danych aplikacyjnych", "Kopie zapasowe i archiwizacja", "Data lake i dane analityczne", "Logi i artefakty procesu budowania", "Statyczne zasoby stron", "Pliki uruchamiające przetwarzanie przez Lambda"],
    commonMistakes: ["Publiczny bucket lub zbyt szeroka Bucket Policy bez potrzeby", "Wyłączenie Block Public Access bez analizy", "Brak Versioning dla ważnych danych", "Brak Lifecycle Rules albo zbyt agresywne usuwanie", "Przechowywanie sekretów w obiektach lub metadanych", "Traktowanie prefixu jak prawdziwego folderu", "Brak kontroli kosztu nieaktualnych wersji", "Błędne założenia o współdziałaniu IAM Policy i Bucket Policy"],
    summary: ["Bucket przechowuje obiekty, a pełny Key jednoznacznie wskazuje obiekt.", "Prefix grupuje klucze logicznie, ale nie tworzy klasycznego folderu.", "Block Public Access pomaga chronić przed przypadkowym publicznym udostępnieniem.", "IAM Policy i Bucket Policy wspólnie wpływają na dostęp; ACL zwykle nie powinny być pierwszym wyborem.", "Versioning pomaga odzyskać nadpisane dane, ale zwiększa ilość przechowywanych wersji.", "Lifecycle Rules automatyzują zmianę klas i usuwanie, dlatego wymagają ostrożnego testowania.", "Koszt obejmuje przechowywanie, żądania, transfer i czasem odzyskiwanie danych."],
    sections: [
      { title: "Buckets, obiekty, Keys i prefixy", paragraphs: ["Bucket jest regionalnym kontenerem na obiekty. Każdy obiekt składa się z danych, metadanych i Key. Key może wyglądać jak reports/2026/july.csv, lecz ukośniki nie tworzą katalogów jak na dysku. Konsola wizualizuje wspólne początki kluczy jako foldery.", "Ta różnica ma znaczenie podczas listowania, kopiowania i usuwania danych. Zmiana nazwy folderu oznacza w praktyce operacje na obiektach o danym prefixie. Region bucketa wpływa na lokalizację danych, opóźnienia, zgodność i architekturę dostępu."], items: [{ name: "Object storage", description: "Aplikacja zapisuje i pobiera całe obiekty przez API, zamiast modyfikować dowolne bloki klasycznego dysku." }, { name: "Key", description: "Pełny identyfikator obiektu wewnątrz bucketa, nie tylko ostatnia część przypominająca nazwę pliku." }] },
      { title: "Kontrola dostępu i Block Public Access", paragraphs: ["Identity-based IAM Policy określa, co użytkownik lub rola może zrobić. Bucket Policy jest resource-based policy przypisaną do bucketa i może wskazywać Principals. Ocena dostępu może uwzględniać oba źródła oraz jawne Deny.", "Block Public Access pomaga zapobiegać przypadkowemu publicznemu udostępnieniu i może działać na poziomie konta oraz bucketa. Publicznie sformułowana Bucket Policy może zostać zablokowana przez te ustawienia. Access Control Lists są starszym mechanizmem; w nowych projektach zwykle łatwiej zarządzać dostępem przez IAM, Bucket Policy i wyłączoną potrzebę ACL."], items: [{ name: "Bezpieczny punkt wyjścia", description: "Pozostaw Block Public Access włączony, używaj prywatnego bucketa i nadawaj tylko wymagany dostęp." }, { name: "Dostęp publiczny", description: "Włączaj wyłącznie po świadomej analizie danych, endpointu, polityk i alternatywy z CloudFront." }] },
      { title: "Versioning i odzyskiwanie", paragraphs: ["Versioning zachowuje wiele wersji obiektu o tym samym Key. Pomaga po przypadkowym nadpisaniu lub usunięciu, ponieważ operacja usunięcia może utworzyć delete marker zamiast natychmiast usuwać wszystkie wcześniejsze wersje.", "Wersjonowanie nie zwalnia z projektowania backupu i dostępu. Każda zachowana wersja zajmuje przestrzeń, więc nieaktualne dane wpływają na koszty. Lifecycle Rules mogą zarządzać starszymi wersjami, ale przed automatycznym usuwaniem trzeba sprawdzić wymagany czas odzyskiwania." ] },
      { title: "Szyfrowanie danych", paragraphs: ["Szyfrowanie w spoczynku chroni zapisane obiekty, a HTTPS chroni transmisję. Klucze zarządzane przez AWS upraszczają podstawowy scenariusz, natomiast AWS KMS może zapewnić większą kontrolę nad kluczami i audytem w środowiskach, które tego wymagają.", "Szyfrowanie nie zastępuje autoryzacji. Użytkownik z uprawnieniami do odczytu może otrzymać odszyfrowane dane zgodnie z konfiguracją, dlatego nadal potrzebne są wąskie polityki, bezpieczne zarządzanie kluczami i zakaz przechowywania sekretów w przypadkowych obiektach." ] },
      { title: "Storage Classes i Lifecycle Rules", paragraphs: ["Storage Classes odpowiadają różnym wzorcom dostępu: od danych często używanych, przez dostęp nieprzewidywalny, po archiwa odzyskiwane rzadko. Wybór wpływa na koszt przechowywania, żądań i odzyskiwania oraz na oczekiwany czas dostępu.", "Lifecycle Rules mogą automatycznie przenosić obiekty do innych klas, wygaszać stare dane i zarządzać nieaktualnymi wersjami. Regułę należy przetestować na ograniczonym zakresie. Zbyt agresywne wygaśnięcie może usunąć potrzebne dane, a brak reguł może pozostawić duże zbiory nieużywanych wersji." ] },
      { title: "Statyczne strony i bezpieczne publikowanie", paragraphs: ["S3 może udostępniać endpoint hostingu statycznej strony dla plików HTML, CSS i JavaScript. Taki endpoint różni się od prywatnego bucketa dostarczającego zawartość przez CloudFront. W architekturze produkcyjnej CloudFront może umożliwić bezpieczne zachowanie prywatnego źródła oraz dodać warstwę dystrybucji.", "Nie włączaj publicznego dostępu do całego bucketa tylko dlatego, że pojedynczy plik ma być dostępny użytkownikom. Najpierw ustal model publikowania, zakres danych, sposób szyfrowania transmisji i kontrolę dostępu." ] },
      { title: "Czasowy dostęp przez pre-signed URL", paragraphs: ["Pre-signed URL pozwala udostępnić określoną operację na konkretnym obiekcie przez ograniczony czas, bez zmiany całego bucketa na publiczny. Adres jest generowany przez uprawnioną tożsamość, a jego możliwości wynikają z jej uprawnień oraz parametrów podpisanego żądania.", "Taki adres należy traktować jak czasowy sekret: nie zapisuj go w publicznych logach i ustaw okres ważności odpowiedni do zadania. Pre-signed URL nie naprawi zbyt szerokiej polityki ani nie zastąpi autoryzacji aplikacji, ale jest bezpieczniejszy niż otwieranie bucketa tylko po to, by przekazać jeden plik."], flow: ["Użytkownik prosi aplikację o plik", "Aplikacja sprawdza uprawnienie użytkownika", "Uprawniona rola generuje krótko ważny pre-signed URL", "Użytkownik pobiera konkretny obiekt z Amazon S3", "Adres wygasa bez upublicznienia bucketa"] },
      { title: "Event Notifications i przetwarzanie", paragraphs: ["S3 może generować zdarzenia po operacjach na obiektach. Pozwala to oddzielić zapis pliku od późniejszego przetwarzania. Odbiorcą może być między innymi Lambda lub kolejka, zależnie od potrzeb niezawodności i buforowania.", "Zdarzeniowy przepływ powinien bezpiecznie obsługiwać ponowienia i duplikaty. Sam fakt pojawienia się zdarzenia nie oznacza, że kod może ufać zawartości pliku; nadal potrzebne są walidacja, ograniczone uprawnienia i monitoring."], flow: ["Nowy obiekt w Amazon S3", "Event Notification", "AWS Lambda lub kolejka", "Walidacja i przetworzenie pliku", "Zapis wyniku lub metryki"] },
      { title: "Durability a availability", paragraphs: ["Durability opisuje prawdopodobieństwo zachowania danych bez ich utraty, natomiast availability opisuje możliwość uzyskania do nich dostępu w danym momencie. Są to powiązane, ale różne cechy. Trwały obiekt może być chwilowo niedostępny, a dostępna usługa nie zastępuje strategii ochrony przed błędem użytkownika.", "Projekt powinien uwzględniać znaczenie danych, Versioning, kopie, wymagania regionalne i zachowanie aplikacji podczas czasowego błędu. Nie należy sprowadzać odporności wyłącznie do jednego parametru usługi." ] },
      { title: "Koszty i świadome zarządzanie danymi", paragraphs: ["Koszt S3 obejmuje przechowywaną ilość danych, żądania, transfer i — dla części klas — odzyskiwanie. Versioning zwiększa ilość danych przez zachowanie nieaktualnych wersji. Małe, bardzo liczne operacje mogą tworzyć inny profil kosztowy niż rzadki dostęp do dużych obiektów.", "Lifecycle Rules pomagają kontrolować koszt, przenosząc rzadko używane dane i usuwając wersje po uzgodnionym czasie. Trzeba jednak uwzględnić potrzeby odzyskiwania i opłaty właściwe wybranej klasie. Monitoruj wzorzec użycia zamiast wybierać klasę tylko na podstawie ceny przechowywania." ] },
      { title: "Kiedy rozważyć inne rozwiązanie", paragraphs: ["S3 nie jest klasycznym dyskiem blokowym ani współdzielonym systemem plików. Dla wolumenu instancji EC2 odpowiedni może być EBS, a dla współdzielonego systemu plików — usługa plikowa. Baza danych lepiej obsłuży częste aktualizacje małych rekordów i zapytania wymagające indeksów.", "S3 dobrze pasuje do obiektów, kopii, artefaktów, logów i data lake. Wybór powinien wynikać ze sposobu zapisu, odczytu, spójności modelu danych, wymaganych operacji i profilu kosztowego." ] },
    ],
  },
  {
    id: "aws:ec2", providerId: "aws", trackId: "aws-foundations",
    slug: "ec2", name: "EC2", category: "Compute", icon: "EC2",
    shortDescription: "Wirtualne serwery i pełna kontrola nad systemem",
    definition: "Amazon EC2 (Elastic Compute Cloud) pozwala uruchamiać wirtualne serwery w chmurze. Wybierasz system operacyjny, moc obliczeniową, pamięć, dyski, sieć i reguły dostępu. AWS utrzymuje fizyczną infrastrukturę, ale to Ty odpowiadasz za konfigurację, aktualizacje i bezpieczeństwo systemu operacyjnego instancji.",
    learningObjectives: ["wyjaśnić rolę Instance, AMI i Instance Type", "odróżnić Stop, Reboot i Terminate", "zaprojektować podstawowy dostęp przez Security Group", "wyjaśnić trwałość EBS i snapshotów", "nadać aplikacji uprawnienia przez Instance Profile", "wskazać główne źródła kosztów EC2"],
    concepts: [
      { name: "Instance", description: "Wirtualny serwer utworzony z obrazu AMI. Ma własny stan, konfigurację sieciową i podłączone dyski." },
      { name: "AMI", description: "Szablon startowy zawierający system operacyjny i opcjonalnie oprogramowanie. Określa, co znajdzie się na serwerze po uruchomieniu." },
      { name: "Instance Type", description: "Rozmiar i profil zasobów instancji: liczba vCPU, pamięć RAM, wydajność sieciowa i inne możliwości sprzętowe." },
      { name: "EBS Volume", description: "Trwały dysk blokowy podłączany do instancji. Może przechowywać system, aplikację lub dane niezależnie od pracy maszyny." },
      { name: "Security Group", description: "Stanowy firewall przypisany do interfejsu sieciowego. Reguły określają dozwolony ruch przychodzący i wychodzący." },
      { name: "Key Pair", description: "Para kluczy używana m.in. do bezpiecznego dostępu administracyjnego. Klucz prywatny należy chronić i nie umieszczać w repozytorium." },
      { name: "User Data", description: "Skrypt lub dane przekazywane przy uruchamianiu instancji, zwykle do automatycznej instalacji i wstępnej konfiguracji oprogramowania." },
      { name: "Public IP", description: "Publiczny adres umożliwiający komunikację przez internet. Automatycznie przypisany adres może zmienić się po zatrzymaniu i ponownym uruchomieniu instancji." },
      { name: "Elastic IP", description: "Statyczny publiczny adres IPv4, który można przypisać do właściwego zasobu i zachować niezależnie od cyklu życia pojedynczej instancji." },
      { name: "Instance Profile / IAM Role", description: "Mechanizm przekazujący instancji tymczasowe poświadczenia AWS. Aplikacja korzysta z uprawnień roli bez zapisywania stałych Access Keys." },
    ],
    useCases: [
      "Aplikacje wymagające pełnej kontroli nad systemem operacyjnym",
      "Tradycyjne aplikacje webowe i serwery testowe",
      "Oprogramowanie legacy, którego nie można łatwo przenieść do usługi zarządzanej",
      "Własne agenty, demony i usługi systemowe",
      "Zadania wymagające konkretnego profilu CPU, GPU lub pamięci",
    ],
    commonMistakes: [
      "Otwarcie SSH na porcie 22 lub RDP dla 0.0.0.0/0 bez uzasadnionej potrzeby",
      "Zapisywanie Access Keys na instancji i używanie stałych kluczy zamiast IAM Role",
      "Pozostawianie nieużywanych instancji uruchomionych lub wybór zbyt dużego Instance Type",
      "Brak aktualizacji systemu operacyjnego i pakietów",
      "Brak monitoringu, alarmów oraz snapshotów ważnych wolumenów",
      "Niewłaściwe reguły Security Group, które udostępniają zbędne porty",
      "Utrata danych po terminacji z powodu nieprzemyślanej konfiguracji usuwania EBS",
      "Założenie, że zatrzymana instancja nie generuje żadnych kosztów — nadal mogą być naliczane opłaty za inne zasoby, np. EBS lub publiczny IPv4",
    ],
    summary: ["AMI definiuje obraz startowy, a Instance Type profil zasobów instancji.", "Security Group powinna dopuszczać tylko wymagane źródła, porty i protokoły.", "Stop pozwala później uruchomić instancję, natomiast Terminate kończy jej istnienie.", "EBS jest osobnym zasobem, a jego zachowanie przy terminacji zależy od konfiguracji.", "Aplikacje na EC2 powinny używać IAM Role przez Instance Profile zamiast stałych Access Keys.", "EC2 wymaga aktualizacji, monitoringu, kopii i świadomego zarządzania systemem.", "Rachunek może obejmować nie tylko czas działania, lecz także EBS, adresy i transfer."],
    sections: [
      {
        title: "Od AMI do działającej instancji",
        paragraphs: [
          "AMI określa obraz startowy z systemem operacyjnym i opcjonalnym oprogramowaniem, a Instance Type dobiera profil vCPU, pamięci i sieci. Podczas uruchamiania wybierasz również VPC, subnet, Security Groups, dyski i IAM Role. Te decyzje tworzą razem instancję; żadna pojedyncza opcja nie opisuje całego serwera.",
          "User Data może wykonać skrypt inicjalizacyjny, na przykład zainstalować pakiety lub uruchomić konfigurację aplikacji. Skrypt powinien być powtarzalny, obserwowalny i pozbawiony sekretów. Błąd User Data nie zawsze zatrzyma samą instancję, dlatego po uruchomieniu trzeba zweryfikować logi inicjalizacji oraz stan aplikacji.",
          "Instance Profile przekazuje instancji IAM Role i tymczasowe poświadczenia. Dzięki temu aplikacja może wywoływać dozwolone API AWS bez Access Keys zapisanych na dysku. Uprawnienia roli ograniczaj do wymaganych operacji i zasobów.",
        ],
      },
      {
        title: "Public IP, Elastic IP i dostęp administracyjny",
        paragraphs: [
          "Prywatny adres służy komunikacji wewnątrz VPC. Automatycznie przypisany publiczny IPv4 może zmienić się po zatrzymaniu i ponownym uruchomieniu instancji. Elastic IP jest statycznym publicznym adresem, który można ponownie przypisać, lecz należy używać go świadomie i usuwać, gdy nie jest potrzebny.",
          "Publiczny adres nie wystarcza do połączenia: subnet potrzebuje poprawnej trasy do Internet Gateway, Security Group musi dopuścić wymagany ruch, a system i aplikacja muszą nasłuchiwać. Dostęp administracyjny ograniczaj do zaufanych źródeł lub stosuj bezpieczniejszy mechanizm zarządzania zamiast otwierania SSH albo RDP dla całego internetu.",
        ],
      },
      {
        title: "Cykl życia instancji",
        paragraphs: [
          "Po poleceniu uruchomienia instancja przechodzi do stanu pending, gdy AWS przygotowuje zasoby, a następnie running, kiedy system działa. Podczas zatrzymywania widoczny jest stan stopping, po którym następuje stopped. Usuwanie prowadzi przez shutting-down do terminated.",
          "Reboot ponownie uruchamia system operacyjny bez zakończenia istnienia instancji. Stop wyłącza instancję, którą można później ponownie uruchomić; zawartość EBS może pozostać, choć automatyczny publiczny adres IP może się zmienić. Terminate trwale usuwa instancję i nie można jej ponownie uruchomić. To, czy podłączone wolumeny EBS zostaną zachowane, zależy od ich konfiguracji.",
        ],
        items: [
          { name: "pending → running", description: "Instancja jest przygotowywana, a następnie gotowa do pracy i rozliczana jako uruchomiona." },
          { name: "stopping → stopped", description: "System jest wyłączany. Instancję można ponownie uruchomić, ale powiązane zasoby mogą nadal generować koszty." },
          { name: "shutting-down → terminated", description: "Instancja jest nieodwracalnie usuwana. Nie da się przywrócić jej do stanu running." },
        ],
      },
      {
        title: "Bezpieczny ruch z Security Groups",
        paragraphs: [
          "Security Group działa jak stanowy firewall przypisany do interfejsu sieciowego instancji. Kontroluje ruch przychodzący i wychodzący. Ponieważ jest stanowa, odpowiedź na dozwolone połączenie może wrócić bez osobnej reguły dla ruchu zwrotnego.",
          "Reguły powinny dopuszczać tylko potrzebne źródła, porty i protokoły. Dostęp administracyjny nie powinien być otwarty dla całego internetu, jeśli można ograniczyć go do zaufanego adresu lub zastosować bezpieczniejszy kanał zarządzania.",
        ],
        items: [
          { name: "Administracja", description: "Port 22 dla SSH dopuść tylko z konkretnego publicznego adresu IP administratora; analogicznie ogranicz RDP." },
          { name: "Ruch webowy", description: "Porty 80 i 443 mogą przyjmować ruch webowy zgodnie z architekturą aplikacji." },
          { name: "Warstwa aplikacji", description: "Port aplikacji może przyjmować ruch ze wskazanej Security Group load balancera zamiast z całego internetu." },
        ],
        flow: ["Klient wysyła żądanie", "Routing kieruje ruch do właściwego interfejsu", "Security Group sprawdza źródło, port i protokół", "Aplikacja na EC2 odbiera dozwolone połączenie", "Odpowiedź wraca dzięki stanowemu działaniu Security Group"],
      },
      {
        title: "EBS i trwałość danych",
        paragraphs: [
          "Instancja jest zasobem obliczeniowym, a EBS Volume osobnym zasobem przechowującym bloki danych. Wolumen można podłączać do instancji, zatrzymać maszynę bez usuwania dysku i — w obsługiwanej konfiguracji — odłączyć go oraz podłączyć gdzie indziej.",
          "Snapshot jest punktową kopią danych wolumenu, z której można utworzyć kolejny EBS Volume. Snapshoty nie zastępują kompletnej strategii backupu, ale pomagają w odtwarzaniu. Przed terminacją sprawdź ustawienie Delete on Termination: niewłaściwa wartość może usunąć potrzebny dysk albo pozostawić niepotrzebny, płatny wolumen.",
        ],
        flow: ["Aplikacja zapisuje dane na EBS Volume", "Zaplanowany proces tworzy snapshot", "Awaria lub błąd wymaga odtworzenia", "Ze snapshotu powstaje nowy EBS Volume", "Wolumen jest podłączany i dane zostają zweryfikowane"],
      },
      {
        title: "Bezpieczeństwo systemu i monitoring",
        paragraphs: [
          "Model współdzielonej odpowiedzialności nie kończy się na uruchomieniu instancji. Zespół odpowiada za aktualizacje systemu operacyjnego i pakietów, konfigurację usług, ochronę kont administracyjnych, ograniczenie oprogramowania oraz reakcję na podatności. AMI powinny być utrzymywane i odświeżane, zamiast przez lata powielać nieaktualny obraz.",
          "Monitoring powinien obejmować stan instancji, CPU, sieć, operacje dyskowe i zachowanie aplikacji. Metryki systemowe, takie jak wykorzystanie pamięci, oraz logi aplikacji mogą wymagać dodatkowej konfiguracji agenta. Alarm bez procedury reakcji ma ograniczoną wartość, podobnie jak serwer bez logów pozwalających połączyć błąd z konkretnym żądaniem.",
          "Kopie i snapshoty należy regularnie testować przez odtworzenie. Sam fakt utworzenia snapshotu nie dowodzi, że aplikacja uruchomi się z odzyskanymi danymi. Bezpieczne utrzymanie EC2 łączy aktualizacje, ograniczone IAM Role, wąskie Security Groups, monitoring oraz sprawdzony proces odtwarzania.",
        ],
      },
      {
        title: "Kiedy rozważyć inną usługę",
        paragraphs: [
          "Pełna kontrola EC2 oznacza również obowiązek aktualizowania, zabezpieczania i monitorowania serwera. Jeśli nie potrzebujesz dostępu do systemu operacyjnego, usługa wyższego poziomu może ograniczyć pracę operacyjną.",
        ],
        items: [
          { name: "AWS Lambda", description: "Dla krótkich zadań uruchamianych przez zdarzenia, bez utrzymywania stale działającego serwera." },
          { name: "Amazon ECS / AWS Fargate", description: "Dla aplikacji kontenerowych; Fargate pozwala uruchamiać zadania bez zarządzania hostami EC2." },
          { name: "Usługi zarządzane", description: "Zarządzana baza danych zwykle wymaga mniej obsługi niż samodzielna baza uruchomiona na EC2." },
          { name: "Amazon S3 i CloudFront", description: "Dla statycznego frontendu, który nie potrzebuje działającego systemu operacyjnego." },
        ],
      },
      {
        title: "Koszty pod kontrolą",
        paragraphs: [
          "Na koszt rozwiązania składa się nie tylko czas działania instancji. Osobno rozliczane mogą być wolumeny i snapshoty EBS, publiczne adresy IPv4 oraz transfer danych. Zasady i stawki zmieniają się, dlatego przed wdrożeniem sprawdź aktualny kalkulator i dokumentację cenową.",
          "Zatrzymuj nieużywane środowiska testowe, dobieraj Instance Type do rzeczywistego obciążenia i regularnie usuwaj zbędne wolumeny oraz snapshoty. Pamiętaj, że samo zatrzymanie instancji nie usuwa wszystkich powiązanych kosztów.",
        ],
      },
    ],
  },
  {
    id: "aws:vpc", providerId: "aws", trackId: "aws-foundations",
    slug: "vpc", name: "VPC", category: "Networking", icon: "VPC",
    shortDescription: "Sieci, subnety, routing i komunikacja zasobów",
    definition: "Amazon VPC (Virtual Private Cloud) to logicznie odizolowana sieć w AWS. Kontrolujesz w niej zakres adresów IP, podział na subnety, routing, dostęp do internetu, komunikację między zasobami oraz część zabezpieczeń sieciowych. VPC działa w jednym regionie, ale może obejmować wiele Availability Zones.",
    learningObjectives: ["wyjaśnić CIDR i podział VPC na subnety", "odróżnić public subnet od private subnet", "odczytać podstawowe trasy w Route Table", "wyjaśnić role Internet Gateway i NAT Gateway", "porównać Security Group z Network ACL", "przeprowadzić podstawową diagnozę przepływu ruchu"],
    concepts: [
      { name: "CIDR", description: "Zapis określający zakres adresów IP, na przykład 10.0.0.0/16. Zakresy subnetów muszą mieścić się w CIDR całego VPC." },
      { name: "Subnet", description: "Część zakresu adresowego VPC przypisana do dokładnie jednej Availability Zone. O tym, czy jest publiczna lub prywatna, decyduje routing." },
      { name: "Route Table", description: "Zestaw tras określających, dokąd ma zostać przekazany ruch z powiązanego subnetu." },
      { name: "Internet Gateway", description: "Skalowalna brama podłączana do VPC, która umożliwia komunikację odpowiednio skonfigurowanych zasobów z internetem." },
      { name: "NAT Gateway", description: "Zarządzana brama pozwalająca zasobom w private subnet inicjować połączenia z internetem bez przyjmowania połączeń inicjowanych z internetu." },
      { name: "Security Group", description: "Stanowa zapora na poziomie interfejsu sieciowego zasobu, oparta na regułach allow." },
      { name: "Network ACL", description: "Bezstanowy filtr na poziomie subnetu, z uporządkowanymi regułami allow i deny." },
    ],
    useCases: [
      "Uruchamianie EC2, RDS, ECS i load balancerów w kontrolowanej sieci",
      "Oddzielanie publicznej warstwy webowej od prywatnej warstwy aplikacji i danych",
      "Udostępnianie prywatnych usług bez bezpośredniej ekspozycji na internet",
      "Łączenie środowiska AWS z siecią firmową w architekturze hybrydowej",
      "Budowanie wielowarstwowych środowisk w wielu Availability Zones",
    ],
    commonMistakes: [
      "Brak trasy do Internet Gateway albo Internet Gateway niepodłączony do VPC",
      "Brak publicznego IPv4 lub Elastic IP na instancji, która ma komunikować się bezpośrednio z internetem",
      "Private subnet bez NAT Gateway lub NAT Gateway umieszczony w subnecie bez drogi do Internet Gateway",
      "Przypisanie do subnetu niewłaściwej Route Table",
      "Security Group blokująca wymagany ruch albo Network ACL blokująca ruch zwrotny",
      "Nakładające się zakresy CIDR, które utrudniają późniejsze łączenie sieci",
      "Otwarcie wszystkich portów dla 0.0.0.0/0 zamiast ograniczenia źródeł i usług",
      "Założenie, że nazwa „public subnet” automatycznie czyni znajdujący się w nim zasób publicznie dostępnym",
    ],
    summary: ["VPC jest regionalne, a każdy subnet należy do jednej Availability Zone.", "Publiczny lub prywatny charakter subnetu wynika przede wszystkim z routingu.", "Internet Gateway zapewnia drogę do internetu dla odpowiednio skonfigurowanych zasobów publicznych.", "NAT Gateway pozwala zasobom prywatnym inicjować ruch wychodzący bez bezpośredniej ekspozycji.", "Security Group jest stanowa i działa przy interfejsie, a Network ACL jest bezstanowa i filtruje subnet.", "Routing i reguły bezpieczeństwa muszą jednocześnie pozwalać na wymagany przepływ.", "NAT Gateway, publiczne adresy i transfer mogą istotnie wpływać na koszt."],
    sections: [
      {
        title: "Adresacja VPC i zapis CIDR",
        paragraphs: [
          "Tworząc VPC, wybierasz zakres prywatnych adresów IP zapisany w notacji CIDR. Przykład 10.0.0.0/16 opisuje sieć zaczynającą się od 10.0.0.0 oraz rozmiar jej zakresu. Na początku nie musisz wykonywać zaawansowanych obliczeń subnettingu — ważne jest zrozumienie, że prefiks po ukośniku określa, jak duża część adresu identyfikuje sieć, a cały zapis wyznacza pulę dostępnych adresów.",
          "Każdy subnet otrzymuje mniejszy CIDR mieszczący się w zakresie VPC, na przykład 10.0.1.0/24. Subnety w tym samym VPC nie mogą na siebie nachodzić. Warto planować adresację z zapasem i myśleć o przyszłych połączeniach z innymi VPC lub siecią firmową. Nakładające się zakresy prywatne utrudniają routing, peering i komunikację hybrydową, bo ten sam adres mógłby wskazywać dwie różne sieci.",
        ],
      },
      {
        title: "Subnety publiczne i prywatne",
        paragraphs: [
          "Subnet jest wydzieloną częścią adresacji VPC i zawsze należy do jednej Availability Zone. VPC jest regionalne, więc możesz utworzyć w nim osobne subnety w dwóch lub większej liczbie AZ. Taki podział pozwala rozmieścić kopie aplikacji w różnych lokalizacjach i ograniczyć wpływ awarii pojedynczej strefy.",
          "Określenia public subnet i private subnet opisują routing, a nie nazwę ani przełącznik przy zasobie. Publiczny subnet ma w powiązanej Route Table trasę internetową prowadzącą do Internet Gateway. Prywatny subnet nie ma bezpośredniej trasy do Internet Gateway; może jednak kierować ruch wychodzący przez NAT Gateway.",
          "Sama obecność zasobu w publicznym subnecie nie czyni go publicznym. Instancja EC2 potrzebuje także publicznego IPv4 lub Elastic IP, prawidłowej Security Group, przepuszczającej Network ACL oraz działającej aplikacji nasłuchującej na właściwym porcie. Wszystkie elementy ścieżki muszą współpracować.",
        ],
      },
      {
        title: "Route Table — mapa drogi dla ruchu",
        paragraphs: [
          "Route Table zawiera trasy z miejscem docelowym i celem, do którego AWS ma wysłać pasujący ruch. Każdy subnet korzysta z jednej Route Table: przypisanej jawnie albo głównej tabeli VPC. Jedna tabela może być współdzielona przez kilka subnetów, dlatego zmiana trasy może wpłynąć na wiele zasobów.",
          "Każda Route Table ma trasę local obejmującą CIDR VPC. Umożliwia ona routing między subnetami wewnątrz VPC i nie należy jej mylić z pozwoleniem firewalla. Trasa 0.0.0.0/0 oznacza wszystkie miejsca docelowe IPv4, dla których nie znaleziono bardziej szczegółowej trasy. W publicznym subnecie jej celem jest zwykle Internet Gateway, a w prywatnym — NAT Gateway.",
          "Routing wybiera drogę, lecz nie zastępuje zabezpieczeń. Błędna tabela lub złe powiązanie może odciąć serwer od internetu, innego subnetu albo sieci firmowej. Podczas diagnozy zawsze sprawdzaj Route Table faktycznie przypisaną do danego subnetu, nie tylko tabelę o obiecującej nazwie.",
        ],
      },
      {
        title: "Internet Gateway i publiczny serwer webowy",
        paragraphs: [
          "Internet Gateway musi być podłączony do VPC. Publiczny subnet zwykle kieruje 0.0.0.0/0 właśnie do tej bramy. Internet Gateway zapewnia drogę pomiędzy VPC a internetem, ale sam nie otwiera portów ani nie przydziela instancji publicznego adresu.",
          "Dla prostego serwera webowego przepływ wygląda tak: Internet → Internet Gateway → public Route Table → public subnet → Security Group → EC2. Odpowiedź wraca tą samą logiczną ścieżką. Instancja potrzebuje publicznego IPv4 lub Elastic IP, a Security Group powinna zezwalać tylko na wymagane porty, na przykład HTTP 80 lub HTTPS 443. Network ACL i firewall systemu operacyjnego również nie mogą blokować połączenia.",
        ],
        items: [
          { name: "1. Adres", description: "EC2 otrzymuje prywatny adres w subnecie oraz publiczny IPv4 lub Elastic IP do komunikacji internetowej." },
          { name: "2. Routing", description: "Route Table subnetu ma trasę 0.0.0.0/0 do Internet Gateway podłączonego do VPC." },
          { name: "3. Dostęp", description: "Security Group zezwala na potrzebny ruch, a Network ACL i system operacyjny go nie blokują." },
        ],
      },
      {
        title: "NAT Gateway i prywatny dostęp wychodzący",
        paragraphs: [
          "Serwer aplikacyjny w private subnet może potrzebować pobierać aktualizacje albo łączyć się z publicznym API, mimo że nie powinien przyjmować połączeń bezpośrednio z internetu. NAT Gateway umożliwia zasobom prywatnym inicjowanie takich połączeń i przekazuje odpowiedzi z powrotem. Użytkownik internetu nie może po prostu rozpocząć przez NAT Gateway nowego połączenia do prywatnej instancji.",
          "Typowy przepływ to: private EC2 → private Route Table → NAT Gateway → Internet Gateway → internet. NAT Gateway umieszcza się zwykle w publicznym subnecie i przypisuje mu publiczny adres. Route Table prywatnego subnetu kieruje 0.0.0.0/0 do NAT Gateway, natomiast tabela publicznego subnetu zapewnia NAT Gateway drogę do Internet Gateway.",
          "NAT Gateway jest usługą płatną i może generować opłaty zarówno za czas działania, jak i przetwarzanie danych. W rozwiązaniu wielostrefowym często rozważa się osobny NAT Gateway dla każdej AZ, aby zwiększyć odporność i ograniczyć ruch między strefami, lecz zwiększa to koszt. Nieużywane bramy należy usuwać.",
        ],
      },
      {
        title: "Security Group a Network ACL",
        paragraphs: [
          "Security Group działa na poziomie interfejsu sieciowego zasobu. Jest stanowa: jeżeli dopuścisz żądanie, ruch odpowiedzi jest automatycznie dozwolony niezależnie od osobnej reguły w przeciwnym kierunku. Security Groups obsługują reguły allow, dlatego bezpieczna konfiguracja polega na dopuszczaniu tylko niezbędnych źródeł, protokołów i portów.",
          "Network ACL działa na granicy subnetu i jest bezstanowa. Obsługuje zarówno allow, jak i deny, oceniając ponumerowane reguły w kolejności od najniższego numeru do pierwszego dopasowania. Ponieważ nie pamięta stanu połączenia, trzeba uwzględnić ruch w obu kierunkach, w tym porty używane przez odpowiedzi. Zbyt restrykcyjna reguła może więc przepuścić żądanie, ale zablokować odpowiedź.",
          "Oba mechanizmy mogą działać jednocześnie i nie zastępują Route Table. Na początek traktuj Security Group jako podstawową kontrolę blisko zasobu, a Network ACL jako dodatkową kontrolę całego subnetu. Unikaj rozbudowanych NACL bez konkretnej potrzeby, bo ich bezstanowość i kolejność reguł zwiększają ryzyko pomyłki.",
        ],
        items: [
          { name: "Security Group", description: "Poziom interfejsu zasobu, stanowa, tylko allow, automatycznie przepuszcza odpowiedź na dozwolony ruch." },
          { name: "Network ACL", description: "Poziom subnetu, bezstanowa, allow i deny, wymaga reguł dla obu kierunków, a kolejność ma znaczenie." },
        ],
      },
      {
        title: "Komunikacja wewnątrz VPC",
        paragraphs: [
          "Zasoby komunikują się wewnątrz VPC przede wszystkim przez prywatne adresy IP. Wbudowana trasa local pozwala kierować pakiety pomiędzy subnetami objętymi CIDR VPC. Nie potrzeba do tego Internet Gateway ani publicznych adresów, nawet gdy subnety znajdują się w różnych Availability Zones.",
          "Sama trasa local nie gwarantuje jednak połączenia. Security Group celu musi dopuścić ruch, a Network ACL subnetu źródłowego i docelowego muszą przepuścić wymagane kierunki. Aplikacja powinna też nasłuchiwać na właściwym adresie i porcie. Działająca komunikacja jest wynikiem jednocześnie poprawnego routingu, adresacji i zabezpieczeń.",
          "Przykładowo serwer webowy może przyjmować HTTPS z load balancera, a prywatna baza danych tylko ruch na swoim porcie z Security Group warstwy aplikacji. Takie odwołania między Security Groups są zwykle bezpieczniejsze i łatwiejsze w utrzymaniu niż szerokie reguły oparte na całych zakresach IP.",
        ],
      },
      {
        title: "Diagnozowanie typowych problemów",
        paragraphs: [
          "Gdy publiczna EC2 nie odpowiada, sprawdź po kolei: czy Internet Gateway jest podłączony, czy właściwa Route Table ma trasę 0.0.0.0/0 do tej bramy, czy instancja ma publiczny IPv4 lub Elastic IP oraz czy Security Group, Network ACL i system operacyjny przepuszczają port. Nie zakładaj, że etykieta „public” rozwiązuje którykolwiek z tych kroków.",
          "Gdy prywatna EC2 nie może pobrać aktualizacji, potwierdź trasę do NAT Gateway, położenie NAT Gateway w publicznym subnecie, jego publiczny adres i trasę publicznego subnetu do Internet Gateway. Sprawdź też ruch wychodzący Security Group oraz obie strony Network ACL. NAT Gateway w prywatnym subnecie bez dostępu do Internet Gateway nie zapewni wyjścia.",
          "Przy problemach między subnetami sprawdź adresy prywatne, trasę local i reguły bezpieczeństwa po obu stronach. Przy łączeniu różnych sieci zweryfikuj, czy ich CIDR się nie nakładają. Wprowadzaj możliwie wąskie reguły: otwarcie wszystkich portów dla 0.0.0.0/0 może chwilowo ukryć błąd diagnostyczny, ale tworzy poważne ryzyko.",
        ],
      },
      {
        title: "Koszty i świadome projektowanie",
        paragraphs: [
          "Samo utworzenie podstawowego VPC nie jest zwykle głównym źródłem kosztu, lecz elementy użyte do komunikacji mogą nim być. NAT Gateway generuje opłaty, transfer danych może być rozliczany, a publiczne adresy IPv4 mogą kosztować. Zakres zależy od architektury i kierunku przepływu, dlatego przed wdrożeniem należy sprawdzić aktualne zasady rozliczeń bez opierania projektu na zapamiętanej cenie.",
          "Regularnie usuwaj nieużywane NAT Gateway i publiczne adresy, obserwuj transfer oraz unikaj niepotrzebnego prowadzenia danych między Availability Zones. Architektura wielostrefowa zwiększa odporność, ale dodatkowe bramy i ruch mogą zwiększyć rachunek. Celem nie jest rezygnacja z odporności, lecz świadomy wybór adekwatny do znaczenia środowiska.",
        ],
      },
      {
        title: "Jak złożyć podstawową architekturę",
        paragraphs: [
          "Zacznij od regionalnego VPC i nienakładającego się CIDR. W każdej z co najmniej dwóch Availability Zones utwórz publiczny subnet dla elementów przyjmujących ruch, takich jak publiczny load balancer, oraz private subnet dla aplikacji i danych. Publiczne tabele kierują internet do Internet Gateway, a prywatne — jeśli potrzebują wyjścia — do NAT Gateway.",
          "Następnie ogranicz przepływy za pomocą Security Groups: internet komunikuje się z load balancerem, load balancer z aplikacją, a aplikacja z bazą. NACL pozostaw proste lub dodaj świadome reguły dla wymagań całego subnetu. Taki wielowarstwowy układ jest punktem wyjścia dla EC2, RDS, ECS, load balancerów, prywatnych usług i przyszłych połączeń hybrydowych.",
        ],
      },
    ],
  },
  {
    id: "aws:lambda", providerId: "aws", trackId: "aws-foundations",
    slug: "lambda", name: "Lambda", category: "Serverless", icon: "λ",
    shortDescription: "Uruchamianie kodu bez zarządzania serwerami",
    definition: "AWS Lambda pozwala uruchamiać kod bez samodzielnego zarządzania serwerami. Dostarczasz kod i konfigurację funkcji, a AWS utrzymuje infrastrukturę wykonawczą oraz uruchamia funkcję w reakcji na zdarzenie albo bezpośrednie wywołanie. Nadal odpowiadasz za kod, uprawnienia, bezpieczeństwo, konfigurację i monitoring. Serverless nie oznacza braku serwerów — oznacza, że nie zarządzasz nimi bezpośrednio.",
    learningObjectives: ["wyjaśnić role Function, Runtime i Handler", "odróżnić Event od Triggera", "nadać funkcji ograniczoną Execution Role", "dobrać podstawowo Memory, Timeout i concurrency", "wyjaśnić cold start oraz bezstanowy model funkcji", "rozpoznać wymagania sieciowe Lambda w VPC"],
    concepts: [
      { name: "Function", description: "Podstawowa jednostka wdrożenia: kod oraz konfiguracja obejmująca Runtime, Handler, Execution Role, pamięć, Timeout, zmienne środowiskowe i źródła zdarzeń." },
      { name: "Runtime", description: "Środowisko wykonawcze dla języka programowania, na przykład Node.js, Python, Java lub .NET." },
      { name: "Handler", description: "Punkt wejścia funkcji. Przyjmuje dane zdarzenia, wykonuje logikę, a następnie zwraca wynik lub zgłasza błąd." },
      { name: "Event", description: "Dane opisujące zdarzenie i przekazywane do Handlera, na przykład informacje o nowym obiekcie S3." },
      { name: "Trigger", description: "Konfiguracja, która powoduje wywołanie funkcji po określonym zdarzeniu. Nie jest tym samym co dane Event." },
      { name: "Execution Role", description: "IAM Role używana przez funkcję do uzyskania ograniczonego dostępu do usług i zasobów AWS." },
      { name: "Timeout", description: "Maksymalny czas pojedynczego wykonania funkcji, po którym Lambda je przerywa." },
      { name: "Concurrency", description: "Liczba wykonań funkcji, które mogą odbywać się równolegle." },
    ],
    useCases: [
      "Backendy API i proste integracje między usługami",
      "Przetwarzanie plików po dodaniu do Amazon S3",
      "Automatyzacja operacji i reakcje na zdarzenia",
      "Przetwarzanie komunikatów z kolejek",
      "Cykliczne zadania uruchamiane przez EventBridge",
      "Transformacje danych i lekkie procesy integracyjne",
    ],
    commonMistakes: [
      "Zbyt szeroka Execution Role lub niepotrzebne uprawnienia administratora",
      "Przechowywanie sekretów w kodzie albo logowanie danych wrażliwych",
      "Zbyt niski Timeout lub ustawienie wysokiej wartości bez zbadania przyczyny opóźnień",
      "Brak obsługi retry, idempotency i błędnych zdarzeń",
      "Przeciążanie bazy danych albo zewnętrznego API przez nadmierną concurrency",
      "Ciężka inicjalizacja wykonywana przy każdym wywołaniu",
      "Zakładanie trwałości pamięci lub lokalnego systemu plików",
      "Podłączanie funkcji do VPC bez potrzeby albo błędny routing po podłączeniu",
      "Brak logów, metryk, alarmów i monitoringu",
    ],
    summary: ["Lambda uruchamia kod bez zarządzania serwerami, ale konfiguracja i bezpieczeństwo pozostają odpowiedzialnością zespołu.", "Runtime zapewnia środowisko, Handler jest punktem wejścia, Event zawiera dane, a Trigger inicjuje wykonanie.", "Execution Role powinna zapewniać wyłącznie niezbędne uprawnienia.", "Memory, Timeout i concurrency dobieraj na podstawie pomiarów oraz możliwości usług zależnych.", "Nie zakładaj trwałości środowiska, pamięci ani lokalnego systemu plików.", "Retry wymaga idempotency i świadomej obsługi błędnych zdarzeń.", "Lambda w prywatnym subnecie potrzebuje poprawnego routingu do internetu lub odpowiednich VPC Endpoints."],
    sections: [
      {
        title: "Jak działa funkcja: Runtime i Handler",
        paragraphs: [
          "Function łączy kod z ustawieniami potrzebnymi do wykonania. Runtime zapewnia środowisko dla wybranego języka, takiego jak Node.js, Python, Java lub .NET. Dostępne środowiska zmieniają się z czasem, dlatego wybór powinien wynikać z aktualnej dokumentacji, wymagań aplikacji i wsparcia zespołu.",
          "Handler jest punktem wejścia wskazanym w konfiguracji. Odbiera Event, wykonuje logikę i zwraca wynik albo zgłasza błąd. Kod inicjalizujący klientów usług lub stałą konfigurację można umieścić poza Handlerem, aby przygotować go podczas uruchamiania środowiska i potencjalnie wykorzystać ponownie. Nie należy jednak zakładać, że konkretne środowisko zawsze przetrwa kolejne wywołanie.",
        ],
        items: [
          { name: "Kod", description: "Implementuje logikę biznesową oraz świadomą obsługę oczekiwanych błędów." },
          { name: "Konfiguracja", description: "Wskazuje między innymi Runtime, Handler, Execution Role, pamięć, Timeout i zmienne środowiskowe." },
          { name: "Źródła zdarzeń", description: "Łączą funkcję z usługami lub klientami, które mają inicjować wykonanie." },
        ],
      },
      {
        title: "Event, Trigger i źródła wywołań",
        paragraphs: [
          "Event to dane opisujące zdarzenie przekazane funkcji. Trigger to konfiguracja powodująca jej wywołanie. Gdy do bucketa trafia plik, Event może zawierać informacje o obiekcie, a Trigger S3 określa, że takie zdarzenie ma uruchomić wskazaną funkcję. Rozdzielenie tych pojęć pomaga diagnozować, czy problem dotyczy dostarczenia zdarzenia, czy jego obsługi przez kod.",
          "Funkcję mogą wywoływać między innymi API Gateway, Amazon S3, EventBridge, SQS, SNS i DynamoDB Streams. Możliwe jest też bezpośrednie wywołanie przez SDK lub CLI. Każda integracja ma własny model dostarczenia i obsługi błędów, dlatego zachowania nie należy uogólniać na wszystkie źródła.",
        ],
        items: [
          { name: "Wywołanie synchroniczne", description: "Klient oczekuje na odpowiedź, a wynik lub błąd może otrzymać bezpośrednio. Typowym przykładem jest żądanie obsługiwane przez integrację API." },
          { name: "Wywołanie asynchroniczne", description: "Zdarzenie zostaje przyjęte do obsługi, a wykonanie odbywa się niezależnie od klienta. Mogą wystąpić automatyczne ponowienia, więc błędne zdarzenia wymagają zaplanowanej obsługi." },
          { name: "Integracje strumieniowe i kolejkowe", description: "Usługa może pobierać partie rekordów i sterować ponowieniami w sposób właściwy dla źródła. Projektuj obsługę na podstawie konkretnej integracji." },
        ],
      },
      {
        title: "Uprawnienia: Execution Role i polityka zasobowa",
        paragraphs: [
          "Execution Role jest IAM Role przejmowaną przez usługę Lambda podczas wykonywania funkcji. Określa, jakie operacje funkcja może wykonywać na innych usługach i zasobach. Stosuj Least Privilege: funkcja odczytująca jeden bucket S3 powinna mieć tylko wymagane operacje odczytu wobec właściwych zasobów, a nie ogólny dostęp do całego konta.",
          "Nie zapisuj Access Keys w kodzie ani zmiennych konfiguracyjnych. Execution Role dostarcza tymczasowe poświadczenia. Sama funkcja może również mieć resource-based policy, która określa, kto lub która usługa może ją wywołać. To inny kierunek zaufania: Execution Role opisuje działania funkcji, a polityka zasobowa — uprawnienia do wywołania funkcji.",
        ],
      },
      {
        title: "Pamięć, CPU, Timeout i concurrency",
        paragraphs: [
          "Konfiguracja pamięci wpływa nie tylko na dostępną pamięć, lecz również na przydzielone zasoby obliczeniowe. Właściwe ustawienie ustala się pomiarami: większy przydział może skrócić wykonanie, ale zmienia koszt. Timeout ogranicza maksymalny czas jednego wykonania. Zbyt niski przerwie poprawne zadanie, a zbyt wysoki może maskować blokady, opóźniać wykrycie błędu i zwiększać koszty. Funkcja powinna kończyć się w przewidywalnym czasie.",
          "Lambda może uruchamiać wiele środowisk równolegle, gdy rośnie liczba zdarzeń. To ułatwia skalowanie, lecz zależna baza danych lub zewnętrzne API może nie przyjąć takiego ruchu. Limity concurrency chronią konto i systemy zależne. Reserved concurrency może ograniczyć maksymalną równoległość funkcji, a zarazem zarezerwować dla niej część dostępnej współbieżności. Limit dobieraj do pełnego przepływu, nie tylko możliwości samej Lambda.",
        ],
      },
      {
        title: "Cold start i ponowne użycie środowiska",
        paragraphs: [
          "Pierwsze wykonanie w nowym środowisku może potrwać dłużej, ponieważ trzeba przygotować Runtime i kod inicjalizacyjny. Jest to cold start, którego wpływ zależy od języka, pakietu, konfiguracji i charakteru ruchu — nie każda funkcja odczuwa go identycznie. Optymalizacja powinna wynikać z pomiarów oraz wymagań dotyczących opóźnienia.",
          "AWS może ponownie użyć środowiska przy kolejnych wywołaniach. Obiekty utworzone poza Handlerem mogą wtedy pozostać dostępne, co bywa przydatne dla połączeń lub klientów usług. Ponowne użycie nie jest jednak gwarancją. Funkcja powinna działać poprawnie zarówno w nowym, jak i istniejącym środowisku i nie może uzależniać poprawności od stanu zachowanego w pamięci.",
        ],
      },
      {
        title: "Konfiguracja, zmienne środowiskowe i sekrety",
        paragraphs: [
          "Zmienne środowiskowe nadają się do konfiguracji, na przykład nazwy środowiska albo identyfikatora zasobu. Pozwalają oddzielić ustawienia od kodu, ale nie należy traktować ich jako zamiennika właściwego zarządzania sekretami ani wpisywać haseł i kluczy bezpośrednio w repozytorium.",
          "Wrażliwe dane przechowuj w przeznaczonej do tego usłudze, na przykład AWS Secrets Manager lub Systems Manager Parameter Store. Funkcja powinna odczytywać wyłącznie potrzebny sekret dzięki ograniczonej Execution Role. Nie wypisuj wartości sekretów, tokenów ani wrażliwych danych użytkowników w logach, także podczas diagnostyki błędów.",
        ],
      },
      {
        title: "Logi, monitoring i obsługa błędów",
        paragraphs: [
          "Funkcja może zapisywać logi do CloudWatch Logs. Przydatny log zawiera kontekst operacji, poziom zdarzenia i identyfikator żądania, ale nie sekrety ani dane wrażliwe. Monitoruj błędy, czas działania i throttling, a dla ważnych sygnałów ustaw alarmy. CloudWatch jest kolejnym modułem ścieżki i rozwinie temat obserwowalności.",
          "Wyjątki powinny być obsłużone tam, gdzie funkcja potrafi bezpiecznie zareagować, albo świadomie propagowane do mechanizmu integracji. Ponowienia muszą być bezpieczne: funkcja przetwarzająca zdarzenia powinna być możliwie idempotentna, czyli wielokrotne przetworzenie tego samego zdarzenia nie powinno tworzyć niekontrolowanych efektów ubocznych. Błędne zdarzenia można kierować do DLQ lub odpowiedniego miejsca docelowego, zależnie od źródła i modelu wywołania.",
        ],
      },
      {
        title: "Lambda w VPC",
        paragraphs: [
          "Lambda nie zawsze musi być podłączona do VPC. Takie połączenie jest potrzebne, gdy funkcja ma komunikować się z prywatnymi zasobami, na przykład bazą dostępną wyłącznie wewnątrz VPC. Wtedy dobierz subnety, Security Groups i routing do wymaganych przepływów oraz ogranicz ruch do niezbędnego minimum.",
          "Funkcja korzystająca z prywatnego subnetu nie otrzymuje automatycznie dostępu do internetu. Ruch wychodzący może wymagać trasy przez NAT Gateway, a dostęp do wybranych usług AWS można w części architektur realizować przez VPC Endpoints. Błędny routing jest częstym źródłem problemów. Pełna diagnoza scenariusza „Lambda w VPC nie ma internetu” może być późniejszym ćwiczeniem praktycznym.",
        ],
      },
      {
        title: "Stan i lokalna warstwa tymczasowa",
        paragraphs: [
          "Projektuj funkcję jako bezstanową. Trwałe dane powinny trafiać do zewnętrznej usługi dobranej do ich charakteru. Dzięki temu nowe środowisko może obsłużyć zdarzenie bez wiedzy przechowywanej wyłącznie przez poprzednie wykonanie.",
          "Podczas wykonania może być dostępny lokalny katalog tymczasowy, przydatny na przykład do krótkiego przetwarzania pliku. Nie jest on trwałą bazą danych: środowisko może zniknąć, a kolejne wywołanie może trafić gdzie indziej. Dane wymagające zachowania muszą zostać zapisane poza lokalnym systemem plików funkcji.",
        ],
      },
      {
        title: "Kiedy rozważyć inne rozwiązanie",
        paragraphs: [
          "Lambda dobrze pasuje do krótkich, zdarzeniowych zadań, ale nie jest automatycznie najlepszym wyborem dla każdego workloadu. Porównaj inne usługi, gdy proces działa bardzo długo, wymaga stale działającego procesu, pełnej kontroli systemu albo nietypowego środowiska. Kontenery w Amazon ECS lub AWS Fargate mogą lepiej odpowiadać sposobowi budowania i wdrażania aplikacji, a EC2 daje kontrolę nad systemem operacyjnym.",
          "Dla procesu składającego się z wielu kroków rozważ AWS Step Functions zamiast umieszczania całej orkiestracji w jednej funkcji. Przy stałym, wysokim obciążeniu porównaj koszty i pracę operacyjną z modelami kontenerowymi lub EC2. Wybór powinien wynikać z profilu ruchu, czasu działania, potrzeb zespołu i wymagań niezawodności.",
        ],
      },
      {
        title: "Koszty i świadome retry",
        paragraphs: [
          "Koszt Lambda zależy przede wszystkim od liczby wywołań i czasu wykonywania, a konfiguracja pamięci wpływa na koszt pojedynczego wykonania. Usługi używane przez funkcję rozliczane są osobno. CloudWatch Logs może generować koszty zapisu i przechowywania danych, dlatego warto ustalić poziomy logowania oraz retencję.",
          "Architektura sieciowa również ma znaczenie: NAT Gateway może istotnie wpłynąć na koszt funkcji działającej w VPC. Nieefektywne retry zwiększa liczbę wywołań i obciążenie usług zależnych. Mierz czas, błędy i wolumen zdarzeń, ogranicz zbędne logi oraz sprawdzaj aktualne zasady rozliczeń przed wdrożeniem.",
        ],
      },
    ],
  },
  {
    id: "aws:cloudwatch", providerId: "aws", trackId: "aws-foundations",
    slug: "cloudwatch", name: "CloudWatch", category: "Observability", icon: "CW",
    shortDescription: "Logi, metryki, monitoring i alarmy",
    definition: "Amazon CloudWatch jest usługą obserwowalności i monitoringu zasobów oraz aplikacji działających w AWS. Pomaga zbierać metryki, przechowywać logi, tworzyć alarmy i dashboardy, analizować zachowanie systemu, wykrywać problemy oraz reagować na określone stany. Samo zbieranie danych nie rozwiązuje problemów — potrzebne są właściwe sygnały, sensowne alarmy i uzgodnione procedury reakcji.",
    learningObjectives: ["odróżnić metrykę od logu", "wyjaśnić Namespace, Dimensions, Statistics i Period", "rozpoznać stany OK, ALARM i INSUFFICIENT_DATA", "zaprojektować podstawowy, użyteczny alarm", "połączyć metryki i logi podczas diagnozy", "rozpoznać alarm fatigue oraz koszt nadmiernej obserwowalności"],
    concepts: [
      { name: "Metric", description: "Wartość liczbowa zbierana w czasie, na przykład liczba błędów, czas odpowiedzi albo wykorzystanie CPU." },
      { name: "Namespace", description: "Logiczna przestrzeń grupująca powiązane metryki usług AWS, aplikacji, środowisk lub metryk własnych." },
      { name: "Dimensions", description: "Pary nazw i wartości identyfikujące kontekst metryki, na przykład konkretną instancję EC2." },
      { name: "Log Event", description: "Pojedynczy wpis logu zawierający czas i komunikat konkretnego zdarzenia." },
      { name: "Log Stream", description: "Sekwencja wpisów pochodzących z jednego źródła, takiego jak instancja lub środowisko wykonawcze funkcji." },
      { name: "Log Group", description: "Logiczna grupa powiązanych Log Streams, dla której można ustalać między innymi retencję." },
      { name: "Alarm", description: "Mechanizm obserwujący metrykę lub wyrażenie i zmieniający stan po spełnieniu skonfigurowanych warunków." },
      { name: "Dashboard", description: "Wspólny widok najważniejszych metryk i informacji odpowiadających na konkretne pytania o stan systemu." },
    ],
    useCases: [
      "Monitorowanie usług i zasobów AWS",
      "Zbieranie oraz analizowanie logów aplikacyjnych i systemowych",
      "Tworzenie alarmów dla ważnych symptomów problemów",
      "Obserwowanie wydajności i wykrywanie błędów",
      "Budowanie dashboardów operacyjnych",
      "Wspieranie diagnozy incydentów",
      "Śledzenie własnych metryk aplikacyjnych i biznesowych",
    ],
    commonMistakes: [
      "Brak alarmów dla kluczowych komponentów albo alarmowanie wyłącznie na CPU",
      "Monitorowanie tylko infrastruktury bez metryk aplikacyjnych i biznesowych",
      "Logowanie sekretów, tokenów lub niepotrzebnych danych wrażliwych",
      "Brak świadomej retencji logów",
      "Zbyt wiele alarmów lub alarmy bez właściciela i instrukcji reakcji",
      "Błędny próg i ignorowanie stanu INSUFFICIENT_DATA",
      "Brak identyfikatorów korelacji i niespójne, nieczytelne logi tekstowe",
      "Brak testowania alarmów i zakładanie, że brak alarmu oznacza brak problemu",
    ],
    summary: ["Metryki opisują zachowanie liczbami, a logi dostarczają kontekstu konkretnych zdarzeń.", "Namespace grupuje metryki, Dimensions wskazują ich kontekst, a Statistics i Period wpływają na interpretację.", "INSUFFICIENT_DATA oznacza brak danych do oceny, a nie automatycznie awarię lub poprawne działanie.", "Dobry alarm jest związany z wpływem, ma właściciela i prowadzi do konkretnej reakcji.", "Dashboard powinien odpowiadać na pytania operacyjne, a nie tylko prezentować dużą liczbę wykresów.", "Monitoring infrastruktury uzupełniaj metrykami aplikacyjnymi i biznesowymi.", "Retencja, szczegółowość logów i własne metryki wpływają na koszt obserwowalności."],
    sections: [
      {
        title: "Obserwowalność: zrozumieć stan systemu",
        paragraphs: [
          "Obserwowalność oznacza możliwość zrozumienia wewnętrznego stanu systemu na podstawie danych, które system generuje. Metryki opisują zachowanie liczbowo, logi zachowują szczegóły zdarzeń, a ślady lub informacje o przepływie żądań pomagają prześledzić drogę operacji przez komponenty. Na poziomie podstawowym ważne jest łączenie tych źródeł, a nie traktowanie jednego z nich jako kompletnej odpowiedzi.",
          "CloudWatch gromadzi i prezentuje wiele takich sygnałów, ale nie zastępuje decyzji projektowych. Zespół musi ustalić, co oznacza poprawne działanie, jakie symptomy mają wpływ na użytkownika, kto reaguje na alarm oraz gdzie szukać dalszego kontekstu. Duża ilość danych bez celu może utrudnić diagnozę równie mocno jak ich brak.",
        ],
      },
      {
        title: "Metrics i ich kontekst",
        paragraphs: [
          "Metryka jest wartością liczbową zapisywaną w kolejnych punktach czasu. Może opisywać wykorzystanie CPU, liczbę żądań i błędów, czas odpowiedzi, liczbę wywołań Lambda, odrzucone lub ograniczone operacje albo stan zasobu. Każdy punkt danych ma Timestamp, Value i opcjonalną Unit, dzięki czemu wiadomo, kiedy wykonano pomiar, jaka była wartość i co ona oznacza.",
          "Namespace grupuje powiązane metryki i pomaga oddzielić usługi AWS, aplikacje, środowiska oraz metryki własne. Metric Name nazywa obserwowaną wielkość. Dimensions dodają kontekst: ta sama metryka wykorzystania CPU może istnieć dla wielu instancji, a dimension z identyfikatorem EC2 wskazuje konkretny zasób. Źle dobrane lub pominięte Dimensions mogą prowadzić do analizowania niewłaściwego zakresu danych.",
        ],
        items: [
          { name: "Namespace", description: "Grupa logiczna metryk, która oddziela ich źródła lub obszary odpowiedzialności." },
          { name: "Metric Name", description: "Nazwa mierzonej wielkości, na przykład liczba wywołań lub czas odpowiedzi." },
          { name: "Dimensions", description: "Kontekst identyfikujący zasób, operację albo środowisko związane z punktem danych." },
          { name: "Timestamp", description: "Czas, którego dotyczy pomiar." },
          { name: "Value", description: "Liczbowa wartość pomiaru." },
          { name: "Unit", description: "Jednostka ułatwiająca interpretację wartości, na przykład czas, liczba lub procent." },
        ],
      },
      {
        title: "Statistics, agregacja i Period",
        paragraphs: [
          "CloudWatch może agregować punkty danych. Average pokazuje średnią, Minimum i Maximum wartości skrajne, Sum łączną wartość, a SampleCount liczbę próbek. Statystykę dobiera się do pytania: dla czasu odpowiedzi średnia może wyglądać dobrze, choć pojedyncze żądania są bardzo wolne. Maximum pomoże zauważyć skrajność, a percentyle mogą dodatkowo opisywać rozkład opóźnień bez ograniczania analizy do średniej.",
          "Period określa przedział czasu używany do agregacji danych. Bardzo szeroki okres może wygładzić i ukryć krótki problem. Bardzo mały zwiększa szczegółowość oraz ilość danych do analizy. Właściwy okres zależy od dynamiki systemu, częstotliwości pomiarów i szybkości, z jaką zespół powinien wykryć istotną zmianę.",
        ],
        items: [
          { name: "Average", description: "Średnia wartość próbek w okresie; przydatna dla trendu, ale może ukrywać skrajności." },
          { name: "Minimum / Maximum", description: "Najniższa i najwyższa wartość, które pomagają znaleźć zakres oraz krótkie skoki." },
          { name: "Sum", description: "Suma wartości w okresie, użyteczna między innymi dla zliczanych zdarzeń." },
          { name: "SampleCount", description: "Liczba próbek uwzględnionych w agregacji." },
        ],
      },
      {
        title: "CloudWatch Logs i dobre logowanie",
        paragraphs: [
          "Log Event jest pojedynczym wpisem, Log Stream uporządkowaną sekwencją wpisów z jednego źródła, a Log Group logiczną grupą powiązanych strumieni. W ten sposób mogą być organizowane logi funkcji Lambda, aplikacji, systemu operacyjnego i infrastruktury. Nazewnictwo powinno pomagać szybko rozpoznać komponent i środowisko.",
          "Dobry wpis zawiera czas zdarzenia, poziom logu, nazwę komponentu, identyfikator żądania lub korelacji, krótki opis i potrzebny kontekst techniczny. Nie powinien zawierać haseł, tokenów, Access Keys, sekretów, pełnych danych osobowych ani zbędnych danych wrażliwych. Logi strukturalne, na przykład w JSON, łatwiej filtrować i analizować niż niespójne zdania o zmiennym formacie.",
          "Więcej logów nie zawsze oznacza lepszą obserwowalność. Nadmiar powtarzalnych wpisów zasłania istotne zdarzenia i generuje koszty. Ustal poziomy logowania oraz retencję. Zbyt długa retencja przechowuje niepotrzebne dane, a zbyt krótka może uniemożliwić analizę historycznego incydentu. Okres przechowywania powinien odpowiadać potrzebom technicznym, prawnym i kosztowym.",
        ],
      },
      {
        title: "CloudWatch Alarms",
        paragraphs: [
          "Alarm obserwuje metrykę albo wyrażenie oparte na metrykach. Stan OK oznacza, że oceniany warunek nie wskazuje alarmu, ALARM — że warunek został spełniony, a INSUFFICIENT_DATA — że brakuje danych do jego oceny. Ostatni stan nie dowodzi ani awarii, ani poprawnego działania. Może wynikać z zatrzymania zasobu, braku zdarzeń lub problemu z instrumentacją.",
          "Konfiguracja łączy Metric, Statistic, Period, Threshold, Comparison Operator, Evaluation Periods, Datapoints to Alarm i Missing Data Treatment. Próg powinien wynikać z zachowania systemu oraz wpływu na użytkowników. CPU powyżej 80% może być oczekiwane w efektywnym zadaniu obliczeniowym, a gdzie indziej sygnalizować przeciążenie. Bez kontekstu sama liczba nie definiuje awarii.",
          "Alarm nie musi reagować na pojedynczy krótki skok. Evaluation Periods i Datapoints to Alarm pozwalają wymagać naruszenia przez odpowiednią liczbę okresów. Zbyt czuły alarm tworzy szum, a zbyt mało czuły reaguje za późno. Missing Data Treatment również dobiera się do znaczenia metryki, ponieważ brak danych może oznaczać ciszę, zatrzymanie źródła lub uszkodzoną instrumentację.",
        ],
        items: [
          { name: "Threshold i Comparison Operator", description: "Wartość graniczna i sposób porównania danych z tą wartością." },
          { name: "Evaluation Periods", description: "Liczba okresów uwzględnianych podczas oceny stanu." },
          { name: "Datapoints to Alarm", description: "Liczba naruszających punktów potrzebna do przejścia w ALARM." },
          { name: "Missing Data Treatment", description: "Reguła interpretacji okresów, dla których nie otrzymano punktu danych." },
          { name: "Alarm actions", description: "Zmiana stanu może inicjować powiadomienie, reakcję automatyczną lub integrację; akcja musi być świadomie zaprojektowana i testowana." },
        ],
      },
      {
        title: "Dashboardy i pytania operacyjne",
        paragraphs: [
          "Dashboard prezentuje najważniejsze sygnały w jednym miejscu. Jego wartość nie wynika z liczby wykresów, lecz z pytań, na które pozwala szybko odpowiedzieć: czy system działa, czy użytkownicy widzą błędy, czy rośnie czas odpowiedzi, czy zasoby są przeciążone i czy zależne usługi zachowują się poprawnie.",
          "Każdy wykres powinien mieć czytelną nazwę, jednostkę, zakres czasu i kontekst. Widok przeładowany wykresami bez priorytetów utrudnia zauważenie zmiany. Dobry dashboard prowadzi od ogólnego stanu do komponentu wymagającego dalszej analizy, ale nie zastępuje alarmów ani szczegółowych logów.",
        ],
      },
      {
        title: "Monitoring EC2, Lambda i aplikacji",
        paragraphs: [
          "Dla EC2 przydatne są między innymi wykorzystanie CPU, status checks, ruch sieciowy, operacje dyskowe i logi aplikacji. Nie wszystkie informacje z systemu operacyjnego są dostępne automatycznie. Wykorzystanie pamięci i dodatkowe logi mogą wymagać zainstalowania oraz skonfigurowania odpowiedniego agenta lub innego rozwiązania monitorującego.",
          "Dla Lambda analizuj Invocations, Errors, Duration, Throttles, Concurrent Executions i logi wykonania. Sama liczba błędów bez liczby wszystkich wywołań nie pokazuje ich udziału. Dziesięć błędów na kilkanaście wywołań znaczy coś innego niż dziesięć błędów przy bardzo dużym ruchu; znaczenie funkcji i wpływ niepowodzeń są równie ważne.",
          "Rozróżniaj poziomy monitoringu. CPU instancji jest metryką infrastruktury, czas odpowiedzi API metryką aplikacyjną, a liczba zakończonych zamówień metryką biznesową. Zdrowa infrastruktura nie gwarantuje, że użytkownik może zakończyć proces biznesowy. Pełniejszy obraz wymaga sygnałów ze wszystkich istotnych warstw.",
        ],
      },
      {
        title: "Custom Metrics oraz Logs a Metrics",
        paragraphs: [
          "Aplikacja może publikować własne metryki opisujące jej rzeczywiste zachowanie: liczbę nieudanych płatności, długość kolejki wewnętrznej, liczbę przetworzonych plików, czas konkretnego procesu albo błędy walidacji. Własna metryka powinna odpowiadać na określone pytanie operacyjne lub biznesowe i mieć dobrze dobrane Dimensions.",
          "Metryki są dobre do trendów, szybkich alarmów, agregacji liczbowej i dashboardów. Logi służą szczegółowej diagnozie, analizie konkretnych zdarzeń i odtwarzaniu kontekstu. W praktyce metryka często pokazuje, że problem istnieje, a logi pomagają wyjaśnić dlaczego. Jedno źródło nie powinno bez potrzeby udawać drugiego.",
        ],
      },
      {
        title: "Alarm fatigue i odpowiedzialna reakcja",
        paragraphs: [
          "Alarm fatigue powstaje, gdy zespół otrzymuje zbyt wiele powiadomień, alarmy reagują na nieistotne skoki albo nie wiadomo, jaka czynność ma po nich nastąpić. Użytkownicy zaczynają ignorować sygnały, przez co ważny problem może pozostać niezauważony. Wyłączenie całego monitoringu nie jest rozwiązaniem — potrzebne jest strojenie i priorytetyzacja.",
          "Dobry alarm jest możliwy do zinterpretowania, powiązany z realnym wpływem, ma właściciela, konkretną reakcję i krótką dokumentację diagnostyczną. Alarmy należy testować, a po incydencie oceniać, czy uruchomiły się w odpowiednim momencie. Brak alarmu nie dowodzi braku problemu, szczególnie jeśli nie monitorujemy doświadczenia użytkownika lub ważnego procesu biznesowego.",
        ],
      },
      {
        title: "Typowy przepływ diagnozy",
        paragraphs: [
          "Prosty przepływ zaczyna się, gdy alarm informuje o wzroście błędów. Dashboard pokazuje, kiedy zmiana się rozpoczęła i czy towarzyszyły jej inne symptomy. Metryki pozwalają wskazać dotknięty komponent, a logi z identyfikatorem korelacji ujawniają konkretny komunikat oraz kontekst żądania.",
          "Zespół naprawia przyczynę, a następnie używa metryk, by potwierdzić powrót systemu do normy. Na końcu może skorygować alarm, dashboard, logowanie lub instrukcję reakcji. Taki proces łączenia sygnałów będzie podstawą przyszłych symulowanych scenariuszy CloudOps Lab.",
        ],
        items: [
          { name: "1. Wykrycie", description: "Alarm wskazuje istotny wzrost błędów." },
          { name: "2. Zakres czasu", description: "Dashboard pokazuje początek i przebieg problemu." },
          { name: "3. Lokalizacja", description: "Metryki wskazują komponent lub operację." },
          { name: "4. Przyczyna", description: "Logi dostarczają szczegółowego komunikatu i kontekstu." },
          { name: "5. Naprawa", description: "Zespół usuwa przyczynę, nie tylko symptom." },
          { name: "6. Potwierdzenie", description: "Metryki potwierdzają powrót do oczekiwanego zachowania." },
        ],
      },
      {
        title: "Koszty obserwowalności",
        paragraphs: [
          "Przechowywanie i przetwarzanie logów może generować koszty, podobnie jak własne metryki, dashboardy i dodatkowe funkcje monitoringu. Bardzo szczegółowe logowanie zwiększa ilość przetwarzanych danych, a długa retencja zwiększa przechowywanie. Nie oznacza to, że należy rezygnować z potrzebnych informacji, lecz że każda z nich powinna mieć uzasadnienie.",
          "Monitoruj koszt samego systemu obserwowalności, ustalaj retencję, ograniczaj zbędne wpisy i projektuj Dimensions bez niekontrolowanego mnożenia serii metryk. Potrzebna widoczność, ryzyko operacyjne i koszt muszą być oceniane razem. Aktualne zasady rozliczeń sprawdzaj przed wdrożeniem zamiast opierać decyzje na zapamiętanych cenach.",
        ],
      },
    ],
  },
];

export function getService(slug: string) {
  return awsServices.find((service) => service.slug === slug);
}
