import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import "./ParentDashboard.css";

import {
  API_BASE_URL,
  HOMEWORK_FILE_BASE_URL,
} from "@/config/api";

type HomeworkItem = {
  id?: number;
  subject: string;
  description?: string | null;
  due_date: string;
  pdf_url?: string | null;
  image_url?: string | null;
};

type ParentData = {
  admission_no: string;
};

type HomeworkResponse = {
  success: boolean;
  homework?: HomeworkItem[];
  message?: string;
};

export default function ParentHomework() {
  const navigate = useNavigate();

  const [homeworkList, setHomeworkList] =
    useState<HomeworkItem[]>([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD HOMEWORK
  // ==========================================
  useEffect(() => {
    const parentData =
      localStorage.getItem("parent");

    if (!parentData) {
      navigate("/parent/login");
      return;
    }

    try {
      const parent: ParentData =
        JSON.parse(parentData);

      if (!parent.admission_no) {
        navigate("/parent/login");
        return;
      }

      fetchParentHomework(parent.admission_no);
    } catch (error) {
      console.error(
        "Invalid parent data:",
        error
      );

      navigate("/parent/login");
    }
  }, [navigate]);

  // ==========================================
  // FETCH HOMEWORK
  // ==========================================
  const fetchParentHomework = async (
    admissionNo: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/homework/student/${admissionNo}`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status}`
        );
      }

      const result: HomeworkResponse =
        await response.json();

      if (result.success) {
        setHomeworkList(
          result.homework ?? []
        );
      } else {
        console.error(
          result.message ||
            "Failed to fetch homework."
        );

        setHomeworkList([]);
      }
    } catch (error) {
      console.error(
        "Error fetching homework:",
        error
      );

      setHomeworkList([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILE URL
  // ==========================================
  const getFileUrl = (
    filePath: string
  ): string => {
    if (!filePath) {
      return "";
    }

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    return `${HOMEWORK_FILE_BASE_URL}${filePath}`;
  };

  // ==========================================
  // DOWNLOAD FILE
  // ==========================================
  const downloadFile = async (
    filePath: string
  ): Promise<void> => {
    const url = getFileUrl(filePath);

    if (!url) {
      alert("File not available.");
      return;
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status}`
        );
      }

      const blob = await response.blob();

      const fileName =
        filePath.split("/").pop() ||
        `download-${Date.now()}`;

      // ========================================
      // ANDROID / CAPACITOR
      // ========================================
      if (Capacitor.isNativePlatform()) {
        const base64Data =
          await blobToBase64(blob);

        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
        });

        alert(
          `Downloaded successfully:\n${fileName}`
        );

        return;
      }

      // ========================================
      // DESKTOP / NORMAL MOBILE BROWSER
      // ========================================
      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(
        "File download error:",
        error
      );

      alert(
        "Unable to download the file."
      );
    }
  };

  // ==========================================
  // BLOB → BASE64
  // ==========================================
  const blobToBase64 = (
    blob: Blob
  ): Promise<string> => {
    return new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader();

        reader.onloadend = () => {
          try {
            const result =
              reader.result;

            if (
              typeof result !== "string"
            ) {
              reject(
                new Error(
                  "Unable to convert file."
                )
              );

              return;
            }

            const base64 =
              result.split(",")[1];

            if (!base64) {
              reject(
                new Error(
                  "Base64 conversion failed."
                )
              );

              return;
            }

            resolve(base64);
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(
            new Error(
              "File reading failed."
            )
          );
        };

        reader.readAsDataURL(blob);
      }
    );
  };

  // ==========================================
  // BACK BUTTON
  // ==========================================
  const handleBack = (): void => {
    navigate(-1);
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div
      className="parent-dashboard"
      style={{
        padding: "20px",
      }}
    >
      {/* ======================================
          PAGE HEADER
      ====================================== */}
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
          onClick={handleBack}
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

      {/* ======================================
          LOADING
      ====================================== */}
      {loading ? (
        <p>
          Loading homework...
        </p>
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
          {homeworkList.map(
            (
              hw: HomeworkItem,
              index: number
            ) => (
              <div
                key={
                  hw.id ??
                  `homework-${index}`
                }
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px rgba(0,0,0,0.05)",
                }}
              >
                {/* ==================================
                    SUBJECT + DUE DATE
                ================================== */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background:
                        "#e0f2fe",
                      color: "#0369a1",
                      padding:
                        "4px 10px",
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
                    Due Date:{" "}
                    {hw.due_date}
                  </span>
                </div>

                {/* ==================================
                    DESCRIPTION
                ================================== */}
                <p
                  style={{
                    color: "#334155",
                    margin: "10px 0",
                    whiteSpace:
                      "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {hw.description ||
                    "No description provided."}
                </p>

                {/* ==================================
                    ATTACHMENTS
                ================================== */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* PDF */}
                  {hw.pdf_url && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadFile(
                          hw.pdf_url as string
                        )
                      }
                      style={{
                        border:
                          "1px solid #2563eb",
                        background:
                          "#ffffff",
                        color: "#2563eb",
                        padding:
                          "9px 13px",
                        borderRadius: "6px",
                        cursor:
                          "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      📥 Download PDF
                    </button>
                  )}

                  {/* IMAGE */}
                  {hw.image_url && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadFile(
                          hw.image_url as string
                        )
                      }
                      style={{
                        border:
                          "1px solid #16a34a",
                        background:
                          "#ffffff",
                        color: "#16a34a",
                        padding:
                          "9px 13px",
                        borderRadius: "6px",
                        cursor:
                          "pointer",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      📥 Download Image
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}