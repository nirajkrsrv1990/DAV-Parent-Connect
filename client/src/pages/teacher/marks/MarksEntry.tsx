import { useMemo, useState } from "react";

import "./MarksEntry.css";
import TeacherSidebar from "../../../components/teacher/TeacherSidebar";
import { API_BASE_URL } from "@/config/api";

type StudentMark = {
  id: number;
  roll: number;
  admissionNo: string;
  studentName: string;
  theory: number;
  practical: number;
};

const classSections: Record<string, string[]> = {
  NURSERY: ["A"],
  LKG: ["A"],
  UKG: ["A", "B"],
  I: ["A", "B"],
  II: ["A", "B", "C"],
  III: ["A", "B", "C", "D"],
  IV: ["A", "B", "C", "D"],
  V: ["A", "B", "C", "D", "E", "F"],
  VI: ["A", "B", "C", "D", "E", "JEE", "NEET"],
  VII: ["A", "B", "C", "D", "E", "JEE", "NEET"],
  VIII: ["A", "B", "C", "D", "E", "JEE", "NEET"],
  IX: ["A", "B", "C", "D", "E", "JEE", "NEET"],
  X: ["A", "B", "C", "D", "E", "JEE", "NEET"],
  XI: ["COMM", "JEE", "NEET"],
  XII: ["COMM", "JEE", "NEET"],
};

const classOptions = Object.keys(classSections);

