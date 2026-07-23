import type { QuizDefinition } from "@/types/quiz";

export const iamQuiz = {
  id: "iam-foundations",
  providerId: "aws",
  trackId: "aws-foundations",
  moduleId: "aws:iam",
  moduleSlug: "iam",
  title: "Quiz IAM",
  description: "Sprawdź znajomość tożsamości, polityk i bezpiecznego nadawania dostępu w AWS.",
  passingScore: 4,
  questions: [
    {
      id: "iam-user-vs-role",
      question: "Które stwierdzenie najlepiej opisuje różnicę między IAM User a IAM Role?",
      answers: [
        { id: "a", text: "IAM User zawsze ma dostęp tymczasowy, a IAM Role stałe hasło." },
        { id: "b", text: "IAM User reprezentuje konkretną tożsamość, a IAM Role dostarcza tymczasowe uprawnienia możliwe do przejęcia." },
        { id: "c", text: "IAM Role służy wyłącznie do grupowania IAM Users." },
        { id: "d", text: "Nie ma między nimi różnicy — są zamienne." },
      ],
      correctAnswerId: "b",
      explanation: "IAM User jest długotrwałą tożsamością osoby lub aplikacji. IAM Role nie ma własnych stałych danych logowania i jest przejmowana, aby uzyskać tymczasowe poświadczenia.",
    },
    {
      id: "iam-policy-evaluation",
      question: "Co się stanie, gdy jedna pasująca IAM Policy zezwala na akcję, a inna jawnie jej zabrania?",
      answers: [
        { id: "a", text: "Allow ma zawsze pierwszeństwo." },
        { id: "b", text: "Decyduje polityka utworzona najpóźniej." },
        { id: "c", text: "Jawny Deny ma pierwszeństwo przed Allow." },
        { id: "d", text: "AWS wybiera wynik losowo." },
      ],
      correctAnswerId: "c",
      explanation: "IAM Policy definiuje dozwolone i zabronione działania. W procesie oceny uprawnień jawny Deny zawsze przeważa nad Allow.",
    },
    {
      id: "least-privilege",
      question: "Co oznacza zasada Least Privilege?",
      answers: [
        { id: "a", text: "Przyznanie administratorom dostępu do wszystkich usług." },
        { id: "b", text: "Przyznanie tylko minimalnych uprawnień potrzebnych do wykonania zadania." },
        { id: "c", text: "Współdzielenie jednego konta przez cały zespół." },
        { id: "d", text: "Blokowanie każdego dostępu spoza jednej sieci." },
      ],
      correctAnswerId: "b",
      explanation: "Least Privilege ogranicza uprawnienia do niezbędnego minimum, zmniejszając skutki błędów, wycieku danych logowania lub przejęcia konta.",
    },
    {
      id: "iam-groups",
      question: "Do czego najlepiej wykorzystać IAM Group?",
      answers: [
        { id: "a", text: "Do grupowania IAM Users o podobnych obowiązkach i wspólnego nadawania im uprawnień." },
        { id: "b", text: "Do uruchamiania aplikacji na EC2." },
        { id: "c", text: "Do przechowywania plików konfiguracyjnych." },
        { id: "d", text: "Do łączenia wielu kont AWS w jedną sieć." },
      ],
      correctAnswerId: "a",
      explanation: "IAM Group upraszcza zarządzanie użytkownikami: politykę można przypisać grupie, a należący do niej IAM Users odziedziczą te uprawnienia.",
    },
    {
      id: "application-access",
      question: "Jak bezpiecznie przyznać aplikacji działającej na EC2 dostęp do S3?",
      answers: [
        { id: "a", text: "Zapisać klucze użytkownika root w kodzie aplikacji." },
        { id: "b", text: "Umieścić długoterminowe access keys w publicznym repozytorium." },
        { id: "c", text: "Przypisać instancji odpowiednią IAM Role z minimalnymi wymaganymi uprawnieniami." },
        { id: "d", text: "Ustawić bucket S3 jako publiczny." },
      ],
      correctAnswerId: "c",
      explanation: "IAM Role przypisana do EC2 dostarcza aplikacji automatycznie rotowane, tymczasowe poświadczenia. Eliminuje to potrzebę zapisywania stałych kluczy w kodzie lub konfiguracji.",
    },
  ],
} satisfies QuizDefinition;
