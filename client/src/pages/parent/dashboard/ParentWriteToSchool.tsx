import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import apiClient from "../../../services/apiClient";
import "./ParentWriteToSchool.css";

export default function ParentWriteToSchool() {
  const navigate = useNavigate();

  const [messageType, setMessageType] = useState("Suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      alert("Please enter subject and message.");
      return;
    }

    try {
      setSubmitting(true);

      const parentData = localStorage.getItem("parent");

      if (!parentData) {
        alert("Parent session not found. Please login again.");
        navigate("/parent/login");
        return;
      }

      const parent = JSON.parse(parentData);

      const admissionNo =
        parent.admission_no ||
        parent.admissionNo;

      if (!admissionNo) {
        alert("Student admission number not found.");
        return;
      }

      const response = await apiClient.post(
        "/parent/messages",
        {
          admission_no: admissionNo,
          message_type: messageType,
          subject: subject.trim(),
          message: message.trim(),
        }
      );

      if (response.data?.success) {
        alert("Your message has been submitted successfully.");

        setSubject("");
        setMessage("");
        setMessageType("Suggestion");

        navigate("/parent/dashboard");
      } else {
        alert(
          response.data?.message ||
            "Unable to submit your message."
        );
      }
    } catch (error: any) {
      console.error(
        "Parent Message Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to submit your message."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="parent-write-school">

      <div className="write-school-header">
        <button
          type="button"
          className="write-school-back"
          onClick={() => navigate("/parent/dashboard")}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div>
          <h1>Write To School</h1>
          <p>
            Share your suggestion, complaint or
            academic concern with the school.
          </p>
        </div>
      </div>

      <div className="write-school-card">

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="messageType">
              Type
            </label>

            <select
              id="messageType"
              value={messageType}
              onChange={(e) =>
                setMessageType(e.target.value)
              }
              disabled={submitting}
            >
              <option value="Suggestion">
                Suggestion
              </option>

              <option value="Complaint">
                Complaint
              </option>

              <option value="Academic Issue">
                Academic Issue
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">
              Subject
            </label>

            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              placeholder="Enter subject"
              maxLength={200}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Message
            </label>

            <textarea
              id="message"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write your message here..."
              rows={7}
              disabled={submitting}
              required
            />
          </div>

          <button
            type="submit"
            className="write-school-submit"
            disabled={submitting}
          >
            <Send size={18} />

            {submitting
              ? "Submitting..."
              : "Submit Message"}
          </button>

        </form>

      </div>

    </div>
  );
}