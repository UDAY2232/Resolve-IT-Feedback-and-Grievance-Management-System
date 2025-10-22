import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(""); 
  const [showPopup, setShowPopup] = useState(false); // for popup
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("User registered successfully!");
        setShowPopup(true); // show popup instead of immediate navigation
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch (err) {
      setStatus("error");
      setMessage("Server error. Please try again later.");
    }
  };

  const handleOkClick = () => {
    setShowPopup(false);
    navigate("/login"); // redirect after closing popup
  };

  return (
    <div className='body'>
      <div className="outer-container">
        <h2>Create Your Account</h2>

        <div className="inner-container">
          {message && status === "error" && (
            <div className={`message ${status}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" placeholder="Enter Your Name" onChange={handleChange} required />
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter Your Email" onChange={handleChange} required />
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter Your Password" onChange={handleChange} required />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{message}</p>
            <button onClick={handleOkClick}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
