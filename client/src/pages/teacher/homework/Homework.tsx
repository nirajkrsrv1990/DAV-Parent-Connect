import { useState } from "react";
import "./Homework.css";
import { API_BASE_URL } from "@/config/api";

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
  const [loading, setLoading] = useState(false);

  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);

  // Function to handle homework upload and backend API integration
  const saveHomework = async () => {
    // 1. Mandatory field check for due date
    if (!dueDate) {
      alert("Please select a Due Date.");
      return;
    }

    // 2. Flexible validation: at least ONE content item must be provided (Text, PDF, or Image)
    if (!homework.trim() && !pdf && !image) {
      alert("Please provide at least one content item: Homework Description, PDF, or Image.");
      return;
    }

    setLoading(true);

    // Prepare multipart form data payload for backend submission
    const formData = new FormData();
    formData.append("class_name", selectedClass);
    formData.append("section", selectedSection);
    formData.append("subject", subject);
    formData.append("due_date", dueDate);
    if (homework.trim()) formData.append("description", homework);
    if (pdf) formData.append("pdf", pdf);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${API_BASE_URL}/homework/create`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Add to local state list for instant UI preview
        setHomeworkList([
          {
            id: result.homework?.id || Date.now(),
            subject,
            homework,
            dueDate,
            pdf,
            image,
          },
          ...homeworkList,
        ]);

        // Reset form fields
        setHomework("");
        setDueDate("");
        setPdf(null);
        setImage(null);

        alert("Homework Uploaded Successfully and parents notified!");
      } else {
        alert(result.message || "Failed to upload homework.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while uploading homework.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="homework-page">
        <div className="homework-header">
          <h1>Homework Management</h1>
          <button className="save-btn" onClick={saveHomework} disabled={loading}>
            {loading ? "Uploading..." : "Upload Homework"}
          </button>
        </div>

        <div className="homework-form">
          {/* Main Form Fields Grid */}
          <div className="form-grid">
            <div>
              <label>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option>NURSERY</option>
                <option>LKG</option>
                <option>UKG</option>
                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>
                <option>V</option>
                <option>VI</option>
                <option>VII</option>
                <option>VIII</option>
                <option>IX</option>
                <option>X</option>
                <option>XI</option>
                <option>XII</option>
              </select>
            </div>

            <div>
              <label>Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
                <option>NEET</option>
                <option>JEE</option>
                <option>PCB</option>
                <option>PCM</option>
                <option>COMM.</option>
              </select>
            </div>

            <div>
              <label>Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option>English</option>
                <option>Sanskrit</option>
                <option>Hindi</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>Social Science</option>
                <option>Computer</option>
                <option>M.Ed.</option>
                <option>G.K.</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Economics</option>
                <option>B.St.</option>
                <option>Accountancy</option>
                <option>Physical Education</option>
                <option>ART</option>
              </select>
            </div>

            <div>
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Homework Description Textarea */}
          <div style={{ marginTop: "25px" }}>
            <label>Homework Description (Optional if file attached)</label>
            <textarea
              rows={10}
              value={homework}
              placeholder="Enter today's homework for students..."
              onChange={(e) => setHomework(e.target.value)}
              style={{
                width: "100%",
                minHeight: "220px",
              }}
            />
          </div>

          {/* File Attachments Grid */}
          <div className="form-grid" style={{ marginTop: "25px" }}>
            <div>
              <label>Attach PDF (Optional)</label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) =>
                  setPdf(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>

            <div>
              <label>Attach Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
          </div>

          {/* Uploaded Homework Table Preview */}
          <div className="homework-list" style={{ marginTop: "30px" }}>
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
                    <td>{item.homework || "-"}</td>
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
        </div>
      </main>
    </>
  );
}