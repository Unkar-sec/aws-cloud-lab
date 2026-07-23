import type { Metadata } from "next";
import { QuizPage } from "@/components/quiz/quiz-page";
import { lambdaQuiz } from "@/data/quizzes/lambda-quiz";

export const metadata: Metadata = {
  title: { absolute: "Quiz Lambda | CloudOps Lab" },
  description: "Sprawdź podstawową wiedzę o AWS Lambda, triggerach, Execution Role, Timeout, sekretach i integracji z VPC.",
};

export default function LambdaQuizPage() {
  return <QuizPage quiz={lambdaQuiz} />;
}
