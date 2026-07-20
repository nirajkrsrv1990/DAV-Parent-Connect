import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";
import "./ClassSectionMaster.css";

type ClassData = {
  id: number;
  className: string;
  sections: string[];
  status: "Active" | "Inactive";
  order: number;
};

export default function ClassSectionMaster() {

  const [className, setClassName] = useState("");

  const [displayOrder, setDisplayOrder] = useState("");

  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const [search, setSearch] = useState("");

  const [sections, setSections] = useState<string[]>([]);

  const [editId, setEditId] = useState<number | null>(null);

  const [classList, setClassList] =
  useState<ClassData[]>([]);
  const loadClasses = async () => {

  try {

    const response = await fetch(

      "/api/master/class"

    );

    const result = await response.json();

    if (result.success) {

      const data: ClassData[] = result.classes.map(

        (item: {
  id: number;
  class_name: string;
  sections: string[];
  status: "Active" | "Inactive";
  display_order: number;
}) => ({

          id: item.id,

          className: item.class_name,

          sections: item.sections,

          status: item.status,

          order: item.display_order,

        })

      );

      setClassList(data);

    }

  } catch (err) {

    console.log(err);

  }

};

  const allSections = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "JEE",
    "NEET",
    "PCB",
    "PCM",
    "COMM",
  ];

  const toggleSection = (section: string) => {

    setSections((prev) =>
      prev.includes(section)
        ? prev.filter((x) => x !== section)
        : [...prev, section]
    );

  };

  const resetForm = () => {

    setClassName("");
    setDisplayOrder("");
    setStatus("Active");
    setSections([]);
    setEditId(null);

  };

  const saveClass = async () => {

  if (!className.trim()) {
    alert("Enter Class Name");
    return;
  }

  if (!displayOrder.trim()) {
    alert("Enter Display Order");
    return;
  }

  if (sections.length === 0) {
    alert("Select at least one Section");
    return;
  }

  try {

    const response = await fetch(

      "/api/master/class",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          className: className.trim(),

          sections,

          displayOrder: Number(displayOrder),

          status,

        }),

      }

    );

    const result = await response.json();

    if (result.success) {

      alert("Class Saved Successfully");

      resetForm();

      loadClasses();

    } else {

      alert(result.message);

    }

  } catch (err) {

    console.log(err);

    alert("Unable to Save");

  }

};

  const editClass = (item: ClassData) => {

    setEditId(item.id);
    setClassName(item.className);
    setDisplayOrder(item.order.toString());
    setStatus(item.status);
    setSections([...item.sections]);

  };

  const deleteClass = (id: number) => {

    if (!window.confirm("Delete this class?")) return;

    setClassList(classList.filter((item) => item.id !== id));

    if (editId === id) {
      resetForm();
    }

  };

  useEffect(() => {

  const fetchClasses = async () => {

    await loadClasses();

  };

  void fetchClasses();

}, []);
  const filteredData = useMemo(() => {

    return classList.filter((item) =>
      item.className
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [classList, search]);

  return (
  <>
    <Sidebar />
    <Header />

    <main className="dashboard-content">

      <div className="master-page">

        <div className="page-header">
          <h1>Class & Section Master</h1>
        </div>

        <div className="master-form">

          <div className="form-row">

            <div className="form-group">
              <label>Class Name</label>

              <input
                type="text"
                value={className}
                placeholder="Enter Class Name"
                onChange={(e) =>
                  setClassName(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Display Order</label>

              <input
                type="number"
                value={displayOrder}
                placeholder="1"
                onChange={(e) =>
                  setDisplayOrder(e.target.value)
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
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

          </div>

          <label>Sections</label>

          <div className="section-grid">

            {allSections.map((item) => (

              <button
                key={item}
                type="button"
                className={
                  sections.includes(item)
                    ? "section-btn active"
                    : "section-btn"
                }
                onClick={() => toggleSection(item)}
              >
                {item}
              </button>

            ))}

          </div>

          <div className="btn-group">

            <button
              className="save-btn"
              onClick={saveClass}
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
            placeholder="Search Class..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <table className="master-table">

          <thead>

            <tr>

              <th>Class</th>

              <th>Sections</th>

              <th>Status</th>

              <th>Order</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredData.map((item) => (

              <tr key={item.id}>

                <td>{item.className}</td>

                <td>
                  {item.sections.join(", ")}
                </td>

                <td>{item.status}</td>

                <td>{item.order}</td>

                <td>

                  <div className="action-btns">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editClass(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteClass(item.id)
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