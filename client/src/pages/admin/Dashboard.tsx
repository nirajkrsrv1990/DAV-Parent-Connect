import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import DashboardCard from "../../components/dashboard/DashboardCard";
import QuickActions from "../../components/dashboard/QuickActions";

import "./Dashboard.css";

export default function Dashboard() {
  return (
    <>
      <Sidebar />
      <Header />

      <main className="dashboard-content">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="cards">
          <DashboardCard title="Students" value="0" color="#1565C0" />
          <DashboardCard title="Teachers" value="0" color="#43A047" />
          <DashboardCard title="Parents" value="0" color="#8E24AA" />
          <DashboardCard title="Notices" value="0" color="#FB8C00" />
        </div>

        <div className="dashboard-grid">

          <div className="recent-activities">
            <h2>Recent Activities</h2>

            <div className="activity-item">
              No recent activity found.
            </div>

            <div className="activity-item">
              Database not connected yet.
            </div>

            <div className="activity-item">
              System is ready.
            </div>
          </div>

          <QuickActions />

        </div>
      </main>
    </>
  );
}