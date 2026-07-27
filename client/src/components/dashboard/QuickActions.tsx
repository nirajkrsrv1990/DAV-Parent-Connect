import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

export default function QuickActions() {

  const navigate = useNavigate();

  return (
    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <button
        style={{ background: "red", color: "white" }}
        onClick={() => {
          alert("WORKING");
          console.log("WORKING");
        }}
      >
        TEST BUTTON
      </button>

    </div>
  );

}