import TeacherStudentList from "../pages/teacher/TeacherStudentList";
import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import AdminLayout from "../components/layout/AdminLayout";

// ================= ADMIN =================
import Dashboard from "../pages/admin/Dashboard";
import MasterDashboard from "../pages/admin/master/dashboard/MasterDashboard";
import ClassSectionMaster from "../pages/admin/master/ClassSectionMaster";
import SubjectMaster from "../pages/admin/master/SubjectMaster";
import SessionMaster from "../pages/admin/master/SessionMaster";
import ExamMaster from "../pages/admin/master/ExamMaster";
import MarksPatternMaster from "../pages/admin/master/MarksPatternMaster";
import AddNotice from "../pages/admin/notices/AddNotice";
import NoticeList from "../pages/admin/notices/NoticeList";

// ================= STUDENTS =================
import StudentUpload from "../pages/admin/students/StudentUpload";
import StudentList from "../pages/admin/students/StudentList";

// ================= TEACHERS (ADMIN) =================
import TeacherList from "../pages/admin/teachers/TeacherList";
import AddTeacher from "../pages/admin/teachers/AddTeacher";
import TeacherAssignment from "../pages/admin/teacher-assignment/TeacherAssignment";

// ================= TEACHER PORTAL =================
import TeacherLayout from "../components/layout/TeacherLayout";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import Attendance from "../pages/teacher/attendance/Attendance";
import Homework from "../pages/teacher/homework/Homework";
import MarksEntry from "../pages/teacher/marks/MarksEntry";

// ================= PARENTS =================
import ParentSignup from "../pages/parent/ParentSignup";
import ParentLogin from "../pages/parent/ParentLogin";
import ParentDashboard from "../pages/parent/dashboard/ParentDashboard";
import ParentHomework from "../pages/parent/dashboard/ParentHomework";
import ParentAttendance from "../pages/parent/dashboard/ParentAttendance";
import ParentAnnualCalendar from "../pages/parent/dashboard/ParentAnnualCalendar";
import ParentAnnualAttendance from "../pages/parent/dashboard/ParentAnnualAttendance";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= LOGIN & NOTICES ================= */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/notices" element={<NoticeList />} />
      <Route path="/admin/notices/add" element={<AddNotice />} />

      {/* ================= ADMIN ================= */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/master" element={<MasterDashboard />} />
        <Route path="/admin/master/session" element={<SessionMaster />} />
        <Route path="/admin/master/class-section" element={<ClassSectionMaster />} />
        <Route path="/admin/master/subject" element={<SubjectMaster />} />
        <Route path="/admin/master/exam" element={<ExamMaster />} />
        <Route
  path="/admin/master/marks-pattern"
  element={<MarksPatternMaster />}
/>
        <Route path="/admin/students/upload" element={<StudentUpload />} />
        <Route path="/admin/students/list" element={<StudentList />} />
        <Route path="/admin/teachers" element={<TeacherList />} />
        <Route path="/admin/teachers/add" element={<AddTeacher />} />
        <Route path="/admin/teacher-assignment" element={<TeacherAssignment />} />
      </Route>

      {/* ================= TEACHER PORTAL ================= */}
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path=":teacherId" element={<TeacherDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="homework" element={<Homework />} />
        <Route path="marks" element={<MarksEntry />} />
        <Route path="notices" element={<NoticeList />} />
        <Route
  path="students"
  element={<TeacherStudentList />}
/>
        <Route path="profile" element={<TeacherDashboard />} />
        <Route path="change-password" element={<TeacherDashboard />} />
      </Route>

      {/* ================= PARENT PORTAL ================= */}
      <Route path="/parent/signup" element={<ParentSignup />} />
      <Route path="/parent/login" element={<ParentLogin />} />
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/parent/homework" element={<ParentHomework />} />
      <Route path="/parent/attendance" element={<ParentAttendance />} />
      <Route 
  path="/parent/annual-attendance" 
  element={<ParentAnnualAttendance />} 
/>
       <Route path="/parent/annual-calendar"  element={<ParentAnnualCalendar />} />
      <Route path="/parent/notices" element={<NoticeList />} />
     

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <h1 style={{ textAlign: "center", marginTop: "100px", color: "#0F4C81" }}>
            404 - Page Not Found
          </h1>
        }
      />
    </Routes>
  );
}