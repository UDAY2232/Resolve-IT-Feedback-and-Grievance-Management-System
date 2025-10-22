import React, { useState } from "react";
import "./SubmitComplaint.css";

const SubmitComplaint = () => {
  const [submissionType, setSubmissionType] = useState("Public");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [file, setFile] = useState(null);

  // 🔹 For popup
  const [message, setMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", 1); // 🔹 Replace with logged-in user ID
    formData.append("is_anonymous", submissionType === "Anonymous" ? 1 : 0);
    formData.append("category", "General"); // can be extended later
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("urgency", urgency);

    if (file) {
      formData.append("files", file);
    }

    try {
      const res = await fetch("http://localhost:5000/complaints", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Your complaint has been submitted successfully! Complaint ID: ${data.complaintId}`);
        setShowPopup(true);
        // Reset form fields
        setSubject("");
        setDescription("");
        setFile(null);
        setSubmissionType("Public");
        setUrgency("Medium");
      } else {
        setMessage(data.message || "Complaint submission failed!");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setMessage("Server error. Please try again later.");
      setShowPopup(true);
    }
  };

  const handleOkClick = () => {
    setShowPopup(false);
  };

  return (
    <div className="submit-complaint-container">
      <div className="top-row">
        <button type="button" className="back-icon" aria-label="back">←</button>
        <h2 className="title">Submit Complaint</h2>
      </div>

      {/* Submission Type section */}
      <div className="section submission-section">
        <label className="section-label">Submission Type</label>
        <div className="submission-type">
          <button
            type="button"
            className={submissionType === "Public" ? "pill active" : "pill"}
            onClick={() => setSubmissionType("Public")}
          >
            Public
          </button>
          <button
            type="button"
            className={submissionType === "Anonymous" ? "pill active" : "pill"}
            onClick={() => setSubmissionType("Anonymous")}
          >
            Anonymous
          </button>
        </div>
      </div>

      {/* Complaint details */}
      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="section">
          <label className="section-label">Complaint Details</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            required
            className="input-field"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="textarea-field"
          />
        </div>

        {/* Urgency Dropdown */}
        <div className="section">
          <label className="section-label">Urgency</label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="input-field"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Attachments */}
        <div className="section">
          <label className="section-label">Attachments (Optional)</label>
          <div className="upload-box">
            <div className="upload-content">
              <p className="upload-title">Add Media</p>
              <p className="upload-sub">Attach images or videos to support your complaint.</p>

              <label className="upload-btn">
                Upload
                <input type="file" onChange={handleFileChange} hidden />
              </label>

              {file && <p className="file-name">{file.name}</p>}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit Complaint</button>
      </form>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{message}</p>
            <button onClick={handleOkClick}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitComplaint;
