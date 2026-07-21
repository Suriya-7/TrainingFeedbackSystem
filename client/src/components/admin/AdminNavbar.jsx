import logo from "../../assets/dietech-logo.png";
import { LogOut } from "lucide-react";

function AdminNavbar() {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    window.location.href = "/admin/login";
  };

  return (
    <nav
      className="
        px-4
        sm:px-6
        lg:px-8
        py-4
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          flex
          items-center
          justify-between
        "
      >
        {/* Left Section */}

        <div
          className="
            flex
            items-center
            gap-3
            sm:gap-4
          "
        >
          {/* Logo */}

          <div
            className="
              bg-gray-50
              border
              border-gray-200
              rounded-xl
              p-2
              flex
              items-center
              justify-center
            "
          >
            <img
              src={logo}
              alt="DIETECH Logo"
              className="
                w-20
                h-20
                sm:w-12
                sm:h-12
                object-contain
              "
            />
          </div>

          {/* Company Details */}

          <div className="leading-tight">
            <h1
              className="
                text-lg
                sm:text-xl
                font-bold
                text-gray-800
                tracking-wide
              "
            >
              DIETECH
            </h1>

            <p
              className="
                text-xs
                sm:text-sm
                text-gray-500
                mt-1
              "
            >
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Right Section */}

        <button
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2

            bg-gray-900
            hover:bg-black

            text-white

            px-4
            sm:px-5

            py-2

            rounded-xl

            text-sm
            sm:text-base

            font-medium

            shadow-sm

            transition-all
            duration-200

            hover:shadow-md

            active:scale-95
          "
        >
          <LogOut size={18} strokeWidth={2} />

          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
