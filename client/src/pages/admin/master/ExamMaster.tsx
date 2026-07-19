import { useMemo, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";
import "./ExamMaster.css";

type ExamData = {
  id: number;
  examName: string;
  examCategory: string;
  customExamName: string;
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  passingMarks: number;
  weightage: number;
  displayOrder: number;
  status: "Active" | "Inactive";
};

export default function ExamMaster() {

  const [examName, setExamName] = useState("");
  const [examCategory, setExamCategory] = useState("Periodic Test");
  const [customExamName, setCustomExamName] = useState("");

  const [theoryMarks, setTheoryMarks] = useState(0);
  const [practicalMarks, setPracticalMarks] = useState(0);
  const [passingMarks, setPassingMarks] = useState(0);
  const [weightage, setWeightage] = useState(0);
  const [displayOrder, setDisplayOrder] = useState(1);

  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  const [search, setSearch] = useState("");

  const [editId, setEditId] =
    useState<number | null>(null);

  const totalMarks = theoryMarks + practicalMarks;

  const [examList, setExamList] =
    useState<ExamData[]>([
      {
        id: 1,
        examName: "1st Pre-Mid",
        examCategory: "Periodic Test",
        customExamName: "",
        theoryMarks: 20,
        practicalMarks: 0,
        totalMarks: 20,
        passingMarks: 7,
        weightage: 10,
        displayOrder: 1,
        status: "Active",
      },
    ]);

  const resetForm = () => {

    setExamName("");
    setExamCategory("Periodic Test");
    setCustomExamName("");
    setTheoryMarks(0);
    setPracticalMarks(0);
    setPassingMarks(0);
    setWeightage(0);
    setDisplayOrder(1);
    setStatus("Active");
    setEditId(null);

  };

  const saveExam = () => {

    if (!examName.trim()) {
      alert("Enter Exam Name");
      return;
    }

    const duplicate = examList.find(
      (item) =>
        item.examName.toLowerCase() ===
          examName.toLowerCase() &&
        item.id !== editId
    );

    if (duplicate) {
      alert("Exam already exists.");
      return;
    }

    const examData: ExamData = {

      id: editId ?? Date.now(),

      examName,

      examCategory,

      customExamName,

      theoryMarks,

      practicalMarks,

      totalMarks,

      passingMarks,

      weightage,

      displayOrder,

      status,

    };

    if (editId !== null) {

      setExamList(
        examList.map((item) =>
          item.id === editId
            ? examData
            : item
        )
      );

    } else {

      setExamList([
        ...examList,
        examData,
      ]);

    }

    resetForm();

  };

  const editExam = (item: ExamData) => {

    setEditId(item.id);

    setExamName(item.examName);

    setExamCategory(item.examCategory);

    setCustomExamName(item.customExamName);

    setTheoryMarks(item.theoryMarks);

    setPracticalMarks(item.practicalMarks);

    setPassingMarks(item.passingMarks);

    setWeightage(item.weightage);

    setDisplayOrder(item.displayOrder);

    setStatus(item.status);

  };

  const deleteExam = (id: number) => {

    if (!window.confirm("Delete Exam?"))
      return;

    setExamList(
      examList.filter(
        (item) => item.id !== id
      )
    );

  };

  const filteredData = useMemo(() => {

    return examList.filter((item) =>
      item.examName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [search, examList]);

  return (
  <>
    <Sidebar />
    <Header />

    <main className="dashboard-content">

      <div className="master-page">

        <div className="page-header">
          <h1>Exam Master</h1>
        </div>

        <div className="master-form">

          <div className="form-row">

            <div className="form-group">
              <label>Exam Name</label>

              <input
                type="text"
                value={examName}
                placeholder="Enter Exam Name"
                onChange={(e) =>
                  setExamName(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Exam Category</label>

              <select
                value={examCategory}
                onChange={(e) =>
                  setExamCategory(e.target.value)
                }
              >
                <option>Periodic Test</option>
                <option>Half Yearly</option>
                <option>Annual</option>
                <option>Pre Board</option>
                <option>Practical</option>
                <option>Oral</option>
                <option>Subject Enrichment</option>
                <option>Notebook</option>
                <option>Multiple Assessment</option>
                <option>Assignment</option>
                <option>Project</option>
                <option>Custom</option>
              </select>
            </div>

            {examCategory === "Custom" && (

              <div className="form-group">

                <label>Custom Exam Name</label>

                <input
                  type="text"
                  value={customExamName}
                  onChange={(e) =>
                    setCustomExamName(e.target.value)
                  }
                />

              </div>

            )}

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Theory Marks</label>

              <input
                type="number"
                value={theoryMarks}
                onChange={(e) =>
                  setTheoryMarks(Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label>Practical Marks</label>

              <input
                type="number"
                value={practicalMarks}
                onChange={(e) =>
                  setPracticalMarks(Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label>Total Marks</label>

              <input
                type="number"
                value={totalMarks}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Passing Marks</label>

              <input
                type="number"
                value={passingMarks}
                onChange={(e) =>
                  setPassingMarks(Number(e.target.value))
                }
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Weightage (%)</label>

              <input
                type="number"
                value={weightage}
                onChange={(e) =>
                  setWeightage(Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label>Display Order</label>

              <input
                type="number"
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(Number(e.target.value))
                }
              />
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
              onClick={saveExam}
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
            placeholder="Search Exam..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <table className="master-table">

          <thead>

            <tr>

              <th>Exam Name</th>

              <th>Category</th>

              <th>Total</th>

              <th>Pass</th>

              <th>Weight</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredData.map((item) => (

              <tr key={item.id}>

                <td>{item.examName}</td>

                <td>{item.examCategory}</td>

                <td>{item.totalMarks}</td>

                <td>{item.passingMarks}</td>

                <td>{item.weightage}%</td>

                <td>{item.status}</td>

                <td>

                  <div className="action-btns">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editExam(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteExam(item.id)
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
                  colSpan={7}
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