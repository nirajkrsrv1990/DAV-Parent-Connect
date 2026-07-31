import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import ParentDashboard from "./pages/parent/dashboard/ParentDashboard";
import ParentHomework from "./pages/parent/dashboard/ParentHomework";
import ParentLogin from "./pages/parent/ParentLogin";

export default function App() {
  return (
    <Routes>
      {/* Root path par LoginPage set kar diya hai taaki blank screen na aaye */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/parent/login" element={<ParentLogin />} />
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/parent/homework" element={<ParentHomework />} />
      
      {/* 404 Page */}
      <Route path="*" element={<h1 style={{ textAlign: "center", marginTop: "100px" }}>404 - Page Not Found</h1>} />
    </Routes>
  );
}