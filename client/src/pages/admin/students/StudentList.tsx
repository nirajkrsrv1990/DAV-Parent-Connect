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
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleEdit = (
    student: Student
  ) => {
    console.log(
      "Edit Student:",
      student
    );

    alert(
      `Edit option selected for:\n\n` +
      `Student: ${student.student_name}\n` +
      `Admission No.: ${student.admission_no}`
    );
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

    </div>
  );
}