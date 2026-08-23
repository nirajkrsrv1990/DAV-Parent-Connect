import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentDashboard.css";
import {
  API_BASE_URL,
  HOMEWORK_FILE_BASE_URL,
} from "@/config/api";

type ViewerState = {
  type: "image" | "pdf";
  url: string;
  title: string;
} | null;

export default function ParentHomework() {
  const navigate = useNavigate();

  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<ViewerState>(null);

  useEffect(() => {
    const parentData = localStorage.getItem("parent");

    if (!parentData) {
      navigate("/parent/login");
      return;
    }

    try {
      const parent = JSON.parse(parentData);
      fetchParentHomework(parent.admission_no);
    } catch (err) {
      console.error("Invalid parent data:", err);
      navigate("/parent/login");
    }
  }, [navigate]);

  const fetchParentHomework = async (admissionNo: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/homework/student/${admissionNo}`
      );

      const result = await response.json();

      if (result.success) {
        setHomeworkList(result.homework || []);
      }
    } catch (err) {
      console.error("Error fetching homework:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FILE URL
  // ==============================
  const getFileUrl = (filePath: string) => {
    if (!filePath) return "";

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    return `${HOMEWORK_FILE_BASE_URL}${filePath}`;
  };

  // ==============================
  // OPEN IMAGE
  // ==============================
  const openImage = (filePath: string) => {
    setViewer({
      type: "image",
      url: getFileUrl(filePath),
      title: "Homework Image",
    });
  };

  // ==============================
  // OPEN PDF
  // ==============================
  const openPdf = (filePath: string) => {
    setViewer({
      type: "pdf",
      url: getFileUrl(filePath),
      title: "Homework PDF",
    });
  };

  // ==============================
  // CLOSE VIEWER
  // ==============================
  const closeViewer = () => {
    setViewer(null);
  };

  // ==============================
  // DOWNLOAD PDF
  // ==============================
  const downloadPdf = async (filePath: string) => {
    const url = getFileUrl(filePath);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;

      const fileName =
        filePath.split("/").pop() || "homework.pdf";

      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download error:", err);

      // Fallback for Android/WebView
      window.open(url, "_system");
    }
  };

  // ==============================
  // VIEWER
  // ==============================
  if (viewer) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Viewer Header */}
        <div
          style={{
            height: "60px",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 15px",
            background: "#ffffff",
            borderBottom: "1px solid #cbd5e1",
          }}
        >
          <button
            type="button"
            onClick={closeViewer}
            style={{
              border: "none",
              background: "#1e293b",
              color: "#ffffff",
              padding: "8px 15px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>

          <strong
            style={{
              color: "#1e293b",
              fontSize: "16px",
            }}
          >
            {viewer.title}
          </strong>

          {viewer.type === "pdf" ? (
            <button
              type="button"
              onClick={() => downloadPdf(viewer.url)}
              style={{
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                padding: "8px 13px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Download
            </button>
          ) : (
            <div style={{ width: "80px" }} />
          )}
        </div>

        {/* Viewer Content */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "15px",
            overflow: "auto",
          }}
        >
          {viewer.type === "image" ? (
            <img
              src={viewer.url}
              alt="Homework"
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "calc(100vh - 100px)",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: "6px",
              }}
            />
          ) : (
            <iframe
              src={viewer.url}
              title="Homework PDF"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "400px",
                border: "none",
                background: "#ffffff",
                borderRadius: "6px",
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="parent-dashboard"
      style={{
        padding: "20px",
      }}
    >
      {/* ============================
          PAGE HEADER
      ============================ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          gap: "15px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            background: "#1e293b",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: "22px",
          }}
        >
          Assigned Homework
        </h1>
      </div>

      {/* ============================
          LOADING
      ============================ */}
      {loading ? (
        <p>Loading homework...</p>
      ) : homeworkList.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "30px",
            textAlign: "center",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >
            No homework assigned yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {homeworkList.map((hw: any, index: number) => (
            <div
              key={hw.id ?? index}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow:
                  "0 4px 6px rgba(0,0,0,0.05)",
              }}
            >
              {/* Subject + Due Date */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {hw.subject}
                </span>

                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Due Date: {hw.due_date}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  color: "#334155",
                  margin: "10px 0",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {hw.description ||
                  "No description provided."}
              </p>

              {/* Attachments */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                  flexWrap: "wrap",
                }}
              >
                {hw.pdf_url && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        openPdf(hw.pdf_url)
                      }
                      style={{
                        border: "none",
                        background: "#2563eb",
                        color: "#ffffff",
                        padding: "9px 13px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      📄 View PDF
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadPdf(hw.pdf_url)
                      }
                      style={{
                        border: "1px solid #2563eb",
                        background: "#ffffff",
                        color: "#2563eb",
                        padding: "9px 13px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      ⬇ Download PDF
                    </button>
                  </>
                )}

                {hw.image_url && (
                  <button
                    type="button"
                    onClick={() =>
                      openImage(hw.image_url)
                    }
                    style={{
                      border: "none",
                      background: "#16a34a",
                      color: "#ffffff",
                      padding: "9px 13px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    🖼 View Image
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}