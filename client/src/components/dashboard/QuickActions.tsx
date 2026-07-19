import "./QuickActions.css";

export default function QuickActions() {
  const actions = [
    "➕ Add Student",
    "➕ Add Teacher",
    "➕ Add Parent",
    "📢 Upload Notice",
  ];

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>

      {actions.map((action) => (
        <button key={action}>{action}</button>
      ))}
    </div>
  );
}