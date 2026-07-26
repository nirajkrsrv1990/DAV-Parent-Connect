import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";

import "./AdminLayout.css";

export default function AdminLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log("Sidebar State =", sidebarOpen);

console.log("Admin Sidebar =", sidebarOpen);

  return (

    <div className="admin-layout">

      <Sidebar
  isOpen={sidebarOpen}
  onClose={() => {
    console.log("ADMIN SIDEBAR CLOSE");
    setSidebarOpen(false);
  }}
/>

      <div className="layout-container">

        <Header
  onMenuClick={() => {
    console.log("ADMIN HEADER CLICK");
    setSidebarOpen(true);
  }}
/>

        <main className="layout-content">

          <Outlet />

        </main>

      </div>

    </div>

  );

}