import { useCallback, useEffect, useState } from "react";
import "./Attendance.css";
import TeacherSidebar from "../../../components/teacher/TeacherSidebar";
import TeacherHeader from "../../../components/teacher/TeacherHeader";

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

  const [selectedClass, setSelectedClass] =
    useState("");

  const [selectedSection, setSelectedSection] =
    useState("");

  const [students, setStudents] =
    useState<Student[]>([]);

  const [classes, setClasses] =
    useState<ClassMaster[]>([]);

  const [loading, setLoading] =
    useState(false);
    const loadAssignedClass = useCallback(async () => {

  const teacherData = localStorage.getItem("teacher");

  if (!teacherData) return;

  const teacher = JSON.parse(teacherData);

  try {

    const response = await fetch(
      `/api/class-teacher/${teacher.teacher_id}`
    );

    const result = await response.json();
    console.log("Class Teacher API:", result);

    if (result.success && result.assignment) {

      setSelectedClass(result.assignment.class_name);

      setSelectedSection(result.assignment.section);
      console.log(
"Assigned",
result.assignment.class_name,
result.assignment.section
);

    }

  } catch (err) {

    console.log(err);

  }

}, []);

  const loadClasses = useCallback(async () => {

    try {
      console.log(
"Loading Students",
selectedClass,
selectedSection
);

      const response = await fetch(
        "/api/master/class"
      );

      const result = await response.json();

      if (result.success) {

        setClasses(result.classes);

        

      }

    } catch (err) {

      console.log(err);

    }

  }, []);

  const loadStudents = useCallback(async () => {

    if (!selectedClass || !selectedSection)
      return;

    try {

      setLoading(true);
      console.log("Loading Students...");
console.log("Class:", selectedClass);
console.log("Section:", selectedSection);

      const response = await fetch(

        `/api/students?class=${selectedClass}&section=${selectedSection}`

      );

      const result = await response.json();
      console.log("Students API Result:", result);

      if (result.success) {

        const data: Student[] =
          result.students.map(
            (item: Student) => ({
              ...item,
              status: "P",
            })
          );

        setStudents(data);

      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }, [selectedClass, selectedSection]);

  useEffect(() => {

  void loadClasses();

  void loadAssignedClass();

}, [
  loadClasses,
  loadAssignedClass,
]);

  useEffect(() => {

  if (selectedClass && selectedSection) {

    loadStudents();

  }

}, [
  selectedClass,
  selectedSection,
  loadStudents,
]);
    const markAttendance = (
    id: number,
    status: "P" | "A"
  ) => {

    setStudents((prev) =>

  prev.map((student) =>

        student.id === id
          ? {
              ...student,
              status,
            }
          : student

      )

    );

  };

  const saveAttendance = () => {

    console.log(students);

    alert("Attendance Saved Successfully");

  };

  return (

    <>

      <TeacherSidebar />

      <TeacherHeader />

      <main className="attendance-page">

        <div className="attendance-header">

          <h1>Attendance Management</h1>

          <button
            className="save-btn"
            onClick={saveAttendance}
          >
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
                onChange={(e) =>
                  setAttendanceDate(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <label>Class</label>

              <select
  value={selectedClass}
  disabled
                onChange={(e) =>
                  setSelectedClass(
                    e.target.value
                  )
                }
              >

                {classes.map((item) => (

                  <option
                    key={item.id}
                    value={item.class_name}
                  >

                    {item.class_name}

                  </option>

                ))}

              </select>

            </div>

            <div>

              <label>Section</label>

              <select
  value={selectedSection}
  disabled
                onChange={(e) =>
                  setSelectedSection(
                    e.target.value
                  )
                }
              >

                {classes
                  .find(
                    (c) =>
                      c.class_name ===
                      selectedClass
                  )
                  ?.sections.map(
                    (section) => (

                      <option
                        key={section}
                        value={section}
                      >

                        {section}

                      </option>

                    )
                  )}

              </select>

            </div>

          </div>

        </div>

        {loading && (

          <h2
            style={{
              textAlign: "center",
            }}
          >
            Loading Students...
          </h2>

        )}

        {!loading && (

          <div className="attendance-table">

            <table>

              <thead>

                <tr>

                  <th>Roll</th>

                  <th>Admission No</th>

                  <th>Student Name</th>

                  <th
                    style={{
                      textAlign: "center",
                    }}
                  >
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

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >

                        <button
                          className={
                            student.status === "P"
                              ? "present-btn active"
                              : "present-btn"
                          }
                          onClick={() =>
                            markAttendance(
                              student.id,
                              "P"
                            )
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
                            markAttendance(
                              student.id,
                              "A"
                            )
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

        )}

      </main>

    </>

  );

}