export default function MarksEntry() {
  const [selectedExam, setSelectedExam] =
    useState("1st Pre-Mid");

  const [selectedClass, setSelectedClass] =
    useState("VIII");

  const [selectedSection, setSelectedSection] =
    useState("A");

  const [selectedSubject, setSelectedSubject] =
    useState("English");

  const [search, setSearch] = useState("");

  const [students, setStudents] =
    useState<StudentMark[]>([]);

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const [studentError, setStudentError] =
    useState("");

  /* =====================================================
     LOAD STUDENTS FROM DATABASE
  ===================================================== */

  useEffect(() => {
    const loadStudents = async () => {
      setLoadingStudents(true);
      setStudentError("");
      setStudents([]);

      try {
        const url =
          `${API_BASE_URL}/students?class=${encodeURIComponent(
            selectedClass
          )}&section=${encodeURIComponent(
            selectedSection
          )}`;

        console.log("Marks Students API:", url);

        const response = await fetch(url);

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Unable to load students"
          );
        }

        const studentList =
          Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.students)
            ? result.students
            : [];

        const mappedStudents: StudentMark[] =
          studentList.map((student: any, index: number) => ({
            id: Number(student.id),

            roll:
              Number(student.roll_no) ||
              index + 1,

            admissionNo:
              student.admission_no || "",

            studentName:
              student.student_name || "",

            theory: 0,

            practical: 0,
          }));

        setStudents(mappedStudents);

      } catch (error) {
        console.error(
          "Marks Students API Error:",
          error
        );

        setStudentError(
          "Unable to load students."
        );

      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();

    setSearch("");
  }, [selectedClass, selectedSection]);

  /* =====================================================
     UPDATE THEORY
  ===================================================== */

  const updateTheory = (
    id: number,
    value: number
  ) => {
    setStudents((currentStudents) =>
      currentStudents.map((item) =>
        item.id === id
          ? {
              ...item,
              theory: value,
            }
          : item
      )
    );
  };

  /* =====================================================
     UPDATE PRACTICAL
  ===================================================== */

  const updatePractical = (
    id: number,
    value: number
  ) => {
    setStudents((currentStudents) =>
      currentStudents.map((item) =>
        item.id === id
          ? {
              ...item,
              practical: value,
            }
          : item
      )
    );
  };

  /* =====================================================
     SEARCH STUDENTS
  ===================================================== */

  const filteredStudents = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return students;
    }

    return students.filter(
      (item) =>
        item.studentName
          .toLowerCase()
          .includes(searchText) ||
        item.admissionNo
          .toLowerCase()
          .includes(searchText)
    );
  }, [students, search]);

  /* =====================================================
     SAVE MARKS
  ===================================================== */

  const saveMarks = () => {
    alert("Marks Saved Successfully");

    console.log({
      exam: selectedExam,
      class: selectedClass,
      section: selectedSection,
      subject: selectedSubject,
      students,
    });
  };

  /* =====================================================
     CLASS CHANGE
  ===================================================== */

  const handleClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newClass = e.target.value;

    setSelectedClass(newClass);

    const sections =
      classSections[newClass] || [];

    setSelectedSection(
      sections[0] || ""
    );
  };

  return (
    <>
      <TeacherSidebar />

      <main className="marks-page">

        <div className="marks-header">

          <h1>Marks Entry</h1>

          <button
            className="save-btn"
            onClick={saveMarks}
          >
            Save Marks
          </button>

        </div>

        {/* =================================================
            FILTER CARD
        ================================================= */}

        <div className="filter-card">

          <div className="filter-grid">

            {/* EXAM */}

            <div>
              <label>Exam</label>

              <select
                value={selectedExam}
                onChange={(e) =>
                  setSelectedExam(
                    e.target.value
                  )
                }
              >
                <option>
                  1st Pre-Mid
                </option>

                <option>
                  2nd Pre-Mid
                </option>

                <option>
                  Half Yearly
                </option>

                <option>
                  1st Post-Mid
                </option>

                <option>
                  2nd Post-Mid
                </option>

                <option>
                  Annual
                </option>
              </select>
            </div>

            {/* CLASS */}

            <div>
              <label>Class</label>

              <select
                value={selectedClass}
                onChange={
                  handleClassChange
                }
              >
                {classOptions.map(
                  (className) => (
                    <option
                      key={className}
                      value={className}
                    >
                      {className}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* SECTION */}

            <div>
              <label>Section</label>

              <select
                value={selectedSection}
                onChange={(e) =>
                  setSelectedSection(
                    e.target.value
                  )
                }
              >
                {(
                  classSections[
                    selectedClass
                  ] || []
                ).map((section) => (
                  <option
                    key={section}
                    value={section}
                  >
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT */}

            <div>
              <label>Subject</label>

              <select
                value={selectedSubject}
                onChange={(e) =>
                  setSelectedSubject(
                    e.target.value
                  )
                }
              >
                <option>
                  English
                </option>

                <option>
                  Hindi
                </option>

                <option>
                  Mathematics
                </option>

                <option>
                  Science
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="search-box">

          <input
            type="text"
            placeholder="Search Student..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {/* =================================================
            STUDENT TABLE
        ================================================= */}

        <div className="marks-table">

          {loadingStudents && (
            <p
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              Loading students...
            </p>
          )}

          {!loadingStudents &&
            studentError && (
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "red",
                }}
              >
                {studentError}
              </p>
            )}

          {!loadingStudents &&
            !studentError &&
            students.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No students found for{" "}
                {selectedClass} -{" "}
                {selectedSection}
              </p>
            )}

          {!loadingStudents &&
            !studentError &&
            students.length > 0 && (
              <table>

                <thead>
                  <tr>

                    <th>
                      Roll
                    </th>

                    <th>
                      Admission No
                    </th>

                    <th>
                      Student Name
                    </th>

                    <th>
                      Theory
                    </th>

                    <th>
                      Practical
                    </th>

                    <th>
                      Total
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredStudents.map(
                    (student) => (

                      <tr
                        key={student.id}
                      >

                        <td>
                          {student.roll}
                        </td>

                        <td>
                          {
                            student.admissionNo
                          }
                        </td>

                        <td>
                          {
                            student.studentName
                          }
                        </td>

                        <td>

                          <input
                            type="number"
                            value={
                              student.theory
                            }
                            onChange={(e) =>
                              updateTheory(
                                student.id,
                                Number(
                                  e.target
                                    .value
                                )
                              )
                            }
                            style={{
                              width: "80px",
                            }}
                          />

                        </td>

                        <td>

                          <input
                            type="number"
                            value={
                              student.practical
                            }
                            onChange={(e) =>
                              updatePractical(
                                student.id,
                                Number(
                                  e.target
                                    .value
                                )
                              )
                            }
                            style={{
                              width: "80px",
                            }}
                          />

                        </td>

                        <td>

                          <strong>
                            {student.theory +
                              student.practical}
                          </strong>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>
            )}

          {!loadingStudents &&
            !studentError &&
            students.length > 0 &&
            filteredStudents.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No matching student found.
              </p>
            )}

        </div>

      </main>
    </>
  );
}