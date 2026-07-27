import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

export default function QuickActions() {

  const navigate = useNavigate();

  return (

    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <button
        onClick={() => navigate("/admin/students/upload")}
      >
        ➕ Upload Students
      </button>

      <button
        onClick={() => navigate("/admin/teachers/add")}
      >
        ➕ Add Teacher
      </button>

      <button
        onClick={() => navigate("/parent/signup")}
      >
        ➕ Add Parent
      </button>

      <button
        onClick={() => alert("Notice Module Coming Next")}
      >
        📢 Upload Notice
      </button>

    </div>

  );

}