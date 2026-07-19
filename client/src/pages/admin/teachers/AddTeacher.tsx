import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";
import "./AddTeacher.css";

export default function AddTeacher() {

  const navigate = useNavigate();

  const [teacherName, setTeacherName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [qualification, setQualification] =
    useState("");

  const [designation, setDesignation] =
    useState("");

  const [joiningDate, setJoiningDate] =
    useState("");

  const [status, setStatus] =
    useState("Active");

  const [teacherId, setTeacherId] =
    useState("Auto Generate");

  const [password, setPassword] =
    useState("Auto Generate");

  /* ==========================
     CLASS TEACHER
  ========================== */

  const [classTeacherClass, setClassTeacherClass] =
    useState("");

  const [classTeacherSection, setClassTeacherSection] =
    useState("");

  /* ==========================
     SAVE TEACHER
  ========================== */

  const saveTeacher = async () => {

    if (!teacherName.trim()) {

      alert("Enter Teacher Name");

      return;

    }

    if (!classTeacherClass) {

      alert("Select Class");

      return;

    }

    if (!classTeacherSection) {

      alert("Select Section");

      return;

    }

    try {

      const response = await fetch(

        "http://localhost:5000/api/teachers/create",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            teacher_name: teacherName,

            mobile,

            email,

            qualification,

            designation,

            joiningDate,

            status,

            class_name: classTeacherClass,

            section: classTeacherSection,

          }),

        }

      );

      const result = await response.json();
            if (result.success) {

        setTeacherId(
          result.teacher.teacher_id
        );

        setPassword(
          result.teacher.password
        );

        const assignResponse = await fetch(

  "http://localhost:5000/api/teachers/assign-class-teacher",

  {

    method: "POST",

    headers: {

      "Content-Type": "application/json",

    },

    body: JSON.stringify({

      teacher_id: result.teacher.teacher_id,

      class_name: classTeacherClass,

      section: classTeacherSection,

    }),

  }

);

const assignResult = await assignResponse.json();

if (!assignResult.success) {

  alert(assignResult.message);

  return;

}

        alert(

`Teacher Created Successfully

Teacher ID : ${result.teacher.teacher_id}

Password : ${result.teacher.password}`

        );

        navigate("/admin/teachers");

      }

      else {

        alert(result.message);

      }

    }

    catch (err) {

      console.log(err);

      alert("Unable to Save Teacher");

    }

  };

  return (

    <>

      <Sidebar />

      <Header />

      <main className="dashboard-content">

        <div className="teacher-form">

          <h1>Add Teacher</h1>

          <div className="form-grid">
                      <div>

            <label>Teacher ID</label>

            <input
              value={teacherId}
              readOnly
            />

          </div>

          <div>

            <label>Temporary Password</label>

            <input
              value={password}
              readOnly
            />

          </div>

          <div>

            <label>Teacher Name</label>

            <input
              value={teacherName}
              onChange={(e) =>
                setTeacherName(e.target.value)
              }
              placeholder="Teacher Name"
            />

          </div>

          <div>

            <label>Mobile</label>

            <input
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
              placeholder="Mobile Number"
            />

          </div>

          <div>

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email Address"
            />

          </div>

          <div>

            <label>Qualification</label>

            <input
              value={qualification}
              onChange={(e) =>
                setQualification(e.target.value)
              }
              placeholder="Qualification"
            />

          </div>

          <div>

            <label>Designation</label>

            <input
              value={designation}
              onChange={(e) =>
                setDesignation(e.target.value)
              }
              placeholder="Designation"
            />

          </div>

          <div>

            <label>Joining Date</label>

            <input
              type="date"
              value={joiningDate}
              onChange={(e) =>
                setJoiningDate(e.target.value)
              }
            />

          </div>

          <div>

            <label>Status</label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

          </div>

        </div>

        <hr />

        <h2>Class Teacher Assignment</h2>

        <div className="form-grid">

          <div>

            <label>Class</label>

            <select
              value={classTeacherClass}
              onChange={(e) =>
                setClassTeacherClass(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Class
              </option>

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
              value={classTeacherSection}
              onChange={(e) =>
                setClassTeacherSection(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Section
              </option>

              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>E</option>
              <option>JEE</option>
              <option>NEET</option>
              <option>COMM</option>

            </select>

          </div>

         </div>

        <div className="button-group">

          <button
            className="save-btn"
            onClick={saveTeacher}
          >
            Save Teacher
          </button>

          <button
            className="cancel-btn"
            onClick={() =>
              navigate("/admin/teachers")
            }
          >
            Cancel
          </button>

        </div>

      </div>

    </main>

  </>

);

}