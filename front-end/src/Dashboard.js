import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Status1 from "./components/Status1";
import SubmitComplaint from "./components/SubmitComplaint";
import Featured from "./components/Featured";
import UserTabs from "./components/UserTabs";

const DashHome = () => (
  <div>
    <Featured />
    <UserTabs />
  </div>
);

const Dashboard = () => {


  return (
    
      <div>
      <Navbar />

      <div className="dashboard-content">

        <Routes>
          <Route index element={<DashHome />} />
          <Route path="complaint" element={<SubmitComplaint />} />
          <Route path="status1" element={<Status1 />} />
        </Routes>
      </div>
</div>
  );
};

export default Dashboard;
