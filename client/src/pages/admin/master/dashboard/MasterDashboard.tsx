import "./MasterDashboard.css";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../../components/dashboard/Sidebar";
import Header from "../../../../components/dashboard/Header";

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
    icon: "👨‍🏫",
    route: "/admin/teacher-assignment",
}
  ];

  return (
    <>
      <Sidebar />
      <Header />

      <main className="dashboard-content">
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
      </main>
    </>
  );
}