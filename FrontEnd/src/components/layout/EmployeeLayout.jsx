import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import BrandMark from "../ui/BrandMark";
import { readToken } from "../../utils/format";

// Employee shell: slim top bar, one centred column (works the same on phones and shared PCs).
function EmployeeLayout({ children, width = "max-w-2xl" }) {
  const navigate = useNavigate();
  const empNo = readToken(localStorage.getItem("employeeToken") || "")?.id;

  const handleLogout = () => {
    localStorage.removeItem("employeeToken");
    navigate("/");
  };

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <div className="flex items-center gap-2">
            {empNo && (
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline">
                {empNo}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto w-full px-4 py-6 sm:px-6 sm:py-10 ${width}`}>{children}</main>
    </div>
  );
}

export default EmployeeLayout;
