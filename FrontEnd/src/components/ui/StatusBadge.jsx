import { CheckCircle2, Clock } from "lucide-react";

const TONES = {
  completed: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", Icon: CheckCircle2, label: "Completed" },
  pending: { cls: "bg-amber-50 text-amber-700 ring-amber-600/20", Icon: Clock, label: "Pending" },
  progress: { cls: "bg-brand-50 text-brand-700 ring-brand-600/15", Icon: Clock, label: "In progress" },
};

function StatusBadge({ status, label }) {
  const tone = TONES[status] || TONES.pending;
  const { Icon } = tone;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone.cls}`}
    >
      <Icon size={13} />
      {label || tone.label}
    </span>
  );
}

export default StatusBadge;
