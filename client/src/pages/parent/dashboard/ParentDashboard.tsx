import "./ParentDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo/dav_logo.png";

export default function ParentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const parentData = localStorage.getItem("parent");

    if (!parentData) {
      navigate("/parent/login");
      return;
    }

    const parent = JSON.parse(parentData);

    // 1. Load Student Profile Details
    loadStudent(parent.admission_no);

    // 2. Load Attendance % & Daily Notifications Data
    loadDashboardData(parent.admission_no);
  }, []);

  /* Fetch Student Profile Info */
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

  /* Fetch Dynamic Attendance % and Notifications */
  const loadDashboardData = async (admissionNo: string) => {
    try {
      const response = await fetch(`/api/parent/dashboard/${admissionNo}`);
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
        <header className="parent-header">
          <div>
            <h1>Welcome, Parent</h1>
            <p>DAV PUBLIC SCHOOL, Sasaram</p>
          </div>
        </header>

        {/* Real-time Notifications / Alerts Section */}
        {notifications.length > 0 && (
          <section className="notifications-section" style={{ marginBottom: "20px" }}>
            <div style={{ padding: "12px", backgroundColor: "#fff3cd", borderLeft: "5px solid #ffc107", borderRadius: "5px" }}>
              <strong>🔔 Recent Notification:</strong> {notifications[0]?.message || notifications[0]?.title}
            </div>
          </section>
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
            {/* Dynamic Attendance Percentage */}
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