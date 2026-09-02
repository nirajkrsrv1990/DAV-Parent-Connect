import { useEffect, useState } from "react";
import "./Homework.css";
import { API_BASE_URL } from "@/config/api";

type HomeworkItem = {
  id: number;
  teacher_id?: string;
  subject: string;
  class: string;
  section: string;
  description: string | null;
  due_date: string;
  pdf_url: string | null;
  image_url: string | null;
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
  const [historyLoading, setHistoryLoading] = useState(true);

  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);

const [editingHomeworkId, setEditingHomeworkId] =
  useState<number | null>(null);

const [deletingHomeworkId, setDeletingHomeworkId] =
  useState<number | null>(null);

  /* =====================================================
     GET LOGGED-IN TEACHER ID
  ===================================================== */

  const getTeacherId = (): string | null => {
    try {
      const teacherData = localStorage.getItem("teacher");

      if (!teacherData) {
        return null;
      }

      const teacher = JSON.parse(teacherData);

      return teacher?.teacher_id || null;
    } catch (error) {
      console.error("Teacher data error:", error);
      return null;
    }
  };

  /* =====================================================
     LOAD TEACHER HOMEWORK HISTORY
  ===================================================== */

  /* =====================================================
   LOAD TODAY'S HOMEWORK
   - Subject Teacher → Own homework
   - Class Teacher   → All homework of assigned class
===================================================== */

const loadHomeworkHistory = async () => {
  try {
    setHistoryLoading(true);

    const teacherId = getTeacherId();

    if (!teacherId) {
      console.error("Teacher ID not found.");
      setHomeworkList([]);
      return;
    }

    /* =================================================
       UPLOAD HOMEWORK HISTORY
       
       ALWAYS LOAD ONLY THE LOGGED-IN TEACHER'S
       OWN HOMEWORK.

       Even if the teacher is also a Class Teacher,
       this page must NOT load class-wide homework.
    ================================================= */

    const response = await fetch(
      `${API_BASE_URL}/homework/teacher/${encodeURIComponent(
        teacherId
      )}`
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error(
        result.message || "Failed to load homework."
      );

      setHomeworkList([]);
      return;
    }

    setHomeworkList(result.homework || []);

  } catch (error) {
    console.error(
      "Homework History Error:",
      error
    );

    setHomeworkList([]);

  } finally {
    setHistoryLoading(false);
  }
};

  /* =====================================================
     LOAD HISTORY WHEN PAGE OPENS
  ===================================================== */

  useEffect(() => {
    loadHomeworkHistory();
  }, []);
  /* =====================================================
   EDIT HOMEWORK
===================================================== */

const updateHomework = async () => {
  if (!editingHomeworkId) {
    return;
  }

  if (!dueDate) {
    alert("Please select a Due Date.");
    return;
  }

  if (!homework.trim() && !pdf && !image) {
    alert(
      "Please provide at least one content item: Homework Description, PDF, or Image."
    );
    return;
  }

  const teacherId = getTeacherId();

  if (!teacherId) {
    alert("Teacher ID not found. Please login again.");
    return;
  }

  setLoading(true);

  const formData = new FormData();

  formData.append("teacher_id", teacherId);
  formData.append("class_name", selectedClass);
  formData.append("section", selectedSection);
  formData.append("subject", subject);
  formData.append("due_date", dueDate);

  formData.append("description", homework);

  /*
    New PDF/Image is optional during edit.
    If no new file is selected, backend will retain
    the existing file.
  */

  if (pdf) {
    formData.append("pdf", pdf);
  }

  if (image) {
    formData.append("image", image);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/homework/${editingHomeworkId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      await loadHomeworkHistory();

      setEditingHomeworkId(null);

      setHomework("");
      setDueDate("");
      setPdf(null);
      setImage(null);

      alert("Homework updated successfully.");
    } else {
      alert(
        result.message ||
          "Failed to update homework."
      );
    }
  } catch (error) {
    console.error(
      "Update homework error:",
      error
    );

    alert(
      "An error occurred while updating homework."
    );
  } finally {
    setLoading(false);
  }
};


/* =====================================================
   DELETE HOMEWORK
===================================================== */

