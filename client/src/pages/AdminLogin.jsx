import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        formData.password
      );

      if (response.success) {
        toast.success("Login successful!");

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 800);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-gray-800">
          Training Feedback System
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Admin Login
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter Username"
              autoComplete="username"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-black outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 focus:ring-2 focus:ring-black focus:border-black outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold transition hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
<button
  type="button"
  onClick={() => toast.success("Toast Working")}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Test Toast
</button>
      </div>
    </div>
    
  );
}

export default AdminLogin;