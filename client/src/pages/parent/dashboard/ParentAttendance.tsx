import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import "./ParentAttendance.css";


// ============================================
// DATE HELPER
// ============================================
// Convert API date/timestamp to India date
// YYYY-MM-DD
//
// Example:
// 2026-08-28
// 2026-08-27T18:30:00.000Z
//
// The second value represents 28 August in India
// because 18:30 UTC = 00:00 IST next day.
// ============================================

const toIndiaDateKey = (
  value: string | null | undefined
): string => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.split("T")[0];
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const yearPart =
    parts.find(
      (part) => part.type === "year"
    )?.value || "";

  const monthPart =
    parts.find(
      (part) => part.type === "month"
    )?.value || "";

  const dayPart =
    parts.find(
      (part) => part.type === "day"
    )?.value || "";

  return `${yearPart}-${monthPart}-${dayPart}`;
};


// ============================================
// TYPES
// ============================================

type AttendanceRecord = {
  attendance_date: string;
  status: string;
};

type Student = {
  id: number;
  student_name: string;
  admission_no: string;
  class: string;
  section: string;
};

type AcademicCalendarItem = {
  id: number;
  session: string;
  event_type: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  date_text: string | null;
  description: string | null;
  is_tentative: boolean;
  is_active: boolean;
};

type ApiResponse = {
  success: boolean;
  student?: Student;
  month?: string;
  attendance?: AttendanceRecord[];
  message?: string;
};

type AcademicCalendarResponse = {
  success: boolean;
  session?: string;
  data?: AcademicCalendarItem[];
  message?: string;
};


// ============================================
// COMPONENT
// ============================================

