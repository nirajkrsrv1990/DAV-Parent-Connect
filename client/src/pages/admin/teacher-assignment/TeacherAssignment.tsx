import { useMemo, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";
import "./TeacherAssignment.css";

type Assignment = {
  id: number;
  teacher: string;
  className: string;
  sections: string[];
  subjects: string[];
  classTeacher: boolean;
  status: "Active" | "Inactive";
};

export default function TeacherAssignment() {

  const teacherList = [
    "Amit Kumar",
    "Rajesh Kumar",
    "Pankaj Kumar",
    "Neha Kumari",
    "Sanjay Kumar",
  ];

  const classList = [
    "Nursery",
    "LKG",
    "UKG",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  const sectionList = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "JEE",
    "NEET",
    "PCB",
    "PCM",
    "COMM",
  ];

  const subjectList = [
    "English",
    "Hindi",
    "Sanskrit",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Accounts",
    "Business Studies",
  ];

  const [teacher, setTeacher] = useState("");

  const [className, setClassName] = useState("");

  const [sections, setSections] = useState<string[]>([]);

  const [subjects, setSubjects] = useState<string[]>([]);

  const [classTeacher, setClassTeacher] = useState(false);

  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  const [search, setSearch] = useState("");

  const [editId, setEditId] =
    useState<number | null>(null);

  const [assignmentList, setAssignmentList] =
    useState<Assignment[]>([]);

  const toggleSection = (item: string) => {

    setSections((prev) =>
      prev.includes(item)
        ? prev.filter((x) => x !== item)
        : [...prev, item]
    );

  };

  const toggleSubject = (item: string) => {

    setSubjects((prev) =>
      prev.includes(item)
        ? prev.filter((x) => x !== item)
        : [...prev, item]
    );

  };

  const resetForm = () => {

    setTeacher("");
    setClassName("");
    setSections([]);
    setSubjects([]);
    setClassTeacher(false);
    setStatus("Active");
    setEditId(null);

  };

  const saveAssignment = () => {

    if (!teacher) {
      alert("Select Teacher");
      return;
    }

    if (!className) {
      alert("Select Class");
      return;
    }

    if (sections.length === 0) {
      alert("Select Section");
      return;
    }

    if (subjects.length === 0) {
      alert("Select Subject");
      return;
    }

    const data: Assignment = {

      id: editId ?? Date.now(),

      teacher,

      className,

      sections,

      subjects,

      classTeacher,

      status,

    };

    if (editId !== null) {

      setAssignmentList(
        assignmentList.map((item) =>
          item.id === editId
            ? data
            : item
        )
      );

    } else {

      setAssignmentList([
        ...assignmentList,
        data,
      ]);

    }

    resetForm();

  };

  const editAssignment = (item: Assignment) => {

    setEditId(item.id);

    setTeacher(item.teacher);

    setClassName(item.className);

    setSections([...item.sections]);

    setSubjects([...item.subjects]);

    setClassTeacher(item.classTeacher);

    setStatus(item.status);

  };

  const deleteAssignment = (id: number) => {

    if (!window.confirm("Delete Assignment?"))
      return;

    setAssignmentList(
      assignmentList.filter(
        (item) => item.id !== id
      )
    );

  };

  const filteredData = useMemo(() => {

    return assignmentList.filter((item) =>
      item.teacher
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [assignmentList, search]);

  return (
  <>
    <Sidebar />
    <Header />

    <main className="dashboard-content">

      <div className="master-page">

        <div className="page-header">
          <h1>Teacher Assignment</h1>
        </div>

        <div className="master-form">

          <div className="form-row">

            <div className="form-group">

              <label>Teacher</label>

              <select
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
              >
                <option value="">Select Teacher</option>

                {teacherList.map((item) => (
                  <option key={item}>{item}</option>
                ))}

              </select>

            </div>

            <div className="form-group">

              <label>Class</label>

              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              >
                <option value="">Select Class</option>

                {classList.map((item) => (
                  <option key={item}>{item}</option>
                ))}

              </select>

            </div>

          </div>

          <label>Sections</label>

          <div className="section-grid">

            {sectionList.map((item) => (

              <button
                key={item}
                type="button"
                className={
                  sections.includes(item)
                    ? "section-btn active"
                    : "section-btn"
                }
                onClick={() => toggleSection(item)}
              >
                {item}
              </button>

            ))}

          </div>

          <br />

          <label>Subjects</label>

          <div className="section-grid">

            {subjectList.map((item) => (

              <button
                key={item}
                type="button"
                className={
                  subjects.includes(item)
                    ? "section-btn active"
                    : "section-btn"
                }
                onClick={() => toggleSubject(item)}
              >
                {item}
              </button>

            ))}

          </div>

          <br />

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >

            <label>

              <input
                type="checkbox"
                checked={classTeacher}
                onChange={(e) =>
                  setClassTeacher(e.target.checked)
                }
              />

              &nbsp; Class Teacher

            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | "Active"
                    | "Inactive"
                )
              }
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>

          <div className="btn-group">

            <button
              className="save-btn"
              onClick={saveAssignment}
            >
              {editId === null ? "Save" : "Update"}
            </button>

            <button
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>

          </div>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search Teacher..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <table className="master-table">

          <thead>

            <tr>

              <th>Teacher</th>

              <th>Class</th>

              <th>Sections</th>

              <th>Subjects</th>

              <th>Class Teacher</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredData.map((item) => (

              <tr key={item.id}>

                <td>{item.teacher}</td>

                <td>{item.className}</td>

                <td>{item.sections.join(", ")}</td>

                <td>{item.subjects.join(", ")}</td>

                <td>
                  {item.classTeacher ? "Yes" : "No"}
                </td>

                <td>{item.status}</td>

                <td>

                  <div className="action-btns">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editAssignment(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteAssignment(item.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {filteredData.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  style={{ textAlign: "center" }}
                >
                  No Record Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </main>

  </>
);

}