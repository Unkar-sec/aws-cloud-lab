import type { QuizQuestion as QuizQuestionType } from "@/types/quiz";

type QuizQuestionProps = {
  question: QuizQuestionType;
  selectedAnswerId: string | null;
  isSubmitted: boolean;
  onSelect: (answerId: string) => void;
};

export function QuizQuestion({ question, selectedAnswerId, isSubmitted, onSelect }: QuizQuestionProps) {
  return (
    <fieldset disabled={isSubmitted}>
      <legend className="text-xl font-semibold leading-8 text-white sm:text-2xl">{question.question}</legend>
      <div className="mt-7 grid gap-3">
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswerId === answer.id;
          const isCorrect = isSubmitted && answer.id === question.correctAnswerId;
          const isWrong = isSubmitted && isSelected && !isCorrect;
          return (
            <label key={answer.id} className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-400 ${isCorrect ? "border-emerald-400/60 bg-emerald-400/10" : isWrong ? "border-rose-400/60 bg-rose-400/10" : isSelected ? "border-sky-400 bg-sky-400/10" : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]"} ${isSubmitted ? "cursor-default" : ""}`}>
              <input type="radio" name={question.id} value={answer.id} checked={isSelected} onChange={() => onSelect(answer.id)} className="sr-only" />
              <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-lg border font-mono text-xs font-semibold ${isCorrect ? "border-emerald-400/40 text-emerald-300" : isWrong ? "border-rose-400/40 text-rose-300" : isSelected ? "border-sky-400/50 text-sky-300" : "border-white/10 text-slate-500"}`}>{String.fromCharCode(65 + index)}</span>
              <span className="pt-1 text-sm leading-6 text-slate-300">{answer.text}</span>
              {isSubmitted && (isCorrect || isWrong) && <span className={`ml-auto shrink-0 pt-1 text-xs font-semibold ${isCorrect ? "text-emerald-300" : "text-rose-300"}`}>{isCorrect ? "Poprawna" : "Błędna"}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
