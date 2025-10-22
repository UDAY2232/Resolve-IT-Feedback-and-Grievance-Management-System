import React, { useEffect, useState } from "react";
import "./ManageComplaints.css";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("All");

  const [confirmation, setConfirmation] = useState({ show: false, action: "", status: "" });

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/allcomplaints");
      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/allcomplaints/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, comment }),
        }
      );
      if (!response.ok) throw new Error("Failed to update status");

      fetchComplaints();
      setSelectedComplaint(null);
      setComment("");
      setConfirmation({ show: false, action: "", status: "" });
    } catch (err) {
      console.error(err);
      alert("Error updating status: " + err.message);
    }
  };

  const confirmAction = (action, status) => {
    setConfirmation({ show: true, action, status });
  };

  const submittedComplaints = complaints.filter(c => c.status.toLowerCase() === "submitted");
  const underReviewComplaints = complaints.filter(c => c.status.toLowerCase() === "under review");

  let displayedComplaints = [];
  if (filter === "All") displayedComplaints = [...submittedComplaints, ...underReviewComplaints];
  else if (filter === "Submitted") displayedComplaints = submittedComplaints;
  else if (filter === "Under Review") displayedComplaints = underReviewComplaints;

  if (loading) return <div>Loading complaints...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="manage-complaints-container">
      <h2>Manage Complaints</h2>

      <div className="filter-buttons">
        {["All", "Submitted", "Under Review"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => {
              setFilter(f);
              setSelectedComplaint(null);
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="complaints-sections-row">
        <div className="complaints-section">
          <h3>{filter === "All" ? "All Complaints" : filter}</h3>
          <div className="complaints-list">
            {displayedComplaints.map((c) => (
              <div
                key={c.id}
                className="complaint-card-horizontal clickable"
                onClick={() => setSelectedComplaint(c)}
              >
                <div className="complaint-left">
                  <div className="complaint-line">
                    <span className="card-labelll">Complaint ID:</span>
                    <span className="card-valueee">#{c.id}</span>
                  </div>
                  <div className="complaint-line">
                    <span className="card-labelll">Issue:</span>
                    <span className="card-valueee">{c.subject}</span>
                  </div>
                  <div className="complaint-line">
                    <span className="card-labelll">Date:</span>
                    <span className="card-valueee">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div
                  className={`complaint-status ${
                    c.status.toLowerCase() === "submitted"
                      ? "submitted"
                      : "under-review"
                  }`}
                >
                  {c.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedComplaint && (
          <div className="complaints-section">
            <h3>Complaint #{selectedComplaint.id}</h3>
            <p>
              <strong>Subject:</strong> {selectedComplaint.subject}
            </p>
            <p>
              <strong>Description:</strong> {selectedComplaint.description}
            </p>

            {selectedComplaint.media && selectedComplaint.media.length > 0 && (
              <div className="support-documents">
                <strong>Support Documents:</strong>
                <ul>
                  {selectedComplaint.media.map((m) => (
                    <li key={m.media_id}>
                      {m.file_name}{" "}
                      <button
                        className="btn blue"
                        onClick={() =>
                          window.open(
                            `http://localhost:5000/api/allcomplaints/media/${m.media_id}`,
                            "_blank"
                          )
                        }
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="review-actions">
              {selectedComplaint.status.toLowerCase() === "submitted" && (
                <button
                  className="btn orange"
                  onClick={() => confirmAction("Under Review", "Under Review")}
                >
                  Mark as Under Review
                </button>
              )}

{selectedComplaint.status.toLowerCase() === "under review" && (
  <>
    <textarea
      placeholder="Enter comment here..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
    <button
      className="btn green"
      onClick={() => {
        if (!comment.trim()) {
          alert("Please enter a comment before marking as Resolved.");
          return;
        }
        handleUpdateStatus(selectedComplaint.id, "Resolved");
      }}
    >
      Mark as Resolved
    </button>
    <button
      className="btn red"
      onClick={() => {
        if (!comment.trim()) {
          alert("Please enter a comment before marking as Rejected.");
          return;
        }
        handleUpdateStatus(selectedComplaint.id, "Rejected");
      }}
    >
      Mark as Rejected
    </button>
  </>
)}


              <button
                className="btn gray"
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Confirmation Popup */}
      {confirmation.show && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to mark this complaint as <strong>{confirmation.status}</strong>?
            </p>
            <div className="review-actions">
              <button
                className="btn green"
                onClick={() => handleUpdateStatus(selectedComplaint.id, confirmation.status)}
              >
                Yes
              </button>
              <button
                className="btn gray"
                onClick={() => setConfirmation({ show: false, action: "", status: "" })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;
