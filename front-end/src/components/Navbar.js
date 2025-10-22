import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css'

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear auth data
    // localStorage.removeItem("token");

    navigate("/"); // redirect to login page
  };

  return (
    <div className='navbar'>
        <div className='container'>
          <Link to="/dashboard" className='linksto'>
            <div className='logo'>Online Complaint and Grievance Portal</div>
          </Link>
            <div className='links'>
              <Link to="/dashboard/complaint" className='linksto'>
                <span>Complaint</span>
              </Link>
              <Link to="/dashboard/status1" className='linksto'>
                <span>Status</span>
              </Link>
                <button onClick={handleLogout}>Logout</button>
            </div>

        </div>
        
    </div>

  )
}

export default Navbar