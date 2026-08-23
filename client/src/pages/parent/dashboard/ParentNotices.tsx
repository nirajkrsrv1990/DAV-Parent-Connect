import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Capacitor } from "@capacitor/core";
import {
  Filesystem,
  Directory,
} from "@capacitor/filesystem";

import {
  API_BASE_URL,
  HOMEWORK_FILE_BASE_URL,
} from "@/config/api";

import "../ParentDashboard.css";

type NoticeItem = {
  id?: number;
  title: string;
  description?: string | null;
  notice_date?: string | null;
  pdf_url?: string | null;
};

export default function ParentNotices() {
  const navigate = useNavigate();

  const [notices, setNotices] =
    useState<NoticeItem[]>([]);

  // ==========================================
  // FETCH NOTICES
  // ==========================================
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notices`
      );

      const result = await response.json();

      if (result.success) {
        setNotices(result.data || []);
      }
    } catch (err) {
      console.log(
        "Error fetching notices:",
        err
      );
    }
  };

  // ==========================================
  // DOWNLOAD NOTICE PDF
  // ==========================================
  const downloadNoticePdf = async (
    filePath: string
  ): Promise<void> => {
    try {
      const url =
        filePath.startsWith("http://") ||
        filePath.startsWith("https://")
          ? filePath
          : `${HOMEWORK_FILE_BASE_URL}${filePath}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status}`
        );
      }

      const blob = await response.blob();

      const fileName =
        filePath.split("/").pop() ||
        "notice.pdf";

      // ========================================
      // ANDROID / CAPACITOR
      // ========================================
      if (Capacitor.isNativePlatform()) {
        const base64Data =
          await new Promise<string>(
            (resolve, reject) => {
              const reader =
                new FileReader();

              reader.onloadend = () => {
                const result =
                  reader.result;

                if (
                  typeof result !== "string"
                ) {
                  reject(
                    new Error(
                      "Unable to read file."
                    )
                  );
                  return;
                }

                const base64 =
                  result.split(",")[1];

                if (!base64) {
                  reject(
                    new Error(
                      "Unable to convert file."
                    )
                  );
                  return;
                }

                resolve(base64);
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

        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
        });

        alert(
          `Notice downloaded successfully:\n${fileName}`
        );

        return;
      }

      // ========================================
      // DESKTOP / NORMAL BROWSER
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
        "Notice PDF download error:",
        error
      );

      alert(
        "Unable to download notice PDF."
      );
    }
  };

  return (
    <div
      className="parent-dashboard"
      style={{
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>School Notices</h2>

        <button
          type="button"
          onClick={() =>
            navigate("/parent/dashboard")
          }
          style={{
            backgroundColor: "#0F4C81",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {notices.length === 0 ? (
        <p
          style={{
            color: "#64748b",
          }}
        >
          No notices available.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {notices.map(
            (
              notice: NoticeItem,
              index: number
            ) => (
              <div
                key={
                  notice.id ??
                  `notice-${index}`
                }
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    color: "#0F4C81",
                  }}
                >
                  {notice.title}
                </h3>

                <p
                  style={{
                    margin: "0 0 10px 0",
                    color: "#334155",
                  }}
                >
                  {notice.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "12px",
                    color: "#64748b",
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    Date:{" "}
                    {notice.notice_date
                      ? notice.notice_date.split(
                          "T"
                        )[0]
                      : ""}
                  </span>

                  {notice.pdf_url && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadNoticePdf(
                          notice.pdf_url as string
                        )
                      }
                      style={{
                        border:
                          "1px solid #2563eb",
                        background:
                          "#ffffff",
                        color: "#2563eb",
                        padding:
                          "8px 12px",
                        borderRadius: "6px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold",
                        fontSize:
                          "12px",
                      }}
                    >
                      📥 Download PDF Notice
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