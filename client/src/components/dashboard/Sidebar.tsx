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
  MessageSquare,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";
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

  const [studentsOpen, setStudentsOpen] =
    useState(false);

  return (
    <>
      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ===================================================== */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* =================================================
            SIDEBAR BRAND
        ================================================= */}

        <div className="sidebar-brand">

          <div className="sidebar-top">

            <img
              src={logo}
              alt="DAV Logo"
              className="sidebar-logo"
            />

            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              aria-label="Close Sidebar"
            >
              <X size={22} />
            </button>

          </div>

          <h2>DAV ERP</h2>

          <p>
            DAV Public School
          </p>

          <small>
            Session : 2026-27
          </small>

        </div>


        {/* =================================================
            MENU
        ================================================= */}

        <nav className="menu">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Link
            to="/admin"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <LayoutDashboard size={20} />

              <span>
                Dashboard
              </span>

            </div>
          </Link>


          {/* =================================================
              STUDENTS
          ================================================= */}

          <div className="students-menu">

            {/* Students Main Button */}

            <button
              type="button"
              className="students-main-link"
              onClick={() =>
                setStudentsOpen(
                  (previous) => !previous
                )
              }
            >

              <div className="menu-item students-menu-item">

                <GraduationCap size={20} />

                <span>
                  Students
                </span>

                <span className="students-arrow">

                  {studentsOpen ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}

                </span>

              </div>

            </button>


            {/* =================================================
                STUDENTS SUBMENU
            ================================================= */}

            {studentsOpen && (
              <div className="students-submenu">

                {/* Student List */}

                <Link
  to="/admin/students/list"
  className="students-submenu-link"
  onClick={onClose}
>
                  <span>📋</span>
                  <span>
                    Student List
                  </span>
                </Link>


                {/* Student Excel Upload */}

                <Link
                  to="/admin/students/upload"
                  className="students-submenu-link"
                  onClick={onClose}
                >
                  <span>📤</span>
                  <span>
                    Student Excel Upload
                  </span>
                </Link>

              </div>
            )}

          </div>


          {/* =================================================
              TEACHERS
          ================================================= */}

          <Link
            to="/admin/teachers"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <Users size={20} />

              <span>
                Teachers
              </span>

            </div>
          </Link>


          {/* =================================================
              PARENTS
          ================================================= */}

          <Link
            to="/parent/dashboard"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <UserRound size={20} />

              <span>
                Parents
              </span>

            </div>
          </Link>


          {/* =================================================
              MASTERS
          ================================================= */}

          <Link
            to="/admin/master"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <School size={20} />

              <span>
                Masters
              </span>

            </div>
          </Link>


          {/* =================================================
              ATTENDANCE
          ================================================= */}

          <Link
            to="#"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <ClipboardCheck size={20} />

              <span>
                Attendance
              </span>

            </div>
          </Link>


          {/* =================================================
              HOMEWORK
          ================================================= */}

          <Link
            to="#"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <BookOpen size={20} />

              <span>
                Homework
              </span>

            </div>
          </Link>


          {/* =================================================
              RESULTS
          ================================================= */}

          <Link
            to="#"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <FileBarChart size={20} />

              <span>
                Results
              </span>

            </div>
          </Link>


          {/* =================================================
              FEES
          ================================================= */}

          <Link
            to="#"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <IndianRupee size={20} />

              <span>
                Fees
              </span>

            </div>
          </Link>


          {/* =================================================
              NOTICES
          ================================================= */}

          <Link
            to="/admin/notices/add"
            className="menu-link"
            onClick={onClose}
          >
            <div className="menu-item">

              <Bell size={20} />

              <span>
                Notices
              </span>

            </div>
          </Link>
          {/* =================================================
    PARENT MESSAGES
================================================= */}

<Link
  to="/admin/parent-messages"
  className="menu-link"
  onClick={onClose}
>
  <div className="menu-item">

    <MessageSquare size={20} />

    <span>
      Parent Messages
    </span>

  </div>
</Link>


          {/* =================================================
    LOGOUT
================================================= */}

<button
  type="button"
  className="menu-link"
  onClick={() => {
    // Clear active login session
    localStorage.removeItem("auth_token");

    // Clear saved role sessions
    localStorage.removeItem("admin");
    localStorage.removeItem("teacher");
    localStorage.removeItem("parent");

    // Keep remembered_user_id so ID can still be autofilled
    onClose();

    // Go to login page
    window.location.href = "/";
  }}
>
  <div className="menu-item">

    <LogOut size={20} />

    <span>
      Logout
    </span>

  </div>
</button>

        </nav>

      </aside>
    </>
  );
}