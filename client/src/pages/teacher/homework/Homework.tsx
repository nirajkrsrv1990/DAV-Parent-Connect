import { useState } from "react";
import "./Homework.css";
import TeacherSidebar from "../../../components/teacher/TeacherSidebar";
import TeacherHeader from "../../../components/teacher/TeacherHeader";

type HomeworkItem = {
  id: number;
  subject: string;
  homework: string;
  dueDate: string;
  pdf: File | null;
  image: File | null;
};

export default function Homework() {

  const [selectedClass, setSelectedClass] = useState("VIII");
  const [selectedSection, setSelectedSection] = useState("A");
  const [subject, setSubject] = useState("English");
  const [homework, setHomework] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [pdf, setPdf] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);

  const saveHomework = () => {

    if (!homework.trim()) {
      alert("Enter Homework");
      return;
    }

    if (!dueDate) {
      alert("Select Due Date");
      return;
    }

    setHomeworkList([
      {
        id: Date.now(),
        subject,
        homework,
        dueDate,
        pdf,
        image,
      },
      ...homeworkList,
    ]);

    setHomework("");
    setDueDate("");
    setPdf(null);
    setImage(null);

    alert("Homework Uploaded Successfully");

  };

  return (
  <>
    <TeacherSidebar />
    <TeacherHeader />

    <main className="homework-page">

      <div className="homework-header">

        <h1>Homework Management</h1>

        <button
          className="save-btn"
          onClick={saveHomework}
        >
          Upload Homework
        </button>

      </div>

      <div className="homework-form">

        <div className="form-grid">

  <div>

    <label>Class</label>

    <select
      value={selectedClass}
      onChange={(e) =>
        setSelectedClass(e.target.value)
      }
    >
      <option>VII</option>
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
      value={subject}
      onChange={(e) =>
        setSubject(e.target.value)
      }
    >
      <option>English</option>
      <option>Hindi</option>
      <option>Mathematics</option>
      <option>Science</option>
      <option>Social Science</option>
      <option>Computer</option>
    </select>

  </div>

  <div>

    <label>Due Date</label>

    <input
      type="date"
      value={dueDate}
      onChange={(e) =>
        setDueDate(e.target.value)
      }
    />

  </div>

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
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>Social Science</option>
              <option>Computer</option>
            </select>

          </div>

          <div>

            <label>Due Date</label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />

          </div>

        </div>

        <div style={{ marginTop: "25px" }}>

  <label>Homework Description</label>

  <textarea
  rows={10}
  value={homework}
  placeholder="Enter today's homework for students..."
  onChange={(e) =>
    setHomework(e.target.value)
  }
  style={{
    width: "100%",
    minHeight: "220px"
  }}
/>

</div>

<div
  className="form-grid"
  style={{ marginTop: "25px" }}
>

  <div>

    <label>Attach PDF (Optional)</label>

    <input
      type="file"
      accept=".pdf"
      onChange={(e) =>
        setPdf(
          e.target.files
            ? e.target.files[0]
            : null
        )
      }
    />

  </div>

  <div>

    <label>Attach Image (Optional)</label>

    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setImage(
          e.target.files
            ? e.target.files[0]
            : null
        )
      }
    />

  </div>

</div>

         <div className="homework-list">

        <table>

          <thead>

            <tr>

  <th style={{ width: "70px" }}>#</th>

  <th>Subject</th>

  <th>Homework</th>

  <th>Due Date</th>

  <th>PDF</th>

  <th>Image</th>

</tr>

          </thead>

          <tbody>

  {homeworkList.map((item, index) => (

    <tr key={item.id}>

      <td>{index + 1}</td>

      <td>{item.subject}</td>

      <td>{item.homework}</td>

      <td>{item.dueDate}</td>

      <td>

        {item.pdf ? (

          <span
            style={{
              color: "#1565C0",
              fontWeight: 600,
            }}
          >
            📄 {item.pdf.name}
          </span>

        ) : (

          "-"

        )}

      </td>

      <td>

        {item.image ? (

          <span
            style={{
              color: "#2E7D32",
              fontWeight: 600,
            }}
          >
            🖼 {item.image.name}
          </span>

        ) : (

          "-"

        )}

      </td>

    </tr>

  ))}

  {homeworkList.length === 0 && (

    <tr>

      <td
        colSpan={6}
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#777",
          fontWeight: 600,
        }}
      >

        No Homework Uploaded Yet

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