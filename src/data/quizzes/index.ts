import { iamQuiz } from "./iam-quiz";
import { s3Quiz } from "./s3-quiz";
import { ec2Quiz } from "./ec2-quiz";
import { vpcQuiz } from "./vpc-quiz";
import { lambdaQuiz } from "./lambda-quiz";
import { cloudwatchQuiz } from "./cloudwatch-quiz";
import type { LearningModuleSlug } from "@/types/learning-catalog";
import type { QuizDefinition } from "@/types/quiz";

export const quizzesByModule = {
  iam: iamQuiz,
  s3: s3Quiz,
  ec2: ec2Quiz,
  vpc: vpcQuiz,
  lambda: lambdaQuiz,
  cloudwatch: cloudwatchQuiz,
} satisfies Partial<Record<LearningModuleSlug, QuizDefinition>>;

export function getQuizForModule(moduleSlug: LearningModuleSlug): QuizDefinition | undefined {
  return quizzesByModule[moduleSlug as keyof typeof quizzesByModule];
}
