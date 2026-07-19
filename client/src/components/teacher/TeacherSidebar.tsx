import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  FileBarChart,
  Users,
  UserCircle,
  KeyRound,
  Bell,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";
import logo from "../../assets/logo/dav_logo.png";
import "./TeacherSidebar.css";

export default function TeacherSidebar() {
  return (
    <aside className="teacher-sidebar">

      <div className="teacher-brand">

        <img
          src={logo}
          alt="DAV Logo"
          className="teacher-logo"
        />

        <h2>DAV ERP</h2>

        <p>Teacher Portal</p>

        <small>Session : 2026-27</small>

      </div>

      <nav className="teacher-menu">

        <Link to="/teacher" className="teacher-link">
          <div className="teacher-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
        </Link>

        <Link to="/teacher/attendance" className="teacher-link">
          <div className="teacher-item">
            <ClipboardCheck size={20} />
            <span>Attendance</span>
          </div>
        </Link>

        <Link to="/teacher/homework" className="teacher-link">
          <div className="teacher-item">
            <BookOpen size={20} />
            <span>Homework</span>
          </div>
        </Link>

        <Link to="/teacher/results" className="teacher-link">
          <div className="teacher-item">
            <FileBarChart size={20} />
            <span>Marks Entry</span>
          </div>
        </Link>

        <Link to="/teacher/students" className="teacher-link">
          <div className="teacher-item">
            <Users size={20} />
            <span>Student List</span>
          </div>
        </Link>

        <Link to="/teacher/profile" className="teacher-link">
          <div className="teacher-item">
            <UserCircle size={20} />
            <span>My Profile</span>
          </div>
        </Link>

        <Link to="/teacher/password" className="teacher-link">
          <div className="teacher-item">
            <KeyRound size={20} />
            <span>Change Password</span>
          </div>
        </Link>

        <Link to="/teacher/notices" className="teacher-link">
          <div className="teacher-item">
            <Bell size={20} />
            <span>Notices</span>
          </div>
        </Link>

        <Link to="/" className="teacher-link">
          <div className="teacher-item">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </Link>

      </nav>

    </aside>
  );
}