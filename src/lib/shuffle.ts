import type { QuizQuestion } from "@/types/quiz";

export function shuffleArray<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

export function shuffleQuestionAnswers(questions: readonly QuizQuestion[]): QuizQuestion[] {
  return questions.map((question) => ({
    ...question,
    answers: shuffleArray(question.answers),
  }));
}
