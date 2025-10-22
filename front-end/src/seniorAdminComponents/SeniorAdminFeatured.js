import React from "react";
import "./SeniorAdminFeatured.css";

const seniorOverviewStats = [
  { title: "Total Escalated Complaints", value: 48 },
  { title: "Pending Actions", value: 12 },
  { title: "Resolved by Senior Admin", value: 25 },
  { title: "Awaiting Response", value: 8 },
  { title: "Closed after Review", value: 3 },
  { title: "Average Escalation Handling Time", value: "3 days" },
];

const SeniorAdminFeatured = () => {
  return (
    <div className="senior-dashboard">
      <div className="top-section">
        <h2 className="dashboard-welcome">Welcome, Senior Admin!</h2>
        <p className="dashboard-subtext">
          Here's an overview of all escalated complaints under your supervision.
        </p>
      </div>

      <h3 className="overview-heading">Escalation Overview</h3>

      <div className="overview-cards">
        {seniorOverviewStats.map((item, idx) => (
          <div key={idx} className="overview-card">
            <p className="card-title">{item.title}</p>
            <h2 className="card-value">{item.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeniorAdminFeatured;
