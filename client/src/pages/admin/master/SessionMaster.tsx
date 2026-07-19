import { useMemo, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";
import "./SessionMaster.css";

type SessionData = {
  id: number;
  sessionName: string;
  startDate: string;
  endDate: string;
  current: boolean;
  status: "Active" | "Inactive";
};

export default function SessionMaster() {

  const [sessionName, setSessionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [current, setCurrent] = useState(true);

  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  const [search, setSearch] = useState("");

  const [editId, setEditId] =
    useState<number | null>(null);

  const [sessionList, setSessionList] =
    useState<SessionData[]>([
      {
        id: 1,
        sessionName: "2026-27",
        startDate: "2026-04-01",
        endDate: "2027-03-31",
        current: true,
        status: "Active",
      },
    ]);

  const resetForm = () => {

    setSessionName("");
    setStartDate("");
    setEndDate("");
    setCurrent(true);
    setStatus("Active");
    setEditId(null);

  };

  const saveSession = () => {

    if (!sessionName.trim()) {
      alert("Enter Session");
      return;
    }

    if (!startDate || !endDate) {
      alert("Select Start & End Date");
      return;
    }

    const duplicate = sessionList.find(
      (item) =>
        item.sessionName === sessionName &&
        item.id !== editId
    );

    if (duplicate) {
      alert("Session already exists.");
      return;
    }

    if (editId !== null) {

      setSessionList(
        sessionList.map((item) =>
          item.id === editId
            ? {
                ...item,
                sessionName,
                startDate,
                endDate,
                current,
                status,
              }
            : item
        )
      );

    } else {

      setSessionList([
        ...sessionList,
        {
          id: Date.now(),
          sessionName,
          startDate,
          endDate,
          current,
          status,
        },
      ]);

    }

    resetForm();

  };

  const editSession = (item: SessionData) => {

    setEditId(item.id);
    setSessionName(item.sessionName);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setCurrent(item.current);
    setStatus(item.status);

  };

  const deleteSession = (id: number) => {

    if (!window.confirm("Delete Session?"))
      return;

    setSessionList(
      sessionList.filter(
        (item) => item.id !== id
      )
    );

    if (editId === id)
      resetForm();

  };

  const filteredData = useMemo(() => {

    return sessionList.filter((item) =>
      item.sessionName
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [sessionList, search]);

  return (
  <>
    <Sidebar />
    <Header />

    <main className="dashboard-content">

      <div className="master-page">

        <div className="page-header">
          <h1>Session Master</h1>
        </div>

        <div className="master-form">

          <div className="form-row">

            <div className="form-group">
              <label>Academic Session</label>

              <input
                type="text"
                placeholder="2026-27"
                value={sessionName}
                onChange={(e) =>
                  setSessionName(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>End Date</label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
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
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >

            <input
              type="checkbox"
              checked={current}
              onChange={(e) =>
                setCurrent(e.target.checked)
              }
            />

            <span>
              Set as Current Session
            </span>

          </div>

          <div className="btn-group">

            <button
              className="save-btn"
              onClick={saveSession}
            >
              {editId === null
                ? "Save"
                : "Update"}
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
            placeholder="Search Session..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <table className="master-table">

          <thead>

            <tr>

              <th>Session</th>

              <th>Start Date</th>

              <th>End Date</th>

              <th>Current</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredData.map((item) => (

              <tr key={item.id}>

                <td>{item.sessionName}</td>

                <td>{item.startDate}</td>

                <td>{item.endDate}</td>

                <td>
                  {item.current ? "Yes" : "No"}
                </td>

                <td>{item.status}</td>

                <td>

                  <div className="action-btns">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editSession(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteSession(item.id)
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
                  colSpan={6}
                  style={{
                    textAlign: "center",
                  }}
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