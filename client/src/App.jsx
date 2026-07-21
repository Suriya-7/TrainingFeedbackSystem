import { BrowserRouter, Routes, Route } from "react-router-dom";

import EmployeeFeedback from "./pages/EmployeeFeedback";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/AdminDashboard";
import ViewFeedback from "./pages/ViewFeedback";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeFeedback />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path="/view/:id" element={<ViewFeedback />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;