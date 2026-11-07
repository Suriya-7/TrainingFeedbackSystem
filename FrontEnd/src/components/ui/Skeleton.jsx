export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />
);

export const PageLoader = ({ label = "Loading…" }) => (
  <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">{label}</div>
);
