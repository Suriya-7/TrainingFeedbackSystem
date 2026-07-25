import { AlertTriangle, Home } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center">

        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <AlertTriangle
            size={52}
            className="text-red-600"
          />
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-extrabold text-gray-900 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 leading-relaxed">
          The page you are looking for doesn't exist, has been moved,
          or the URL is incorrect.
        </p>

        {/* Button */}
        <div className="mt-8">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-blue-600
              text-white
              font-semibold
              shadow-md
              hover:bg-blue-700
              hover:shadow-lg
              transition-all
              duration-200
            "
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-400">
          Training Feedback System
        </p>

      </div>
    </div>
  );
}

export default NotFound;