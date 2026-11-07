import mark from "../../assets/dietech-mark.png";

function BrandMark({ light = false, compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          light ? "bg-white" : "bg-brand-50"
        }`}
      >
        <img src={mark} alt="" className="h-6 w-auto" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className={`text-sm font-bold ${light ? "text-white" : "text-slate-900"}`}>Dietech India Pvt Ltd</p>
          <p className={`text-xs ${light ? "text-brand-200" : "text-slate-500"}`}>Training Feedback</p>
        </div>
      )}
    </div>
  );
}

export default BrandMark;
