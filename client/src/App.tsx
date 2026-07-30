import { Routes, Route } from "react-router-dom";
import ParentDashboard from "./pages/parent/dashboard/ParentDashboard";
import ParentHomework from "./pages/parent/dashboard/ParentHomework";
export default function AppRoutes() {
  return (
    <Routes>
      {/* Baaki routes jo pehle se hain */}
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      
      {/* 2. Yeh naya route add karein */}
      <Route path="/parent/homework" element={<ParentHomework />} />
    </Routes>
  );
}