const deleteHomework = async (id: number) => {
  const teacherId = getTeacherId();

  if (!teacherId) {
    alert("Teacher ID not found. Please login again.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this homework?"
  );

  if (!confirmed) {
    return;
  }

  setDeletingHomeworkId(id);

  try {
    const response = await fetch(
      `${API_BASE_URL}/homework/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher_id: teacherId,
        }),
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      await loadHomeworkHistory();

      alert("Homework deleted successfully.");
    } else {
      alert(
        result.message ||
          "Failed to delete homework."
      );
    }
  } catch (error) {
    console.error(
      "Delete homework error:",
      error
    );

    alert(
      "An error occurred while deleting homework."
    );
  } finally {
    setDeletingHomeworkId(null);
  }
};


/* =====================================================
   START EDIT HOMEWORK
===================================================== */

const startEditHomework = (item: HomeworkItem) => {
  setEditingHomeworkId(item.id);

  setSelectedClass(item.class);
  setSelectedSection(item.section);
  setSubject(item.subject);

  setHomework(item.description || "");

  setDueDate(
    item.due_date
      ? item.due_date.substring(0, 10)
      : ""
  );

  /*
    Existing PDF/Image are NOT put into File state.
    Therefore, if teacher does not select a new file,
    backend will preserve the old file.
  */

  setPdf(null);
  setImage(null);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


/* =====================================================
   CANCEL EDIT
===================================================== */

const cancelEditHomework = () => {
  setEditingHomeworkId(null);

  setHomework("");
  setDueDate("");
  setPdf(null);
  setImage(null);
};


/* =====================================================
   SAVE / UPLOAD HOMEWORK
===================================================== */

const saveHomework = async () => {
    // Mandatory due date
    if (!dueDate) {
      alert("Please select a Due Date.");
      return;
    }

    // At least one content item
    if (!homework.trim() && !pdf && !image) {
      alert(
        "Please provide at least one content item: Homework Description, PDF, or Image."
      );
      return;
    }

    const teacherId = getTeacherId();

    if (!teacherId) {
      alert(
        "Teacher ID not found. Please login again."
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();

    // Teacher ID
    formData.append(
      "teacher_id",
      teacherId
    );

    // Class
    formData.append(
      "class_name",
      selectedClass
    );

    // Section
    formData.append(
      "section",
      selectedSection
    );

    // Subject
    formData.append(
      "subject",
      subject
    );

    // Due Date
    formData.append(
      "due_date",
      dueDate
    );

    // Description
    if (homework.trim()) {
      formData.append(
        "description",
        homework
      );
    }

    // PDF
    if (pdf) {
      formData.append(
        "pdf",
        pdf
      );
    }

    // Image
    if (image) {
      formData.append(
        "image",
        image
      );
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/homework/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        /*
          Backend से returned homework को
          तुरंत history में add करें।
        */
        await loadHomeworkHistory();

        // Reset form
        setHomework("");
        setDueDate("");
        setPdf(null);
        setImage(null);

        alert(
          "Homework Uploaded Successfully and parents notified!"
        );
      } else {
        alert(
          result.message ||
            "Failed to upload homework."
        );
      }
    } catch (error) {
      console.error(
        "Submission error:",
        error
      );

      alert(
        "An error occurred while uploading homework."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <main className="homework-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="homework-header">

          <h1>
            Homework Management
          </h1>

          <button
  className="save-btn"
  onClick={
    editingHomeworkId
      ? updateHomework
      : saveHomework
  }
  disabled={loading}
>
  {loading
    ? editingHomeworkId
      ? "Updating..."
      : "Uploading..."
    : editingHomeworkId
      ? "Update Homework"
      : "Upload Homework"}
</button>

{editingHomeworkId && (
  <button
    type="button"
    onClick={cancelEditHomework}
    disabled={loading}
    style={{
      marginLeft: "10px",
      padding: "10px 18px",
      borderRadius: "6px",
      border: "1px solid #999",
      background: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    Cancel Edit
  </button>
)}

        </div>


        <div className="homework-form">

          {/* =================================================
              FORM FIELDS
          ================================================= */}

          <div className="form-grid">

            {/* CLASS */}

            <div>
              <label>
                Class
              </label>

              <select
                value={selectedClass}
                onChange={(e) =>
                  setSelectedClass(
                    e.target.value
                  )
                }
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


            {/* SECTION */}

            <div>
              <label>
                Section
              </label>

              <select
                value={selectedSection}
                onChange={(e) =>
                  setSelectedSection(
                    e.target.value
                  )
                }
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
                <option>F</option>
                <option>NEET</option>
                <option>JEE</option>
                <option>PCB</option>
                <option>PCM</option>
                <option>COMM</option>
              </select>
            </div>


            {/* SUBJECT */}

            <div>
              <label>
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) =>
                  setSubject(
                    e.target.value
                  )
                }
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


            {/* DUE DATE */}

            <div>
              <label>
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(
                    e.target.value
                  )
                }
              />
            </div>

          </div>


          {/* =================================================
              HOMEWORK DESCRIPTION
          ================================================= */}

          <div
            style={{
              marginTop: "25px",
            }}
          >
            <label>
              Homework Description
              (Optional if file attached)
            </label>

            <textarea
              rows={10}
              value={homework}
              placeholder="Enter today's homework for students..."
              onChange={(e) =>
                setHomework(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                minHeight: "220px",
              }}
            />
          </div>


          {/* =================================================
              FILE ATTACHMENTS
          ================================================= */}

          <div
            className="form-grid"
            style={{
              marginTop: "25px",
            }}
          >

            {/* PDF */}

            <div>
              <label>
                Attach PDF (Optional)
              </label>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) =>
                  setPdf(
                    e.target.files
                      ? e.target.files[0]
                      : null
                  )
                }
              />
            </div>


            {/* IMAGE */}

            <div>
              <label>
                Attach Image (Optional)
              </label>

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


          {/* =================================================
              TEACHER HOMEWORK HISTORY
          ================================================= */}

          <div
            className="homework-list"
            style={{
              marginTop: "30px",
            }}
          >

            <table>

              <thead>

                <tr>

                  <th
                    style={{
                      width: "60px",
                    }}
                  >
                    #
                  </th>

                  <th>
                    Subject
                  </th>

                  <th>
                    Class
                  </th>

                  <th>
                    Sec
                  </th>

                  <th>
                    Homework
                  </th>

                  <th>
                    PDF
                  </th>

                  <th>
                    Image
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* HISTORY LOADING */}

                {historyLoading && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#777",
                        fontWeight: 600,
                      }}
                    >
                      Loading Homework History...
                    </td>
                  </tr>
                )}


                {/* HOMEWORK LIST */}

                {!historyLoading &&
                  homeworkList.map(
                    (item, index) => (
                      <tr key={item.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {item.subject}
                        </td>

                        <td>
                          {item.class}
                        </td>

                        <td>
                          {item.section}
                        </td>

                        <td>
                          {item.description ||
                            "-"}
                        </td>

                        <td>

                          {item.pdf_url ? (
                            <a
                              href={`${API_BASE_URL.replace(
                                /\/api$/,
                                ""
                              )}${item.pdf_url}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color:
                                  "#1565C0",
                                fontWeight: 600,
                                textDecoration:
                                  "none",
                              }}
                            >
                              📄 View PDF
                            </a>
                          ) : (
                            "-"
                          )}

                        </td>

                        <td>

  {item.image_url ? (
    <a
      href={`${API_BASE_URL.replace(
        /\/api$/,
        ""
      )}${item.image_url}`}
      target="_blank"
      rel="noreferrer"
      style={{
        color:
          "#2E7D32",
        fontWeight: 600,
        textDecoration:
          "none",
      }}
    >
      🖼 View Image
    </a>
  ) : (
    "-"
  )}

</td>

<td>
  <div
    style={{
      display: "flex",
      gap: "8px",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    }}
  >
    <button
      type="button"
      onClick={() =>
        startEditHomework(item)
      }
      disabled={
        deletingHomeworkId === item.id
      }
      style={{
        padding: "6px 12px",
        borderRadius: "5px",
        border: "none",
        background: "#1565C0",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      ✏️ Edit
    </button>

    <button
      type="button"
      onClick={() =>
        deleteHomework(item.id)
      }
      disabled={
        deletingHomeworkId === item.id
      }
      style={{
        padding: "6px 12px",
        borderRadius: "5px",
        border: "none",
        background: "#C62828",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {deletingHomeworkId === item.id
        ? "Deleting..."
        : "🗑 Delete"}
    </button>
  </div>
</td>

                      </tr>
                    )
                  )}


                {/* EMPTY */}

                {!historyLoading &&
                  homeworkList.length === 0 && (
                    <tr>

                      <td
                        colSpan={8}
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