import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { toast } from "react-toastify";

import authService from "../services/authService";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error("Username and Password are required.");

      return;
    }

    try {
      setLoading(true);

      const response = await authService.login(
        formData.username,
        formData.password,
      );

      if (response.success) {
        toast.success("Login successful!");

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 800);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-gray-200
          p-8
        "
      >
        {/* Header */}

        <div className="text-center mb-8">
          <div
            className="
              mx-auto
              w-14
              h-14
              rounded-2xl
              bg-gray-900
              text-white
              flex
              items-center
              justify-center
              mb-4
            "
          >
            <LockKeyhole size={26} />
          </div>

          <h1
            className="
              text-2xl
              font-bold
              text-gray-900
            "
          >
            Training Feedback System Dietech India
          </h1>

          <p
            className="
              mt-2
              text-gray-500
              text-sm
            "
          >
            Admin Portal Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}

          <div>
            <label
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Username
            </label>

            <div className="relative">
              <UserRound
                size={18}

                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"

                name="username"

                value={formData.username}

                onChange={handleChange}

                placeholder="Enter Username"

                autoComplete="username"

                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-900
                  transition
                "
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}

                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type={showPassword ? "text" : "password"}

                name="password"

                value={formData.password}

                onChange={handleChange}

                placeholder="Enter Password"

                autoComplete="current-password"

                className="
                  w-full
                  pl-11
                  pr-14
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-900
                  transition
                "
              />

              <button
                type="button"

                onClick={() => setShowPassword(!showPassword)}

                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-900
                "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}

          <button
            type="submit"

            disabled={loading}

            className="
              w-full
              py-3
              rounded-xl
              bg-gray-900
              text-white
              font-semibold
              hover:bg-black
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
