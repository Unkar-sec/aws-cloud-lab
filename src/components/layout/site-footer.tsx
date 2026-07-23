import { brand } from "@/config/brand";

export function SiteFooter() {
  return (
    <footer id="o-projekcie" className="scroll-mt-20 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-8 text-sm text-slate-400 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-semibold text-slate-200">{brand.name}</span> — niezależna platforma edukacyjna do nauki chmury, DevOps i bezpieczeństwa.</p>
          <p>© 2026 Projekt niezależny</p>
        </div>
        <div className="mt-6 max-w-4xl space-y-2 border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">
          <p>Aktualna ścieżka edukacyjna wykorzystuje nazwy usług Amazon Web Services wyłącznie w celach informacyjnych. {brand.name} nie jest powiązany, sponsorowany ani zatwierdzony przez Amazon Web Services.</p>
          <p>AWS, Amazon Web Services oraz nazwy powiązanych usług są znakami towarowymi Amazon.com, Inc. lub jej podmiotów powiązanych.</p>
        </div>
      </div>
    </footer>
  );
}
