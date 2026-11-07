function ProgressBar({ value = 0, tone = "brand", className = "" }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const fill = pct === 100 ? "bg-emerald-500" : tone === "brand" ? "bg-brand-600" : "bg-slate-400";
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full transition-all duration-500 ${fill}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default ProgressBar;
