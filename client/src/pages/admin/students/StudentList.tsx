import {
  useEffect,
  useMemo,
  useState,
} from "react";

import apiClient from "../../../services/apiClient";

import "./StudentList.css";

type Student = {
  id: number;
  admission_no: string;
  student_name: string;
  father_name: string;
  mother_name: string;
  mobile_no: string;
  class: string;
  section: string;
  roll_no: number;
  gender: string;
  dob: string;
  house: string;
  status: string;
  student_status?: string;
  removal_reason?: string | null;
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [savingStudent, setSavingStudent] = useState(false);

  // =====================================================
  // FILTER STATES
  // =====================================================

  const [admissionFilter, setAdmissionFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiClient.get("/students");

        const result = response.data;

        console.log("Student List API Response:", result);

        if (cancelled) return;

        if (result.success) {
          setStudents(result.students || []);
        } else {
          setError(result.message || "Unable to load students.");
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Student List Load Error:", err);

        setError("Unable to connect server.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // CLASS OPTIONS
  // =====================================================

  const classOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map((student) => student.class?.trim())
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
      })
    );
  }, [students]);

  // =====================================================
  // SECTION OPTIONS
  // =====================================================

  const sectionOptions = useMemo(() => {
    const filteredForSections = classFilter
      ? students.filter(
          (student) => student.class === classFilter
        )
      : students;

    return Array.from(
      new Set(
        filteredForSections
          .map((student) => student.section?.trim())
          .filter(Boolean)
      )
    ).sort();
  }, [students, classFilter]);

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents = useMemo(() => {
    const admissionText = admissionFilter
      .trim()
      .toLowerCase();

    return students.filter((student) => {
      const admissionMatch =
        !admissionText ||
        String(student.admission_no ?? "")
          .toLowerCase()
          .includes(admissionText);

      const classMatch =
        !classFilter ||
        student.class === classFilter;

      const sectionMatch =
        !sectionFilter ||
        student.section === sectionFilter;

      return (
        admissionMatch &&
        classMatch &&
        sectionMatch
      );
    });
  }, [
    students,
    admissionFilter,
    classFilter,
    sectionFilter,
  ]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setAdmissionFilter("");
    setClassFilter("");
    setSectionFilter("");
  };

  // =====================================================
  // CLASS CHANGE
  // =====================================================

  const handleClassChange = (
    value: string
  ) => {
    setClassFilter(value);

    // Reset section when class changes
    setSectionFilter("");
  };

  // =====================================================
// EDIT STUDENT
// =====================================================

const handleEdit = (student: Student) => {
  console.log("Edit Student:", student);

  setEditingStudent({
    ...student,
    dob: student.dob
      ? student.dob.substring(0, 10)
      : "",
  });
  console.log("EDITING STUDENT SET:", student);
};


// =====================================================
// SAVE EDITED STUDENT
// =====================================================

