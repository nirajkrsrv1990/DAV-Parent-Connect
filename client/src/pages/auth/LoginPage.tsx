import "./LoginPage.css";
import logo from "@/assets/logo/dav_logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "@/config/api";

type Role = "admin" | "teacher" | "parent";

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const adminLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("admin", JSON.stringify(result.admin));
        navigate("/admin");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  const teacherLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacher_id: email, password }),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("teacher", JSON.stringify(result.teacher));
        navigate("/teacher");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  // Parent Login Function add kar diya gaya hai
  const parentLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/parents/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("parent", JSON.stringify(result.parent));
        navigate("/parent/dashboard");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>
      <div className="login-card">
        <img src={logo} alt="DAV Logo" className="logo" />
        <h1>DAV PUBLIC SCHOOL</h1>
        <h3>Hansraj Nagar, Admapur, Sasaram</h3>
        <p className="managed">Managed By DAV CMC, New Delhi</p>
        <div className="session">Session : 2026–27</div>

        <div className="role-buttons">
          <button
            className={role === "admin" ? "role-btn admin active-role" : "role-btn admin"}
            onClick={() => setRole("admin")}
          >
            👨‍💼 Admin Login
          </button>

          <button
            className={role === "teacher" ? "role-btn teacher active-role" : "role-btn teacher"}
            onClick={() => setRole("teacher")}
          >
            👨‍🏫 Teacher Login
          </button>

          <button
            className={role === "parent" ? "role-btn parent active-role" : "role-btn parent"}
            onClick={() => setRole("parent")}
          >
            👨‍👩‍👧 Parent Login
          </button>
        </div>

        <div className="divider"></div>

        <div className="login-form">
          <input
            type="text"
            placeholder={
              role === "admin"
                ? "Admin Email"
                : role === "teacher"
                ? "Teacher ID"
                : "Parent Email"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button
            className="login-dir" // ya jo bhi aapki class hai
            onClick={() => {
              if (role === "admin") {
                adminLogin();
              } else if (role === "teacher") {
                teacherLogin();
              } else {
                parentLogin();
              }
            }}
          >
            LOGIN
          </button>

          {/* Yeh raha Parent Registration Link jo sirf Parent role select hone par dikhega */}
          {role === "parent" && (
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <span style={{ color: "#fff", fontSize: "14px" }}>Don't have an account? </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffcc00",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                  display: "inline",
                  padding: 0
                }}
                onClick={() => navigate("/parent/signup")}
              >
                Register Here
              </button>
            </div>
          )}
        </div>

        <div className="footer">
          <p>Designed & Developed by</p>
          <strong>IT Department</strong>
          <p>DAV Public School, Sasaram</p>
        </div>
      </div>
    </div>
  );
}