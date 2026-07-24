import {
  RotateCw,
  LogOut,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import authService from "../../services/authService";

function AdminNavbar({
  onRefresh,
  loading = false,
}) {


  const navigate = useNavigate();


  const handleLogout = () => {
    authService.logout();

    toast.success("Logged out successfully.");

    navigate("/admin/login", {
      replace: true,
    });
  };


  return (

    <nav
      className="
        sticky
        top-0
        z-50
        bg-white/95
        backdrop-blur
        border-b
        border-gray-200
        shadow-sm
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            min-h-16
            py-3
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-4
          "
        >


          {/* Company Section */}

          <div
            className="
              flex
              items-center
              gap-3
              w-full
              lg:w-auto
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-gray-900
                text-white
                flex
                items-center
                justify-center
                shadow-md
              "
            >
              <Building2 size={24}/>
            </div>


            <div>

              <h1
                className="
                  text-base
                  sm:text-lg
                  font-bold
                  text-gray-900
                  leading-tight
                "
              >
                Training Feedback System
              </h1>


              <p
                className="
                  text-xs
                  sm:text-sm
                  text-gray-500
                  mt-1
                "
              >
                Dietech India Pvt. Ltd.
              </p>

            </div>

          </div>



          {/* Action Section */}

          <div
            className="
              flex
              flex-wrap
              justify-center
              lg:justify-end
              items-center
              gap-3
              w-full
              lg:w-auto
            "
          >


           




            {/* Refresh Button */}

            <button
              onClick={onRefresh}
              disabled={loading}
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                border
                border-gray-300
                bg-white
                text-gray-700
                font-medium
                text-sm
                hover:bg-gray-100
                hover:border-gray-400
                transition-all
                duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              <RotateCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              <span>
                {loading ? "Refreshing..." : "Refresh"}
              </span>

            </button>




            {/* Logout Button */}

            <button
              onClick={handleLogout}
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                bg-red-600
                text-white
                font-medium
                text-sm
                shadow-sm
                hover:bg-red-700
                hover:shadow-md
                transition-all
                duration-200
              "
            >

              <LogOut size={17}/>

              <span>
                Logout
              </span>

            </button>


          </div>


        </div>

      </div>


    </nav>

  );
}

export default AdminNavbar;