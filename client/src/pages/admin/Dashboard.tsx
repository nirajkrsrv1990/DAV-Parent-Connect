import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

import DashboardCard from "../../components/dashboard/DashboardCard";
import QuickActions from "../../components/dashboard/QuickActions";

import "./Dashboard.css";

type DashboardStats = {
  students: number;
  teachers: number;
  parents: number;
  notices: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    teachers: 0,
    parents: 0,
    notices: 0,
  });

  const loadDashboard = async () => {
    try {
      const res = await apiClient.get(
  "/admin/dashboard-stats"
);
console.log("Dashboard API Response:", res.data);

      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard Load Error", err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <h1 className="dashboard-title">
        Dashboard
      </h1>

      <div className="cards">

        <DashboardCard
          title="Students"
          value={String(stats.students)}
          color="#1565C0"
        />

        <DashboardCard
          title="Teachers"
          value={String(stats.teachers)}
          color="#43A047"
        />

        <DashboardCard
          title="Parents"
          value={String(stats.parents)}
          color="#8E24AA"
        />

        <DashboardCard
          title="Notices"
          value={String(stats.notices)}
          color="#FB8C00"
        />

      </div>

      <div className="dashboard-grid">

        <div className="recent-activities">

          <h2>Recent Activities</h2>

          <div className="activity-item">
            Dashboard Connected Successfully.
          </div>

          <div className="activity-item">
            PostgreSQL Database Connected.
          </div>

          <div className="activity-item">
            DAV ERP Ready.
          </div>

        </div>

        <QuickActions />

      </div>

    </>
  );
}