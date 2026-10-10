import { BrowserRouter, Routes, Route } from "react-router-dom";

import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeFeedbackForm from "./pages/EmployeeFeedbackForm";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateTraining from "./pages/AdminCreateTraining";
import AdminTrainingDetail from "./pages/AdminTrainingDetail";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Employee */}
        <Route path="/" element={<EmployeeLogin />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/feedback/:id" element={<EmployeeFeedbackForm />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/trainings/new"
          element={
            <ProtectedRoute>
              <AdminCreateTraining />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/trainings/:id"
          element={
            <ProtectedRoute>
              <AdminTrainingDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
