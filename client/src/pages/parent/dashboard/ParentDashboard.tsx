import "./ParentDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo/dav_logo.png";

export default function ParentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // NEW STATE FOR MOBILE MENU

  useEffect(() => {
    const parentData = localStorage.getItem("parent");

    if (!parentData) {
      navigate("/parent/login");
      return;
    }

    const parent = JSON.parse(parentData);

    loadStudent(parent.admission_no);
    loadDashboardData(parent.admission_no);
  }, []);

  const loadStudent = async (admissionNo: string) => {
    try {
      const response = await fetch(`/api/students/admission/${admissionNo}`);
      const result = await response.json();

      if (result.success) {
        setStudent(result.student);
      }
    } catch (err) {
      console.log("Error loading student:", err);
    }
  };

  const loadDashboardData = async (admissionNo: string) => {
    try {
      const response = await fetch(`/api/parents/dashboard/${admissionNo}`);
      const result = await response.json();

      if (result.success) {
        setAttendancePercentage(result.attendancePercentage);
        setNotifications(result.notifications || []);
      }
    } catch (err) {
      console.log("Error loading dashboard data:", err);
    }
  };

  // Helper for closing sidebar on menu click (mobile)
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`parent-dashboard ${isSidebarOpen ? "sidebar-open" : ""}`}>
      
      {/* MOBILE NAV (HEADER) - Appears on < 992px */}
      <div className="parent-mobile-nav">
        <div className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰
        </div>
        <img src={logo} alt="DAV Logo" className="parent-logo-mobile" />
        <span className="school-name-mobile">DAV Public School</span>
      </div>

      {/* PARENT SIDEBAR - With dynamic class */}
      <aside className={`parent-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="DAV Logo" className="parent-logo" />
          <h2>DAV Parent</h2>
          <p>Session : 2026-27</p>
          <div className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>×</div> {/* Close Button on mobile sidebar */}
        </div>

        <nav>
          <a href="#" onClick={closeSidebarOnMobile}>🏠 Dashboard</a>
          <a href="#" onClick={closeSidebarOnMobile}>👨‍🎓 Student Profile</a>
          <a href="#" onClick={closeSidebarOnMobile}>📅 Attendance</a>
          <a href="#" onClick={closeSidebarOnMobile}>📚 Homework</a>
          <a href="#" onClick={closeSidebarOnMobile}>📝 Results</a>
          <a href="#" onClick={closeSidebarOnMobile}>📢 Notices</a>
          <a href="#" onClick={closeSidebarOnMobile}>💰 Fees</a>
          <a href="#" onClick={closeSidebarOnMobile}>📖 Timetable</a>
          <a href="#" onClick={closeSidebarOnMobile}>📂 Downloads</a>
          <a
            href="/"
            onClick={() => {
              localStorage.removeItem("parent");
            }}
          >
            🚪 Logout
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="parent-content">
        
        {/* HEADER WITH NOTIFICATION BELL (Keep this similar) */}
        <header className="parent-header">
          <div>
            <h1>Welcome, Parent</h1>
            <p>DAV PUBLIC SCHOOL, Sasaram</p>
          </div>

          <div style={{ position: "relative", cursor: "pointer" }}>
            <div 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              style={{ fontSize: "24px", padding: "10px", position: "relative" }}
            >
              🔔
              {notifications.length > 0 && (
                <span className="notif-badge">
                  {notifications.length}
                </span>
              )}
            </div>

            {showNotificationDropdown && (
              <div className="notif-dropdown">
                {/* ... dropdown content same as before ... */}
              </div>
            )}
          </div>
        </header>

        {/* TOP ALERT BANNER (If any notification) */}
        {notifications.length > 0 && (
          <div className="parent-notification-banner">
            <strong>🔔 Notification:</strong> {notifications[0].message}
          </div>
        )}

        {/* STUDENT INFO CARD */}
        <section className="student-card card">
          <h2>Student Information</h2>
          <div className="student-grid">
            <div>
              <strong>Student Name</strong>
              <p>{student?.student_name || "AASHI"}</p> {/* Fallback for testing */}
            </div>
            <div>
              <strong>Admission No.</strong>
              <p>{student?.admission_no || "10703"}</p>
            </div>
            <div>
              <strong>Class</strong>
              <p>{student?.class || "VII"}</p>
            </div>
            <div>
              <strong>Section</strong>
              <p>{student?.section || "A"}</p>
            </div>
            <div>
              <strong>Session</strong>
              <p>2026-27</p>
            </div>
          </div>
        </section>

        {/* DASHBOARD SUMMARY GRID */}
        <section className="dashboard-grid">
          <div className="card">
            <h3>Attendance</h3>
            <p>{attendancePercentage}%</p>
          </div>

          <div className="card">
            <h3>Homework</h3>
            <p>0 Pending</p>
          </div>

          <div className="card">
            <h3>Results</h3>
            <p>Not Published</p>
          </div>

          <div className="card">
            <h3>Notices</h3>
            <p>{notifications.length} New</p>
          </div>

          <div className="card">
            <h3>Fees</h3>
            <p>No Due</p>
          </div>

          <div className="card">
            <h3>Downloads</h3>
            <p>Coming Soon</p>
          </div>
        </section>
      </div>
    </div>
  );
}