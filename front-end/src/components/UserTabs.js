import React from "react";
import { Link } from "react-router-dom";
import "./UserTabs.css";

const features = [
  {
    title: "Submit Complaint",
    description: "Easily submit your complaints with detailed information. Your issue will be tracked until resolved.",
    path: "/dashboard/complaint",
  },
  {
    title: "Check Complaint Status",
    description: "Track the progress of your submitted complaints. See whether they are under review, resolved, or rejected.",
    path: "/dashboard/status1",
  },
  {
    title: "My Complaints",
    description: "View all complaints submitted by you in one place. Monitor their status and history effortlessly.",
    path: "/dashboard/my-complaints", // optional route
  },
];

const UserTabs = () => {
  return (
    <div className="user-tabs-container">
      <h2 className="section-title">Track & Manage Your Complaints</h2>
      <div className="feature-cards">
        {features.map((feature, index) => (
          <Link to={feature.path} key={index} className="feature-card">
            <div className="feature-info">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
            <span className="arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserTabs;
