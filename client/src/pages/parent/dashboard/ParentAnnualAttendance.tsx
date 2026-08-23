import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import "./ParentAnnualAttendance.css";

type AttendanceRecord = {
  attendance_date: string;
  status: string;
};

type Student = {
  student_name: string;
  admission_no: string;
  class: string;
  section: string;
};

type Holiday = {
  title: string;
  event_type: string;
  start_date: string;
  end_date: string;
};

const months = [
  { name: "April", year: 2026, month: 4 },
  { name: "May", year: 2026, month: 5 },
  { name: "June", year: 2026, month: 6 },
  { name: "July", year: 2026, month: 7 },
  { name: "August", year: 2026, month: 8 },
  { name: "September", year: 2026, month: 9 },
  { name: "October", year: 2026, month: 10 },
  { name: "November", year: 2026, month: 11 },
  { name: "December", year: 2026, month: 12 },
  { name: "January", year: 2027, month: 1 },
  { name: "February", year: 2027, month: 2 },
  { name: "March", year: 2027, month: 3 },
];

/* =========================================================
   CONVERT DATE TO INDIA DATE KEY
========================================================= */

const toIndiaDateKey = (value: string) => {
  const date = new Date(value);

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;

  return `${y}-${m}-${d}`;
};

/* =========================================================
   DATE KEY TO LOCAL DATE
========================================================= */

const dateFromKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
};

/* =========================================================
   NORMALIZE ATTENDANCE
   Same student + same date = COUNT ONLY ONCE
   If duplicate records exist, last record wins.
========================================================= */

const getUniqueAttendance = (
  records: AttendanceRecord[]
): AttendanceRecord[] => {
  const map = new Map<string, AttendanceRecord>();

  records.forEach((record) => {
    const dateKey = toIndiaDateKey(record.attendance_date);

    map.set(dateKey, {
      ...record,
      attendance_date: dateKey,
    });
  });

  return Array.from(map.values());
};

/* =========================================================
   CHECK WHETHER EVENT IS ACTUAL HOLIDAY
   CELEBRATION / EXAM ARE NOT HOLIDAYS
========================================================= */

const isActualHoliday = (holiday: Holiday) => {
  return (
    holiday.event_type &&
    holiday.event_type.trim().toUpperCase() === "HOLIDAY"
  );
};

/* =========================================================
   CHECK HOLIDAY FOR A DATE
========================================================= */

const isHolidayDate = (
  dateKey: string,
  holidays: Holiday[]
) => {
  return holidays.some((holiday) => {
    if (!isActualHoliday(holiday)) {
      return false;
    }

    const start = toIndiaDateKey(holiday.start_date);

    const end = holiday.end_date
      ? toIndiaDateKey(holiday.end_date)
      : start;

    return dateKey >= start && dateKey <= end;
  });
};

/* =========================================================
   GET CURRENT MONTH
========================================================= */

