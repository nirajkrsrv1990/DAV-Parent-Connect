import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";

import "./StudentList.css";

type Student = {

  id:number;

  admission_no:string;

  student_name:string;

  father_name:string;

  mother_name:string;

  mobile_no:string;

  class:string;

  section:string;

  roll_no:number;

  gender:string;

  dob:string;

  house:string;

  status:string;

};

export default function StudentList(){

  const [students,setStudents]=
    useState<Student[]>([]);

  const [loading,setLoading]=
    useState(true);

  const [search,setSearch]=
    useState("");

  const [error,setError]=
    useState("");

  const loadStudents=async()=>{

    try{

      setLoading(true);

      const response=
        await fetch(
          "http://localhost:5000/api/students"
        );

      const result=
        await response.json();

      if(result.success){

        setStudents(result.students);

      }

      else{

        setError(result.message);

      }

    }

    catch{

      setError(
        "Unable to connect server."
      );

    }

    finally{

      setLoading(false);

    }

  };

  useEffect(() => {

  const fetchStudents = async () => {
    await loadStudents();
  };

  fetchStudents();

}, []);

  const filteredStudents=
    useMemo(()=>{

      return students.filter(

        (student)=>

          student.student_name

          .toLowerCase()

          .includes(

            search.toLowerCase()

          )

      );

    },[students,search]);
    return (

  <>

    <Sidebar />

    <Header />

    <main className="dashboard-content">

      <div className="master-page">

        <div className="page-header">

          <h1>Student List</h1>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search Student..."
            value={search}
            onChange={(e)=>
              setSearch(e.target.value)
            }
          />

        </div>

        {

          loading &&

          <h3
            style={{
              textAlign:"center",
              marginTop:"40px"
            }}
          >
            Loading Students...
          </h3>

        }

        {

          error &&

          <h3
            style={{
              textAlign:"center",
              color:"red",
              marginTop:"40px"
            }}
          >
            {error}
          </h3>

        }

        {

          !loading && !error &&

          <table className="master-table">

            <thead>

              <tr>

                <th>Adm No</th>

                <th>Student Name</th>

                <th>Class</th>

                <th>Section</th>

                <th>Roll</th>

                <th>Mobile</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {

                filteredStudents.map(

                  (student)=>(

                    <tr
                      key={student.id}
                    >

                      <td>

                        {student.admission_no}

                      </td>

                      <td>

                        {student.student_name}

                      </td>

                      <td>

                        {student.class}

                      </td>

                      <td>

                        {student.section}

                      </td>

                      <td>

                        {student.roll_no}

                      </td>

                      <td>

                        {student.mobile_no}

                      </td>

                      <td>

                        {student.status}

                      </td>

                      <td>

                        <button
                          className="edit-btn"
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          style={{
                            marginLeft:"8px"
                          }}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )

                )

              }
                            {

                filteredStudents.length===0 && (

                  <tr>

                    <td
                      colSpan={8}
                      style={{
                        textAlign:"center",
                        padding:"20px"
                      }}
                    >
                      No Student Found
                    </td>

                  </tr>

                )

              }

            </tbody>

          </table>

        }

      </div>

    </main>

  </>

);

}