export default function ParentAttendance() {

  const navigate = useNavigate();


  // ============================================
  // STUDENT
  // ============================================

  const [student, setStudent] =
    useState<Student | null>(null);


  // ============================================
  // CURRENT MONTH
  // ============================================

  const [currentMonth, setCurrentMonth] =
    useState(() => {

      const todayKey =
        toIndiaDateKey(
          new Date().toISOString()
        );

      return todayKey.slice(0, 7);
    });


  // ============================================
  // ATTENDANCE
  // ============================================

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);


  // ============================================
  // ACADEMIC CALENDAR
  // ============================================

  const [academicCalendar, setAcademicCalendar] =
    useState<AcademicCalendarItem[]>([]);


  // ============================================
  // LOADING
  // ============================================

  const [loading, setLoading] =
    useState(true);


  // ============================================
  // ERROR
  // ============================================

  const [error, setError] =
    useState("");


  // ============================================
  // LOAD PARENT ATTENDANCE
  // + ACADEMIC CALENDAR
  // ============================================

  useEffect(() => {

    const parentData =
      localStorage.getItem("parent");


    if (!parentData) {

      navigate("/parent/login");

      return;
    }


    try {

      const parent =
        JSON.parse(parentData);


      if (!parent.admission_no) {

        navigate("/parent/login");

        return;
      }


      void loadAttendanceAndCalendar(
        parent.admission_no,
        currentMonth
      );

    } catch (err) {

      console.error(
        "Parent data error:",
        err
      );

      navigate("/parent/login");
    }

  }, [currentMonth, navigate]);


  // ============================================
  // LOAD BOTH APIs
  // ============================================

  const loadAttendanceAndCalendar =
    async (
      admissionNo: string,
      month: string
    ) => {

      try {

        setLoading(true);

        setError("");


        const [
          attendanceResponse,
          calendarResponse,
        ] = await Promise.all([

          // ================================
          // ATTENDANCE API
          // ================================

          fetch(
            `${API_BASE_URL}/parents/attendance/${encodeURIComponent(
              admissionNo
            )}?month=${month}`
          ),


          // ================================
          // ACADEMIC CALENDAR API
          // ================================

          fetch(
            `${API_BASE_URL}/academic-calendar?session=2026-27`
          ),
        ]);


        // ==================================
        // ATTENDANCE RESPONSE
        // ==================================

        const attendanceResult:
          ApiResponse =
          await attendanceResponse.json();


        if (
          !attendanceResponse.ok ||
          !attendanceResult.success
        ) {

          throw new Error(
            attendanceResult.message ||
            "Unable to load attendance"
          );
        }


        setStudent(
          attendanceResult.student ||
          null
        );


        setAttendance(
          attendanceResult.attendance ||
          []
        );


        // ==================================
        // ACADEMIC CALENDAR RESPONSE
        // ==================================

        const calendarResult:
          AcademicCalendarResponse =
          await calendarResponse.json();


        if (
          !calendarResponse.ok ||
          !calendarResult.success
        ) {

          throw new Error(
            calendarResult.message ||
            "Unable to load academic calendar"
          );
        }


        setAcademicCalendar(
          calendarResult.data ||
          []
        );

      } catch (err) {

        console.error(
          "Attendance / Calendar Load Error:",
          err
        );


        setAttendance([]);

        setAcademicCalendar([]);


        setError(
          err instanceof Error
            ? err.message
            : "Unable to load attendance"
        );

      } finally {

        setLoading(false);
      }
    };


  // ============================================
  // MONTH INFORMATION
  // ============================================

  const [
    year,
    month,
  ] = currentMonth
    .split("-")
    .map(Number);


  const monthName =
    new Date(
      year,
      month - 1,
      1
    ).toLocaleString(
      "en-US",
      {
        month: "long",
      }
    );


  const daysInMonth =
    new Date(
      year,
      month,
      0
    ).getDate();


  const firstDay =
    new Date(
      year,
      month - 1,
      1
    ).getDay();


  // ============================================
  // SUNDAY-FIRST JS DAY
  // TO MONDAY-FIRST CALENDAR
  // ============================================

  const mondayFirstOffset =
    firstDay === 0
      ? 6
      : firstDay - 1;


  // ============================================
  // ATTENDANCE LOOKUP
  // ============================================

  const attendanceMap =
    useMemo(() => {

      const map =
        new Map<string, string>();


      attendance.forEach(
        (item) => {

          const dateOnly =
            toIndiaDateKey(
              item.attendance_date
            );


          map.set(
            dateOnly,
            item.status
          );
        }
      );


      return map;

    }, [attendance]);


  // ============================================
  // ACADEMIC HOLIDAY / VACATION LOOKUP
  // ============================================

  const academicHolidayItems =
    useMemo(() => {

      return academicCalendar.filter(
        (item) => {

          const type =
            item.event_type
              ?.toUpperCase()
              .trim();


          return (
            type === "HOLIDAY" ||
            type === "VACATION"
          );
        }
      );

    }, [academicCalendar]);


  // ============================================
  // DATE HELPERS
  // ============================================

  const getDateKey =
    (day: number) => {

      return `${currentMonth}-${String(
        day
      ).padStart(2, "0")}`;
    };


  const todayKey =
    toIndiaDateKey(
      new Date().toISOString()
    );


  const isFutureDate =
    (dateKey: string) => {

      return dateKey > todayKey;
    };


  const isSunday =
    (day: number) => {

      return new Date(
        year,
        month - 1,
        day
      ).getDay() === 0;
    };


  // ============================================
  // ACADEMIC HOLIDAY CHECK
  // ============================================

  const isAcademicHoliday =
    (dateKey: string) => {

      return academicHolidayItems.some(
        (item) => {

          if (!item.start_date) {
            return false;
          }


          const startDate =
            toIndiaDateKey(
              item.start_date
            );


          const endDate =
            item.end_date
              ? toIndiaDateKey(
                  item.end_date
                )
              : startDate;


          return (
            dateKey >= startDate &&
            dateKey <= endDate
          );
        }
      );
    };


  // ============================================
  // GET HOLIDAY INFORMATION
  // ============================================

  const getAcademicHoliday =
    (dateKey: string) => {

      return academicHolidayItems.find(
        (item) => {

          if (!item.start_date) {
            return false;
          }


          const startDate =
            toIndiaDateKey(
              item.start_date
            );


          const endDate =
            item.end_date
              ? toIndiaDateKey(
                  item.end_date
                )
              : startDate;


          return (
            dateKey >= startDate &&
            dateKey <= endDate
          );
        }
      );
    };


  // ============================================
  // MONTH NAVIGATION
  // ============================================

  const changeMonth =
    (direction: number) => {

      const newDate =
        new Date(
          year,
          month - 1 + direction,
          1
        );


      setCurrentMonth(
        `${newDate.getFullYear()}-${String(
          newDate.getMonth() + 1
        ).padStart(2, "0")}`
      );
    };


  // ============================================
  // CALENDAR CELLS
  // ============================================

  const calendarCells: (
    | {
        type: "empty";
        key: string;
      }
    | {
        type: "day";
        day: number;
      }
  )[] = [];


  // ============================================
  // EMPTY CELLS
  // ============================================

  for (
    let i = 0;
    i < mondayFirstOffset;
    i++
  ) {

    calendarCells.push({

      type: "empty",

      key: `empty-${i}`,

    });
  }


  // ============================================
  // DAY CELLS
  // ============================================

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    calendarCells.push({

      type: "day",

      day,

    });
  }


  // ============================================
  // DAY STATUS
  // ============================================

  const getDayStatus =
    (day: number) => {

      const dateKey =
        getDateKey(day);


      // ========================================
      // 1. ACADEMIC HOLIDAY / VACATION
      // Highest Priority
      // ========================================

      if (
        isAcademicHoliday(dateKey)
      ) {

        return "holiday";
      }


      // ========================================
      // 2. SUNDAY
      // ========================================

      if (
        isSunday(day)
      ) {

        return "sunday";
      }


      // ========================================
      // 3. FUTURE DATE
      // ========================================

      if (
        isFutureDate(dateKey)
      ) {

        return "future";
      }


      // ========================================
      // 4. ATTENDANCE
      // ========================================

      const savedStatus =
        attendanceMap.get(
          dateKey
        );


      if (!savedStatus) {

        return "not-updated";
      }


      const normalized =
        savedStatus
          .toLowerCase()
          .trim();


      // ========================================
      // PRESENT
      // ========================================

      if (
        normalized === "p" ||
        normalized === "present"
      ) {

        return "present";
      }


      // ========================================
      // ABSENT
      // ========================================

      if (
        normalized === "a" ||
        normalized === "absent"
      ) {

        return "absent";
      }


      // ========================================
      // DEFAULT
      // ========================================

      return "not-updated";
    };


  // ============================================
  // ANNUAL ATTENDANCE
  // ============================================

  const handleAnnualAttendance = () => {

  navigate("/parent/annual-attendance");

};


  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <div className="parent-attendance-page">

        <div className="attendance-loading">

          <div className="attendance-spinner" />

          <p>
            Loading Attendance...
          </p>

        </div>

      </div>
    );
  }


  // ============================================
  // MAIN UI
  // ============================================

  return (

    <div className="parent-attendance-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="parent-attendance-header">

        <button
          className="attendance-back-btn"
          onClick={() =>
            navigate(
              "/parent/dashboard"
            )
          }
          aria-label="Back"
        >
          ←
        </button>


        <h1>
          Attendance
        </h1>

      </div>


      {/* ======================================
          STUDENT BAR
      ====================================== */}

      {student && (

        <div className="attendance-student-bar">

          <strong>
            {student.student_name}
          </strong>


          <span>
            {student.class},{" "}
            {student.section}
          </span>

        </div>
      )}


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="attendance-error">
          {error}
        </div>
      )}


      {/* ======================================
          CALENDAR CARD
      ====================================== */}

      <div className="attendance-calendar-card">


        {/* ==================================
            MONTH NAVIGATION
        ================================== */}

        <div className="attendance-month-header">

          <button
            onClick={() =>
              changeMonth(-1)
            }
            className="month-nav-btn"
          >
            ‹
          </button>


          <div className="month-title">

            {monthName},{" "}
            {year}

          </div>


          <button
            onClick={() =>
              changeMonth(1)
            }
            className="month-nav-btn"
          >
            ›
          </button>

        </div>


        {/* ==================================
            WEEK DAYS
        ================================== */}

        <div className="attendance-weekdays">

          {[
            "Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sa",
            "Su",
          ].map(
            (day) => (

              <div
                key={day}
                className="attendance-weekday"
              >
                {day}
              </div>

            )
          )}

        </div>


        {/* ==================================
            CALENDAR
        ================================== */}

        <div className="attendance-calendar-grid">

          {calendarCells.map(
            (cell) => {

              // ==============================
              // EMPTY CELL
              // ==============================

              if (
                cell.type === "empty"
              ) {

                return (

                  <div
                    key={cell.key}
                    className="attendance-day empty"
                  />

                );
              }


              // ==============================
              // STATUS
              // ==============================

              const status =
                getDayStatus(
                  cell.day
                );


              const dateKey =
                getDateKey(
                  cell.day
                );


              // ==============================
              // HOLIDAY INFORMATION
              // ==============================

              const holidayInfo =
                status === "holiday"
                  ? getAcademicHoliday(
                      dateKey
                    )
                  : undefined;


              // ==============================
              // TOOLTIP
              // ==============================

              let title = "";

if (status === "holiday") {
  title = holidayInfo?.title || "Holiday / Vacation";
}
else if (status === "present") {
  title = "Present";
}
else if (status === "absent") {
  title = "Absent";
}
else if (status === "sunday") {
  title = "Sunday";
}
else {
  title = "Not Updated";
}


              // ==============================
              // DAY CELL
              // ==============================

              return (

                <div
  key={cell.day}
  className={`attendance-day ${status}`}
  title={`${cell.day} - ${title}`}
>
                  {cell.day}
                </div>

              );

            }
          )}

        </div>


        {/* ==================================
            LEGEND
        ================================== */}

        <div className="attendance-legend">


          {/* PRESENT */}

          <div className="legend-item">

            <span
              className="legend-color present"
            />

            <span>
              Present
            </span>

          </div>


          {/* ABSENT */}

          <div className="legend-item">

            <span
              className="legend-color absent"
            />

            <span>
              Absent
            </span>

          </div>


          {/* HOLIDAY / VACATION */}

          <div className="legend-item">

            <span
              className="legend-color holiday"
            />

            <span>
              Holiday / Vacation
            </span>

          </div>


          {/* SUNDAY */}

          <div className="legend-item">

            <span
              className="legend-color sunday"
            />

            <span>
              Sunday
            </span>

          </div>


          {/* NOT UPDATED */}

          <div className="legend-item">

            <span
              className="legend-color not-updated"
            />

            <span>
              Not Updated
            </span>

          </div>


        </div>


        {/* ==================================
            ANNUAL ATTENDANCE
        ================================== */}

        <button
          className="annual-attendance-btn"
          onClick={
            handleAnnualAttendance
          }
        >
          View Annual Attendance
        </button>


      </div>

    </div>
  );
}