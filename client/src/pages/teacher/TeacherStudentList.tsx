import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { API_BASE_URL } from "@/config/api";

type Student = {
  id: number;
  admission_no: string;
  student_name: string;
  father_name: string;
  mother_name: string;
  mobile_no: string;
  class: string;
  section: string;
  roll_no: number | null;
  gender: string;
  dob: string;
  house: string;
  status: string;
  student_status?: string;
  removal_reason?: string | null;
  removed_at?: string | null;
};

type Assignment = {
  class_name: string;
  section: string;
};

type Teacher = {
  teacher_id: string;
  teacher_name: string;
  mobile?: string;
  email?: string;
};

type StudentForm = {
  admission_no: string;
  student_name: string;
  father_name: string;
  mother_name: string;
  mobile_no: string;
  class: string;
  section: string;
  roll_no: string;
  gender: string;
  dob: string;
  house: string;
  status: string;
};

const emptyForm: StudentForm = {
  admission_no: "",
  student_name: "",
  father_name: "",
  mother_name: "",
  mobile_no: "",
  class: "",
  section: "",
  roll_no: "",
  gender: "",
  dob: "",
  house: "",
  status: "Active",
};

export default function TeacherStudentList() {
  /* =====================================================
     TEACHER
  ===================================================== */

  const [teacher, setTeacher] =
    useState<Teacher | null>(null);

  /* =====================================================
     ASSIGNMENT
  ===================================================== */

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  /* =====================================================
     STUDENTS
  ===================================================== */

  const [students, setStudents] =
    useState<Student[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  /* =====================================================
     FORM / MODAL
  ===================================================== */

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);

  const [isAdding, setIsAdding] =
    useState(false);

  const [form, setForm] =
    useState<StudentForm>(emptyForm);

  const [saving, setSaving] =
    useState(false);

  /* =====================================================
     REMOVE
  ===================================================== */

  const [removingId, setRemovingId] =
    useState<number | null>(null);

  /* =====================================================
     LOAD TEACHER STUDENTS
  ===================================================== */

  const loadTeacherStudents = useCallback(
    async (teacherId: string) => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/teacher-students/${encodeURIComponent(
            teacherId
          )}`
        );

        const result =
          await response.json();

        console.log(
          "Teacher Students API:",
          result
        );

        if (
          !response.ok ||
          !result.success
        ) {
          setStudents([]);

          setAssignment(null);

          setError(
            result.message ||
              "Unable to load students."
          );

          return;
        }

        const teacherAssignment: Assignment = {
          class_name:
            result.class_name ||
            result.assignment?.class_name ||
            "",

          section:
            result.section ||
            result.assignment?.section ||
            "",
        };

        setAssignment(
          teacherAssignment
        );

        setStudents(
          Array.isArray(result.students)
            ? result.students
            : []
        );
      } catch (err) {
        console.error(
          "Teacher Student List Error:",
          err
        );

        setStudents([]);

        setError(
          "Unable to connect to server."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =====================================================
     LOAD TEACHER
  ===================================================== */

  useEffect(() => {
  const loadTeacher = async () => {
    await Promise.resolve();

    const teacherData =
      localStorage.getItem("teacher");

    if (!teacherData) {
      setError(
        "Teacher login information not found."
      );

      setLoading(false);

      return;
    }

    try {
      const teacherInfo: Teacher =
        JSON.parse(teacherData);

      if (!teacherInfo.teacher_id) {
        setError(
          "Teacher ID not found."
        );

        setLoading(false);

        return;
      }

      setTeacher(teacherInfo);

      await loadTeacherStudents(
        teacherInfo.teacher_id
      );
    } catch (err) {
      console.error(
        "Teacher LocalStorage Error:",
        err
      );

      setError(
        "Invalid teacher login information."
      );

      setLoading(false);
    }
  };

  void loadTeacher();
}, [loadTeacherStudents]);

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredStudents =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      if (!searchText) {
        return students;
      }

      return students.filter(
        (student) => {
          return (
            String(
              student.admission_no || ""
            )
              .toLowerCase()
              .includes(searchText) ||

            String(
              student.student_name || ""
            )
              .toLowerCase()
              .includes(searchText) ||

            String(
              student.father_name || ""
            )
              .toLowerCase()
              .includes(searchText) ||

            String(
              student.mother_name || ""
            )
              .toLowerCase()
              .includes(searchText) ||

            String(
              student.mobile_no || ""
            )
              .toLowerCase()
              .includes(searchText) ||

            String(
              student.roll_no ?? ""
            )
              .toLowerCase()
              .includes(searchText)
          );
        }
      );
    }, [students, search]);

  /* =====================================================
     OPEN ADD
  ===================================================== */

  const openAddStudent = () => {
    setEditingStudent(null);

    setIsAdding(true);

    setForm({
      ...emptyForm,

      class:
        assignment?.class_name || "",

      section:
        assignment?.section || "",
    });

    setModalOpen(true);
  };

  /* =====================================================
     OPEN EDIT
  ===================================================== */

  const openEditStudent = (
    student: Student
  ) => {
    setEditingStudent(student);

    setIsAdding(false);

    setForm({
      admission_no:
        student.admission_no || "",

      student_name:
        student.student_name || "",

      father_name:
        student.father_name || "",

      mother_name:
        student.mother_name || "",

      mobile_no:
        student.mobile_no || "",

      class:
        student.class || "",

      section:
        student.section || "",

      roll_no:
        student.roll_no === null ||
        student.roll_no === undefined
          ? ""
          : String(student.roll_no),

      gender:
        student.gender || "",

      dob:
        student.dob
          ? String(
              student.dob
            ).substring(0, 10)
          : "",

      house:
        student.house || "",

      status:
        student.status || "Active",
    });

    setModalOpen(true);
  };

  /* =====================================================
     UPDATE FORM FIELD
  ===================================================== */

  const updateField = (
    field: keyof StudentForm,
    value: string
  ) => {
    setForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setEditingStudent(null);

    setIsAdding(false);

    setForm(emptyForm);
  };

  /* =====================================================
     SAVE / ADD STUDENT
  ===================================================== */

  const saveStudent = async () => {
    if (!teacher?.teacher_id) {
      alert(
        "Teacher login information not found."
      );

      return;
    }

    if (
      !form.admission_no.trim() ||
      !form.student_name.trim()
    ) {
      alert(
        "Admission No. and Student Name are required."
      );

      return;
    }

    try {
      setSaving(true);

      /* =================================================
         ADD NEW / EXISTING STUDENT
      ================================================= */

      if (isAdding) {
        const response = await fetch(
          `${API_BASE_URL}/teacher-students`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              teacher_id:
                teacher.teacher_id,

              admission_no:
                form.admission_no.trim(),

              student_name:
                form.student_name.trim(),

              father_name:
                form.father_name.trim(),

              mother_name:
                form.mother_name.trim(),

              mobile_no:
                form.mobile_no.trim(),

              roll_no:
                form.roll_no
                  ? Number(form.roll_no)
                  : null,

              gender:
                form.gender.trim(),

              dob:
                form.dob || null,

              house:
                form.house.trim(),

              status:
                form.status || "Active",
            }),
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          alert(
            result.message ||
              "Unable to add student."
          );

          return;
        }

        alert(
          result.message ||
            "Student Added Successfully"
        );

        closeModal();

        await loadTeacherStudents(
          teacher.teacher_id
        );

        return;
      }

      /* =================================================
         UPDATE EXISTING STUDENT
      ================================================= */

      if (!editingStudent) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/teacher-students/${editingStudent.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            teacher_id:
              teacher.teacher_id,

            admission_no:
              form.admission_no.trim(),

            student_name:
              form.student_name.trim(),

            father_name:
              form.father_name.trim(),

            mother_name:
              form.mother_name.trim(),

            mobile_no:
              form.mobile_no.trim(),

            class:
              form.class.trim(),

            section:
              form.section.trim(),

            roll_no:
              form.roll_no
                ? Number(form.roll_no)
                : null,

            gender:
              form.gender.trim(),

            dob:
              form.dob || null,

            house:
              form.house.trim(),

            status:
              form.status || "Active",
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        alert(
          result.message ||
            "Unable to update student."
        );

        return;
      }

      alert(
        result.message ||
          "Student Updated Successfully"
      );

      closeModal();

      await loadTeacherStudents(
        teacher.teacher_id
      );
    } catch (err) {
      console.error(
        "Save Student Error:",
        err
      );

      alert(
        "Unable to connect to server."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     REMOVE STUDENT
     SOFT REMOVE ONLY
  ===================================================== */

  const removeStudent = async (
    student: Student
  ) => {
    if (!teacher?.teacher_id) {
      alert(
        "Teacher login information not found."
      );

      return;
    }

    const reason =
      window.prompt(
        `Remove "${student.student_name}" from your class.\n\nEnter reason:`,
        "Student belongs to another section"
      );

    if (
      reason === null
    ) {
      return;
    }

    const finalReason =
      reason.trim();

    if (!finalReason) {
      alert(
        "Removal reason is required."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to remove ${student.student_name} from your class?\n\nThe student will NOT be permanently deleted from the database.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(student.id);

      const response = await fetch(
        `${API_BASE_URL}/teacher-students/${student.id}/remove`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            teacher_id:
              teacher.teacher_id,

            removal_reason:
              finalReason,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        alert(
          result.message ||
            "Unable to remove student."
        );

        return;
      }

      alert(
        result.message ||
          "Student Removed From Your Class"
      );

      await loadTeacherStudents(
        teacher.teacher_id
      );
    } catch (err) {
      console.error(
        "Remove Student Error:",
        err
      );

      alert(
        "Unable to connect to server."
      );
    } finally {
      setRemovingId(null);
    }
  };

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (
    value: string
  ) => {
    if (!value) {
      return "-";
    }

    return String(value).substring(
      0,
      10
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="teacher-student-page">

      <style>{`

        .teacher-student-page {
          width: 100%;
          min-height: 100vh;
          box-sizing: border-box;
          padding: 28px;
          background: #f4f7fb;
          color: #16324f;
        }

        .teacher-student-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .teacher-student-header h1 {
          margin: 0;
          color: #0f4c81;
          font-size: 28px;
          font-weight: 700;
        }

        .teacher-student-header p {
          margin: 6px 0 0;
          color: #667085;
          font-size: 14px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .assignment-badge {
          background: #e8f2ff;
          color: #0f4c81;
          border: 1px solid #c9def5;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 600;
          white-space: nowrap;
        }

        .add-student-button {
          border: none;
          background: #1565c0;
          color: #ffffff;
          padding: 11px 18px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .add-student-button:hover {
          background: #0f4c81;
        }

        .student-toolbar {
          background: #ffffff;
          padding: 18px;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(15, 76, 129, 0.08);
          margin-bottom: 20px;
        }

        .student-search {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          border: 1px solid #d7dee8;
          border-radius: 9px;
          outline: none;
          font-size: 14px;
        }

        .student-search:focus {
          border-color: #1565c0;
          box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.10);
        }

        .student-count {
          margin-top: 10px;
          color: #667085;
          font-size: 13px;
        }

        .student-table-wrapper {
          width: 100%;
          overflow-x: auto;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(15, 76, 129, 0.08);
        }

        .teacher-student-table {
          width: 100%;
          min-width: 1350px;
          border-collapse: collapse;
        }

        .teacher-student-table th {
          background: #1565c0;
          color: #ffffff;
          padding: 13px 10px;
          text-align: left;
          font-size: 13px;
          white-space: nowrap;
        }

        .teacher-student-table td {
          padding: 12px 10px;
          border-bottom: 1px solid #edf0f4;
          font-size: 13px;
          vertical-align: middle;
        }

        .teacher-student-table tbody tr:hover {
          background: #f7fbff;
        }

        .student-name {
          font-weight: 600;
          color: #0f4c81;
          white-space: nowrap;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          background: #dcfce7;
          color: #15803d;
        }

        .status-inactive {
          background: #fee2e2;
          color: #b91c1c;
        }

        .action-buttons {
          display: flex;
          gap: 7px;
        }

        .edit-button,
        .remove-button {
          border: none;
          color: #ffffff;
          border-radius: 6px;
          padding: 7px 12px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .edit-button {
          background: #1565c0;
        }

        .edit-button:hover {
          background: #0f4c81;
        }

        .remove-button {
          background: #dc3545;
        }

        .remove-button:hover {
          background: #b42333;
        }

        .remove-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message-box {
          background: #ffffff;
          border-radius: 14px;
          padding: 45px 20px;
          text-align: center;
          color: #667085;
          box-shadow: 0 4px 15px rgba(15, 76, 129, 0.08);
        }

        .error-box {
          color: #b42318;
        }

        .mobile-student-list {
          display: none;
        }

        .mobile-student-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 15px;
          margin-bottom: 12px;
          box-shadow: 0 3px 12px rgba(15,76,129,.08);
        }

        .mobile-student-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #edf0f4;
        }

        .mobile-student-name {
          color: #0f4c81;
          font-weight: 700;
          font-size: 15px;
        }

        .mobile-student-admission {
          margin-top: 4px;
          font-size: 11px;
          color: #667085;
        }

        .mobile-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .mobile-detail-label {
          font-size: 10px;
          color: #667085;
          margin-bottom: 3px;
        }

        .mobile-detail-value {
          font-size: 12px;
          color: #101828;
          word-break: break-word;
        }

        .mobile-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 14px;
        }

        .mobile-actions button {
          border: none;
          border-radius: 7px;
          padding: 9px;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        }

        .mobile-edit {
          background: #1565c0;
        }

        .mobile-remove {
          background: #dc3545;
        }

        .mobile-actions button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* =================================================
           MODAL
        ================================================= */

        .student-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.58);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .student-modal {
          width: min(850px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,.25);
          padding: 24px;
          box-sizing: border-box;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          margin: 0;
          color: #0f4c81;
          font-size: 22px;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 12px;
        }

        .modal-close {
          border: none;
          background: #eef2f6;
          color: #344054;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .form-field label {
          font-size: 12px;
          font-weight: 600;
          color: #475467;
        }

        .form-field input,
        .form-field select {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 11px;
          border: 1px solid #d0d5dd;
          border-radius: 7px;
          outline: none;
          font-size: 13px;
        }

        .form-field input:focus,
        .form-field select:focus {
          border-color: #1565c0;
          box-shadow: 0 0 0 3px rgba(21,101,192,.08);
        }

        .assignment-note {
          grid-column: 1 / -1;
          background: #eef6ff;
          border: 1px solid #c9def5;
          color: #0f4c81;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 12px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 22px;
        }

        .cancel-button,
        .save-button {
          border: none;
          border-radius: 7px;
          padding: 10px 20px;
          cursor: pointer;
          font-weight: 600;
        }

        .cancel-button {
          background: #e4e7ec;
          color: #344054;
        }

        .save-button {
          background: #1565c0;
          color: #ffffff;
        }

        .save-button:disabled,
        .cancel-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        @media (max-width: 1000px) {

          .teacher-student-page {
            padding: 18px;
          }

          .teacher-student-header h1 {
            font-size: 23px;
          }

          .student-table-wrapper {
            display: none;
          }

          .mobile-student-list {
            display: block;
          }

        }

        @media (max-width: 700px) {

          .teacher-student-page {
            padding: 12px;
          }

          .teacher-student-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .header-right {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }

          .assignment-badge {
            width: 100%;
            box-sizing: border-box;
          }

          .add-student-button {
            width: 100%;
          }

          .student-toolbar {
            padding: 13px;
          }

          .student-modal-overlay {
            padding: 10px;
          }

          .student-modal {
            padding: 16px;
            max-height: 94vh;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full {
            grid-column: auto;
          }

          .modal-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .cancel-button,
          .save-button {
            width: 100%;
          }

        }

        @media (max-width: 420px) {

          .mobile-details-grid {
            grid-template-columns: 1fr;
          }

          .teacher-student-header h1 {
            font-size: 21px;
          }

          .student-search {
            font-size: 13px;
          }

        }

      `}</style>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="teacher-student-header">

        <div>

          <h1>
            Student List
          </h1>

          <p>
            Welcome,{" "}
            {teacher?.teacher_name ||
              "Teacher"}
          </p>

        </div>


        <div className="header-right">

          {assignment && (
            <div className="assignment-badge">

              Class Teacher:{" "}
              {assignment.class_name}
              {" - "}
              {assignment.section}

            </div>
          )}

          {assignment && (
            <button
              type="button"
              className="add-student-button"
              onClick={openAddStudent}
            >
              + Add Student
            </button>
          )}

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      {!loading &&
        !error &&
        assignment && (

          <div className="student-toolbar">

            <input
              type="text"
              className="student-search"
              placeholder="Search by Admission No., Name, Roll No., Father Name, Mother Name or Mobile..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <div className="student-count">

              Showing{" "}
              <strong>
                {filteredStudents.length}
              </strong>{" "}
              of{" "}
              <strong>
                {students.length}
              </strong>{" "}
              active students of{" "}
              <strong>
                {assignment.class_name}
                {" - "}
                {assignment.section}
              </strong>

            </div>

          </div>
        )}


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <div className="message-box">
          Loading Students...
        </div>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading &&
        error && (

          <div className="message-box error-box">
            {error}
          </div>

        )}


      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      {!loading &&
        !error &&
        assignment &&
        filteredStudents.length > 0 && (

          <div className="student-table-wrapper">

            <table className="teacher-student-table">

              <thead>

                <tr>

                  <th>Roll No.</th>

                  <th>Admission No.</th>

                  <th>Student Name</th>

                  <th>Class</th>

                  <th>Section</th>

                  <th>Father's Name</th>

                  <th>Mother's Name</th>

                  <th>Mobile No.</th>

                  <th>Gender</th>

                  <th>Date of Birth</th>

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
                        {student.roll_no ??
                          "-"}
                      </td>

                      <td>
                        {student.admission_no}
                      </td>

                      <td className="student-name">
                        {student.student_name}
                      </td>

                      <td>
                        {student.class}
                      </td>

                      <td>
                        {student.section}
                      </td>

                      <td>
                        {student.father_name ||
                          "-"}
                      </td>

                      <td>
                        {student.mother_name ||
                          "-"}
                      </td>

                      <td>
                        {student.mobile_no ||
                          "-"}
                      </td>

                      <td>
                        {student.gender ||
                          "-"}
                      </td>

                      <td>
                        {formatDate(
                          student.dob
                        )}
                      </td>

                      <td>
                        {student.house ||
                          "-"}
                      </td>

                      <td>

                        <span
                          className={
                            student.status
                              ?.toLowerCase() ===
                            "active"
                              ? "status-badge"
                              : "status-badge status-inactive"
                          }
                        >
                          {student.status ||
                            "-"}
                        </span>

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              openEditStudent(
                                student
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="remove-button"
                            disabled={
                              removingId ===
                              student.id
                            }
                            onClick={() =>
                              void removeStudent(
                                student
                              )
                            }
                          >
                            {removingId ===
                            student.id
                              ? "Removing..."
                              : "Remove"}
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


      {/* =====================================================
          MOBILE / TABLET
      ===================================================== */}

      {!loading &&
        !error &&
        assignment &&
        filteredStudents.length > 0 && (

          <div className="mobile-student-list">

            {filteredStudents.map(
              (student) => (

                <div
                  className="mobile-student-card"
                  key={student.id}
                >

                  <div className="mobile-student-top">

                    <div>

                      <div className="mobile-student-name">
                        {student.student_name}
                      </div>

                      <div className="mobile-student-admission">
                        Admission No.:{" "}
                        {student.admission_no}
                      </div>

                    </div>

                    <span
                      className={
                        student.status
                          ?.toLowerCase() ===
                        "active"
                          ? "status-badge"
                          : "status-badge status-inactive"
                      }
                    >
                      {student.status ||
                        "-"}
                    </span>

                  </div>


                  <div className="mobile-details-grid">

                    <div>
                      <div className="mobile-detail-label">
                        Roll No.
                      </div>

                      <div className="mobile-detail-value">
                        {student.roll_no ??
                          "-"}
                      </div>
                    </div>


                    <div>
                      <div className="mobile-detail-label">
                        Class
                      </div>

                      <div className="mobile-detail-value">
                        {student.class}
                      </div>
                    </div>


                    <div>
                      <div className="mobile-detail-label">
                        Section
                      </div>

                      <div className="mobile-detail-value">
                        {student.section}
                      </div>
                    </div>


                    <div>
                      <div className="mobile-detail-label">
                        Father's Name
                      </div>

                      <div className="mobile-detail-value">
                        {student.father_name ||
                          "-"}
                      </div>
                    </div>


                    <div>
                      <div className="mobile-detail-label">
                        Mother's Name
                      </div>

                      <div className="mobile-detail-value">
                        {student.mother_name ||
                          "-"}
                      </div>
                    </div>


                    <div>
                      <div className="mobile-detail-label">
                        Mobile No.
                      </div>

                      <div className="mobile-detail-value">
                        {student.mobile_no ||
                          "-"}
                      </div>
                    </div>


                    <div>
                      <div className="mobile-detail-label">
                        Gender
                      </div>

                      <div className="mobile-detail-value">
                        {student.gender ||
                          "-"}
                      </div>
                    </div>


                    <div>
                      <div className="mobile-detail-label">
                        Date of Birth
                      </div>

                      <div className="mobile-detail-value">
                        {formatDate(
                          student.dob
                        )}
                      </div>
                    </div>


                    <div>
                      <div className="mobile-detail-label">
                        House
                      </div>

                      <div className="mobile-detail-value">
                        {student.house ||
                          "-"}
                      </div>
                    </div>

                  </div>


                  <div className="mobile-actions">

                    <button
                      type="button"
                      className="mobile-edit"
                      onClick={() =>
                        openEditStudent(
                          student
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="mobile-remove"
                      disabled={
                        removingId ===
                        student.id
                      }
                      onClick={() =>
                        void removeStudent(
                          student
                        )
                      }
                    >
                      {removingId ===
                      student.id
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}


      {/* =====================================================
          NO STUDENTS
      ===================================================== */}

      {!loading &&
        !error &&
        assignment &&
        filteredStudents.length === 0 && (

          <div className="message-box">

            {students.length === 0
              ? `No active students found in ${assignment.class_name} - ${assignment.section}.`
              : "No student found for your search."}

          </div>

        )}


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {modalOpen && (

        <div className="student-modal-overlay">

          <div className="student-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {isAdding
                    ? "Add Student"
                    : "Edit Student"}
                </h2>

                <p>
                  {isAdding
                    ? "Add a new student or assign an existing student to your class."
                    : "Update student details or shift the student to another class-section."}
                </p>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>


            <div className="form-grid">

              {isAdding && (
                <div className="assignment-note">

                  Student will be added to:

                  {" "}

                  <strong>
                    {assignment?.class_name}
                    {" - "}
                    {assignment?.section}
                  </strong>

                  <br />

                  If this Admission No. already exists
                  in another class/section, that
                  existing student will be moved here
                  instead of creating a duplicate.

                </div>
              )}


              <div className="form-field">

                <label>
                  Admission No. *
                </label>

                <input
                  value={
                    form.admission_no
                  }
                  onChange={(e) =>
                    updateField(
                      "admission_no",
                      e.target.value
                    )
                  }
                  placeholder="Admission Number"
                />

              </div>


              <div className="form-field">

                <label>
                  Roll No.
                </label>

                <input
                  type="number"
                  value={
                    form.roll_no
                  }
                  onChange={(e) =>
                    updateField(
                      "roll_no",
                      e.target.value
                    )
                  }
                  placeholder="Roll No."
                />

              </div>


              <div className="form-field full">

                <label>
                  Student Name *
                </label>

                <input
                  value={
                    form.student_name
                  }
                  onChange={(e) =>
                    updateField(
                      "student_name",
                      e.target.value
                    )
                  }
                  placeholder="Student Name"
                />

              </div>


              {!isAdding && (
                <>
                  <div className="form-field">

                    <label>
                      Class
                    </label>

                    <input
                      value={
                        form.class
                      }
                      onChange={(e) =>
                        updateField(
                          "class",
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <div className="form-field">

                    <label>
                      Section
                    </label>

                    <input
                      value={
                        form.section
                      }
                      onChange={(e) =>
                        updateField(
                          "section",
                          e.target.value
                        )
                      }
                    />

                  </div>
                </>
              )}


              <div className="form-field">

                <label>
                  Father's Name
                </label>

                <input
                  value={
                    form.father_name
                  }
                  onChange={(e) =>
                    updateField(
                      "father_name",
                      e.target.value
                    )
                  }
                  placeholder="Father's Name"
                />

              </div>


              <div className="form-field">

                <label>
                  Mother's Name
                </label>

                <input
                  value={
                    form.mother_name
                  }
                  onChange={(e) =>
                    updateField(
                      "mother_name",
                      e.target.value
                    )
                  }
                  placeholder="Mother's Name"
                />

              </div>


              <div className="form-field">

                <label>
                  Mobile No.
                </label>

                <input
                  value={
                    form.mobile_no
                  }
                  onChange={(e) =>
                    updateField(
                      "mobile_no",
                      e.target.value
                    )
                  }
                  placeholder="Mobile Number"
                />

              </div>


              <div className="form-field">

                <label>
                  Gender
                </label>

                <select
                  value={
                    form.gender
                  }
                  onChange={(e) =>
                    updateField(
                      "gender",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="MALE">
                    MALE
                  </option>

                  <option value="FEMALE">
                    FEMALE
                  </option>

                </select>

              </div>


              <div className="form-field">

                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={
                    form.dob
                  }
                  onChange={(e) =>
                    updateField(
                      "dob",
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="form-field">

                <label>
                  House
                </label>

                <input
                  value={
                    form.house
                  }
                  onChange={(e) =>
                    updateField(
                      "house",
                      e.target.value
                    )
                  }
                  placeholder="House"
                />

              </div>


              <div className="form-field">

                <label>
                  Status
                </label>

                <select
                  value={
                    form.status
                  }
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value
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

            </div>


            <div className="modal-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-button"
                onClick={() =>
                  void saveStudent()
                }
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : isAdding
                    ? "Add Student"
                    : "Save Changes"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}