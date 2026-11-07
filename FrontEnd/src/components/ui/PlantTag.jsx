import { plantLabel } from "../../utils/format";

// Small coloured chip so people from different plants are easy to tell apart.
const TONES = {
  PLANT1: "bg-sky-50 text-sky-700 ring-sky-600/15",
  PLANT2: "bg-violet-50 text-violet-700 ring-violet-600/15",
  PLANT3: "bg-teal-50 text-teal-700 ring-teal-600/15",
};

function PlantTag({ code }) {
  if (!code) return null;
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
        TONES[code] || "bg-slate-100 text-slate-600 ring-slate-500/15"
      }`}
    >
      {plantLabel(code)}
    </span>
  );
}

export default PlantTag;
