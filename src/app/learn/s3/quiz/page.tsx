import type { Metadata } from "next";
import { QuizPage } from "@/components/quiz/quiz-page";
import { s3Quiz } from "@/data/quizzes/s3-quiz";

export const metadata: Metadata = {
  title: "Quiz S3",
  description: "Sprawdź wiedzę o Amazon S3 i ukończ drugi moduł ścieżki AWS Foundations.",
};

export default function S3QuizPage() {
  return <QuizPage quiz={s3Quiz} />;
}
