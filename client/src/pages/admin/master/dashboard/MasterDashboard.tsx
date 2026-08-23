import "./MasterDashboard.css";
import { useNavigate } from "react-router-dom";

type MasterItem = {
  title: string;
  route: string;
  icon: string;
};

export default function MasterDashboard() {
  const navigate = useNavigate();

  const masters: MasterItem[] = [
    {
      title: "Class & Section",
      route: "/admin/master/class-section",
      icon: "🏫",
    },
    {
      title: "Subject Master",
      route: "/admin/master/subject",
      icon: "📚",
    },
    {
      title: "Exam Master",
      route: "/admin/master/exam",
      icon: "📝",
    },
    {
  title: "Marks Pattern",
  route: "/admin/master/marks-pattern",
  icon: "📊",
},
    {
      title: "House Master",
      route: "/admin/master/house",
      icon: "🏆",
    },
    {
      title: "Fee Head",
      route: "/admin/master/fee",
      icon: "💰",
    },
    {
      title: "Academic Year",
      route: "/admin/master/academic-year",
      icon: "🎓",
    },
    {
      title: "Session Master",
      route: "/admin/master/session",
      icon: "📅",
    },
    {
      title: "School Settings",
      route: "/admin/master/settings",
      icon: "⚙️",
    },
    {
      title: "Teacher Assignment",
      route: "/admin/teacher-assignment",
      icon: "👨‍🏫",
    },
  ];

  return (
    <div className="master-dashboard">

      <h1>Master Management</h1>

      <p>
        Configure all master data for DAV ERP.
      </p>

      <div className="master-grid">

        {masters.map((item) => (
          <div
            key={item.title}
            className="master-card"
            onClick={() => navigate(item.route)}
          >
            <div className="master-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>
          </div>
        ))}

      </div>

    </div>
  );
}