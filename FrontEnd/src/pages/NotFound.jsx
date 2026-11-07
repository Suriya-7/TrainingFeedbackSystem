import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import BrandMark from "../components/ui/BrandMark";

function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-6">
      <div className="self-start">
        <BrandMark />
      </div>

      <div className="flex flex-1 items-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Compass size={30} />
          </div>
          <p className="text-sm font-semibold text-brand-700">Error 404</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
          <p className="mt-3 text-slate-500">
            The page you’re looking for doesn’t exist or the link is incorrect.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
            >
              Employee sign in
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Admin sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
