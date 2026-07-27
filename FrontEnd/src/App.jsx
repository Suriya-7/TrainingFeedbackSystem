import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeFeedback from "./pages/EmployeeFeedback";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeFeedback />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;