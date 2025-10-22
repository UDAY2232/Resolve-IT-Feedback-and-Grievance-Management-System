import React, { useState } from "react";
import "./Status1.css";

const Status = () => {
  const [complaintId, setComplaintId] = useState("");
  const [complaintData, setComplaintData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckStatus = async () => {
    if (!complaintId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/status/${complaintId}`);
      if (!response.ok) {
        throw new Error("Complaint not found");
      }
      const data = await response.json();
      setComplaintData(data);
    } catch (err) {
      setError(err.message);
      setComplaintData(null);
    } finally {
      setLoading(false);
    }
  };


  //need API fetch here
  const currentStatus = complaintData?.status?.toLowerCase() || "";
  const steps = ["submitted", "under review", "resolved"];

  const activeIndex =
    currentStatus.toLowerCase() === "rejected"
      ? steps.length - 1
      : steps.indexOf(currentStatus.toLowerCase());

  const isRejected = currentStatus.toLowerCase() === "rejected";




  return (
    <div className="status-container">
      <h2 className="title">Complaint Status</h2>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Complaint ID"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
        />
        <button onClick={handleCheckStatus}>Check Status</button>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {complaintData && (
        <div className="status-card">
          <h3 className="complaint-id">Complaint ID: #{complaintData.complaint_code}</h3>

          

    {/* Progress Bar */}
    <div className="stepper-container">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isCompletedBefore = index < activeIndex;
        const isLineBeforeRejected =
          isRejected && index === steps.length - 2; // line before last step

        // Change last label to "rejected" if status is rejected
        const displayLabel =
          isRejected && index === steps.length - 1 ? "rejected" : step;

        return (
          <div
            key={index}
            className={`stepper-step ${
              isCompletedBefore ? "completed-before" : ""
            } ${isLineBeforeRejected ? "line-before-rejected" : ""}`}
          >
            <div
              className={`circle ${
                isActive || isCompletedBefore ? "active" : ""
              } ${isCompletedBefore ? "completed" : ""} ${
                isRejected && isActive ? "rejected" : ""
              }`}
            >
              {!isActive && !isCompletedBefore ? index + 1 : ""}
            </div>
            <div className="label">{displayLabel}</div>
          </div>
        );
      })}
    </div>

          {/* Timeline */}
          <div className="timeline">
            <h4>Updates</h4>
            <ul>
              {complaintData.timeline?.map((log, index) => (
                <li key={index}>
                  <div className="timeline-status">
                    <span
                      className={`dot ${
                        log.status === "Resolved"
                          ? "resolved"
                          : log.status === "Rejected"
                          ? "rejected"
                          : "pending"
                      }`}
                    ></span>
                    <div>
                      <p className="status-text">{log.status}</p>
                      <p className="timestamp">
                        {new Date(log.updated_at).toLocaleString()}
                      </p>
                      {log.comment && <p className="comment">💬 {log.comment}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
