import { Bell, UserCircle } from "lucide-react";
import "./Header.css";

export default function Header() {
  return (
    <header className="dashboard-header">
      <div>
        <h2>DAV PUBLIC SCHOOL</h2>
        <p>Hansraj Nagar, Admapur, Sasaram</p>
      </div>

      <div className="header-right">
        <div className="notification">
          <Bell size={22} />
        </div>

        <div className="profile">
          <UserCircle size={36} />
          <div>
            <strong>Administrator</strong>
            <p>Session : 2026-27</p>
          </div>
        </div>
      </div>
    </header>
  );
}