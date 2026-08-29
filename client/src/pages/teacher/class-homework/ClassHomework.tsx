import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import "./ClassHomework.css";

type Homework = {
  id: number;
  teacher_id: string;
  subject: string;
  class: string;
  section: string;
  description?: string | null;
  pdf_url?: string | null;
  image_url?: string | null;
  due_date?: string | null;
  created_at?: string;
};

type Assignment = {
  class_name: string;
  section: string;
};

export default function ClassHomework() {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTeacherId = () => {
    return (
      localStorage.getItem("teacherId") ||
      localStorage.getItem("teacher_id") ||
      ""
    ).trim();
  };

  const loadClassHomework = async () => {
    try {
      setLoading(true);
      setError("");

      const teacherId = getTeacherId();

      if (!teacherId) {
        setError("Teacher ID not found.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/homework/class-teacher/${encodeURIComponent(
          teacherId
        )}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setAssignment(null);
        setHomework([]);

        setError(
          result.message ||
            "Unable to load class homework."
        );

        return;
      }

      setAssignment(result.assignment || null);
      setHomework(result.homework || []);
    } catch (err) {
      console.error(
        "Class Homework Error:",
        err
      );

      setError(
        "Unable to connect to server."
      );

      setHomework([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassHomework();
  }, []);

  /* ==========================================
     GROUP HOMEWORK BY SUBJECT
  ========================================== */

  const groupedHomework = homework.reduce(
    (groups, item) => {
      const subject = item.subject || "Other";

      if (!groups[subject]) {
        groups[subject] = [];
      }

      groups[subject].push(item);

      return groups;
    },
    {} as Record<string, Homework[]>
  );

  return (
    <div className="class-homework-page">

      {/* PAGE HEADER */}
      <div className="class-homework-title">
        <div>
          <h1>
            <BookOpen size={28} />
            Class Homework
          </h1>

          <p>
            Homework assigned to your class by
            all subject teachers.
          </p>
        </div>

        <button
          className="class-homework-refresh"
          onClick={loadClassHomework}
          disabled={loading}
        >
          <RefreshCw
            size={18}
            className={
              loading
                ? "refresh-spinning"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* CLASS INFORMATION */}
      {assignment && (
        <div className="class-homework-info">
          <div>
            <CalendarDays size={20} />

            <span>
              Class:{" "}
              <strong>
                {assignment.class_name}
              </strong>
            </span>
          </div>

          <div>
            <span>
              Section:{" "}
              <strong>
                {assignment.section}
              </strong>
            </span>
          </div>

          <div>
            <span>
              Date:{" "}
              <strong>
                {new Date().toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="class-homework-message">
          Loading today's homework...
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="class-homework-error">
          {error}
        </div>
      )}

      {/* NO HOMEWORK */}
      {!loading &&
        !error &&
        homework.length === 0 && (
          <div className="class-homework-empty">
            <BookOpen size={42} />

            <h3>
              No Homework Assigned Today
            </h3>

            <p>
              No subject teacher has assigned
              homework to your class today.
            </p>
          </div>
        )}

      {/* HOMEWORK LIST */}
      {!loading &&
        !error &&
        homework.length > 0 && (
          <div className="class-homework-list">

            {Object.entries(
              groupedHomework
            ).map(
              ([
                subject,
                subjectHomework,
              ]) => (
                <div
                  className="class-homework-card"
                  key={subject}
                >
                  <div className="class-homework-card-header">
                    <h2>{subject}</h2>

                    <span>
                      {subjectHomework.length}{" "}
                      Homework
                    </span>
                  </div>

                  {subjectHomework.map(
                    (item) => (
                      <div
                        className="class-homework-item"
                        key={item.id}
                      >
                        {item.description && (
                          <p className="homework-description">
                            {item.description}
                          </p>
                        )}

                        {item.due_date && (
                          <p className="homework-due-date">
                            Due Date:{" "}
                            {new Date(
                              item.due_date
                            ).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                        )}

                        {item.pdf_url && (
                          <a
                            href={item.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="homework-file-link"
                          >
                            View PDF
                          </a>
                        )}

                        {item.image_url && (
                          <a
                            href={item.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="homework-file-link"
                          >
                            View Image
                          </a>
                        )}
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        )}
    </div>
  );
}