import React, { useState, useEffect } from "react";
import "./EscalateComplaint.css";

const EscalateComplaint = () => {
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [notifyAll, setNotifyAll] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const higherAuthorities = [
    { id: 1, name: "Senior Admin" },
    { id: 2, name: "Regional Officer" },
    { id: 3, name: "Chief Complaint Officer" },
  ];

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 2500);
  };

  const fetchPendingComplaints = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/escalate/pending");
      const data = await res.json();
      setPendingComplaints(data);
      if (!selectedComplaint && data.length > 0) setSelectedComplaint(data[0]);
    } catch (err) {
      console.error(err);
      showToast("Failed to load unresolved complaints", "error");
    }
  };

  useEffect(() => {
    fetchPendingComplaints();
  }, []);

  const handleEscalate = async () => {
    if (!selectedAuthority) {
      showToast("Select a higher authority", "error");
      return;
    }
    try {
const selectedAuthObj = higherAuthorities.find(a => a.id == selectedAuthority);

const res = await fetch(
  `http://localhost:5000/api/escalate/${selectedComplaint.id}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      escalated_to: selectedAuthority, // numeric user ID ✅
      reason: `Escalated to ${selectedAuthObj?.name} by Admin${
        notifyAll ? " (All parties notified)" : ""
      }`,
      escalated_by: 38, // Admin ID from your users table ✅
    }),
  }
);

      const data = await res.json();
      if (res.ok) {
        showToast("Escalated successfully", "success");
        fetchPendingComplaints();
      } else {
        showToast(data.message || "Failed to escalate", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    }
  };

  return (
    <div className="escalate-container">
      {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <h2 className="escalate-header">Escalate Complaint</h2>

      <div className="escalate-body">
        {/* Sidebar */}
        <div className="sidebar-upgraded">
          <h3>Unresolved Complaints</h3>
          {pendingComplaints.length === 0 ? (
            <p className="no-data">No unresolved complaints</p>
          ) : (
            <ul>
              {pendingComplaints.map((c) => (
                <li
                  key={c.id}
                  className={selectedComplaint?.id === c.id ? "selected" : ""}
                  onClick={() => setSelectedComplaint(c)}
                >
                  <div className="list-left">
                    <span className="list-title">{c.subject}</span>
                    <span className="list-id">ID: {c.id}</span>
                  </div>
                  <span className={`list-status status-${c.status.replace(/\s/g,'').toLowerCase()}`}>
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main panel */}
        <div className="main-panel">
          {selectedComplaint && (
            <>
              <div className="complaint-details">
                <div className="icon">📄</div>
                <div>
                  <p className="complaint-title">{selectedComplaint.subject}</p>
                  <p className="complaint-id">Complaint ID: {selectedComplaint.id}</p>
                  <p className="complaint-user">User: {selectedComplaint.userEmail}</p>
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Escalation Options</label>
<select
  className="dropdown"
  value={selectedAuthority}
  onChange={(e) => setSelectedAuthority(e.target.value)}
>
  <option value="">Select Higher Authority</option>
  {higherAuthorities.map((auth) => (
    <option key={auth.id} value={auth.id}>
      {auth.name}
    </option>
  ))}
</select>


                <div className="notify-toggle">
                  <label>Notify All Parties</label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifyAll}
                      onChange={() => setNotifyAll(!notifyAll)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <button className="escalate-btn" onClick={handleEscalate}>
                Escalate Complaint
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscalateComplaint;
