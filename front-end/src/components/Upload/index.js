import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import API from "../../api.js";

import { RxCornerTopLeft } from "react-icons/rx";
import { RxCornerTopRight } from "react-icons/rx";
import { RxCornerBottomLeft } from "react-icons/rx";
import { RxCornerBottomRight } from "react-icons/rx";

import "./index.css";

const Upload = () => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const uploadFile = async (file) => {
    console.log("Uploading file:", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await API.post("/upload/excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload success:", response.data);
      navigate(`/create-chart/${response.data.file._id}`);
    } catch (error) {
      alert(error);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    if (event.relatedTarget === null) setDragOver(false);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) uploadFile(file);
  };

  useEffect(() => {
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragleave", handleDragLeave);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  return (
    <div className="upload-page">
      <div className={`drag-area ${dragOver ? "drag-over" : ""}`}>
        <div>
          <RxCornerTopLeft className="corner-icon" />
          <RxCornerTopRight className="corner-icon" />
        </div>
        <h1>Drop Your File Anywhere</h1>
        <div>
          <RxCornerBottomLeft className="corner-icon" />
          <RxCornerBottomRight className="corner-icon" />
        </div>
      </div>

      <Header />
      <div className="upload-container">
        <div className="upload-element">
          <button type="button" onClick={() => fileInputRef.current.click()}>
            Upload
          </button>
          <h1>Or drop a file</h1>
          <p>Drag or select an Excel file (.xls/.xlsx) under 5MB</p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;
