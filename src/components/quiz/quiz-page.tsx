import Link from "next/link";
import { getLearningModule, getLearningTrack } from "@/data/learning-tracks";
import type { QuizDefinition } from "@/types/quiz";
import { QuizRunner } from "./quiz-runner";

export function QuizPage({ quiz }: { quiz: QuizDefinition }) {
  const learningModule = getLearningModule(quiz.moduleId);
  const track = getLearningTrack(quiz.trackId);
  if (!learningModule || !track) return null;
  return (
    <main className="relative isolate min-h-[75vh] overflow-hidden">
      <div className="hero-glow absolute inset-0 -z-10" />
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-20">
        <nav aria-label="Okruszki" className="text-sm text-slate-500">
          <Link href={`/learn/${learningModule.slug}`} className="rounded text-slate-400 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Tutorial {learningModule.name}</Link>
          <span aria-hidden="true" className="mx-2">/</span><span>Quiz</span>
        </nav>
        <header className="py-10">
          <p className="text-sm font-semibold text-sky-300">{track.name} · {learningModule.name}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">{quiz.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{quiz.description} Quiz zawiera {quiz.questions.length} pytań. Aby zaliczyć moduł, zdobądź co najmniej {quiz.passingScore}/{quiz.questions.length} punktów.</p>
        </header>
        <QuizRunner quiz={quiz} />
      </div>
    </main>
  );
}
