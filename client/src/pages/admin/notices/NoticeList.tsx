import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

export default function NoticeList() {
  const [notices, setNotices] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Check karein ki user kahan se aaya hai (admin, teacher, ya parent)
  const isParent = location.pathname.includes("/parent");
  const isTeacher = location.pathname.includes("/teacher");
  const isAdmin = location.pathname.includes("/admin");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notices`);
      const result = await response.json();
      if (result.success) {
        setNotices(result.data || []);
      }
    } catch (err) {
      console.log("Error fetching notices:", err);
    }
  };

  const handleBack = () => {
    if (isParent) navigate("/parent/dashboard");
    else if (isTeacher) navigate("/teacher");
    else navigate("/admin");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>School Notice List</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {isAdmin && (
            <button 
              onClick={() => navigate("/admin/notices/add")}
              style={{ backgroundColor: "#0F4C81", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              + Add Notice
            </button>
          )}
          <button 
            onClick={handleBack}
            style={{ backgroundColor: "#64748b", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Dashboard
          </button>
        </div>
      </div>

      {notices.length === 0 ? (
        <p style={{ color: "#64748b" }}>No notices found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notices.map((notice, index) => (
            <div key={index} style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#0F4C81" }}>{notice.title}</h3>
              <p style={{ margin: "0 0 10px 0", color: "#334155" }}>{notice.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
                <span>Date: {notice.notice_date ? notice.notice_date.split("T")[0] : ""}</span>
                {notice.pdf_url && (
                  <a href={`${API_BASE_URL.replace("/api", "")}${notice.pdf_url}`} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontWeight: "bold" }}>
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