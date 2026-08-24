import { useEffect, useState } from "react";
import { ArrowLeft, User, GraduationCap, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "@/config/api";

import "./ParentProfile.css";

type ParentData = {
  parent_name?: string;
  mobile?: string;
  email?: string;
  admission_no?: string;
};

type StudentData = {
  student_name?: string;
  admission_no?: string;
  father_name?: string;
  mother_name?: string;
  father_mobile?: string | null;
  mother_mobile?: string | null;
  class?: string;
  section?: string;
  roll_no?: number | null;
  house?: string | null;
  address?: string | null;
};

export default function ParentProfile() {
  const navigate = useNavigate();

  const [parent, setParent] =
    useState<ParentData | null>(null);

  const [student, setStudent] =
    useState<StudentData | null>(null);

  const [fatherMobile, setFatherMobile] =
    useState("");

  const [motherMobile, setMotherMobile] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [editingFatherMobile, setEditingFatherMobile] =
    useState(false);

  const [editingMotherMobile, setEditingMotherMobile] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {
    const parentData =
      localStorage.getItem("parent");

    if (!parentData) {
      navigate("/parent/login");
      return;
    }

    try {
      const parsedParent =
        JSON.parse(parentData);

      setParent(parsedParent);

      const admissionNo =
        parsedParent.admission_no;

      if (!admissionNo) {
        setError(
          "Admission number not found."
        );
        setLoading(false);
        return;
      }

      const loadProfile = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/parents/dashboard/${admissionNo}`
          );

          const result =
            await response.json();

          if (!response.ok || !result.success) {
            setError(
              result.message ||
                "Unable to load profile."
            );
            return;
          }

          setStudent(result.student);

          setFatherMobile(
            result.student?.father_mobile || ""
          );

          setMotherMobile(
            result.student?.mother_mobile || ""
          );

          setAddress(
            result.student?.address || ""
          );

        } catch (err) {
          console.error(
            "Profile Load Error:",
            err
          );

          setError(
            "Unable to load profile."
          );
        } finally {
          setLoading(false);
        }
      };

      void loadProfile();

    } catch (err) {
      console.error(err);

      setError(
        "Invalid parent information."
      );

      setLoading(false);
    }
  }, [navigate]);

  /* =====================================================
     UPDATE PROFILE
  ===================================================== */

  const saveProfile = async () => {
    if (!student?.admission_no) {
      setError(
        "Admission number not found."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/parents/profile/${student.admission_no}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            father_mobile:
              fatherMobile.trim(),
            mother_mobile:
              motherMobile.trim(),
            address:
              address.trim(),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Unable to update profile."
        );
        return;
      }

      setStudent(result.student);

      setFatherMobile(
        result.student?.father_mobile || ""
      );

      setMotherMobile(
        result.student?.mother_mobile || ""
      );

      setAddress(
        result.student?.address || ""
      );

      setEditingFatherMobile(false);
      setEditingMotherMobile(false);
      setEditingAddress(false);

      setMessage(
        "Profile updated successfully."
      );

    } catch (err) {
      console.error(
        "Profile Update Error:",
        err
      );

      setError(
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="parent-profile-page">
        <div className="parent-profile-state">
          Loading profile...
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="parent-profile-page">

      {/* HEADER */}

      <div className="parent-profile-header">

        <button
          type="button"
          className="parent-profile-back"
          onClick={() =>
            navigate("/parent/dashboard")
          }
        >
          <ArrowLeft size={19} />
          Back
        </button>

        <div className="parent-profile-heading">
          <div className="parent-profile-heading-icon">
            <User size={24} />
          </div>

          <div>
            <h1>My Profile</h1>

            <p>
              Parent and student information
            </p>
          </div>
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="parent-profile-error">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {message && (
        <div className="parent-profile-success">
          {message}
        </div>
      )}

      {/* =================================================
          PARENT INFORMATION
      ================================================= */}

      <section className="parent-profile-card">

        <div className="parent-profile-section-title">
          <User size={20} />
          <h2>Parent Information</h2>
        </div>

        <div className="parent-profile-grid">

          {/* Father's Name */}

          <div className="parent-profile-field">
            <label>Father's Name</label>

            <div className="parent-profile-value">
              {student?.father_name || "-"}
            </div>
          </div>

          {/* Mother's Name */}

          <div className="parent-profile-field">
            <label>Mother's Name</label>

            <div className="parent-profile-value">
              {student?.mother_name || "-"}
            </div>
          </div>

          {/* Father's Number */}

          <div className="parent-profile-field">
            <label>Father's Number</label>

            {editingFatherMobile ? (
              <input
                type="tel"
                value={fatherMobile}
                onChange={(e) =>
                  setFatherMobile(
                    e.target.value
                  )
                }
                placeholder="Enter father's number"
              />
            ) : (
              <div className="parent-profile-value-row">

                <div className="parent-profile-value">
                  {fatherMobile ||
                    "Not Available"}
                </div>

                <button
                  type="button"
                  className="parent-profile-edit-btn"
                  onClick={() =>
                    setEditingFatherMobile(true)
                  }
                >
                  {fatherMobile
                    ? "Update"
                    : "Add"}
                </button>

              </div>
            )}
          </div>

          {/* Mother's Number */}

          <div className="parent-profile-field">
            <label>Mother's Number</label>

            {editingMotherMobile ? (
              <input
                type="tel"
                value={motherMobile}
                onChange={(e) =>
                  setMotherMobile(
                    e.target.value
                  )
                }
                placeholder="Enter mother's number"
              />
            ) : (
              <div className="parent-profile-value-row">

                <div className="parent-profile-value">
                  {motherMobile ||
                    "Not Available"}
                </div>

                <button
                  type="button"
                  className="parent-profile-edit-btn"
                  onClick={() =>
                    setEditingMotherMobile(true)
                  }
                >
                  {motherMobile
                    ? "Update"
                    : "Add"}
                </button>

              </div>
            )}
          </div>

          {/* Email */}

          <div className="parent-profile-field">
            <label>Email</label>

            <div className="parent-profile-value">
              {parent?.email || "-"}
            </div>
          </div>

        </div>

      </section>

      {/* =================================================
          STUDENT INFORMATION
      ================================================= */}

      <section className="parent-profile-card">

        <div className="parent-profile-section-title">
          <GraduationCap size={20} />
          <h2>Student Information</h2>
        </div>

        <div className="parent-profile-grid">

          <div className="parent-profile-field">
            <label>Student Name</label>

            <div className="parent-profile-value">
              {student?.student_name || "-"}
            </div>
          </div>

          <div className="parent-profile-field">
            <label>Admission No.</label>

            <div className="parent-profile-value">
              {student?.admission_no || "-"}
            </div>
          </div>

          <div className="parent-profile-field">
            <label>Class</label>

            <div className="parent-profile-value">
              {student?.class || "-"}
            </div>
          </div>

          <div className="parent-profile-field">
            <label>Section</label>

            <div className="parent-profile-value">
              {student?.section || "-"}
            </div>
          </div>

          <div className="parent-profile-field">
            <label>Roll No.</label>

            <div className="parent-profile-value">
              {student?.roll_no ?? "-"}
            </div>
          </div>

          <div className="parent-profile-field">
            <label>House</label>

            <div className="parent-profile-value">
              {student?.house || "-"}
            </div>
          </div>

          {/* Address */}

          <div className="parent-profile-field parent-profile-address-field">
            <label>Address</label>

            {editingAddress ? (
              <textarea
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                placeholder="Enter address"
                rows={3}
              />
            ) : (
              <div className="parent-profile-value-row">

                <div className="parent-profile-value">
                  {address ||
                    "Not Available"}
                </div>

                <button
                  type="button"
                  className="parent-profile-edit-btn"
                  onClick={() =>
                    setEditingAddress(true)
                  }
                >
                  {address
                    ? "Update"
                    : "Add"}
                </button>

              </div>
            )}
          </div>

          <div className="parent-profile-field">
            <label>Session</label>

            <div className="parent-profile-value">
              2026-27
            </div>
          </div>

        </div>

      </section>

      {/* SAVE BUTTON */}

      {(editingFatherMobile ||
        editingMotherMobile ||
        editingAddress) && (
        <div className="parent-profile-save-area">

          <button
            type="button"
            className="parent-profile-save-btn"
            onClick={() =>
              void saveProfile()
            }
            disabled={saving}
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      )}

    </div>
  );
}