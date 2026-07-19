import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";
import "./StudentUpload.css";

export default function StudentUpload() {

  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  const fileChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.length) return;

    setFile(e.target.files[0]);

  };

  const uploadExcel = async () => {

    if (!file) {

      alert("Please select an Excel file.");

      return;

    }

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(

        "http://localhost:5000/api/students/upload",

        {

          method: "POST",

          body: formData

        }

      );

      const result = await response.json();

      if (result.success) {

        alert(result.message);

        navigate("/admin/students/list");

      } else {

        alert(result.message);

      }

    } catch {

      alert("Unable to connect to server.");

    } finally {

      setUploading(false);

    }

  };

  return (

    <>

      <Sidebar />

      <Header />

      <main className="dashboard-content">

        <div className="upload-page">

          <div className="page-header">

            <h1>Student Excel Upload</h1>

          </div>

          <div className="upload-card">

            <h2>Upload Student Database</h2>

            <p>

              Upload Student Excel (.xlsx)

            </p>

            <input

              ref={fileInputRef}

              type="file"

              accept=".xlsx,.xls"

              hidden

              onChange={fileChanged}

            />

            <button

              className="choose-btn"

              onClick={chooseFile}

            >

              Choose Excel File

            </button>

            {

              file && (

                <div className="file-box">

                  <strong>

                    Selected File

                  </strong>

                  <p>

                    {file.name}

                  </p>

                </div>

              )

            }

            <button

              className="upload-btn"

              disabled={uploading}

              onClick={uploadExcel}

            >

              {

                uploading

                  ? "Uploading..."

                  : "Upload Student Database"

              }

            </button>

          </div>

        </div>

      </main>

    </>

  );

}