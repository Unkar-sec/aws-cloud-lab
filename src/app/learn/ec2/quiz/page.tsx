import type { Metadata } from "next";
import { QuizPage } from "@/components/quiz/quiz-page";
import { ec2Quiz } from "@/data/quizzes/ec2-quiz";

export const metadata: Metadata = {
  title: { absolute: "Quiz EC2 | CloudOps Lab" },
  description: "Sprawdź podstawową wiedzę o Amazon EC2, Security Groups, EBS i bezpiecznym dostępie do usług AWS.",
};

export default function Ec2QuizPage() {
  return <QuizPage quiz={ec2Quiz} />;
}
