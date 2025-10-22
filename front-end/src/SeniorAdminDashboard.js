import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminFeatured from "./adminComponents/AdminFeatured";
import AdminNavbar from "./adminComponents/AdminNavbar";
import AdminTabs from "./adminComponents/AdminTabs";
import AllComplaints from "./adminComponents/AllComplaints";
import ManageComplaints from "./adminComponents/ManageComplaints";
import EscalateComplaint from "./adminComponents/EscalateComplaint";
const SeniorAdminDashHome = () => (
  <div>
    <AdminFeatured />
    <AdminTabs />
  </div>
);

const SeniorAdminDashboard = () => {


  return (
    
      <div>
        <AdminNavbar />

      <div className="dashboard-content">

        <Routes>
          <Route index element={<SeniorAdminDashHome />} />
          <Route path="allcomplaints" element={<AllComplaints />} />
          <Route path="managecomplaints" element={<ManageComplaints />} />
          <Route path="escalatecomplaint" element={<EscalateComplaint />} />

        </Routes>
      </div>
</div>
  );
};

export default SeniorAdminDashboard;
