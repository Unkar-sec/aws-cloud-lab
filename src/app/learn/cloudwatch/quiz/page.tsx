import type { Metadata } from "next";
import { QuizPage } from "@/components/quiz/quiz-page";
import { cloudwatchQuiz } from "@/data/quizzes/cloudwatch-quiz";

export const metadata: Metadata = {
  title: { absolute: "Quiz CloudWatch | CloudOps Lab" },
  description: "Sprawdź podstawową wiedzę o metrykach, logach, alarmach, dashboardach i monitorowaniu usług AWS.",
};

export default function CloudWatchQuizPage() {
  return <QuizPage quiz={cloudwatchQuiz} />;
}
