function StatCard({ icon: Icon, label, value, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="flex flex-col items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:gap-3.5 sm:p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0 max-w-full">
        <p className="text-xs font-medium leading-tight text-slate-500 sm:truncate">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default StatCard;
