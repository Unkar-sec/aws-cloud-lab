import type { Metadata } from "next";
import { QuizPage } from "@/components/quiz/quiz-page";
import { iamQuiz } from "@/data/quizzes/iam-quiz";

export const metadata: Metadata = {
  title: "Quiz IAM",
  description: "Sprawdź wiedzę o IAM i ukończ pierwszy moduł ścieżki AWS Foundations.",
};

export default function IamQuizPage() {
  return <QuizPage quiz={iamQuiz} />;
}
