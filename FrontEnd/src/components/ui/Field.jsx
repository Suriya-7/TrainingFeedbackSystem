// Labelled text input with an optional leading icon and trailing slot (e.g. a show/hide button).
function Field({ label, icon: Icon, trailing, hint, className = "", inputClassName = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          id={inputId}
          className={`h-12 w-full rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 md:h-11 md:text-sm ${
            Icon ? "pl-11" : "pl-4"
          } ${trailing ? "pr-12" : "pr-4"} ${inputClassName}`}
          {...props}
        />
        {trailing && <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default Field;
