import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, PlusCircle, UserCog, LogOut, Menu, X, Building2, ArrowLeft } from "lucide-react";

import BrandMark from "../ui/BrandMark";
import authService from "../../services/authService";

const NAV = [
  { to: "/admin/dashboard", label: "Trainings", icon: LayoutDashboard },
  { to: "/admin/trainings/new", label: "Assign training", icon: PlusCircle },
  { to: "/admin/trainers", label: "Trainers", icon: UserCog },
];

function NavItems({ onNavigate }) {
  const { pathname } = useLocation();
  // "Trainings" stays highlighted on a training's detail page too.
  const isActive = (to) =>
    to === "/admin/dashboard"
      ? pathname === to || (pathname.startsWith("/admin/trainings/") && pathname !== "/admin/trainings/new")
      : pathname === to;

  return (
    <nav className="space-y-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={`flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition ${
            isActive(to)
              ? "bg-brand-50 text-brand-800"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarFooter({ plant, onLogout }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-700 shadow-card">
          <Building2 size={17} />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-slate-900">{plant || "Plant"}</p>
          <p className="text-xs text-slate-500">Plant admin</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
      >
        <LogOut size={19} />
        Log out
      </button>
    </div>
  );
}

/**
 * Admin shell: fixed sidebar on laptops/desktops (lg+),
 * top bar + slide-in menu on tablets and phones.
 */
function AdminLayout({ title, subtitle, back, actions, children, width = "max-w-6xl" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const plant = authService.getPlantName();

  useEffect(() => setOpen(false), [pathname]);

  // Lock page scroll behind the open menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = () => {
    authService.logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-dvh lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 lg:flex">
        <div>
          <div className="px-1.5 py-2">
            <BrandMark />
          </div>
          <div className="mt-6">
            <NavItems />
          </div>
        </div>
        <SidebarFooter plant={plant} onLogout={handleLogout} />
      </aside>

      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
        <BrandMark compact />
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
          {plant || "Plant"}
        </span>
      </header>

      {/* Slide-in menu */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col justify-between bg-white p-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between px-1.5 py-2">
                <BrandMark />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-6">
                <NavItems onNavigate={() => setOpen(false)} />
              </div>
            </div>
            <SidebarFooter plant={plant} onLogout={handleLogout} />
          </div>
        </div>
      )}

      <main className={`mx-auto w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-9 ${width}`}>
        {back && (
          <Link
            to={back.to}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} /> {back.label}
          </Link>
        )}

        {(title || actions) && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.7rem]">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
          </div>
        )}

        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
