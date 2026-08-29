import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  FileBarChart,
  Users,
  UserCircle,
  KeyRound,
  Bell,
  MessageSquare,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import logo from "../../assets/logo/dav_logo.png";
import "./TeacherSidebar.css";

type TeacherSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function TeacherSidebar({
  isOpen = false,
  onClose,
}: TeacherSidebarProps) {
  const [homeworkOpen, setHomeworkOpen] =
  useState(false);
  return (
    <>
      {/* Mobile view background overlay */}
      {isOpen && (
        <div
          className="teacher-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`teacher-sidebar ${
          isOpen ? "teacher-sidebar-open open" : ""
        }`}
      >
        <div className="teacher-brand">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="DAV Logo"
              className="teacher-logo"
            />

            <button
              className="teacher-close-btn"
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>

          <h2>DAV ERP</h2>
          <p>Teacher Portal</p>
          <small>Session : 2026-27</small>
        </div>

        <nav className="teacher-menu">
          <Link to="/teacher" className="teacher-link" onClick={onClose}>
            <div className="teacher-item">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
          </Link>

          <Link to="/teacher/attendance" className="teacher-link" onClick={onClose}>
            <div className="teacher-item">
              <ClipboardCheck size={20} />
              <span>Attendance</span>
            </div>
          </Link>

          {/* ==========================================
    HOMEWORK MANAGEMENT
========================================== */}

<div className="teacher-link">
  <div
    className="teacher-item"
    onClick={() =>
      setHomeworkOpen((previous) => !previous)
    }
    style={{ cursor: "pointer" }}
  >
    <BookOpen size={20} />

    <span style={{ flex: 1 }}>
      Homework Management
    </span>

    {homeworkOpen ? (
      <ChevronDown size={18} />
    ) : (
      <ChevronRight size={18} />
    )}
  </div>
</div>

{homeworkOpen && (
  <div className="teacher-submenu">

    <Link
      to="/teacher/class-homework"
      className="teacher-submenu-link"
      onClick={onClose}
    >
      📋 Class Homework
    </Link>

    <Link
      to="/teacher/homework"
      className="teacher-submenu-link"
      onClick={onClose}
    >
      ⬆️ Upload Homework
    </Link>

  </div>
)}

          <Link to="/teacher/marks" className="teacher-link" onClick={onClose}>
            <div className="teacher-item">
              <FileBarChart size={20} />
              <span>Marks Entry</span>
            </div>
          </Link>

          <Link to="/teacher/students" className="teacher-link" onClick={onClose}>
            <div className="teacher-item">
              <Users size={20} />
              <span>Student List</span>
            </div>
          </Link>

          <Link to="/teacher/profile" className="teacher-link" onClick={onClose}>
            <div className="teacher-item">
              <UserCircle size={20} />
              <span>My Profile</span>
            </div>
          </Link>

          <Link to="/teacher/change-password" className="teacher-link" onClick={onClose}>
            <div className="teacher-item">
              <KeyRound size={20} />
              <span>Change Password</span>
            </div>
          </Link>

          <Link to="/teacher/notices" className="teacher-link" onClick={onClose}>
            <div className="teacher-item">
              <Bell size={20} />
              <span>Notices</span>
            </div>
          </Link>
          <Link
  to="/teacher/parent-messages"
  className="teacher-link"
  onClick={onClose}
>
  <div className="teacher-item">
    <MessageSquare size={20} />
    <span>Parent Messages</span>
  </div>
</Link>

          <Link to="/" className="teacher-link" onClick={onClose}>
            <div className="teacher-item">
              <LogOut size={20} />
              <span>Logout</span>
            </div>
          </Link>
        </nav>
      </aside>
    </>
  );
}