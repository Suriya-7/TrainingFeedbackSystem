import BrandMark from "../ui/BrandMark";

// Sign-in pages: brand panel on large screens, compact header on phones/tablets.
function AuthShell({ title, subtitle, points = [], children, footer }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel (desktop) */}
      <aside className="relative hidden overflow-hidden bg-brand-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-700/40" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-brand-800/60" />
        <div className="pointer-events-none absolute bottom-24 right-12 h-40 w-40 rounded-full border border-white/10" />

        <div className="relative">
          <BrandMark light />
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-brand-200">{subtitle}</p>
          {points.length > 0 && (
            <ul className="mt-8 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-brand-100">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="relative text-xs text-brand-300">© Dietech India Pvt. Ltd.</p>
      </aside>

      {/* Form side */}
      <main className="flex min-h-dvh flex-col px-4 py-6 sm:px-8 lg:min-h-0 lg:px-12">
        <div className="lg:hidden">
          <BrandMark />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {footer && <div className="text-center text-sm text-slate-500">{footer}</div>}
      </main>
    </div>
  );
}

export default AuthShell;
