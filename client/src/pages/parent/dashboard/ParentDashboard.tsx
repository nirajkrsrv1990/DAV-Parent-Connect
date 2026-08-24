import "./ParentDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo/dav_logo.png";

export default function ParentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [homeworkCount, setHomeworkCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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
        const fetchedNotifications = result.notifications || [];
        setNotifications(fetchedNotifications);

        // Sirf un notifications ko count karein jo read nahi hui hain (is_read === false)
        const pendingNotifications = fetchedNotifications.filter(
          (n: any) => n.is_read === false || n.is_read === 0
        );

        // Agar aapko pending homework count backend se mil raha hai toh theek, warna unread notifications se map karein
        setHomeworkCount(result.homeworkCount !== undefined ? result.homeworkCount : pendingNotifications.filter((n: any) => n.type === "homework").length);
      }
    } catch (err) {
      console.log("Error loading dashboard data:", err);
    }
  };

  // Notification ko read mark karne ka function
  const handleMarkAsRead = async () => {
    const parentData = localStorage.getItem("parent");
    if (!parentData) return;
    const parent = JSON.parse(parentData);

    // Dropdown toggle karein
    const nextState = !showNotificationDropdown;
    setShowNotificationDropdown(nextState);

    // Agar dropdown khul raha hai aur notifications hain, toh backend par read mark bhej dein
    if (nextState && notifications.length > 0) {
      try {
        await fetch(`/api/parents/notifications/read/${parent.admission_no}`, {
          method: "PUT",
        });
        
        // UI par notifications ki is_read ko true kar dein taaki count 0 ho jaye
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true }))
        );
      } catch (err) {
        console.log("Error marking notifications as read:", err);
      }
    }
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  };

  // Unread notifications ki count nikalne ke liye
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  return (
    <div className="parent-dashboard">
      
      {/* MOBILE TOP BAR */}
      <div className="parent-mobile-nav">
        <div className="hamburger" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src={logo} alt="DAV Logo" className="parent-logo-mobile" />
          <span className="school-name-mobile">DAV Parent</span>
        </div>
        <div style={{ width: "24px" }}></div>
      </div>

      {/* DRAWER SIDEBAR */}
      <aside className={`parent-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>×</div>
          <img src={logo} alt="DAV Logo" className="parent-logo" />
          <h2>DAV Parent</h2>
          <p>Session : 2026-27</p>
        </div>

        <nav>
          <a href="#" onClick={() => { navigate("/parent/dashboard"); closeSidebarOnMobile(); }}>🏠 Dashboard</a>
          <a href="#" onClick={closeSidebarOnMobile}>👨‍🎓 Student Profile</a>
          <a href="#" onClick={closeSidebarOnMobile}>📅 Attendance</a>
          <a href="#" onClick={() => { navigate("/parent/homework"); closeSidebarOnMobile(); }}>📚 Homework</a>
          <a href="#" onClick={closeSidebarOnMobile}>📝 Results</a>
          <a href="#" onClick={() => { navigate("/parent/notices"); closeSidebarOnMobile(); }}>📢 Notices</a>
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
        
        {/* HEADER WITH NOTIFICATION BELL */}
        <header className="parent-header">
          <div>
            <h1>Welcome, Parent</h1>
            <p>DAV PUBLIC SCHOOL, Sasaram</p>
          </div>

          <div style={{ position: "relative", cursor: "pointer" }}>
            <div 
              onClick={handleMarkAsRead}
              style={{ fontSize: "22px", padding: "8px", position: "relative" }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  fontSize: "11px",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontWeight: "bold"
                }}>
                  {unreadCount}
                </span>
              )}
            </div>

            {/* DROPDOWN MENU */}
            {showNotificationDropdown && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "40px",
                width: "280px",
                backgroundColor: "#fff",
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                zIndex: 1000,
                padding: "12px"
              }}>
                <h4 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px", fontSize: "14px" }}>
                  Notifications
                </h4>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>No new notifications</p>
                ) : (
                  notifications.map((notif: any, index: number) => (
                    <div key={index} style={{ padding: "8px 0", borderBottom: "1px solid #f8fafc", fontSize: "12px" }}>
                      <strong style={{ color: "#ef4444" }}>{notif.title}</strong>
                      <p style={{ margin: "2px 0 0 0", color: "#334155" }}>{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </header>

        {/* TOP ALERT BANNER */}
        {unreadCount > 0 && notifications.length > 0 && (
          <div className="parent-notification-banner">
            <strong>🔔 Notification:</strong> {notifications[0].message}
          </div>
        )}

        {/* STUDENT INFO CARD */}
        <section className="student-card">
          <h2>Student Information</h2>
          <div className="student-grid">
            <div>
              <strong>Student Name</strong>
              <p>{student?.student_name}</p>
            </div>
            <div>
              <strong>Admission No.</strong>
              <p>{student?.admission_no}</p>
            </div>
            <div>
              <strong>Class</strong>
              <p>{student?.class}</p>
            </div>
            <div>
              <strong>Section</strong>
              <p>{student?.section}</p>
            </div>
            <div>
              <strong>Session</strong>
              <p>2026-27</p>
            </div>
          </div>
        </section>

        {/* PARENT APP MENU GRID */}
<section className="parent-menu-grid">

  <div
    className="parent-menu-item"
    onClick={() => navigate("/parent/attendance")}
  >
    <div className="menu-icon">📅</div>
    <div className="menu-title">Attendance</div>
  </div>

  <div
    className="parent-menu-item"
    onClick={() => navigate("/parent/homework")}
  >
    <div className="menu-icon">📚</div>
    <div className="menu-title">Homework</div>
  </div>

  <div
    className="parent-menu-item"
    onClick={() => navigate("/parent/notices")}
  >
    <div className="menu-icon">📢</div>
    <div className="menu-title">Announcement</div>
  </div>

  <div
    className="parent-menu-item"
    onClick={() => navigate("/parent/results")}
  >
    <div className="menu-icon">⭐</div>
    <div className="menu-title">Marks</div>
  </div>

  <div
    className="parent-menu-item"
    onClick={() => navigate("/parent/homework")}
  >
    <div className="menu-icon">📖</div>
    <div className="menu-title">E-Content</div>
  </div>

  <div
    className="parent-menu-item"
    onClick={() => window.open("https://davsasaram.com/osm", "_blank")}
  >
    <div className="menu-icon">💳</div>
    <div className="menu-title">Fees Payment</div>
  </div>

  <div
  className="parent-menu-item"
  onClick={() => navigate("/parent/annual-calendar")}
>
  <div className="menu-icon">📅</div>
  <div className="menu-title">Annual Calendar</div>
</div>
    

  <div className="parent-menu-item">
    <div className="menu-icon">💬</div>
    <div className="menu-title">Comments</div>
  </div>

  <div className="parent-menu-item">
    <div className="menu-icon">📍</div>
    <div className="menu-title">Bus Location</div>
  </div>

  <div
    className="parent-menu-item"
    onClick={() => navigate("/parent/notices")}
  >
    <div className="menu-icon">📋</div>
    <div className="menu-title">Notice Board</div>
  </div>

  <div className="parent-menu-item">
    <div className="menu-icon">👤</div>
    <div className="menu-title">Profile</div>
  </div>

  <div className="parent-menu-item">
    <div className="menu-icon">⚙️</div>
    <div className="menu-title">Settings</div>
  </div>

  <div className="parent-menu-item">
    <div className="menu-icon">✍️</div>
    <div className="menu-title">Write To School</div>
  </div>

  <div className="parent-menu-item">
    <div className="menu-icon">🎥</div>
    <div className="menu-title">Online Class</div>
  </div>

  <div className="parent-menu-item">
    <div className="menu-icon">📝</div>
    <div className="menu-title">Online Test</div>
  </div>

</section>

      </div>
    </div>
  );
}