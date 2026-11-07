import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { toast } from "react-toastify";

import AuthShell from "../components/layout/AuthShell";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import authService from "../services/authService";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error("Username and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(formData.username, formData.password);
      if (response.success) {
        toast.success("Signed in.");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Run every plant’s training feedback from one place."
      subtitle="Assign trainings, see who has responded, and download the signed feedback forms as PDFs."
      points={["Plant-wise access — you only see your own plant", "Live pending / completed tracking", "One-click PDF and ZIP downloads"]}
      footer={
        <Link to="/" className="font-medium text-brand-700 hover:text-brand-900">
          ← Employee sign in
        </Link>
      }
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <div className="mb-7">
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
            Admin portal
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-1.5 text-sm text-slate-500">Use the username and password for your plant.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Username"
            name="username"
            icon={UserRound}
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            autoComplete="username"
            autoFocus
          />

          <Field
            label="Password"
            name="password"
            icon={LockKeyhole}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            autoComplete="current-password"
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Button type="submit" size="lg" loading={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}

export default AdminLogin;
