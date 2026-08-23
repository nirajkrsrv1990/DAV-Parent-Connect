import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentAnnualCalendar.css";

type CalendarItem = {
  id: number;
  session: string;
  event_type: "HOLIDAY" | "CELEBRATION" | "EXAM";
  title: string;
  start_date: string | null;
  end_date: string | null;
  date_text: string | null;
  description: string | null;
  is_tentative: boolean;
  is_active: boolean;
};

const API_BASE_URL = "/api";

export default function ParentAnnualCalendar() {
  const navigate = useNavigate();

  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/academic-calendar?session=2026-27`
      );

      if (!response.ok) {
        throw new Error("Unable to load academic calendar.");
      }

      const result = await response.json();

      if (result.success) {
        setCalendarItems(result.data || []);
      } else {
        setError(result.message || "Unable to load academic calendar.");
      }
    } catch (err) {
      console.error("Academic Calendar Error:", err);
      setError("Unable to load academic calendar.");
    } finally {
      setLoading(false);
    }
  };

  const holidays = useMemo(
    () =>
      calendarItems.filter(
        (item) => item.event_type === "HOLIDAY"
      ),
    [calendarItems]
  );

  const celebrations = useMemo(
    () =>
      calendarItems.filter(
        (item) => item.event_type === "CELEBRATION"
      ),
    [calendarItems]
  );

  const exams = useMemo(
    () =>
      calendarItems.filter(
        (item) => item.event_type === "EXAM"
      ),
    [calendarItems]
  );

  const formatDate = (date: string | null) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDateDisplay = (item: CalendarItem) => {
    if (item.date_text) {
      return item.date_text;
    }

    if (item.start_date && item.end_date) {
      if (item.start_date === item.end_date) {
        return formatDate(item.start_date);
      }

      return `${formatDate(item.start_date)} to ${formatDate(
        item.end_date
      )}`;
    }

    if (item.start_date) {
      return formatDate(item.start_date);
    }

    return "Date to be announced";
  };

  const renderCalendarList = (
    items: CalendarItem[],
    type: CalendarItem["event_type"]
  ) => {
    if (items.length === 0) {
      return (
        <div className="calendar-empty">
          No information available.
        </div>
      );
    }

    return (
      <div className="calendar-table-wrapper">
        <table className="calendar-table">
          <thead>
            <tr>
              <th className="serial-column">#</th>
              <th>Event</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="serial-column">
                  {index + 1}
                </td>

                <td>
                  <div className="calendar-event-title">
                    {item.title}
                  </div>

                  {type === "EXAM" && item.is_tentative && (
                    <span className="tentative-badge">
                      Tentative
                    </span>
                  )}

                  {item.description && (
                    <div className="calendar-description">
                      {item.description}
                    </div>
                  )}
                </td>

                <td className="calendar-date">
                  {getDateDisplay(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="parent-calendar-page">

      {/* ================= HEADER ================= */}
      <header className="parent-calendar-header">
        <button
          className="calendar-back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="calendar-header-title">
          <div className="calendar-header-icon">📅</div>

          <div>
            <h1>Annual Calendar</h1>
            <p>DAV PUBLIC SCHOOL</p>
          </div>
        </div>

        <div className="calendar-session">
          Session
          <strong>2026–27</strong>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="parent-calendar-content">

        {loading && (
          <div className="calendar-loading">
            <div className="calendar-spinner"></div>
            <p>Loading Annual Calendar...</p>
          </div>
        )}

        {!loading && error && (
          <div className="calendar-error">
            <div className="calendar-error-icon">⚠️</div>
            <h3>Unable to Load Calendar</h3>
            <p>{error}</p>

            <button
              onClick={fetchCalendar}
              className="calendar-retry-button"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ================= HOLIDAYS ================= */}
            <section className="calendar-section holiday-section">

              <div className="calendar-section-header">
                <div className="calendar-section-icon holiday-icon">
                  🏖️
                </div>

                <div>
                  <h2>Holidays & Vacations</h2>
                  <p>
                    School holidays and vacation schedule
                  </p>
                </div>
              </div>

              {renderCalendarList(
                holidays,
                "HOLIDAY"
              )}
            </section>

            {/* ================= CELEBRATIONS ================= */}
            <section className="calendar-section celebration-section">

              <div className="calendar-section-header">
                <div className="calendar-section-icon celebration-icon">
                  🎉
                </div>

                <div>
                  <h2>School Celebrations</h2>
                  <p>
                    Important school celebrations and special days
                  </p>
                </div>
              </div>

              {renderCalendarList(
                celebrations,
                "CELEBRATION"
              )}
            </section>

            {/* ================= EXAMS ================= */}
            <section className="calendar-section exam-section">

              <div className="calendar-section-header">
                <div className="calendar-section-icon exam-icon">
                  📝
                </div>

                <div>
                  <h2>Tentative Exam Dates</h2>
                  <p>
                    Examination schedule for Session 2026–27
                  </p>
                </div>
              </div>

              {renderCalendarList(
                exams,
                "EXAM"
              )}

              <div className="calendar-note">
                <strong>Note:</strong> Examination dates are
                tentative and may change as per school/CBSE
                requirements.
              </div>
            </section>
          </>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="parent-calendar-footer">
        DAV PUBLIC SCHOOL, SASARAM
        <span> • </span>
        Session 2026–27
      </footer>
    </div>
  );
}