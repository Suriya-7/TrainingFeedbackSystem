import { Navigate } from "react-router-dom";

// role="admin" (default) or role="employee": no token -> back to that role's login page.
function ProtectedRoute({ children, role = "admin" }) {
  const isEmployee = role === "employee";
  const token = localStorage.getItem(isEmployee ? "employeeToken" : "adminToken");

  if (!token) {
    return <Navigate to={isEmployee ? "/" : "/admin/login"} replace />;
  }

  return children;
}

export default ProtectedRoute;
