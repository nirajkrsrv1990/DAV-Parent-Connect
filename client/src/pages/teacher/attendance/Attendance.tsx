import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import "./Attendance.css";

type Student = {
  id: number;
  admission_no: string;
  student_name: string;
  class: string;
  section: string;
  roll_no: number;
  status: "P" | "A";
};

type ClassMaster = {
  id: number;
  class_name: string;
  sections: string[];
  display_order: number;
  status: string;
};

export default function Attendance() {
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
const [classes, setClasses] = useState<ClassMaster[]>([]);
const [loading, setLoading] = useState(false);
const [attendanceMarked, setAttendanceMarked] = useState(false);

  const loadClasses = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/master/class`);
      const result = await response.json();
      if (result.success) {
        setClasses(result.classes);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const loadStudents = useCallback(async () => {
  if (!selectedClass || !selectedSection) return;

  try {
    setLoading(true);

    // 1. Load class students
    const studentsResponse = await fetch(
      `${API_BASE_URL}/students?class=${selectedClass}&section=${selectedSection}`
    );

    const studentsResult = await studentsResponse.json();

    if (!studentsResult.success) {
      setStudents([]);
      return;
    }

    // 2. Load saved attendance for selected date
    const teacherData = localStorage.getItem("teacher");

    if (!teacherData) {
      alert("Teacher Login Expired");
      return;
    }

    const teacher = JSON.parse(teacherData);

    const attendanceResponse = await fetch(
      `/api/teachers/attendance?attendanceDate=${attendanceDate}&teacher_id=${teacher.teacher_id}`
    );

    const attendanceResult = await attendanceResponse.json();

    // 3. Convert saved attendance into a quick lookup
    const attendanceMap = new Map<number, "P" | "A">();

    if (
      attendanceResult.success &&
      Array.isArray(attendanceResult.attendance)
    ) {
      attendanceResult.attendance.forEach(
        (item: { student_id: number; status: "P" | "A" }) => {
          attendanceMap.set(item.student_id, item.status);
        }
      );
    }
    setAttendanceMarked(
  attendanceResult.success &&
  Array.isArray(attendanceResult.attendance) &&
  attendanceResult.attendance.length > 0
);

    // 4. Apply saved attendance to students
    const data: Student[] = studentsResult.students.map(
      (item: Student) => ({
        ...item,
        status: attendanceMap.get(item.id) || "P",
      })
    );

    setStudents(data);
  } catch (err) {
    console.log("Attendance Load Error:", err);
  } finally {
    setLoading(false);
  }
}, [selectedClass, selectedSection, attendanceDate]);

  useEffect(() => {
    const fetchData = async () => {
      await loadClasses();

      const teacherData = localStorage.getItem("teacher");
      if (!teacherData) return;

      const teacher = JSON.parse(teacherData);

      try {
        const response = await fetch(
  `${API_BASE_URL}/teachers/class-teacher/${teacher.teacher_id}`
);

        const result = await response.json();

        console.log("Assignment API Response:", result);

        if (result.success && result.assignment) {
          setSelectedClass(result.assignment.class_name);
          setSelectedSection(result.assignment.section);
        }
      } catch (err) {
        console.log(err);
      }
    };

    void fetchData();
  }, [loadClasses]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      void loadStudents();
    }
  }, [selectedClass, selectedSection, loadStudents]);

  // Toggle Attendance Status Present / Absent
  const markAttendance = (id: number, status: "P" | "A") => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const saveAttendance = async () => {
    try {
      const teacherData = localStorage.getItem("teacher");
      if (!teacherData) {
        alert("Teacher Login Expired");
        return;
      }

      const teacher = JSON.parse(teacherData);

      // Exact matching backend route
      const response = await fetch(`${API_BASE_URL}/teachers/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceDate,
          teacher_db_id: teacher.id,
          teacher_id: teacher.teacher_id,
          students,
        }),
      });

      const result = await response.json();

      if (result.success) {
  setAttendanceMarked(true);
  alert("Attendance Saved Successfully!");
} else {
        alert(result.message || "Failed to save attendance");
      }
    } catch (err) {
      console.log(err);
      alert("Unable to Save Attendance");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <h1>Attendance Management</h1>
        <button className="save-btn" onClick={saveAttendance}>
          Save Attendance
        </button>
      </div>

      <div className="filter-card">
        <div className="filter-grid">
          <div>
            <label>Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          <div>
            <label>Class</label>
            <select value={selectedClass} disabled>
              {classes.map((item) => (
                <option key={item.id} value={item.class_name}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Section</label>
            <select value={selectedSection} disabled>
              {classes
                .find((c) => c.class_name === selectedClass)
                ?.sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
  <h2 style={{ textAlign: "center" }}>
    Loading Students...
  </h2>
)}

{!loading && (
  <>
    {/* Attendance Table */}
    <div className="attendance-table">
      <table>
        <thead>
          <tr>
            <th>Roll</th>
            <th>Admission No</th>
            <th>Student Name</th>
            <th style={{ textAlign: "center" }}>
              Attendance
            </th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.roll_no}</td>

              <td>{student.admission_no}</td>

              <td>{student.student_name}</td>

              <td>
                <div className="attendance-action">

                  <button
                    className={
                      student.status === "P"
                        ? "present-btn active"
                        : "present-btn"
                    }
                    onClick={() =>
                      markAttendance(student.id, "P")
                    }
                  >
                    Present
                  </button>

                  <button
                    className={
                      student.status === "A"
                        ? "absent-btn active"
                        : "absent-btn"
                    }
                    onClick={() =>
                      markAttendance(student.id, "A")
                    }
                  >
                    Absent
                  </button>

                </div>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td
                colSpan={4}
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No Students Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Attendance Summary */}
    {attendanceMarked && (
      <div
        style={{
          marginTop: "15px",
          padding: "15px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            fontWeight: "700",
            color: "#15803d",
            marginBottom: "10px",
          }}
        >
          ✓ Attendance Marked for {attendanceDate}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <strong>Total:</strong> {students.length}
          {" | "}
          <strong>Present:</strong>{" "}
          {students.filter(
            (student) => student.status === "P"
          ).length}
          {" | "}
          <strong>Absent:</strong>{" "}
          {students.filter(
            (student) => student.status === "A"
          ).length}
        </div>

        <div
          style={{
            fontWeight: "700",
            color: "#dc2626",
            marginBottom: "8px",
          }}
        >
          Today's Absent Students
        </div>

        {students.filter(
          (student) => student.status === "A"
        ).length === 0 ? (
          <div style={{ color: "#15803d" }}>
            No student is absent today.
          </div>
        ) : (
          <ol
            style={{
              margin: 0,
              paddingLeft: "20px",
            }}
          >
            {students
              .filter(
                (student) => student.status === "A"
              )
              .map((student) => (
                <li
                  key={student.id}
                  style={{ marginBottom: "5px" }}
                >
                  {student.student_name} — Admission No:{" "}
                  {student.admission_no}
                </li>
              ))}
          </ol>
        )}
            </div>
    )}
  </>
)}
    </div>
  );
}