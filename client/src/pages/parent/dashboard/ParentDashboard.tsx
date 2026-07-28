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

  return (
    <div className="parent-dashboard">
      <aside className="parent-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="DAV Logo" className="parent-logo" />
          <h2>DAV Parent</h2>
          <p>Session : 2026-27</p>
        </div>

        <nav>
          <a href="#">🏠 Dashboard</a>
          <a href="#">👨‍🎓 Student Profile</a>
          <a href="#">📅 Attendance</a>
          <a href="#">📚 Homework</a>
          <a href="#">📝 Results</a>
          <a href="#">📢 Notices</a>
          <a href="#">💰 Fees</a>
          <a href="#">📖 Timetable</a>
          <a href="#">📂 Downloads</a>
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

      <div className="parent-content">
        {/* HEADER WITH NOTIFICATION BELL */}
        <header className="parent-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <div>
            <h1>Welcome, Parent</h1>
            <p>DAV PUBLIC SCHOOL, Sasaram</p>
          </div>

          {/* NOTIFICATION BELL ICON */}
          <div style={{ position: "relative", cursor: "pointer" }}>
            <div 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              style={{ fontSize: "24px", padding: "10px", position: "relative" }}
            >
              🔔
              {notifications.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  fontSize: "12px",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontWeight: "bold"
                }}>
                  {notifications.length}
                </span>
              )}
            </div>

            {/* DROPDOWN MENU */}
            {showNotificationDropdown && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "45px",
                width: "300px",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                zIndex: 1000,
                padding: "10px"
              }}>
                <h4 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Notifications</h4>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: "14px", color: "#666" }}>No new notifications</p>
                ) : (
                  notifications.map((notif: any, index: number) => (
                    <div key={index} style={{ padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: "13px" }}>
                      <strong style={{ color: "#d9534f" }}>{notif.title}</strong>
                      <p style={{ margin: "3px 0 0 0", color: "#333" }}>{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </header>

        {/* TOP ALERT BANNER (If any notification) */}
        {notifications.length > 0 && (
          <div style={{
            margin: "15px 0",
            padding: "12px 16px",
            backgroundColor: "#fff3cd",
            borderLeft: "5px solid #ffc107",
            borderRadius: "4px",
            color: "#856404"
          }}>
            <strong>🔔 Notification:</strong> {notifications[0].message}
          </div>
        )}

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