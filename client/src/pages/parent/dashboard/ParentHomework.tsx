import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileTransfer } from "@capacitor/file-transfer";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
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
  student_name?: string;
  studentName?: string;
  student?: {
    name?: string;
    student_name?: string;
    class?: string;
    class_name?: string;
    section?: string;
  };
  class?: string;
  class_name?: string;
  section?: string;
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
  // created_at is stored as UTC.
  // Convert to India date.
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
  // STUDENT DISPLAY INFORMATION
  // ==========================================
  const parentData = useMemo(() => {
    try {
      const stored = localStorage.getItem("parent");
      return stored ? (JSON.parse(stored) as ParentData) : null;
    } catch {
      return null;
    }
  }, []);

  const studentName =
    parentData?.student_name ||
    parentData?.studentName ||
    parentData?.student?.student_name ||
    parentData?.student?.name ||
    "";

  const studentClass =
    parentData?.class ||
    parentData?.class_name ||
    parentData?.student?.class ||
    parentData?.student?.class_name ||
    "";

  const studentSection =
    parentData?.section ||
    parentData?.student?.section ||
    "";

  const studentClassInfo = [studentClass, studentSection]
    .filter(Boolean)
    .join(", ");

  // ==========================================
  // SUBJECT COLOUR
  // ==========================================
  const getSubjectStyle = (
  subject: string
): React.CSSProperties => {
  const name = subject.toLowerCase().trim();

  const subjectColors: Record<
    string,
    string
  > = {
    english: "#22A900",
    sanskrit: "#00897B",
    hindi: "#F57C00",
    mathematics: "#1565E8",
    science: "#7028C8",
    "social science": "#8E44AD",
    computer: "#0077B6",
    "m.ed.": "#795548",
    "g.k.": "#C2185B",
    physics: "#3949AB",
    chemistry: "#00838F",
    biology: "#2E7D32",
    economics: "#6D4C41",
    "b.st.": "#5E35B1",
    accountancy: "#455A64",
    "physical education": "#EF6C00",
    art: "#D81B60",
  };

  return {
    background:
      subjectColors[name] || "#008FA3",
    color: "#FFFFFF",
  };
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
      className="parent-homework-page"
      style={{
        minHeight: "100vh",
        background: "#f4f8fa",
        paddingBottom: "24px",
      }}
    >
      {/* ======================================
          TOP HEADER
      ====================================== */}
      <div
        style={{
          height: "64px",
          background: "linear-gradient(90deg, #0d8fa3, #1595aa)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          boxSizing: "border-box",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back"
          style={{
            border: "none",
            background: "transparent",
            color: "#ffffff",
            width: "42px",
            height: "42px",
            fontSize: "34px",
            lineHeight: 1,
            cursor: "pointer",
            padding: 0,
          }}
        >
          <ArrowLeft size={30} />
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "0.2px",
          }}
        >
          Homework
        </h1>

        <div
          aria-hidden="true"
          style={{
            width: "42px",
            textAlign: "center",
            fontSize: "27px",
          }}
        >
          <CalendarDays size={28} />
        </div>
      </div>

      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          padding: "16px 14px 0",
          boxSizing: "border-box",
        }}
      >
        {/* ======================================
            STUDENT INFORMATION
        ====================================== */}
        {(studentName || studentClassInfo) && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "16px 18px",
              marginBottom: "18px",
              boxShadow: "0 3px 12px rgba(15,23,42,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              minHeight: "58px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              🎓
            </div>

            <div
              style={{
                color: "#111827",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.35,
              }}
            >
              {studentName}
              {studentName && studentClassInfo ? " , " : ""}
              {studentClassInfo}
            </div>
          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}
        {loading ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "40px 20px",
              textAlign: "center",
              color: "#64748b",
              boxShadow: "0 3px 12px rgba(15,23,42,0.08)",
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
              borderRadius: "12px",
              padding: "42px 20px",
              textAlign: "center",
              color: "#64748b",
              boxShadow: "0 3px 12px rgba(15,23,42,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "12px",
              }}
            >
              📚
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
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
            {groupedHomework.map((group) => (
              <div
                key={group.dateKey}
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 3px 12px rgba(15,23,42,0.10)",
                }}
              >
                {/* DATE HEADER */}
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, #118fa4, #1697ac)",
                    color: "#ffffff",
                    minHeight: "58px",
                    padding: "10px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      fontSize: "28px",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    ▣
                  </span>

                  <span
                    style={{
                      fontSize: "21px",
                      fontWeight: 700,
                    }}
                  >
                    Date : {group.displayDate}
                  </span>
                </div>

                {/* SUBJECT LIST */}
                <div
                  style={{
                    padding: "8px 18px 10px",
                    boxSizing: "border-box",
                  }}
                >
                  {group.items.map((homework, index) => (
                    <div
                      key={
                        homework.id ??
                        `${group.dateKey}-${index}`
                      }
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                        "125px 18px minmax(0, 1fr)",
                        columnGap: "8px",
                        alignItems: "start",
                        padding: "12px 0",
                        borderBottom:
                          index < group.items.length - 1
                            ? "1px solid #e2e8f0"
                            : "none",
                      }}
                    >
                      {/* SUBJECT */}
                      <span
                        style={{
                          ...getSubjectStyle(
                            homework.subject
                          ),
                          width: "100%",
                          minHeight: "36px",
                          padding: "6px 7px",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "14px",
                          lineHeight: 1.25,
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxSizing: "border-box",
                          wordBreak: "break-word",
                        }}
                      >
                        {homework.subject}
                      </span>

                      {/* COLON */}
                      <span
                        style={{
                          color: "#111827",
                          fontSize: "20px",
                          lineHeight: "36px",
                          textAlign: "center",
                        }}
                      >
                        :
                      </span>

                      {/* HOMEWORK DESCRIPTION */}
                      <div
                        style={{
                          color: "#111827",
                          fontSize: "16px",
                          lineHeight: 1.5,
                          paddingTop: "5px",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                          minWidth: 0,
                        }}
                      >
                        {homework.description ||
                          "No description provided."}

                        {/* ATTACHMENTS */}
                        {(homework.pdf_url ||
                          homework.image_url) && (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                              marginTop: "9px",
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
                                  background: "#eff6ff",
                                  color: "#1d4ed8",
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  fontWeight: 600,
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
                                  background: "#f0fdf4",
                                  color: "#15803d",
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                }}
                              >
                                📥 Image
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}