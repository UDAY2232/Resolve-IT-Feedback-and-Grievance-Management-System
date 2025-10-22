import React from "react";
import "./AdminFeatured.css";

const overviewStats = [
  { title: "Total Complaints", value: 124 },
  { title: "Open Complaints", value: 20 },
  { title: "Under Review", value: 32 },
  { title: "Resolved Complaints", value: 78 },
  { title: "Rejected Complaints", value: 14 },
  { title: "Average Resolution Time", value: "3 days" },
];

const AdminFeatured = () => {
  return (
    <div className="admin-dashboard">
      <div className="top-section">
        <h2 className="dashboard-welcome">Welcome, Admin!</h2>
      </div>

      <h3 className="overview-heading">Overview</h3>

      <div className="overview-cards">
        {overviewStats.map((item, idx) => (
          <div key={idx} className="overview-card">
            <p className="card-title">{item.title}</p>
            <h2 className="card-value">{item.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFeatured;
