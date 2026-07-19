import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserRound,
  School,
  ClipboardCheck,
  BookOpen,
  FileBarChart,
  IndianRupee,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";
import logo from "../../assets/logo/dav_logo.png";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <img
          src={logo}
          alt="DAV Logo"
          className="sidebar-logo"
        />

        <h2>DAV ERP</h2>

        <p>DAV Public School</p>

        <small>Session : 2026-27</small>

      </div>

      <nav className="menu">

        <Link to="/admin" className="menu-link">
          <div className="menu-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
        </Link>

       <Link to="/admin/students/upload" className="menu-link">
          <div className="menu-item">
            <GraduationCap size={20} />
            <span>Students</span>
          </div>
        </Link>

        <Link to="/admin/teachers" className="menu-link">
          <div className="menu-item">
            <Users size={20} />
            <span>Teachers</span>
          </div>
        </Link>

        {/* Temporary - Later will become Parent Management */}
        <Link to="/parent/dashboard" className="menu-link">
          <div className="menu-item">
            <UserRound size={20} />
            <span>Parents</span>
          </div>
        </Link>

        <Link to="/admin/master" className="menu-link">
  <div className="menu-item">
    <School size={20} />
    <span>Masters</span>
  </div>
</Link>

        <Link to="#" className="menu-link">
          <div className="menu-item">
            <ClipboardCheck size={20} />
            <span>Attendance</span>
          </div>
        </Link>

        <Link to="#" className="menu-link">
          <div className="menu-item">
            <BookOpen size={20} />
            <span>Homework</span>
          </div>
        </Link>

        <Link to="#" className="menu-link">
          <div className="menu-item">
            <FileBarChart size={20} />
            <span>Results</span>
          </div>
        </Link>

        <Link to="#" className="menu-link">
          <div className="menu-item">
            <IndianRupee size={20} />
            <span>Fees</span>
          </div>
        </Link>

        <Link to="#" className="menu-link">
          <div className="menu-item">
            <Bell size={20} />
            <span>Notices</span>
          </div>
        </Link>

        <Link to="#" className="menu-link">
          <div className="menu-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </Link>
        

        <Link to="/" className="menu-link">
          <div className="menu-item">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </Link>

      </nav>

    </aside>
  );
}