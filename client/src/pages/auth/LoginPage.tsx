import "./LoginPage.css";
import logo from "@/assets/logo/dav_logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function LoginPage() {
  const navigate = useNavigate();
    useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) return;

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      // Token expired
      if (
        payload.exp &&
        payload.exp * 1000 < Date.now()
      ) {
        localStorage.removeItem("auth_token");
        return;
      }

      // Automatically open correct dashboard
      if (payload.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (payload.role === "teacher") {
        navigate("/teacher", { replace: true });
      } else if (payload.role === "parent") {
        navigate("/parent/dashboard", { replace: true });
      }
    } catch (error) {
      console.error(
        "Invalid authentication token:",
        error
      );

      localStorage.removeItem("auth_token");
    }
  }, [navigate]);

  // Initialize state directly from localStorage to avoid useEffect setState error
  const [userId, setUserId] = useState(() => localStorage.getItem("remembered_user_id") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("remembered_user_id"));
  const [loading, setLoading] = useState(false);

  // ==============================
  // SAVE REMEMBER ME
  // ==============================
  const saveRememberMe = () => {
    if (rememberMe) {
      localStorage.setItem("remembered_user_id", userId);
    } else {
      localStorage.removeItem("remembered_user_id");
    }
  };

  // ==============================
  // LOGIN FUNCTION
  // ==============================
  const handleLogin = async () => {
    if (!userId || !password) {
      alert("Please enter ID and Password");
      return;
    }

    setLoading(true);

    try {
      console.log("API URL:", API_BASE_URL);

      const loginId = userId.trim();

      // ==============================
      // TEACHER LOGIN
      // All Teacher IDs start with DAVT
      // ==============================
      if (loginId.toUpperCase().startsWith("DAVT")) {
        const response = await fetch(`${API_BASE_URL}/teachers/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacher_id: loginId,
            password,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
  saveRememberMe();

  localStorage.setItem(
    "teacher",
    JSON.stringify(result.teacher)
  );

  if (result.token) {
    localStorage.setItem(
      "auth_token",
      result.token
    );
  }

  navigate("/teacher");
  return;
}

        alert(result.message || "Invalid Teacher ID or Password");
        return;
      }

      // ==============================
      // ADMIN LOGIN
      // ==============================
      try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  teacher_id: loginId,
  password,
  rememberMe,
}),
        });

        const result = await response.json();

        if (response.ok && result.success) {
  saveRememberMe();

  localStorage.setItem(
    "admin",
    JSON.stringify(result.admin)
  );

  if (result.token) {
    localStorage.setItem(
      "auth_token",
      result.token
    );
  }

  navigate("/admin");
  return;
}
      } catch (error) {
        console.log("Admin login request failed", error);
      }

      // ==============================
      // PARENT LOGIN
      // ==============================
      try {
        const response = await fetch(`${API_BASE_URL}/parents/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginId,
            password,
            rememberMe,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
  saveRememberMe();

  localStorage.setItem(
    "parent",
    JSON.stringify(result.parent)
  );

  if (result.token) {
    localStorage.setItem(
      "auth_token",
      result.token
    );
  }
  navigate("/parent/dashboard");
  return;
}
      } catch (error) {
        console.log("Parent login request failed", error);
      }

      alert("Invalid ID or Password");

    } catch (error) {
      console.error(error);
      alert("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-card">
        {/* DAV LOGO */}
        <img src={logo} alt="DAV Logo" className="logo" />

        {/* SCHOOL DETAILS */}
        <h1>DAV PUBLIC SCHOOL</h1>
        <h3>Hansraj Nagar, Admapur, Sasaram</h3>
        <p className="managed">Managed By DAV CMC, New Delhi</p>

        <div className="session">Session : 2026–27</div>

        <div className="divider"></div>

        {/* LOGIN FORM */}
        <div className="login-form">
          {/* USER ID */}
          <input
  type="text"
  name="username"
  autoComplete="username"
  placeholder="Enter ID / Email"
  value={userId}
  onChange={(e) => setUserId(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  }}
/>

          {/* PASSWORD WITH EYE ICON */}
          <div className="password-box">
            <input
  type={showPassword ? "text" : "password"}
  name="password"
  autoComplete="current-password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  }}
/>

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* OPTIONS */}
          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>

            <button
              type="button"
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="button"
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          {/* REGISTER */}
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <span style={{ color: "#fff", fontSize: "14px" }}>
              Don't have an account?
            </span>

            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#ffcc00",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "underline",
                marginLeft: "5px",
              }}
              onClick={() => navigate("/parent/signup")}
            >
              Register
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <p>Designed & Developed by</p>
          <strong>IT Department</strong>
          <p>DAV Public School, Sasaram</p>
        </div>
      </div>
    </div>
  );
}