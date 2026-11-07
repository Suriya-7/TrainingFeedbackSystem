import { LoaderCircle } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900 disabled:hover:bg-brand-700",
  secondary:
    "bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition select-none disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <LoaderCircle size={size === "sm" ? 15 : 17} className="animate-spin" />
      ) : (
        Icon && <Icon size={size === "sm" ? 15 : 17} />
      )}
      {children}
    </button>
  );
}

export default Button;
