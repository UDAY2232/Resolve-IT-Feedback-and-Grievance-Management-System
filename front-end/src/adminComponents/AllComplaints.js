import React, { useEffect, useState } from "react";
import "./AllComplaints.css";

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/allcomplaints");
        if (!response.ok) throw new Error("Failed to fetch complaints");
        const data = await response.json();
        setComplaints(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch complaints");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(
    (c) => activeFilter.toLowerCase() === "all" || c.status.toLowerCase() === activeFilter.toLowerCase()
  );

  if (loading) return <div>Loading complaints...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="all-complaints-container">
      <h2>All Complaints</h2>

      {/* Filter buttons */}
      <div className="filter-buttons">
        {["All", "Submitted", "Under Review", "Resolved", "Rejected"].map(
          (status) => (
            <button
              key={status}
              className={activeFilter === status ? "active" : ""}
              onClick={() => setActiveFilter(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Complaints List */}
      <div className="complaints-list">
        {filteredComplaints.map((c) => (
          <div key={c.id} className="complaint-card-horizontal">
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
                <span className="card-valueee">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div
              className={`complaint-status ${c.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {c.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllComplaints;
