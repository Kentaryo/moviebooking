import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css"; 

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/movie/backend/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        alert("✅ Registered successfully! Please log in.");
        navigate("/login");
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      alert("❌ Network error: " + error.message);
    }
  };

  
  const handleDoubleClick = async () => {
    
    if (window.confirm("Do you want to register now?")) {
      try {
        const response = await fetch("http://localhost/movie/backend/register.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (data.success) {
          alert("✅ Registered successfully! Please log in.");
          navigate("/login");
        } else {
          alert("❌ " + data.error);
        }
      } catch (error) {
        alert("❌ Network error: " + error.message);
      }
    }
  };

  return (
    <div className="register-page auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            onDoubleClick={handleDoubleClick}
          >
            Register
          </button>
        </form>

        <div className="auth-links">
          <span>
            Already have an account? <Link className="link" to="/login">Login here</Link>
          </span>
          <Link className="link back-home" to="/"> Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
