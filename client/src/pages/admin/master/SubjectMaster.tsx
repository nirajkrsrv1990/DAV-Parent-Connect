import { useMemo, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";
import "./SubjectMaster.css";

type SubjectData = {
  id: number;
  subjectName: string;
  subjectCode: string;
  subjectType: "Theory" | "Practical" | "Both";
  status: "Active" | "Inactive";
};

export default function SubjectMaster() {

  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectType, setSubjectType] =
    useState<"Theory" | "Practical" | "Both">("Theory");

  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  const [search, setSearch] = useState("");

  const [editId, setEditId] =
    useState<number | null>(null);

  const [subjectList, setSubjectList] =
    useState<SubjectData[]>([
      {
        id: 1,
        subjectName: "English",
        subjectCode: "ENG101",
        subjectType: "Theory",
        status: "Active",
      },
      {
        id: 2,
        subjectName: "Mathematics",
        subjectCode: "MAT101",
        subjectType: "Theory",
        status: "Active",
      },
      {
        id: 3,
        subjectName: "Computer",
        subjectCode: "COMP101",
        subjectType: "Both",
        status: "Active",
      },
    ]);

  const resetForm = () => {

    setSubjectName("");
    setSubjectCode("");
    setSubjectType("Theory");
    setStatus("Active");
    setEditId(null);

  };

  const saveSubject = () => {

    if (!subjectName.trim()) {
      alert("Enter Subject Name");
      return;
    }

    if (!subjectCode.trim()) {
      alert("Enter Subject Code");
      return;
    }

    const duplicate = subjectList.find(
      (item) =>
        item.subjectName.toLowerCase() ===
          subjectName.toLowerCase() &&
        item.id !== editId
    );

    if (duplicate) {
      alert("Subject already exists.");
      return;
    }

    if (editId !== null) {

      setSubjectList(
        subjectList.map((item) =>
          item.id === editId
            ? {
                ...item,
                subjectName,
                subjectCode,
                subjectType,
                status,
              }
            : item
        )
      );

    } else {

      setSubjectList([
        ...subjectList,
        {
          id: Date.now(),
          subjectName,
          subjectCode,
          subjectType,
          status,
        },
      ]);

    }

    resetForm();

  };

  const editSubject = (item: SubjectData) => {

    setEditId(item.id);
    setSubjectName(item.subjectName);
    setSubjectCode(item.subjectCode);
    setSubjectType(item.subjectType);
    setStatus(item.status);

  };

  const deleteSubject = (id: number) => {

    if (!window.confirm("Delete Subject?"))
      return;

    setSubjectList(
      subjectList.filter(
        (item) => item.id !== id
      )
    );

    if (editId === id)
      resetForm();

  };

  const filteredData = useMemo(() => {

    return subjectList.filter((item) =>
      item.subjectName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [subjectList, search]);

  return (
  <>
    <Sidebar />
    <Header />

    <main className="dashboard-content">

      <div className="master-page">

        <div className="page-header">
          <h1>Subject Master</h1>
        </div>

        <div className="master-form">

          <div className="form-row">

            <div className="form-group">
              <label>Subject Name</label>

              <input
                type="text"
                value={subjectName}
                placeholder="Enter Subject Name"
                onChange={(e) =>
                  setSubjectName(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Subject Code</label>

              <input
                type="text"
                value={subjectCode}
                placeholder="Enter Subject Code"
                onChange={(e) =>
                  setSubjectCode(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Subject Type</label>

              <select
                value={subjectType}
                onChange={(e) =>
                  setSubjectType(
                    e.target.value as
                      | "Theory"
                      | "Practical"
                      | "Both"
                  )
                }
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "Active"
                      | "Inactive"
                  )
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          <div className="btn-group">

            <button
              className="save-btn"
              onClick={saveSubject}
            >
              {editId === null ? "Save" : "Update"}
            </button>

            <button
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>

          </div>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search Subject..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <table className="master-table">

          <thead>

            <tr>

              <th>Subject Name</th>

              <th>Code</th>

              <th>Type</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredData.map((item) => (

              <tr key={item.id}>

                <td>{item.subjectName}</td>

                <td>{item.subjectCode}</td>

                <td>{item.subjectType}</td>

                <td>{item.status}</td>

                <td>

                  <div className="action-btns">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editSubject(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteSubject(item.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {filteredData.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  style={{ textAlign: "center" }}
                >
                  No Record Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </main>

  </>
);
}