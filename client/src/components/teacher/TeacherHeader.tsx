import { Menu, UserCircle } from "lucide-react";
import "./TeacherHeader.css";

type TeacherHeaderProps = {
  onMenuClick?: () => void;
};

export default function TeacherHeader({ onMenuClick }: TeacherHeaderProps) {
  return (
    <header className="teacher-header">
      <div className="teacher-header-left">
        <button
          className="teacher-menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} />
        </button>

        <div className="teacher-school-info">
          <h2>DAV PUBLIC SCHOOL</h2>
          <p>Hansraj Nagar, Admapur, Sasaram</p>
        </div>
      </div>

      <div className="teacher-header-right">
        <UserCircle size={32} />
        <div className="teacher-profile-info">
          <strong>Teacher Portal</strong>
          <p>Session : 2026-27</p>
        </div>
      </div>
    </header>
  );
}