const handleSaveStudent = async () => {
  if (!editingStudent) return;

  try {
    setSavingStudent(true);

    const response = await apiClient.put(
      `/students/${editingStudent.id}`,
      {
        admission_no: editingStudent.admission_no,
        student_name: editingStudent.student_name,
        father_name: editingStudent.father_name,
        mother_name: editingStudent.mother_name,
        mobile_no: editingStudent.mobile_no,
        class: editingStudent.class,
        section: editingStudent.section,
        roll_no: editingStudent.roll_no,
        gender: editingStudent.gender,
        dob: editingStudent.dob || null,
        house: editingStudent.house,
        status: editingStudent.status,
        student_status:
          editingStudent.student_status || "Active",
        removal_reason:
          editingStudent.removal_reason || null,
      }
    );

    const result = response.data;

    console.log(
      "Update Student Response:",
      result
    );

    if (!result.success) {
      alert(
        result.message ||
          "Unable to update student."
      );
      return;
    }

    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student.id === editingStudent.id
          ? result.student
          : student
      )
    );

    setEditingStudent(null);

    alert("Student Updated Successfully.");

  } catch (error) {
    console.error(
      "Update Student Error:",
      error
    );

    alert(
      "Unable to update student. Please try again."
    );

  } finally {
    setSavingStudent(false);
  }
};

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const handleDelete = (
    student: Student
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${student.student_name}?`
      );

    if (!confirmed) return;

    console.log(
      "Delete Student:",
      student
    );

    alert(
      "Delete API is not connected yet."
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    value: string
  ) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN"
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="student-list-page">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="student-list-header">
        <div>
          <h1>Student List</h1>

          {!loading && !error && (
            <p className="student-subtitle">
              Showing{" "}
              <strong>
                {filteredStudents.length}
              </strong>{" "}
              of{" "}
              <strong>
                {students.length}
              </strong>{" "}
              students
            </p>
          )}
        </div>
      </div>

      {/* =================================================
          FILTER PANEL
      ================================================= */}

      <div className="student-filter-panel">

        {/* Admission Number */}

        <div className="student-filter-group">
          <label htmlFor="admission-filter">
            Admission No.
          </label>

          <input
            id="admission-filter"
            type="text"
            placeholder="Enter Admission No."
            value={admissionFilter}
            onChange={(e) =>
              setAdmissionFilter(
                e.target.value
              )
            }
          />
        </div>

        {/* Class */}

        <div className="student-filter-group">
          <label htmlFor="class-filter">
            Class
          </label>

          <select
            id="class-filter"
            value={classFilter}
            onChange={(e) =>
              handleClassChange(
                e.target.value
              )
            }
          >
            <option value="">
              All Classes
            </option>

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

        {/* Section */}

        <div className="student-filter-group">
          <label htmlFor="section-filter">
            Section
          </label>

          <select
            id="section-filter"
            value={sectionFilter}
            onChange={(e) =>
              setSectionFilter(
                e.target.value
              )
            }
          >
            <option value="">
              All Sections
            </option>

            {sectionOptions.map(
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

        {/* Clear */}

        <div className="student-filter-action">
          <button
            type="button"
            className="clear-filter-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="student-list-message">
          <div className="loading-spinner"></div>

          <p>
            Loading Students...
          </p>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="student-list-message error">

          <p>{error}</p>

          <button
            type="button"
            className="clear-filter-btn"
            onClick={() =>
              window.location.reload()
            }
          >
            Retry
          </button>

        </div>
      )}

      {/* =================================================
          NO STUDENT DATA
      ================================================= */}

      {!loading &&
        !error &&
        students.length === 0 && (
          <div className="student-list-message">
            <p>
              No Student Data Found.
            </p>
          </div>
        )}

      {/* =================================================
          FILTER RESULT EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        students.length > 0 &&
        filteredStudents.length === 0 && (
          <div className="student-list-message">

            <p>
              No student found for the
              selected filters.
            </p>

            <button
              type="button"
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        )}

      {/* =================================================
          DESKTOP / TABLET TABLE
      ================================================= */}

      {!loading &&
        !error &&
        filteredStudents.length > 0 && (
          <div className="student-table-container">

            <table className="student-table">

              <thead>
                <tr>
                  <th>Adm No.</th>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Father's Name</th>
                  <th>Mother's Name</th>
                  <th>Mobile No.</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>House</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.map(
                  (student) => (
                    <tr
                      key={student.id}
                    >

                      <td>
                        {student.admission_no || "-"}
                      </td>

                      <td>
                        {student.roll_no ?? "-"}
                      </td>

                      <td className="student-name-cell">
                        {student.student_name || "-"}
                      </td>

                      <td>
                        {student.class || "-"}
                      </td>

                      <td>
                        {student.section || "-"}
                      </td>

                      <td>
                        {student.father_name || "-"}
                      </td>

                      <td>
                        {student.mother_name || "-"}
                      </td>

                      <td>
                        {student.mobile_no || "-"}
                      </td>

                      <td>
                        {student.gender || "-"}
                      </td>

                      <td>
                        {formatDate(student.dob)}
                      </td>

                      <td>
                        {student.house || "-"}
                      </td>

                      <td>
                        <span
                          className={
                            student.status
                              ?.toLowerCase() ===
                            "active"
                              ? "status-active"
                              : "status-other"
                          }
                        >
                          {student.status || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="student-actions">

                          <button
                            type="button"
                            className="student-edit-btn"
                            onClick={() =>
                              handleEdit(
                                student
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="student-delete-btn"
                            onClick={() =>
                              handleDelete(
                                student
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      {/* =================================================
          MOBILE STUDENT CARDS
      ================================================= */}

      {!loading &&
        !error &&
        filteredStudents.length > 0 && (
          <div className="mobile-student-list">

            {filteredStudents.map(
              (student) => (
                <div
                  className="mobile-student-card"
                  key={student.id}
                >

                  {/* STUDENT HEADER */}

                  <div className="mobile-student-top">

                    <div>
                      <h3>
                        {student.student_name || "-"}
                      </h3>

                      <span>
                        Admission No.:{" "}
                        {student.admission_no || "-"}
                      </span>
                    </div>

                    <span
                      className={
                        student.status
                          ?.toLowerCase() ===
                        "active"
                          ? "status-active"
                          : "status-other"
                      }
                    >
                      {student.status || "-"}
                    </span>

                  </div>

                  {/* ALL STUDENT DETAILS */}

                  <div className="mobile-student-details">

                    <div>
                      <small>
                        Roll No.
                      </small>
                      <strong>
                        {student.roll_no ?? "-"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Class
                      </small>
                      <strong>
                        {student.class || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Section
                      </small>
                      <strong>
                        {student.section || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Father's Name
                      </small>
                      <strong>
                        {student.father_name || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Mother's Name
                      </small>
                      <strong>
                        {student.mother_name || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Mobile No.
                      </small>
                      <strong>
                        {student.mobile_no || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Gender
                      </small>
                      <strong>
                        {student.gender || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Date of Birth
                      </small>
                      <strong>
                        {formatDate(student.dob)}
                      </strong>
                    </div>

                    <div>
                      <small>
                        House
                      </small>
                      <strong>
                        {student.house || "-"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Status
                      </small>
                      <strong>
                        {student.status || "-"}
                      </strong>
                    </div>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="mobile-student-actions">

                    <button
                      type="button"
                      className="student-edit-btn"
                      onClick={() =>
                        handleEdit(
                          student
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="student-delete-btn"
                      onClick={() =>
                        handleDelete(
                          student
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

  
      
      {/* =====================================================
          EDIT STUDENT MODAL
      ===================================================== */}

      {editingStudent && (
        <div className="student-edit-overlay">

          <div className="student-edit-modal">

            {/* HEADER */}

            <div className="student-edit-header">

              <div>
                <h2>Edit Student</h2>

                <p>
                  Admission No.:{" "}
                  <strong>
                    {editingStudent.admission_no}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="student-edit-close"
                onClick={() =>
                  setEditingStudent(null)
                }
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="student-edit-form">

              {/* Admission No. */}

              <div className="edit-form-group">
                <label>
                  Admission No.
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.admission_no
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      admission_no:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* Student Name */}

              <div className="edit-form-group">
                <label>
                  Student Name
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.student_name
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      student_name:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* Father's Name */}

              <div className="edit-form-group">
                <label>
                  Father's Name
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.father_name
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      father_name:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* Mother's Name */}

              <div className="edit-form-group">
                <label>
                  Mother's Name
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.mother_name
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      mother_name:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* Mobile */}

              <div className="edit-form-group">
                <label>
                  Mobile No.
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.mobile_no
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      mobile_no:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* Class */}

              <div className="edit-form-group">
                <label>
                  Class
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.class
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      class:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* Section */}

              <div className="edit-form-group">
                <label>
                  Section
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.section
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      section:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* Roll No. */}

              <div className="edit-form-group">
                <label>
                  Roll No.
                </label>

                <input
                  type="number"
                  value={
                    editingStudent.roll_no ?? ""
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      roll_no:
                        Number(e.target.value),
                    })
                  }
                />
              </div>


              {/* Gender */}

              <div className="edit-form-group">
                <label>
                  Gender
                </label>

                <select
                  value={
                    editingStudent.gender
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      gender:
                        e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="M">
                    Male
                  </option>

                  <option value="F">
                    Female
                  </option>
                </select>
              </div>


              {/* DOB */}

              <div className="edit-form-group">
                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={
                    editingStudent.dob || ""
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      dob:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* House */}

              <div className="edit-form-group">
                <label>
                  House
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.house
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      house:
                        e.target.value,
                    })
                  }
                />
              </div>


              {/* Status */}

              <div className="edit-form-group">
                <label>
                  Status
                </label>

                <select
                  value={
                    editingStudent.status
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      status:
                        e.target.value,
                    })
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


              {/* Student Status */}

              <div className="edit-form-group">
                <label>
                  Student Status
                </label>

                <select
                  value={
                    editingStudent.student_status ||
                    "Active"
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      student_status:
                        e.target.value,
                    })
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                  <option value="Transferred">
                    Transferred
                  </option>

                  <option value="School Left">
                    School Left
                  </option>
                </select>
              </div>


              {/* Removal Reason */}

              <div className="edit-form-group edit-form-full">

                <label>
                  Removal Reason
                </label>

                <input
                  type="text"
                  value={
                    editingStudent.removal_reason ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      removal_reason:
                        e.target.value,
                    })
                  }
                  placeholder="Optional"
                />

              </div>

            </div>


            {/* ACTION BUTTONS */}

            <div className="student-edit-actions">

              <button
                type="button"
                className="student-edit-cancel"
                onClick={() =>
                  setEditingStudent(null)
                }
                disabled={savingStudent}
              >
                Cancel
              </button>

              <button
                type="button"
                className="student-edit-save"
                onClick={handleSaveStudent}
                disabled={savingStudent}
              >
                {savingStudent
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
