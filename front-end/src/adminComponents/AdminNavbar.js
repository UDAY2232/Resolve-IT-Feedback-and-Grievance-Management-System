import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './AdminNavbar.css'

const AdminNavbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear auth data
    // localStorage.removeItem("token");

    navigate("/"); // redirect to login page
  };

  return (
    <div className='navbar'>
        <div className='container'>
          <Link to="/admindashboard" className='linksto'>
            <div className='logo'>Online Complaint and Grievance Admin Portal</div>
          </Link>
            <div className='links'>
              <Link to="/admindashboard/managecomplaints" className='linksto'>
                <span>Manage Complaints</span>
              </Link>
              <Link to="/admindashboard/allcomplaints" className='linksto'>
                <span>All complaints</span>
              </Link>
                <button onClick={handleLogout}>Logout</button>
            </div>

        </div>
        
    </div>

  )
}

export default AdminNavbar