import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, IdCard, LockKeyhole, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import AuthShell from "../components/layout/AuthShell";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { initials } from "../utils/format";
import {
  verifyEmployee,
  setEmployeePassword,
  employeeLogin,
} from "../services/employeeApi";

function EmployeeLogin() {
  const navigate = useNavigate();

  const [step, setStep] = useState("verify"); // 'verify' | 'password'
  const [employeeNo, setEmployeeNo] = useState("");
  const [employee, setEmployee] = useState(null); // { fullName, department, hasPassword }
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!employeeNo.trim()) {
      toast.error("Enter your Employee Number.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyEmployee(employeeNo.trim());
      setEmployee(res);
      setStep("password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Employee not found.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Enter your password.");
      return;
    }

    try {
      setLoading(true);
      const res = employee.hasPassword
        ? await employeeLogin(employeeNo.trim(), password)
        : await setEmployeePassword(employeeNo.trim(), password);

      localStorage.setItem("employeeToken", res.token);
      toast.success(employee.hasPassword ? "Welcome back!" : "Password set — you're in!");
      navigate("/employee/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const backToVerify = () => {
    setStep("verify");
    setPassword("");
  };

  return (
    <AuthShell
      title="Your feedback makes every training better."
      subtitle="Rate the sessions you attended in about two minutes. Your answers go straight to the plant’s training team."
      points={["Takes less than 2 minutes", "Works on your phone or any shared PC", "Sign in with your Employee Number"]}
      footer={
        <Link to="/admin/login" className="font-medium text-brand-700 hover:text-brand-900">
          Admin sign in →
        </Link>
      }
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2" aria-hidden="true">
          <span className="h-1.5 flex-1 rounded-full bg-brand-600" />
          <span className={`h-1.5 flex-1 rounded-full transition ${step === "password" ? "bg-brand-600" : "bg-slate-200"}`} />
        </div>

        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome</h1>
              <p className="mt-1.5 text-sm text-slate-500">Enter your Employee Number to continue.</p>
            </div>

            <Field
              label="Employee Number"
              name="employeeNo"
              icon={IdCard}
              value={employeeNo}
              onChange={(e) => setEmployeeNo(e.target.value)}
              placeholder="e.g. EMP0001"
              autoFocus
              autoComplete="username"
              autoCapitalize="characters"
            />

            <Button type="submit" size="lg" loading={loading} className="w-full">
              {loading ? "Checking…" : "Continue"}
            </Button>
          </form>
        )}

        {step === "password" && employee && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {employee.hasPassword ? "Welcome back" : "Create your password"}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                {employee.hasPassword
                  ? "Enter your password to see your trainings."
                  : "First time here — choose a password to use from now on."}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-sm font-bold text-white">
                {initials(employee.fullName)}
              </div>
              <div className="min-w-0 text-sm">
                <p className="truncate font-semibold text-slate-900">{employee.fullName}</p>
                <p className="truncate text-slate-500">
                  {employeeNo.trim().toUpperCase()} · {employee.department}
                </p>
              </div>
            </div>

            <Field
              label={employee.hasPassword ? "Password" : "New password"}
              name="password"
              icon={LockKeyhole}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={employee.hasPassword ? "Enter your password" : "At least 6 characters"}
              autoFocus
              autoComplete={employee.hasPassword ? "current-password" : "new-password"}
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
              {loading ? "Please wait…" : employee.hasPassword ? "Log in" : "Set password & continue"}
            </Button>

            <button
              type="button"
              onClick={backToVerify}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={15} /> Not you? Use a different number
            </button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

export default EmployeeLogin;
