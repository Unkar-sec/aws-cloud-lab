export function LearningStep({ number, title, available = false }: { number: number; title: string; available?: boolean }) {
  return (
    <li className="relative rounded-xl border border-white/10 bg-[#0b1728] p-5">
      <span className="mb-4 grid size-8 place-items-center rounded-full bg-sky-400/10 text-sm font-bold text-sky-300">{number}</span>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{available ? "Dostępne teraz" : "W kolejnym etapie"}</p>
    </li>
  );
}
