import { useState } from "react";
import { useNavigate } from "react-router-dom";  // <-- for navigation
import "./App.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();  // <-- hook for redirect

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setStatus("");
      setMessage(null);

      // ✅ Check user role
      const userRole = data.user.role;

      if (userRole === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setStatus("error");
      setMessage(data.message);
    }
  } catch (err) {
    setStatus("error");
    setMessage("Server error. Please try again later.");
  }
};

  return (
    <div className='body'>
    <div className="outer-container">
      <h2>Welcome Back</h2>
      <div className="inner-container">
        {message && <div className={`message ${status}`}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Login;
