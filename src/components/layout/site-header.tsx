import Link from "next/link";
import { brand } from "@/config/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101f]/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3 rounded-md font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">
          <span className="grid size-9 place-items-center rounded-lg bg-sky-400 font-mono text-sm font-bold text-slate-950">{brand.mark}</span>
          {brand.name}
        </Link>
        <nav aria-label="Główna nawigacja" className="flex items-center gap-4 text-sm text-slate-300 sm:gap-6">
          <Link href="/#sciezki" className="transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Ścieżki</Link>
          <Link href="/#jak-to-dziala" className="hidden transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 sm:block">Jak to działa</Link>
          <Link href="/#o-projekcie" className="hidden transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 lg:block">O projekcie</Link>
          <Link href="/learn/iam" className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400">Rozpocznij naukę</Link>
        </nav>
      </div>
    </header>
  );
}
