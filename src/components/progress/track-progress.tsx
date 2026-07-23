import type { LearningTrack } from "@/types/learning-catalog";

type TrackProgressProps = {
  track: LearningTrack;
  completed: number;
  total: number;
  percentage: number;
  isLoading: boolean;
};

export function TrackProgress({ track, completed, total, percentage, isLoading }: TrackProgressProps) {
  if (isLoading) {
    return <div aria-label={`Wczytywanie postępu ${track.name}`} className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"><div className="flex animate-pulse items-center justify-between gap-6"><div className="space-y-3"><div className="h-4 w-36 rounded bg-white/10" /><div className="h-3 w-52 max-w-full rounded bg-white/10" /></div><div className="h-5 w-12 rounded bg-white/10" /></div><div className="mt-6 h-3 animate-pulse rounded-full bg-white/10" /></div>;
  }

  const trackCompleted = total > 0 && completed === total;

  return (
    <section aria-labelledby={`${track.id}-progress-title`} className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-6">
        <div><h3 id={`${track.id}-progress-title`} className="font-semibold text-white">{track.name}</h3><p className="mt-1 text-xs text-slate-400">{track.description}</p><p className="mt-2 text-sm text-slate-300">{completed} z {total} modułów ukończonych</p>{trackCompleted && <p role="status" className="mt-2 text-sm font-semibold text-emerald-300">Ścieżka {track.name} ukończona</p>}</div>
        <p className="font-mono text-lg font-semibold text-sky-300">{percentage}%</p>
      </div>
      <div role="progressbar" aria-label={`Postęp ${track.name}: ${completed} z ${total} modułów ukończonych`} aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed} aria-valuetext={`${percentage}%`} className="mt-6 h-3 overflow-hidden rounded-full border border-white/10 bg-[#07101f]">
        <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${percentage}%` }} />
      </div>
      <div aria-hidden="true" className="mt-2 flex justify-between text-[11px] text-slate-400"><span>Start</span><span>Cel</span></div>
    </section>
  );
}
