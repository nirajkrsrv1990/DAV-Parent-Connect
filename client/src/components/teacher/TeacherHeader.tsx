import "./TeacherHeader.css";
import logo from "../../assets/logo/dav_logo.png";

export default function TeacherHeader() {
  return (
    <header className="teacher-header">

      <div className="teacher-header-left">

        <img
          src={logo}
          alt="DAV Logo"
          className="teacher-header-logo"
        />

        <div>

          <h2>DAV PUBLIC SCHOOL</h2>

          <p>Hansraj Nagar, Admapur, Sasaram</p>

        </div>

      </div>

      <div className="teacher-header-right">

        <strong>Teacher Portal</strong>

        <span>Session : 2026-27</span>

      </div>

    </header>
  );
}