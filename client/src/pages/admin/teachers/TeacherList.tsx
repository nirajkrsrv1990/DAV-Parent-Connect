import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import apiClient from "../../../services/apiClient";

import "./TeacherList.css";


type Teacher = {
  id: number;
  teacher_id: string;
  teacher_name: string;
  mobile: string;
  email: string;
  qualification: string;
  designation: string;
  status: string;
};


export default function TeacherList() {

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  /* =====================================================
     LOAD TEACHERS
     ===================================================== */

  const loadTeachers = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await apiClient.get(
          "/teachers"
        );

      const result =
        response.data;

      console.log(
        "Teacher API Status:",
        response.status
      );

      console.log(
        "API Result:",
        result
      );

      console.log(
        "Teachers:",
        result.teachers
      );


      if (result.success) {

        setTeachers(
          Array.isArray(result.teachers)
            ? result.teachers
            : []
        );

      } else {

        setError(
          result.message ||
          "Unable to load teachers."
        );

      }

    } catch (err) {

      console.error(
        "Teacher Load Error:",
        err
      );

      setError(
        "Unable to connect server."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     DELETE TEACHER
     ===================================================== */

  const deleteTeacher = async (
    id: number
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this teacher?"
      );

    if (!confirmDelete) {
      return;
    }


    try {

      const response =
        await apiClient.delete(
          `/teachers/${id}`
        );

      const result =
        response.data;


      if (result.success) {

        alert(
          result.message ||
          "Teacher deleted successfully."
        );

        await loadTeachers();

      } else {

        alert(
          result.message ||
          "Unable to delete teacher."
        );

      }

    } catch (err) {

      console.error(
        "Delete Teacher Error:",
        err
      );

      alert(
        "Unable to Delete Teacher"
      );

    }

  };


  /* =====================================================
     INITIAL LOAD
     ===================================================== */

  useEffect(() => {

    void loadTeachers();

  }, []);


  /* =====================================================
     SEARCH FILTER
     ===================================================== */

  const filteredTeachers =
    useMemo(() => {

      const searchText =
        search.trim().toLowerCase();


      if (!searchText) {

        return teachers;

      }


      return teachers.filter(
        (teacher) =>

          teacher.teacher_id
            .toLowerCase()
            .includes(searchText)

          ||

          teacher.teacher_name
            .toLowerCase()
            .includes(searchText)

          ||

          teacher.mobile
            .toLowerCase()
            .includes(searchText)

          ||

          teacher.designation
            .toLowerCase()
            .includes(searchText)

      );

    }, [teachers, search]);


  /* =====================================================
     PAGE
     ===================================================== */

  return (

    <div className="teacher-page">


      {/* =================================================
          HEADER
          ================================================= */}

      <div className="teacher-header">

        <h1>
          Teacher Management
        </h1>


        <Link
          to="/admin/teachers/add"
          className="add-link"
        >

          <button
            type="button"
            className="add-btn"
          >
            + Add Teacher
          </button>

        </Link>

      </div>


      {/* =================================================
          SEARCH
          ================================================= */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search Teacher by ID / Name..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* =================================================
          LOADING
          ================================================= */}

      {loading && (

        <h2
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          Loading Teachers...
        </h2>

      )}


      {/* =================================================
          ERROR
          ================================================= */}

      {!loading && error && (

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "red",
          }}
        >

          <h3>
            {error}
          </h3>

          <button
            type="button"
            onClick={() => {
              void loadTeachers();
            }}
          >
            Retry
          </button>

        </div>

      )}


      {/* =================================================
          TEACHER TABLE
          ================================================= */}

      {!loading && !error && (

        <table className="teacher-table">

          <thead>

            <tr>

              <th>
                Teacher ID
              </th>

              <th>
                Name
              </th>

              <th>
                Mobile
              </th>

              <th>
                Qualification
              </th>

              <th>
                Designation
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredTeachers.map(
              (teacher) => (

                <tr
                  key={teacher.id}
                >

                  <td>
                    {teacher.teacher_id}
                  </td>

                  <td>
                    {teacher.teacher_name}
                  </td>

                  <td>
                    {teacher.mobile}
                  </td>

                  <td>
                    {teacher.qualification}
                  </td>

                  <td>
                    {teacher.designation}
                  </td>

                  <td>

                    <span
                      className={
                        teacher.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {teacher.status}
                    </span>

                  </td>

                  <td>

                    <div
                      className="teacher-actions"
                    >

                      <button
                        type="button"
                        className="edit-btn"
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() =>
                          void deleteTeacher(
                            teacher.id
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


            {/* =================================================
                NO RECORD
                ================================================= */}

            {filteredTeachers.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="empty-row"
                >

                  {search.trim()
                    ? "No matching teacher records found."
                    : "No teacher records found."
                  }

                </td>

              </tr>

            )}

          </tbody>

        </table>

      )}

    </div>

  );

}