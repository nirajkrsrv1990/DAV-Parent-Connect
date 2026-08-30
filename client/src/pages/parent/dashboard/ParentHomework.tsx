import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileTransfer } from "@capacitor/file-transfer";
import "./ParentDashboard.css";

import {
  API_BASE_URL,
  HOMEWORK_FILE_BASE_URL,
} from "@/config/api";

type HomeworkItem = {
  id?: number;
  subject: string;
  description?: string | null;
  due_date?: string | null;
  pdf_url?: string | null;
  image_url?: string | null;
  created_at?: string;
};

type ParentData = {
  admission_no: string;
};

type HomeworkResponse = {
  success: boolean;
  homework?: HomeworkItem[];
  message?: string;
};

type GroupedHomework = {
  dateKey: string;
  displayDate: string;
  items: HomeworkItem[];
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
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/homework/student/${encodeURIComponent(
          admissionNo
        )}`
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
  // DATE KEY
  //
  // IMPORTANT:
  // created_at is stored as UTC.
  // We convert it to India date.
  // ==========================================
  const getIndiaDateKey = (
    dateString?: string
  ): string => {
    if (!dateString) {
      return "unknown";
    }

    try {
      const date = new Date(dateString);

      const parts = new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      ).formatToParts(date);

      const year =
        parts.find(
          (part) => part.type === "year"
        )?.value || "";

      const month =
        parts.find(
          (part) => part.type === "month"
        )?.value || "";

      const day =
        parts.find(
          (part) => part.type === "day"
        )?.value || "";

      return `${year}-${month}-${day}`;
    } catch {
      return "unknown";
    }
  };

  // ==========================================
  // DISPLAY DATE
  // DD/MM/YYYY
  // ==========================================
  const formatDisplayDate = (
    dateString?: string
  ): string => {
    if (!dateString) {
      return "";
    }

    try {
      const date = new Date(dateString);

      return new Intl.DateTimeFormat(
        "en-GB",
        {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      ).format(date);
    } catch {
      return "";
    }
  };

  // ==========================================
  // GROUP HOMEWORK DATE-WISE
  //
  // created_at = homework upload date
  // ==========================================
  const groupedHomework =
    useMemo<GroupedHomework[]>(() => {
      const groups: Record<
        string,
        GroupedHomework
      > = {};

      homeworkList.forEach((homework) => {
        const dateKey =
          getIndiaDateKey(
            homework.created_at
          );

        if (dateKey === "unknown") {
          return;
        }

        if (!groups[dateKey]) {
          groups[dateKey] = {
            dateKey,
            displayDate:
              formatDisplayDate(
                homework.created_at
              ),
            items: [],
          };
        }

        groups[dateKey].items.push(
          homework
        );
      });

      return Object.values(groups).sort(
        (a, b) =>
          b.dateKey.localeCompare(
            a.dateKey
          )
      );
    }, [homeworkList]);

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
      const fileName =
        decodeURIComponent(
          filePath.split("/").pop() ||
            "download"
        );

      // ========================================
      // ANDROID / CAPACITOR
      // ========================================
      if (Capacitor.isNativePlatform()) {
        const permission =
          await Filesystem.checkPermissions();

        if (
          permission.publicStorage !==
          "granted"
        ) {
          const requested =
            await Filesystem.requestPermissions();

          if (
            requested.publicStorage !==
            "granted"
          ) {
            throw new Error(
              "Storage permission was not granted."
            );
          }
        }

        const fileInfo =
          await Filesystem.getUri({
            directory: Directory.Documents,
            path: fileName,
          });

        await FileTransfer.downloadFile({
          url,
          path: fileInfo.uri,
        });

        alert(
          `Downloaded successfully:\n${fileName}`
        );

        return;
      }

      // ========================================
      // DESKTOP / BROWSER
      // ========================================
      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status}`
        );
      }

      const blob =
        await response.blob();

      const blobUrl =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(
        blobUrl
      );
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
  // BACK
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
        padding: "16px",
        minHeight: "100vh",
        background: "#f1f5f9",
      }}
    >
      {/* ======================================
          PAGE HEADER
      ====================================== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          style={{
            border: "none",
            background: "#1e3a8a",
            color: "#ffffff",
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            color: "#0f172a",
            fontWeight: 700,
          }}
        >
          Homework
        </h1>
      </div>

      {/* ======================================
          LOADING
      ====================================== */}
      {loading ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            padding: "30px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Loading homework...
        </div>
      ) : homeworkList.length === 0 ? (
        /* ======================================
           NO HOMEWORK
        ====================================== */
        <div
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            padding: "35px 20px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          <div
            style={{
              fontSize: "38px",
              marginBottom: "10px",
            }}
          >
            📚
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "15px",
            }}
          >
            No homework assigned yet.
          </p>
        </div>
      ) : (
        /* ======================================
           DATE-WISE HOMEWORK
        ====================================== */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {groupedHomework.map(
            (group) => (
              <div
                key={group.dateKey}
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow:
                    "0 2px 8px rgba(15,23,42,0.08)",
                }}
              >
                {/* ==================================
                    DATE HEADER
                ================================== */}
                <div
                  style={{
                    background:
                      "#f97316",
                    color: "#ffffff",
                    padding:
                      "11px 14px",
                    fontSize: "16px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>
                    📅
                  </span>

                  <span>
                    {group.displayDate}
                  </span>
                </div>

                {/* ==================================
                    SUBJECT LIST
                ================================== */}
                <div
                  style={{
                    padding:
                      "8px 14px 12px",
                  }}
                >
                  {group.items.map(
                    (
                      homework,
                      index
                    ) => (
                      <div
                        key={
                          homework.id ??
                          `${group.dateKey}-${index}`
                        }
                        style={{
                          padding:
                            "11px 0",
                          borderBottom:
                            index <
                            group.items
                              .length -
                              1
                              ? "1px solid #e2e8f0"
                              : "none",
                        }}
                      >
                        {/* SUBJECT + DESCRIPTION */}
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "flex-start",
                            gap: "5px",
                            lineHeight:
                              1.55,
                          }}
                        >
                          <span
                            style={{
                              color:
                                "#1d4ed8",
                              fontWeight:
                                700,
                              minWidth:
                                "78px",
                              flexShrink: 0,
                            }}
                          >
                            {homework.subject}
                          </span>

                          <span
                            style={{
                              color:
                                "#111827",
                              fontSize:
                                "15px",
                              whiteSpace:
                                "pre-wrap",
                            }}
                          >
                            :
                            {" "}
                            {homework.description ||
                              "No description provided."}
                          </span>
                        </div>

                        {/* ==================================
                            ATTACHMENTS
                        ================================== */}
                        {(homework.pdf_url ||
                          homework.image_url) && (
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "8px",
                              flexWrap:
                                "wrap",
                              marginTop:
                                "8px",
                              marginLeft:
                                "83px",
                            }}
                          >
                            {homework.pdf_url && (
                              <button
                                type="button"
                                onClick={() =>
                                  downloadFile(
                                    homework.pdf_url as string
                                  )
                                }
                                style={{
                                  border:
                                    "1px solid #2563eb",
                                  background:
                                    "#eff6ff",
                                  color:
                                    "#1d4ed8",
                                  padding:
                                    "6px 10px",
                                  borderRadius:
                                    "6px",
                                  cursor:
                                    "pointer",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    600,
                                }}
                              >
                                📥 PDF
                              </button>
                            )}

                            {homework.image_url && (
                              <button
                                type="button"
                                onClick={() =>
                                  downloadFile(
                                    homework.image_url as string
                                  )
                                }
                                style={{
                                  border:
                                    "1px solid #16a34a",
                                  background:
                                    "#f0fdf4",
                                  color:
                                    "#15803d",
                                  padding:
                                    "6px 10px",
                                  borderRadius:
                                    "6px",
                                  cursor:
                                    "pointer",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    600,
                                }}
                              >
                                📥 Image
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
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