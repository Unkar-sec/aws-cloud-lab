import type { QuizDefinition } from "@/types/quiz";

export const s3Quiz = {
  id: "s3-foundations",
  providerId: "aws",
  trackId: "aws-foundations",
  moduleId: "aws:s3",
  moduleSlug: "s3",
  title: "Quiz S3",
  description: "Sprawdź znajomość obiektów, wersjonowania oraz bezpiecznej kontroli dostępu w Amazon S3.",
  passingScore: 4,
  questions: [
    {
      id: "s3-bucket-object-key",
      question: "Które stwierdzenie poprawnie opisuje Bucket, Object i Key w Amazon S3?",
      answers: [
        { id: "container-data-identifier", text: "Bucket jest kontenerem, Object zawiera dane i metadane, a Key identyfikuje obiekt w bucketcie." },
        { id: "object-container", text: "Object jest kontenerem na buckety, a Key przechowuje dane pliku." },
        { id: "key-encryption", text: "Key jest kluczem szyfrującym wszystkie obiekty w bucketcie." },
        { id: "bucket-single-file", text: "Bucket może zawierać wyłącznie jeden Object i nie używa identyfikatorów." },
      ],
      correctAnswerId: "container-data-identifier",
      explanation: "Bucket przechowuje obiekty. Object składa się z danych i metadanych, natomiast unikalny w obrębie bucketa Key wskazuje konkretny obiekt.",
    },
    {
      id: "s3-block-public-access",
      question: "Jaką rolę pełni S3 Block Public Access?",
      answers: [
        { id: "encrypts-data", text: "Automatycznie szyfruje każdy obiekt własnym kluczem użytkownika." },
        { id: "prevents-public-access", text: "Pomaga zapobiegać przypadkowemu udostępnieniu bucketów i obiektów publicznie." },
        { id: "creates-backups", text: "Tworzy kopię każdego obiektu w innym regionie." },
        { id: "replaces-policies", text: "Całkowicie zastępuje IAM Policy i Bucket Policy." },
      ],
      correctAnswerId: "prevents-public-access",
      explanation: "S3 Block Public Access nakłada zabezpieczenia ograniczające publiczny dostęp. Szyfrowanie chroni dane, ale nie zastępuje właściwej kontroli dostępu.",
    },
    {
      id: "s3-versioning",
      question: "Co umożliwia włączenie Versioning dla bucketa S3?",
      answers: [
        { id: "multiple-versions", text: "Przechowywanie wielu wersji obiektu o tym samym Key." },
        { id: "public-history", text: "Publiczne udostępnienie historii zmian każdego obiektu." },
        { id: "automatic-compression", text: "Automatyczną kompresję starszych obiektów." },
        { id: "single-copy", text: "Zachowanie wyłącznie najnowszej kopii obiektu." },
      ],
      correctAnswerId: "multiple-versions",
      explanation: "Versioning zachowuje kolejne wersje obiektu o tym samym Key, co pomaga odzyskiwać dane po przypadkowym nadpisaniu lub usunięciu.",
    },
    {
      id: "s3-policy-types",
      question: "Jaka jest podstawowa różnica między IAM Policy a S3 Bucket Policy?",
      answers: [
        { id: "same-policy", text: "Nie ma różnicy — obie polityki są przypisywane wyłącznie do bucketów." },
        { id: "identity-vs-resource", text: "IAM Policy jest przypisywana tożsamości IAM, a Bucket Policy jest polityką opartą na zasobie przypisaną do bucketa." },
        { id: "encryption-vs-network", text: "IAM Policy steruje szyfrowaniem, a Bucket Policy wyłącznie ruchem sieciowym." },
        { id: "users-vs-objects", text: "IAM Policy działa tylko dla ludzi, a Bucket Policy tylko dla pojedynczych obiektów." },
      ],
      correctAnswerId: "identity-vs-resource",
      explanation: "IAM Policy określa uprawnienia tożsamości, takiej jak User lub Role. Bucket Policy jest dołączona do zasobu S3 i może wskazywać, kto ma do niego dostęp.",
    },
    {
      id: "s3-presigned-url",
      question: "Jak bezpiecznie udostępnić konkretnej osobie prywatny obiekt S3 na ograniczony czas?",
      answers: [
        { id: "public-bucket", text: "Ustawić cały bucket jako publiczny." },
        { id: "share-root-keys", text: "Przekazać odbiorcy access keys konta root." },
        { id: "presigned-url", text: "Wygenerować pre-signed URL z krótkim czasem ważności dla konkretnego obiektu." },
        { id: "encryption-only", text: "Włączyć szyfrowanie obiektu bez określania uprawnień." },
      ],
      correctAnswerId: "presigned-url",
      explanation: "Pre-signed URL zapewnia czasowy dostęp do wskazanego obiektu bez upubliczniania bucketa i bez przekazywania odbiorcy danych logowania AWS.",
    },
  ],
} satisfies QuizDefinition;
