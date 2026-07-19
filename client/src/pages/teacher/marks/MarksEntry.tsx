import { useMemo, useState } from "react";
import "./MarksEntry.css";
import TeacherSidebar from "../../../components/teacher/TeacherSidebar";
import TeacherHeader from "../../../components/teacher/TeacherHeader";

type StudentMark = {
  id: number;
  roll: number;
  admissionNo: string;
  studentName: string;
  theory: number;
  practical: number;
};

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
    useState<StudentMark[]>([
      {
        id: 1,
        roll: 1,
        admissionNo: "2026/DAV/001",
        studentName: "Rahul Kumar",
        theory: 18,
        practical: 0,
      },
      {
        id: 2,
        roll: 2,
        admissionNo: "2026/DAV/002",
        studentName: "Aryan Kumar",
        theory: 17,
        practical: 0,
      },
      {
        id: 3,
        roll: 3,
        admissionNo: "2026/DAV/003",
        studentName: "Rohan Kumar",
        theory: 20,
        practical: 0,
      },
      {
        id: 4,
        roll: 4,
        admissionNo: "2026/DAV/004",
        studentName: "Neha Kumari",
        theory: 16,
        practical: 0,
      },
    ]);

  const updateTheory = (
    id: number,
    value: number
  ) => {

    setStudents(
      students.map((item) =>
        item.id === id
          ? {
              ...item,
              theory: value,
            }
          : item
      )
    );

  };

  const updatePractical = (
    id: number,
    value: number
  ) => {

    setStudents(
      students.map((item) =>
        item.id === id
          ? {
              ...item,
              practical: value,
            }
          : item
      )
    );

  };

  const filteredStudents = useMemo(() => {

    return students.filter((item) =>
      item.studentName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [students, search]);

  const saveMarks = () => {

    alert("Marks Saved Successfully");

    console.log(students);

  };

  return (
  <>
    <TeacherSidebar />
    <TeacherHeader />

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

      <div className="filter-card">

        <div className="filter-grid">

          <div>

            <label>Exam</label>

            <select
              value={selectedExam}
              onChange={(e) =>
                setSelectedExam(e.target.value)
              }
            >
              <option>1st Pre-Mid</option>
              <option>2nd Pre-Mid</option>
              <option>Half Yearly</option>
              <option>1st Post-Mid</option>
              <option>2nd Post-Mid</option>
              <option>Annual</option>
            </select>

          </div>

          <div>

            <label>Class</label>

            <select
              value={selectedClass}
              onChange={(e) =>
                setSelectedClass(e.target.value)
              }
            >
              <option>VIII</option>
              <option>IX</option>
              <option>X</option>
            </select>

          </div>

          <div>

            <label>Section</label>

            <select
              value={selectedSection}
              onChange={(e) =>
                setSelectedSection(e.target.value)
              }
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>

          </div>

          <div>

            <label>Subject</label>

            <select
              value={selectedSubject}
              onChange={(e) =>
                setSelectedSubject(e.target.value)
              }
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Mathematics</option>
              <option>Science</option>
            </select>

          </div>

        </div>

      </div>

      <div className="search-box">

        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="marks-table">

        <table>

          <thead>

            <tr>

              <th>Roll</th>

              <th>Admission No</th>

              <th>Student Name</th>

              <th>Theory</th>

              <th>Practical</th>

              <th>Total</th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.map((student) => (

              <tr key={student.id}>

                <td>{student.roll}</td>

                <td>{student.admissionNo}</td>

                <td>{student.studentName}</td>

                <td>

                  <input
                    type="number"
                    value={student.theory}
                    onChange={(e) =>
                      updateTheory(
                        student.id,
                        Number(e.target.value)
                      )
                    }
                    style={{ width: "80px" }}
                  />

                </td>

                <td>

                  <input
                    type="number"
                    value={student.practical}
                    onChange={(e) =>
                      updatePractical(
                        student.id,
                        Number(e.target.value)
                      )
                    }
                    style={{ width: "80px" }}
                  />

                </td>

                <td>

                  <strong>
                    {student.theory + student.practical}
                  </strong>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>

  </>
);

}