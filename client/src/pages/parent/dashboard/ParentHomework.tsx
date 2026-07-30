import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentDashboard.css";

export default function ParentHomework() {
  const navigate = useNavigate();
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parentData = localStorage.getItem("parent");
    if (!parentData) {
      navigate("/parent/login");
      return;
    }
    const parent = JSON.parse(parentData);
    fetchParentHomework(parent.admission_no);
  }, []);

  const fetchParentHomework = async (admissionNo: string) => {
    try {
      // Sahi API route yahan set kar diya gaya hai
      const response = await fetch(`/api/homework/student/${admissionNo}`);
      const result = await response.json();
      if (result.success) {
        setHomeworkList(result.homework || []);
      }
    } catch (err) {
      console.log("Error fetching homework:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-dashboard" style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "15px" }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ padding: "8px 16px", cursor: "pointer", background: "#1e293b", color: "#fff", border: "none", borderRadius: "6px" }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: "22px" }}>Assigned Homework</h1>
      </div>

      {loading ? (
        <p>Loading homework...</p>
      ) : homeworkList.length === 0 ? (
        <div style={{ background: "#fff", padding: "30px", textAlign: "center", borderRadius: "8px" }}>
          <p style={{ color: "#64748b", margin: 0 }}>No homework assigned yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {homeworkList.map((hw: any, index: number) => (
            <div key={index} style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                  {hw.subject}
                </span>
                <span style={{ color: "#ef4444", fontSize: "12px", fontWeight: "bold" }}>
                  Due Date: {hw.due_date}
                </span>
              </div>
              <p style={{ color: "#334155", margin: "10px 0", whiteSpace: "pre-wrap" }}>
                {hw.description || "No description provided."}
              </p>
              
              <div style={{ display: "flex", gap: "15px", marginTop: "12px" }}>
                {hw.pdf_url && (
                  <a href={hw.pdf_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600, fontSize: "13px" }}>
                    📄 View PDF
                  </a>
                )}
                {hw.image_url && (
                  <a href={hw.image_url} target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 600, fontSize: "13px" }}>
                    🖼 View Image
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