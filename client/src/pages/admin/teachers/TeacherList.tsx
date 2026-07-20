import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";
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

  const loadTeachers = async () => {

    try {

      const response = await fetch(
        "http:///api/teachers"
      );

      const result = await response.json();

      if (result.success) {

        setTeachers(result.teachers);

      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };
  const deleteTeacher = async (
  id: number
) => {

  const confirmDelete = window.confirm(

    "Are you sure you want to delete this teacher?"

  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(

      `http:///api/teachers/${id}`,

      {

        method: "DELETE",

      }

    );

    const result = await response.json();

    if (result.success) {

      alert(result.message);

      loadTeachers();

    }

    else {

      alert(result.message);

    }

  }

  catch (err) {

    console.log(err);

    alert("Unable to Delete Teacher");

  }

};

  useEffect(() => {

    void loadTeachers();

  }, []);
  return (
  <>
    <Sidebar />
    <Header />

    <main className="dashboard-content">

      <div className="teacher-page">

        <div className="teacher-header">

          <h1>Teacher Management</h1>

          <Link
            to="/admin/teachers/add"
            className="add-link"
          >
            <button className="add-btn">
              + Add Teacher
            </button>
          </Link>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search Teacher by ID / Name..."
          />

        </div>

        {loading ? (

          <h2
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            Loading Teachers...
          </h2>

        ) : (

          <table className="teacher-table">

            <thead>

              <tr>

                <th>Teacher ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Qualification</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>
                            {teachers.map((teacher) => (

                <tr key={teacher.id}>

                  <td>{teacher.teacher_id}</td>

                  <td>{teacher.teacher_name}</td>

                  <td>{teacher.mobile}</td>

                  <td>{teacher.qualification}</td>

                  <td>{teacher.designation}</td>

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
  style={{
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  }}
>

  <button
    className="edit-btn"
  >
    Edit
  </button>

  <button
    className="remove-btn"
    onClick={() =>
      deleteTeacher(teacher.id)
    }
  >
    Delete
  </button>

</div>

                  </td>

                </tr>

              ))}

              {teachers.length === 0 && (

                <tr>

                  <td
                    colSpan={7}
                    className="empty-row"
                  >
                    No teacher records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </main>

  </>

);

}