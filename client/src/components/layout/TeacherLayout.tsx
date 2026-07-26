import { useState } from "react";
import { Outlet } from "react-router-dom";

import TeacherSidebar from "../teacher/TeacherSidebar";
import TeacherHeader from "../teacher/TeacherHeader";

import "./AdminLayout.css";

export default function TeacherLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <TeacherSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="content-wrapper">

        <TeacherHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="dashboard-content">

          <Outlet />

        </main>

      </div>
    </>
  );

}