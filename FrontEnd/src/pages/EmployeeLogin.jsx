import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, IdCard, LockKeyhole, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

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
      setTimeout(() => navigate("/employee/dashboard"), 600);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-4">
            {step === "verify" ? <IdCard size={26} /> : <LockKeyhole size={26} />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Training Feedback</h1>
          <p className="mt-2 text-gray-500 text-sm">
            {step === "verify" ? "Enter your Employee Number to continue" : "Confirm your details"}
          </p>
        </div>

        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Employee Number
              </label>
              <div className="relative">
                <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={employeeNo}
                  onChange={(e) => setEmployeeNo(e.target.value)}
                  placeholder="e.g. 00123"
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {step === "password" && employee && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <CheckCircle2 size={20} className="text-gray-900 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{employee.fullName}</p>
                <p className="text-gray-500">{employee.department}</p>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                {employee.hasPassword ? "Password" : "Set a new password"}
              </label>
              <div className="relative">
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={employee.hasPassword ? "Enter your password" : "At least 6 characters"}
                  autoFocus
                  className="w-full pl-11 pr-14 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : employee.hasPassword ? "Log In" : "Set Password & Continue"}
            </button>

            <button
              type="button"
              onClick={() => setStep("verify")}
              className="w-full text-sm text-gray-500 hover:text-gray-900"
            >
              Not you? Use a different Employee Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EmployeeLogin;
