export type QuizAnswer = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  answers: QuizAnswer[];
  correctAnswerId: string;
  explanation: string;
};

export type QuizDefinition = {
  id: string;
  moduleSlug: string;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
};
