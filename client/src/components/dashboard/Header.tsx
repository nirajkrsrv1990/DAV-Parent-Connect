import { Bell, Menu, UserCircle } from "lucide-react";
import "./Header.css";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="dashboard-header">

      <div className="header-left">

        <button
          className="menu-btn"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        <div className="school-info">
          <h2>DAV PUBLIC SCHOOL</h2>
          <p>Hansraj Nagar, Admapur, Sasaram</p>
        </div>

      </div>

      <div className="header-right">

        <div className="notification">
          <Bell size={22} />
        </div>

        <div className="profile">
          <UserCircle size={34} />

          <div className="profile-info">
            <strong>Administrator</strong>
            <p>Session : 2026-27</p>
          </div>

        </div>

      </div>

    </header>
  );
}