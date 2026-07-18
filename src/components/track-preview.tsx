import Link from "next/link";
import { awsServices } from "@/data/aws-services";

export function TrackPreview() {
  return (
    <div id="sciezka" className="overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/10 to-indigo-400/5 p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold text-sky-300">Ścieżka startowa</p><h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">AWS Foundations</h2></div>
        <Link href="/learn/iam" className="w-fit rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Zacznij od IAM</Link>
      </div>
      <ol className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {awsServices.map((service, index) => (
          <li key={service.slug} className={`rounded-xl border p-4 ${index === 0 ? "border-sky-400/50 bg-sky-400/10" : "border-white/10 bg-black/10"}`}>
            <span className="text-xs text-slate-500">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-3 font-semibold text-white">{service.name}</p>
            <p className="mt-1 text-xs text-slate-400">{index === 0 ? "Start" : "Następny moduł"}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
