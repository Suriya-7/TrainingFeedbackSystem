import { ChevronDown } from "lucide-react";

function Select({ label, id, className = "", children, ...props }) {
  const selectId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-4 pr-10 text-base text-slate-900 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 md:h-11 md:text-sm"
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

export default Select;
