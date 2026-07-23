import Link from "next/link";
import { brand } from "@/config/brand";

const startingPoints = [
  { href: "/learn/iam", label: "IAM", description: "Tożsamość i dostęp" },
  { href: "/learn/s3", label: "S3", description: "Przechowywanie obiektów" },
  { href: "/learn/ec2", label: "EC2", description: "Wirtualne serwery" },
];

export default function NotFound() {
  return (
    <main className="relative isolate min-h-[calc(100vh-9rem)] overflow-hidden border-b border-white/10">
      <div className="hero-glow absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section aria-labelledby="not-found-heading">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
            Błąd nawigacji
          </p>
          <p aria-hidden="true" className="mt-3 bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-8xl font-bold leading-none tracking-[-0.07em] text-transparent sm:text-9xl">
            404
          </p>
          <h1 id="not-found-heading" className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Ta ścieżka zniknęła w chmurze
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Strona, której szukasz, nie istnieje, została przeniesiona albo podany adres jest nieprawidłowy.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="rounded-lg bg-sky-400 px-6 py-3.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
              Wróć na stronę główną
            </Link>
            <Link href="/#services" className="rounded-lg border border-white/15 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
              Przeglądaj usługi AWS
            </Link>
          </div>
        </section>

        <aside aria-label="Status błędu" className="relative mx-auto w-full max-w-xl">
          <div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728]/90 shadow-2xl shadow-sky-950/30">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <span className="size-2.5 rounded-full bg-slate-600" />
              <span className="size-2.5 rounded-full bg-slate-600" />
              <span className="size-2.5 rounded-full bg-sky-400" />
              <span className="ml-2 font-mono text-xs text-slate-500">cloud-route-check</span>
            </div>
            <div className="p-5 font-mono text-xs leading-7 sm:p-7 sm:text-sm">
              <p><span className="text-slate-500">STATUS:</span> <span className="text-sky-300">RESOURCE_NOT_FOUND</span></p>
              <p><span className="text-slate-500">ENVIRONMENT:</span> <span className="text-slate-300">{brand.slug}</span></p>
              <p><span className="text-slate-500">ACTION:</span> <span className="text-slate-300">RETURN_TO_SAFE_ROUTE</span></p>
              <div aria-hidden="true" className="mt-8 flex items-center gap-3">
                <span className="size-3 rounded-full border-2 border-sky-400 bg-[#0b1728]" />
                <span className="h-px grow border-t border-dashed border-sky-400/40" />
                <span className="grid size-9 place-items-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-[10px] font-bold text-sky-300">{brand.mark}</span>
              </div>
            </div>
          </div>
        </aside>

        <section aria-labelledby="continue-heading" className="lg:col-span-2">
          <h2 id="continue-heading" className="text-sm font-semibold text-slate-300">Możesz kontynuować naukę od:</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {startingPoints.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-sky-400/40 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
                  <span><span className="block font-semibold text-white">{item.label}</span><span className="mt-1 block text-xs text-slate-500">{item.description}</span></span>
                  <span aria-hidden="true" className="text-sky-300 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
