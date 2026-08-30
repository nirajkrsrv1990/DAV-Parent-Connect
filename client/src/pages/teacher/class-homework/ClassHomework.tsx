import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
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
  const [homework, setHomework] =
    useState<Homework[]>([]);

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [minDate, setMinDate] =
    useState("");

  const [maxDate, setMaxDate] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================
     GET TEACHER ID FROM LOCAL STORAGE
  ========================================== */

  const getTeacherId = () => {
    const teacherData =
      localStorage.getItem("teacher");

    if (teacherData) {
      try {
        const teacher =
          JSON.parse(teacherData);

        return String(
          teacher.teacher_id || ""
        ).trim();

      } catch (error) {
        console.error(
          "Failed to parse teacher localStorage:",
          error
        );
      }
    }

    return "";
  };

  /* ==========================================
     FORMAT YYYY-MM-DD → DD/MM/YYYY
  ========================================== */

  const formatDate = (
    dateString: string
  ) => {
    if (!dateString) return "";

    const [year, month, day] =
      dateString.split("-");

    if (!year || !month || !day) {
      return dateString;
    }

    return `${day}/${month}/${year}`;
  };

  /* ==========================================
     LOAD CLASS HOMEWORK
  ========================================== */

  const loadClassHomework = async (
    date?: string
  ) => {
    try {
      setLoading(true);
      setError("");

      const teacherId = getTeacherId();

      if (!teacherId) {
        setError("Teacher ID not found.");
        setHomework([]);
        return;
      }

      const requestedDate =
        date || selectedDate;

      let url =
        `${API_BASE_URL}/homework/class-teacher/` +
        `${encodeURIComponent(teacherId)}`;

      if (requestedDate) {
        url += `?date=${encodeURIComponent(
          requestedDate
        )}`;
      }

      const response =
        await fetch(url);

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setAssignment(
          result.assignment || null
        );

        setHomework([]);

        setError(
          result.message ||
            "Unable to load class homework."
        );

        return;
      }

      setAssignment(
        result.assignment || null
      );

      setHomework(
        result.homework || []
      );

      /* ======================================
         SAVE DATE RANGE FROM BACKEND
      ====================================== */

      if (result.min_date) {
        setMinDate(
          result.min_date
        );
      }

      if (result.max_date) {
        setMaxDate(
          result.max_date
        );
      }

      /* ======================================
         SAVE ACTUAL SELECTED DATE
      ====================================== */

      if (result.selected_date) {
        setSelectedDate(
          result.selected_date
        );
      }

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

  /* ==========================================
     INITIAL LOAD
  ========================================== */

  useEffect(() => {
    loadClassHomework();
  }, []);

  /* ==========================================
     DATE CHANGE
  ========================================== */

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDate =
      event.target.value;

    if (!newDate) return;

    setSelectedDate(newDate);

    loadClassHomework(newDate);
  };

  /* ==========================================
     GROUP HOMEWORK BY SUBJECT
  ========================================== */

  const groupedHomework =
    homework.reduce(
      (groups, item) => {
        const subject =
          item.subject || "Other";

        if (!groups[subject]) {
          groups[subject] = [];
        }

        groups[subject].push(item);

        return groups;
      },
      {} as Record<
        string,
        Homework[]
      >
    );

  return (
    <div className="class-homework-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="class-homework-title">
        <div>
          <h1>
            <BookOpen size={28} />
            Class Homework
          </h1>

          <p>
            Homework assigned to your class
            by all subject teachers.
          </p>
        </div>

        <button
          className="class-homework-refresh"
          onClick={() =>
            loadClassHomework(
              selectedDate
            )
          }
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

      {/* ======================================
          CLASS INFORMATION
      ====================================== */}

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

        </div>
      )}

      {/* ======================================
          DATE SELECTOR
      ====================================== */}

      {assignment && (
        <div className="class-homework-date-card">

          <div className="class-homework-date-label">
            <CalendarDays size={20} />

            <div>
              <strong>
                Select Date
              </strong>

              <span>
                Showing homework for{" "}
                {formatDate(
                  selectedDate
                )}
              </span>
            </div>
          </div>

          <input
            type="date"
            value={selectedDate}
            min={minDate}
            max={maxDate}
            lang="en-GB"
            onChange={
              handleDateChange
            }
            disabled={loading}
            className="class-homework-date-input"
          />

        </div>
      )}

      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="class-homework-message">
          Loading homework...
        </div>
      )}

      {/* ======================================
          ERROR
      ====================================== */}

      {!loading && error && (
        <div className="class-homework-error">
          {error}
        </div>
      )}

      {/* ======================================
          NO HOMEWORK
      ====================================== */}

      {!loading &&
        !error &&
        homework.length === 0 && (
          <div className="class-homework-empty">

            <BookOpen size={42} />

            <h3>
              No Homework Assigned
            </h3>

            <p>
              No subject teacher has assigned
              homework for{" "}
              <strong>
                {formatDate(
                  selectedDate
                )}
              </strong>
              .
            </p>

          </div>
        )}

      {/* ======================================
          HOMEWORK LIST
      ====================================== */}

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

                    <h2>
                      {subject}
                    </h2>

                    <span>
                      {
                        subjectHomework.length
                      }{" "}
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
                            {
                              item.description
                            }
                          </p>
                        )}

                        {item.due_date && (
                          <p className="homework-due-date">
                            Due Date:{" "}
                            {formatDate(
                              item.due_date
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