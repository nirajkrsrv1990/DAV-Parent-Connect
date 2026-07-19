import "./DashboardCard.css";

type DashboardCardProps = {
  title: string;
  value: string;
  color: string;
};

export default function DashboardCard({
  title,
  value,
  color,
}: DashboardCardProps) {
  return (
    <div
      className="dashboard-card"
      style={{ borderTop: `6px solid ${color}` }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}