import type { Metadata } from "next";
import { QuizPage } from "@/components/quiz/quiz-page";
import { vpcQuiz } from "@/data/quizzes/vpc-quiz";

export const metadata: Metadata = {
  title: { absolute: "Quiz VPC | CloudOps Lab" },
  description: "Sprawdź podstawową wiedzę o Amazon VPC, subnetach, routingu, Internet Gateway, NAT Gateway i zabezpieczeniach sieciowych.",
};

export default function VpcQuizPage() {
  return <QuizPage quiz={vpcQuiz} />;
}
