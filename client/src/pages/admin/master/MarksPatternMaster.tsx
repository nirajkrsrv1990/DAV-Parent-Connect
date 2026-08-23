import { useEffect, useMemo, useState } from "react";
import "./MarksPatternMaster.css";
import { API_BASE_URL } from "../../../config/api";

type MarksComponent = {
  name: string;
  fullMarks: number;
};

type MarksPattern = {
  id: number;
  exam_name: string;
  class_name: string;
  subject_name: string;
  subject_category: string;
  components: MarksComponent[];
  total_marks: number;
  passing_marks: number;
  weightage: number;
  status: "Active" | "Inactive";
};

const classOptions = [
  "NURSERY",
  "LKG",
  "UKG",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

const examOptions = [
  "1st Pre-Mid",
  "2nd Pre-Mid",
  "Half Yearly",
  "1st Post-Mid",
  "2nd Post-Mid",
  "Annual",
];

const categoryOptions = [
  "Major",
  "Minor",
  "Optional",
  "Additional",
];

const emptyComponent = (): MarksComponent => ({
  name: "",
  fullMarks: 0,
});

export default function MarksPatternMaster() {
  const [examName, setExamName] = useState("1st Pre-Mid");
  const [className, setClassName] = useState("I");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCategory, setSubjectCategory] =
    useState("Major");

  const [components, setComponents] =
    useState<MarksComponent[]>([
      {
        name: "Theory",
        fullMarks: 40,
      },
    ]);

  const [passingMarks, setPassingMarks] = useState(0);
  const [weightage, setWeightage] = useState(100);
  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  const [patternList, setPatternList] =
    useState<MarksPattern[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editId, setEditId] =
    useState<number | null>(null);

  const totalMarks = useMemo(
    () =>
      components.reduce(
        (total, item) =>
          total + Number(item.fullMarks || 0),
        0
      ),
    [components]
  );

  /* ===========================
     LOAD PATTERNS
  =========================== */

  const loadPatterns = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/master/marks-pattern`
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setPatternList(result.patterns || []);
      } else {
        alert(
          result.message ||
            "Unable to load marks patterns."
        );
      }
    } catch (error) {
      console.error(
        "LOAD MARKS PATTERNS ERROR:",
        error
      );

      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatterns();
  }, []);

  /* ===========================
     RESET FORM
  =========================== */

  const resetForm = () => {
    setExamName("1st Pre-Mid");
    setClassName("I");
    setSubjectName("");
    setSubjectCategory("Major");

    setComponents([
      {
        name: "Theory",
        fullMarks: 40,
      },
    ]);

    setPassingMarks(0);
    setWeightage(100);
    setStatus("Active");
    setEditId(null);
  };

  /* ===========================
     COMPONENTS
  =========================== */

  const addComponent = () => {
    setComponents([
      ...components,
      emptyComponent(),
    ]);
  };

  const removeComponent = (index: number) => {
    if (components.length === 1) {
      alert(
        "At least one marks component is required."
      );
      return;
    }

    setComponents(
      components.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const updateComponent = (
    index: number,
    field: "name" | "fullMarks",
    value: string | number
  ) => {
    setComponents(
      components.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      )
    );
  };

  /* ===========================
     VALIDATION
  =========================== */

  const validateForm = () => {
    if (!examName) {
      alert("Select Exam");
      return false;
    }

    if (!className) {
      alert("Select Class");
      return false;
    }

    if (!subjectName.trim()) {
      alert("Enter Subject Name");
      return false;
    }

    if (!components.length) {
      alert(
        "Add at least one marks component."
      );
      return false;
    }

    const invalidComponent =
      components.some(
        (item) =>
          !item.name.trim() ||
          Number(item.fullMarks) < 0
      );

    if (invalidComponent) {
      alert(
        "Please enter valid component names and marks."
      );
      return false;
    }

    if (
      Number(passingMarks) < 0 ||
      Number(passingMarks) > totalMarks
    ) {
      alert(
        "Passing Marks cannot be greater than Total Full Marks."
      );
      return false;
    }

    if (
      Number(weightage) < 0 ||
      Number(weightage) > 100
    ) {
      alert(
        "Weightage must be between 0 and 100."
      );
      return false;
    }

    return true;
  };

  /* ===========================
     SAVE / UPDATE
  =========================== */

  const savePattern = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        examName,
        className,
        subjectName: subjectName.trim(),
        subjectCategory,
        components,
        passingMarks: Number(passingMarks),
        weightage: Number(weightage),
        status,
      };

      const url =
        editId === null
          ? `${API_BASE_URL}/master/marks-pattern`
          : `${API_BASE_URL}/master/marks-pattern/${editId}`;

      const method =
        editId === null ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Unable to save marks pattern."
        );
        return;
      }

      alert(
        editId === null
          ? "Marks Pattern Saved Successfully"
          : "Marks Pattern Updated Successfully"
      );

      resetForm();
      await loadPatterns();
    } catch (error) {
      console.error(
        "SAVE/UPDATE MARKS PATTERN ERROR:",
        error
      );

      alert("Unable to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  /* ===========================
     EDIT
  =========================== */

  const editPattern = (
    item: MarksPattern
  ) => {
    setEditId(item.id);

    setExamName(item.exam_name);
    setClassName(item.class_name);
    setSubjectName(item.subject_name);
    setSubjectCategory(
      item.subject_category || "Major"
    );

    setComponents(
      Array.isArray(item.components)
        ? item.components
        : []
    );

    setPassingMarks(
      Number(item.passing_marks || 0)
    );

    setWeightage(
      Number(item.weightage || 100)
    );

    setStatus(
      item.status || "Active"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ===========================
     DELETE
  =========================== */

  const deletePattern = async (
    id: number
  ) => {
    if (
      !window.confirm(
        "Delete this marks pattern?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/master/marks-pattern/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Unable to delete marks pattern."
        );
        return;
      }

      if (editId === id) {
        resetForm();
      }

      alert(
        "Marks Pattern Deleted Successfully"
      );

      await loadPatterns();
    } catch (error) {
      console.error(
        "DELETE MARKS PATTERN ERROR:",
        error
      );

      alert("Unable to connect to server.");
    }
  };

  /* ===========================
     SEARCH
  =========================== */

  const filteredData = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    if (!query) {
      return patternList;
    }

    return patternList.filter(
      (item) =>
        item.exam_name
          .toLowerCase()
          .includes(query) ||
        item.class_name
          .toLowerCase()
          .includes(query) ||
        item.subject_name
          .toLowerCase()
          .includes(query) ||
        item.subject_category
          .toLowerCase()
          .includes(query)
    );
  }, [patternList, search]);

  return (
    <main className="dashboard-content">
      <div className="marks-pattern-page">

        <div className="page-header">
          <div>
            <h1>Marks Pattern Master</h1>
            <p>
              Configure exam-wise and
              class-wise subject marks pattern.
            </p>
          </div>

          {editId !== null && (
            <span className="edit-mode-badge">
              Editing Configuration
            </span>
          )}
        </div>

        {/* ===========================
            FORM
        =========================== */}

        <div className="master-form">

          <div className="form-row">

            <div className="form-group">
              <label>Exam</label>

              <select
                value={examName}
                onChange={(e) =>
                  setExamName(e.target.value)
                }
              >
                {examOptions.map((exam) => (
                  <option
                    key={exam}
                    value={exam}
                  >
                    {exam}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Class</label>

              <select
                value={className}
                onChange={(e) =>
                  setClassName(e.target.value)
                }
              >
                {classOptions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>

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
              <label>Subject Category</label>

              <select
                value={subjectCategory}
                onChange={(e) =>
                  setSubjectCategory(
                    e.target.value
                  )
                }
              >
                {categoryOptions.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          {/* ===========================
              COMPONENTS
          =========================== */}

          <div className="components-section">

            <div className="components-header">
              <div>
                <h3>Marks Components</h3>
                <p>
                  Add any component required
                  by the school.
                </p>
              </div>

              <button
                type="button"
                className="add-component-btn"
                onClick={addComponent}
                disabled={saving}
              >
                + Add Component
              </button>
            </div>

            <div className="component-header-row">
              <span>Component Name</span>
              <span>Full Marks</span>
              <span>Action</span>
            </div>

            {components.map(
              (component, index) => (
                <div
                  className="component-row"
                  key={index}
                >
                  <input
                    type="text"
                    value={component.name}
                    placeholder="e.g. Theory, PA3, AE"
                    onChange={(e) =>
                      updateComponent(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    disabled={saving}
                  />

                  <input
                    type="number"
                    min="0"
                    value={component.fullMarks}
                    onChange={(e) =>
                      updateComponent(
                        index,
                        "fullMarks",
                        Number(e.target.value)
                      )
                    }
                    disabled={saving}
                  />

                  <button
                    type="button"
                    className="remove-component-btn"
                    onClick={() =>
                      removeComponent(index)
                    }
                    disabled={saving}
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            <div className="marks-summary">

              <div className="total-box">
                <span>
                  Total Full Marks
                </span>

                <strong>
                  {totalMarks}
                </strong>
              </div>

              <div className="form-group">
                <label>Passing Marks</label>

                <input
                  type="number"
                  min="0"
                  max={totalMarks}
                  value={passingMarks}
                  onChange={(e) =>
                    setPassingMarks(
                      Number(e.target.value)
                    )
                  }
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>Weightage (%)</label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weightage}
                  onChange={(e) =>
                    setWeightage(
                      Number(e.target.value)
                    )
                  }
                  disabled={saving}
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
                  disabled={saving}
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
          </div>

          {/* ===========================
              BUTTONS
          =========================== */}

          <div className="btn-group">

            <button
              type="button"
              className="save-btn"
              onClick={savePattern}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editId === null
                ? "Save Configuration"
                : "Update Configuration"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
              disabled={saving}
            >
              {editId === null
                ? "Reset"
                : "Cancel Edit"}
            </button>

          </div>

        </div>

        {/* ===========================
            SEARCH
        =========================== */}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Exam / Class / Subject..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* ===========================
            TABLE
        =========================== */}

        <div className="table-wrapper">

          <table className="master-table">

            <thead>
              <tr>
                <th>Exam</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Components</th>
                <th>Total</th>
                <th>Pass</th>
                <th>Weight</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="table-message"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredData.map(
                  (item) => (
                    <tr key={item.id}>

                      <td>
                        {item.exam_name}
                      </td>

                      <td>
                        {item.class_name}
                      </td>

                      <td>
                        {item.subject_name}
                      </td>

                      <td>
                        {item.subject_category}
                      </td>

                      <td>
                        <div className="component-list">
                          {item.components?.map(
                            (
                              component,
                              index
                            ) => (
                              <span
                                key={index}
                              >
                                {component.name}
                                {" ("}
                                {component.fullMarks}
                                {")"}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      <td>
                        <strong>
                          {item.total_marks}
                        </strong>
                      </td>

                      <td>
                        {item.passing_marks}
                      </td>

                      <td>
                        {item.weightage}%
                      </td>

                      <td>
                        {item.status}
                      </td>

                      <td>
                        <div className="action-btns">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              editPattern(item)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              deletePattern(
                                item.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )
              )}

              {!loading &&
                filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="table-message"
                    >
                      No Record Found
                    </td>
                  </tr>
                )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}