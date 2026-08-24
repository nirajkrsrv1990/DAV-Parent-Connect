import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import "./TeacherParentMessages.css";

type ParentMessage = {
  id: number;
  student_id: number;
  parent_id: number | null;
  class_name: string;
  section: string;
  teacher_id: string | null;
  message_type: string;
  subject: string;
  message: string;
  status: string;
  teacher_read: boolean;
  created_at: string;

  admission_no: string;
  student_name: string;

  parent_name: string | null;
  mobile: string | null;
  email: string | null;
};

export default function TeacherParentMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const teacherData = localStorage.getItem("teacher");

      if (!teacherData) {
        navigate("/");
        return;
      }

      const teacher = JSON.parse(teacherData);

      if (!teacher?.teacher_id) {
        setError("Teacher information not found.");
        return;
      }

      const response = await apiClient.get(
        `/teachers/parent-messages/${teacher.teacher_id}`
      );

      if (response.data?.success) {
        setMessages(response.data.messages || []);
      } else {
        setError(
          response.data?.message ||
            "Unable to load parent messages."
        );
      }
    } catch (err) {
      console.error(
        "Load Teacher Parent Messages Error:",
        err
      );

      setError("Unable to load parent messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
  }, []);

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="teacher-parent-messages">

      <div className="teacher-parent-messages-header">

        <button
          type="button"
          className="teacher-parent-back"
          onClick={() => navigate("/teacher")}
        >
          <ArrowLeft size={19} />
          Back
        </button>

        <div className="teacher-parent-title">
          <div className="teacher-parent-title-icon">
            <MessageSquare size={24} />
          </div>

          <div>
            <h1>Parent Messages</h1>
            <p>
              Suggestions, complaints and academic
              concerns from parents.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="teacher-parent-refresh"
          onClick={() => void loadMessages()}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw
            size={18}
            className={loading ? "refresh-spinning" : ""}
          />
          Refresh
        </button>

      </div>

      {loading && (
        <div className="teacher-parent-state">
          Loading parent messages...
        </div>
      )}

      {!loading && error && (
        <div className="teacher-parent-error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        messages.length === 0 && (
          <div className="teacher-parent-empty">
            <MessageSquare size={42} />

            <h2>No Parent Messages</h2>

            <p>
              There are currently no messages from
              parents of your assigned class.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        messages.length > 0 && (
          <div className="teacher-message-list">

            {messages.map((item) => (
              <div
                className="teacher-message-card"
                key={item.id}
              >

                <div className="teacher-message-card-header">

                  <div>
                    <span
                      className={`teacher-message-type ${item.message_type
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {item.message_type}
                    </span>

                    <h2>{item.subject}</h2>
                  </div>

                  <span className="teacher-message-status">
                    {item.status}
                  </span>

                </div>

                <div className="teacher-message-student">

                  <div>
                    <strong>Student</strong>
                    <span>
                      {item.student_name}
                    </span>
                  </div>

                  <div>
                    <strong>Admission No.</strong>
                    <span>
                      {item.admission_no}
                    </span>
                  </div>

                  <div>
                    <strong>Class</strong>
                    <span>
                      {item.class_name} -{" "}
                      {item.section}
                    </span>
                  </div>

                </div>

                <div className="teacher-message-parent">

                  <strong>Parent</strong>

                  <span>
                    {item.parent_name ||
                      "Parent"}
                  </span>

                  {item.mobile && (
                    <span>
                      • {item.mobile}
                    </span>
                  )}

                </div>

                <div className="teacher-message-content">
                  {item.message}
                </div>

                <div className="teacher-message-footer">
                  <span>
                    {formatDate(item.created_at)}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

    </div>
  );
}