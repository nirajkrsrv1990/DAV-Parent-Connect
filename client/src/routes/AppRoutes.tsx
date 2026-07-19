import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

// ================= ADMIN =================
import Dashboard from "../pages/admin/Dashboard";
import MasterDashboard from "../pages/admin/master/dashboard/MasterDashboard";
import ClassSectionMaster from "../pages/admin/master/ClassSectionMaster";
import SubjectMaster from "../pages/admin/master/SubjectMaster";
import SessionMaster from "../pages/admin/master/SessionMaster";
import ExamMaster from "../pages/admin/master/ExamMaster";

// ================= STUDENTS =================
import StudentUpload from "../pages/admin/students/StudentUpload";
import StudentList from "../pages/admin/students/StudentList";

// ================= TEACHERS (ADMIN) =================
import TeacherList from "../pages/admin/teachers/TeacherList";
import AddTeacher from "../pages/admin/teachers/AddTeacher";

// ================= TEACHER PORTAL =================
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import Attendance from "../pages/teacher/attendance/Attendance";
import Homework from "../pages/teacher/homework/Homework";
import MarksEntry from "../pages/teacher/marks/MarksEntry";
import TeacherAssignment from "../pages/admin/teacher-assignment/TeacherAssignment";

// ================= PARENTS =================
import ParentSignup from "../pages/parent/ParentSignup";
import ParentDashboard from "../pages/parent/dashboard/ParentDashboard";
import ParentLogin from "../pages/parent/ParentLogin";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= LOGIN ================= */}

      <Route
        path="/"
        element={<LoginPage />}
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={<Dashboard />}
      />
      <Route
    path="/admin/master"
    element={<MasterDashboard />}
/>
<Route
    path="/admin/master/session"
    element={<SessionMaster />}
/>
<Route
    path="/admin/master/class-section"
    element={<ClassSectionMaster />}
/>
<Route
    path="/admin/master/subject"
    element={<SubjectMaster />}
/>
<Route
    path="/admin/master/exam"
    element={<ExamMaster />}
/>
<Route
    path="/admin/students/list"
    element={<StudentList />}
/>
<Route
    path="/admin/students/upload"
    element={<StudentUpload />}
/>

      {/* ================= STUDENTS ================= */}

            <Route
        path="/admin/students/upload"
        element={<StudentUpload />}
      />

      {/* ================= TEACHER MANAGEMENT (ADMIN) ================= */}

      <Route
        path="/admin/teachers"
        element={<TeacherList />}
      />

      <Route
        path="/admin/teachers/add"
        element={<AddTeacher />}
      />

      {/* ================= TEACHER PORTAL ================= */}

      <Route
        path="/teacher"
        element={<TeacherDashboard />}
      />

      <Route
        path="/teacher/attendance"
        element={<Attendance />}
      />
      <Route
    path="/teacher/homework"
    element={<Homework />}
/>
<Route
    path="/teacher/marks"
    element={<MarksEntry />}
/>
<Route
    path="/admin/teacher-assignment"
    element={<TeacherAssignment />}
/>

      {/* ================= PARENT ================= */}

      <Route
        path="/parent/signup"
        element={<ParentSignup />}
      />
      <Route
  path="/parent/login"
  element={<ParentLogin />}
/>

      <Route
        path="/parent/dashboard"
        element={<ParentDashboard />}
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <h1
            style={{
              textAlign: "center",
              marginTop: "100px",
              color: "#0F4C81",
            }}
          >
            404 - Page Not Found
          </h1>
        }
      />

    </Routes>
  );
}