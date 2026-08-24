import { useNavigate } from "react-router-dom";

export default function ParentResults() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          padding: "20px",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/parent/dashboard")}
          style={{
            background: "#1e293b",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 18px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            color: "#0f172a",
          }}
        >
          Marks
        </h1>
      </div>

      {/* Coming Soon */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "50px 30px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "20px",
            }}
          >
            ⭐
          </div>

          <h2
            style={{
              margin: "0 0 12px",
              color: "#0F4C81",
              fontSize: "28px",
            }}
          >
            Coming Soon
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "16px",
              lineHeight: 1.6,
            }}
          >
            Marks and Results feature will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}