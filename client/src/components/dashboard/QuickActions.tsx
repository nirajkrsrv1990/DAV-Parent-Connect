import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>

      {/* 1. Add Student */}
      <button
        type="button"
        onClick={() => {
          console.log("Navigating to Add Student");
          navigate("/admin/students/upload"); // Change route if needed
        }}
      >
        ➕ Add Student
      </button>

      {/* 2. Add Teacher */}
      <button
        type="button"
        onClick={() => {
          console.log("Navigating to Add Teacher");
          navigate("/admin/teachers/add");
        }}
      >
        ➕ Add Teacher
      </button>

      {/* 3. Add Notice */}
      <button
        type="button"
        onClick={() => {
          console.log("Navigating to Add Notice");
          navigate("/admin/notices/add");
        }}
      >
        📢 Add Notice
      </button>
    </div>
  );
}