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
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import logo from "@/assets/logo/dav_logo.png";
import "./Sidebar.css";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-top">
            <img
              src={logo}
              alt="DAV Logo"
              className="sidebar-logo"
            />

            <button
              className="close-btn"
              onClick={onClose}
            >
              <X size={22}/>
            </button>
          </div>

          <h2>DAV ERP</h2>
          <p>DAV Public School</p>
          <small>Session : 2026-27</small>
        </div>

        <nav className="menu">
          <Link to="/admin" className="menu-link" onClick={onClose}>
            <div className="menu-item"><LayoutDashboard size={20}/><span>Dashboard</span></div>
          </Link>

          <Link to="/admin/students/upload" className="menu-link" onClick={onClose}>
            <div className="menu-item"><GraduationCap size={20}/><span>Students</span></div>
          </Link>

          <Link to="/admin/teachers" className="menu-link" onClick={onClose}>
            <div className="menu-item"><Users size={20}/><span>Teachers</span></div>
          </Link>

          <Link to="/parent/dashboard" className="menu-link" onClick={onClose}>
            <div className="menu-item"><UserRound size={20}/><span>Parents</span></div>
          </Link>

          <Link to="/admin/master" className="menu-link" onClick={onClose}>
            <div className="menu-item"><School size={20}/><span>Masters</span></div>
          </Link>

          <Link to="#" className="menu-link" onClick={onClose}>
            <div className="menu-item"><ClipboardCheck size={20}/><span>Attendance</span></div>
          </Link>

          <Link to="#" className="menu-link" onClick={onClose}>
            <div className="menu-item"><BookOpen size={20}/><span>Homework</span></div>
          </Link>

          <Link to="#" className="menu-link" onClick={onClose}>
            <div className="menu-item"><FileBarChart size={20}/><span>Results</span></div>
          </Link>

          <Link to="#" className="menu-link" onClick={onClose}>
            <div className="menu-item"><IndianRupee size={20}/><span>Fees</span></div>
          </Link>

          {/* Direct Add Notice page par jaane ke liye path set kiya gaya hai */}
          <Link to="/admin/notices/add" className="menu-link" onClick={onClose}>
            <div className="menu-item">
              <Bell size={20}/>
              <span>Notices</span>
            </div>
          </Link>

          <Link to="/" className="menu-link" onClick={onClose}>
            <div className="menu-item"><LogOut size={20}/><span>Logout</span></div>
          </Link>
        </nav>
      </aside>
    </>
  );
}