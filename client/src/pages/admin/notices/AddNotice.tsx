import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

import "./Notice.css";

export default function AddNotice() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [noticeDate, setNoticeDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pdf, setPdf] = useState<File | null>(null);

  const saveNotice = async () => {
    if (!title.trim()) {
      alert("Please enter notice title.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("notice_date", noticeDate);

      if (pdf) {
        formData.append("pdf", pdf);
      }

      const res = await axios.post(`${API_BASE_URL}/notices/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("Notice Uploaded Successfully.");
        navigate("/admin/notices");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to upload notice.");
    }
  };

  return (
    <div className="notice-page">
      <h1>Upload Notice</h1>

      <div className="notice-card">
        <label>Notice Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Notice Title"
        />

        <label>Description</label>
        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write notice..."
        />

        <label>Notice Date</label>
        <input
          type="date"
          value={noticeDate}
          onChange={(e) => setNoticeDate(e.target.value)}
        />

        <label>Upload PDF (Optional)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setPdf(e.target.files ? e.target.files[0] : null)
          }
        />

        <div className="notice-buttons">
          <button className="save-btn" onClick={saveNotice}>
            Save Notice
          </button>

          <button className="cancel-btn" onClick={() => navigate("/admin")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}