const getCurrentAcademicMonthIndex = () => {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const index = months.findIndex(
    (item) =>
      item.year === currentYear &&
      item.month === currentMonth
  );

  /*
    If current date is outside the academic session,
    show the last month of the session.
  */

  return index >= 0 ? index : months.length - 1;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ParentAnnualAttendance() {
  const navigate = useNavigate();

  const [student, setStudent] =
    useState<Student | null>(null);

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [holidays, setHolidays] =
    useState<Holiday[]>([]);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const parentData =
          localStorage.getItem("parent");

        if (!parentData) {
          navigate("/parent/login");
          return;
        }

        const parent = JSON.parse(parentData);

        const admissionNo =
          parent.admission_no;

        if (!admissionNo) {
          navigate("/parent/login");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/parents/annual-attendance/${admissionNo}`
        );

        if (!response.ok) {
          throw new Error(
            `HTTP Error ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success) {
          setStudent(data.student);

          /*
            IMPORTANT:
            Duplicate attendance records are normalized
            before storing them.
          */

          const uniqueAttendance =
            getUniqueAttendance(
              data.attendance || []
            );

          setAttendance(uniqueAttendance);

          setHolidays(
            data.holidays || []
          );
        }
      } catch (error) {
        console.error(
          "Annual Attendance Error",
          error
        );
      }
    };

    loadData();
  }, [navigate]);

  /* =======================================================
     GET STATUS FOR CALENDAR DATE
  ======================================================= */

  const getStatus = (date: string) => {
    /*
      HOLIDAY MUST HAVE PRIORITY.
      Even if attendance accidentally exists
      on a holiday, it must NOT show as Present.
    */

    if (
      isHolidayDate(
        date,
        holidays
      )
    ) {
      return "holiday";
    }

    const dateObject =
      dateFromKey(date);

    /*
      Sunday has priority over attendance.
    */

    if (dateObject.getDay() === 0) {
      return "sunday";
    }

    const attendanceRecord =
      attendance.find(
        (item) =>
          toIndiaDateKey(
            item.attendance_date
          ) === date
      );

    if (attendanceRecord) {
      const status =
        attendanceRecord.status
          .toLowerCase()
          .trim();

      if (
        status === "p" ||
        status === "present"
      ) {
        return "present";
      }

      if (
        status === "a" ||
        status === "absent"
      ) {
        return "absent";
      }
    }

    return "empty";
  };

  /* =======================================================
     GET NUMBER OF DAYS
  ======================================================= */

  const getDays = (
    year: number,
    month: number
  ) => {
    const total =
      new Date(
        year,
        month,
        0
      ).getDate();

    return Array.from(
      { length: total },
      (_, i) => i + 1
    );
  };

  /* =======================================================
     GET STARTING EMPTY DAYS
     Monday = 0
     Tuesday = 1
     ...
     Sunday = 6
  ======================================================= */

  const getStartingEmptyDays = (
    year: number,
    month: number
  ) => {
    const firstDay =
      new Date(
        year,
        month - 1,
        1
      ).getDay();

    return firstDay === 0
      ? 6
      : firstDay - 1;
  };

  /* =======================================================
     MONTH SUMMARY
  ======================================================= */

  const getMonthSummary = (
    year: number,
    month: number
  ) => {
    const totalDays =
      new Date(
        year,
        month,
        0
      ).getDate();

    let workingDays = 0;

    let present = 0;

    let absent = 0;

    /*
      Loop through every date of the month.
    */

    for (
      let day = 1;
      day <= totalDays;
      day++
    ) {
      const dateKey =
        `${year}-${String(month).padStart(
          2,
          "0"
        )}-${String(day).padStart(
          2,
          "0"
        )}`;

      const dateObject =
        dateFromKey(dateKey);

      /*
        Sunday is not a working day.
      */

      if (
        dateObject.getDay() === 0
      ) {
        continue;
      }

      /*
        Actual HOLIDAY is not a working day.
        CELEBRATION and EXAM are ignored here.
      */

      if (
        isHolidayDate(
          dateKey,
          holidays
        )
      ) {
        continue;
      }

      /*
        This is a genuine working day.
      */

      workingDays++;

      /*
        Because attendance was already
        normalized by date, a date can
        contribute only once.
      */

      const record =
        attendance.find(
          (item) =>
            toIndiaDateKey(
              item.attendance_date
            ) === dateKey
        );

      if (record) {
        const status =
          record.status
            .toLowerCase()
            .trim();

        if (
          status === "p" ||
          status === "present"
        ) {
          present++;
        }

        if (
          status === "a" ||
          status === "absent"
        ) {
          absent++;
        }
      }
    }

    const percentage =
      workingDays > 0
        ? Math.round(
            (present / workingDays) * 100
          )
        : 0;

    return {
      workingDays,
      present,
      absent,
      percentage,
    };
  };

  /* =======================================================
     CUMULATIVE SUMMARY
     APRIL -> CURRENT MONTH
  ======================================================= */

  const getCumulativeSummary = (
    currentIndex: number
  ) => {
    let totalWorkingDays = 0;

    let totalPresent = 0;

    let totalAbsent = 0;

    for (
      let i = 0;
      i <= currentIndex;
      i++
    ) {
      const item = months[i];

      const summary =
        getMonthSummary(
          item.year,
          item.month
        );

      totalWorkingDays +=
        summary.workingDays;

      totalPresent +=
        summary.present;

      totalAbsent +=
        summary.absent;
    }

    const percentage =
      totalWorkingDays > 0
        ? Math.round(
            (totalPresent /
              totalWorkingDays) *
              100
          )
        : 0;

    return {
      totalWorkingDays,
      totalPresent,
      totalAbsent,
      percentage,
    };
  };

  /* =======================================================
     CURRENT MONTH
  ======================================================= */

  const currentMonthIndex =
    getCurrentAcademicMonthIndex();

  const currentMonth =
    months[currentMonthIndex];

  const currentMonthSummary =
    getMonthSummary(
      currentMonth.year,
      currentMonth.month
    );

  const cumulativeSummary =
    getCumulativeSummary(
      currentMonthIndex
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="annual-attendance-page">

      {/* HEADER */}

      <div className="annual-header">

        <button
          className="annual-back"
          onClick={() =>
            navigate("/parent/dashboard")
          }
        >
          ←
        </button>

        <div>
          <h1>
            Annual Attendance
          </h1>

          <p>
            DAV PUBLIC SCHOOL
          </p>
        </div>

      </div>


      {/* STUDENT BAR */}

      {student && (
        <div className="annual-student-bar">

          <strong>
            {student.student_name}
          </strong>

          <span>
            Class {student.class},
            {student.section}
          </span>

          <span>
            Admission No :{" "}
            {student.admission_no}
          </span>

        </div>
      )}


      {/* SESSION */}

      <div className="session-title">
        Session : 2026-27
      </div>


      {/* =================================================
          CURRENT MONTH ONLY
      ================================================= */}

      <div
        className="month-card"
        key={`${currentMonth.year}-${currentMonth.month}`}
      >

        <h2>
          {currentMonth.name}{" "}
          {currentMonth.year}
        </h2>


        {/* WEEK HEADER */}

        <div className="week-header">

          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>

        </div>


        {/* CALENDAR */}

        <div className="days-grid">

          {[
            ...Array(
              getStartingEmptyDays(
                currentMonth.year,
                currentMonth.month
              )
            ).fill(null),

            ...getDays(
              currentMonth.year,
              currentMonth.month
            ),
          ].map((day, index) => {

            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="day-box empty"
                />
              );
            }

            const date =
              `${currentMonth.year}-${String(
                currentMonth.month
              ).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`;

            const status =
              getStatus(date);

            return (
              <div
                key={day}
                className={`day-box ${status}`}
                title={date}
              >

                <div>
                  {day}
                </div>

                <small>

                  {status === "present"
                    ? "PR"
                    : status === "absent"
                    ? "AB"
                    : status === "holiday"
                    ? "HO"
                    : status === "sunday"
                    ? "SU"
                    : "-"}

                </small>

              </div>
            );
          })}

        </div>


        {/* =================================================
            CURRENT MONTH SUMMARY
        ================================================= */}

        <div className="month-summary">

          <h3>
            {currentMonth.name} Attendance Summary
          </h3>

          <div className="summary-grid">

            <div>
              <span>
                Working Days
              </span>

              <b>
                {currentMonthSummary.workingDays}
              </b>
            </div>


            <div>
              <span>
                Present
              </span>

              <b>
                {currentMonthSummary.present}
              </b>
            </div>


            <div>
              <span>
                Absent
              </span>

              <b>
                {currentMonthSummary.absent}
              </b>
            </div>


            <div>
              <span>
                Attendance %
              </span>

              <b>
                {currentMonthSummary.percentage}%
              </b>
            </div>

          </div>

        </div>


        {/* =================================================
            CUMULATIVE SUMMARY
        ================================================= */}

        <div className="cumulative-summary">

          <h3>
            Attendance Summary
            (April - {currentMonth.name})
          </h3>


          <div className="summary-grid">

            <div>
              <span>
                Total Working Days
              </span>

              <b>
                {
                  cumulativeSummary.totalWorkingDays
                }
              </b>
            </div>


            <div>
              <span>
                Total Present
              </span>

              <b>
                {
                  cumulativeSummary.totalPresent
                }
              </b>
            </div>


            <div>
              <span>
                Total Absent
              </span>

              <b>
                {
                  cumulativeSummary.totalAbsent
                }
              </b>
            </div>


            <div>
              <span>
                Attendance %
              </span>

              <b>
                {
                  cumulativeSummary.percentage
                }%
              </b>
            </div>

          </div>

        </div>

      </div>


      {/* LEGEND */}

      <div className="legend">

        <span>🟩 Present</span>

        <span>🟥 Absent</span>

        <span>🟫 Holiday / Vacation</span>

        <span>🟦 Sunday</span>

        <span>⬜ No Data</span>

      </div>

    </div>
  );
}