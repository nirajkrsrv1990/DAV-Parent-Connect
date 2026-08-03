import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ParentDashboard.css";

export default function ParentNotices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/notices");
      const result = await response.json();
      if (result.success) {
        setNotices(result.data || []);
      }
    } catch (err) {
      console.log("Error fetching notices:", err);
    }
  };

  return (
    <div className="parent-dashboard" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>School Notices</h2>
        <button 
          onClick={() => navigate("/parent/dashboard")}
          style={{ backgroundColor: "#0F4C81", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Back to Dashboard
        </button>
      </div>

      {notices.length === 0 ? (
        <p style={{ color: "#64748b" }}>No notices available.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notices.map((notice, index) => (
            <div key={index} style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#0F4C81" }}>{notice.title}</h3>
              <p style={{ margin: "0 0 10px 0", color: "#334155" }}>{notice.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                <span>Date: {notice.notice_date ? notice.notice_date.split("T")[0] : ""}</span>
                {notice.pdf_url && (
                  <a href={notice.pdf_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontWeight: "bold" }}>
                    📥 Download PDF Notice
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}