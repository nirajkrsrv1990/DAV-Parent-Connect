import "./TeacherDashboard.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import TeacherHeader from "../../components/teacher/TeacherHeader";

type Teacher = {
  teacher_id: string;
  teacher_name: string;
  mobile: string;
  email: string;
};

export default function TeacherDashboard() {

  const navigate = useNavigate();

  const [teacher, setTeacher] =
    useState<Teacher | null>(null);

  const [assignedClass, setAssignedClass] =
    useState("");

  /* ==========================
     LOAD CLASS TEACHER
  ========================== */

  const loadClassTeacher = useCallback(
    async (teacherId: string) => {

      try {

        const response = await fetch(
          `http:///api/class-teacher/${teacherId}`
        );

        const result = await response.json();

console.log("Class Teacher API Response:", result);

if (
  result.success &&
  result.assignment
) {

  console.log(
    "Assigned Class:",
    result.assignment
  );

  setAssignedClass(
    `${result.assignment.class_name}-${result.assignment.section}`
  );

} else {

  console.log("No Assignment Found");

  setAssignedClass("");

}

      } catch (err) {

        console.log(err);

      }

    },
    []
  );

  /* ==========================
     LOAD TEACHER
  ========================== */

  useEffect(() => {

    const teacherData =
      localStorage.getItem("teacher");

    if (!teacherData) {

      navigate("/");

      return;

    }

    const data: Teacher =
  JSON.parse(teacherData);

console.log("Teacher LocalStorage:", data);

setTeacher(data);

void loadClassTeacher(
  data.teacher_id
);

  }, [navigate, loadClassTeacher]);
    return (
    <>
      <TeacherSidebar />
      <TeacherHeader />

      <main className="teacher-dashboard">

        <div className="welcome-card">

          <h1>
            Welcome, {teacher?.teacher_name}
          </h1>

          <p>
            <strong>Teacher ID :</strong>{" "}
            {teacher?.teacher_id}
          </p>

          <p>
            <strong>Class Teacher :</strong>{" "}
            {assignedClass || "Not Assigned"}
          </p>

        </div>

        <div className="teacher-grid">

          <div
            className="teacher-card"
            onClick={() =>
              navigate("/teacher/attendance")
            }
          >
            <h3>Today's Attendance</h3>
            <p>Take Attendance</p>
          </div>

          <div
            className="teacher-card"
            onClick={() =>
              navigate("/teacher/homework")
            }
          >
            <h3>Homework</h3>
            <p>Upload Homework</p>
          </div>

          <div
            className="teacher-card"
            onClick={() =>
              navigate("/teacher/marks")
            }
          >
            <h3>Marks Entry</h3>
            <p>Enter Marks</p>
          </div>

          <div
            className="teacher-card"
            onClick={() =>
              navigate("/teacher/students")
            }
          >
            <h3>Student List</h3>
            <p>View Students</p>
          </div>

          <div
            className="teacher-card"
            onClick={() =>
              navigate("/teacher/notices")
            }
          >
            <h3>Notices</h3>
            <p>School Circulars</p>
          </div>

          <div
            className="teacher-card"
            onClick={() =>
              navigate("/teacher/profile")
            }
          >
            <h3>My Profile</h3>
            <p>View Profile</p>
          </div>

          <div
            className="teacher-card"
            onClick={() =>
              navigate("/teacher/change-password")
            }
          >
            <h3>Change Password</h3>
            <p>Update Password</p>
          </div>

          <div
            className="teacher-card"
            onClick={() => {

              localStorage.removeItem(
                "teacher"
              );

              navigate("/");

            }}
          >
            <h3>Logout</h3>
            <p>Sign Out</p>
          </div>

        </div>

      </main>
    </>
  );

}