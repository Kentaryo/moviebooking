import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app">
    
      <header className="header">
        <h1>🎬 Movie Booking App</h1>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </div>
      </header>

    
      <section className="hero">
        <div className="hero-overlay">
          <h2>Welcome to Movie Booking App!</h2>
          <p>Book your favorite movies easily, anytime, anywhere.</p>
        </div>
      </section>

     
      <section className="features">
        <h2 className="features-title">Why Choose Us?</h2>
        <div className="features-list">
          <div className="feature-card">
            <h3>🎟 Easy Booking</h3>
            <p>Book your movie tickets in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <h3>🎥 Wide Selection</h3>
            <p>Choose from a variety of movies currently showing in theaters.</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payments</h3>
            <p>Pay safely online with multiple payment options.</p>
          </div>
        </div>
      </section>

      
      <footer className="footer">
        <p>© {new Date().getFullYear()} Movie Booking App. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
