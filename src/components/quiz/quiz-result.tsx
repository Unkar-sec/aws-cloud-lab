import Link from "next/link";

type QuizResultProps = {
  score: number;
  total: number;
  passingScore: number;
  onRetry: () => void;
};

export function QuizResult({ score, total, passingScore, onRetry }: QuizResultProps) {
  const passed = score >= passingScore;
  const percentage = Math.round((score / total) * 100);
  return (
    <section aria-labelledby="quiz-result-title" className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/10 to-indigo-400/5 p-6 sm:p-10">
      <p className="text-sm font-semibold text-sky-300">Wynik quizu IAM</p>
      <h1 id="quiz-result-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{passed ? "Moduł IAM ukończony" : "Jeszcze trochę praktyki"}</h1>
      <div className="mt-8 flex flex-col gap-6 border-y border-white/10 py-7 sm:flex-row sm:items-center">
        <p className="font-mono text-6xl font-bold tracking-tight text-white">{score}<span className="text-2xl text-slate-500">/{total}</span></p>
        <div>
          <p className={`font-semibold ${passed ? "text-emerald-300" : "text-amber-300"}`}>{passed ? "Quiz zaliczony" : "Quiz niezaliczony"} · {percentage}%</p>
          <p className="mt-2 text-sm text-slate-400">Próg zaliczenia: {passingScore}/{total}</p>
        </div>
      </div>
      <p className="mt-7 max-w-2xl leading-7 text-slate-300">{passed ? "Dobra robota. Opanowałeś podstawy zarządzania tożsamością i dostępem w AWS." : "Wróć do materiału, zwróć uwagę na polityki i role, a następnie spróbuj ponownie. Najlepszy wynik pozostanie zapisany."}</p>
      {passed && <p className="mt-3 text-sm font-semibold text-sky-300">Odblokowano rekomendowany kolejny moduł: S3</p>}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {passed && <Link href="/learn/s3" className="rounded-lg bg-sky-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Przejdź do S3</Link>}
        <button type="button" onClick={onRetry} className={`${passed ? "border border-white/15 bg-transparent text-white hover:bg-white/5" : "bg-sky-400 text-slate-950 hover:bg-sky-300"} rounded-lg px-5 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400`}>Powtórz quiz</button>
        <Link href="/learn/iam" className="rounded-lg border border-white/15 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Wróć do tutorialu IAM</Link>
      </div>
    </section>
  );
}
