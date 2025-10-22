import React from 'react'
import { Link } from "react-router-dom";
import './Featured.css';

const Featured = () => {
  return (
    <div className="featured">
        <div className='container'>
            <div className='left'>
                <h1>Welcome, UserName</h1>
                <p>
                     Our portal allows you to easily submit and track your complaints online. 
                     We make sure your issues reach the right authorities quickly and efficiently.
                </p> 
                <Link to="/dashboard/complaint" className='linksto'>
                <button className="submit-button">
                    Submit Complaint 
                </button>
                </Link>
            </div>
            <div className='right'>
                <img src='/images/cb.jpg' alt='' />
            </div>
        </div>
    </div>
  )
}

export default Featured