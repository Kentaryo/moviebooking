import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }

    console.log("Submitting login form with:", { email, password });

    
    if (email === "admin@example.com" && password === "admin123") {
      alert("Admin login successful!");
      navigate("/admin-dashboard");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost/movie/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (result.success) {
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(result.message || "Invalid email or password");
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    }
  };

  const handleFocus = (field) => {
    console.log(`${field} field focused`);
  };

  return (
    <div className="register-page">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => handleFocus("Email")}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => handleFocus("Password")}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="link">
              Register
            </Link>
          </p>
          <Link to="/" className="link back-home">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
