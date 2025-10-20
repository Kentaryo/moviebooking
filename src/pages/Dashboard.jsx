import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard({ userId = 1 }) {
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookedCount, setBookedCount] = useState(0);
  const moviesPerPage = 5;
  const navigate = useNavigate();

  const adminGCashNumber = "09171234567";

  // Fetch movies
  const loadMovies = () => {
    fetch("http://localhost/movie/backend/getMovies.php")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Failed to fetch movies:", err))
      .finally(() => setLoadingMovies(false));
  };

  useEffect(() => {
    loadMovies();
    const interval = setInterval(loadMovies, 5000);
    return () => clearInterval(interval);
  }, []);

  // Count booked movies
  useEffect(() => {
    const count = movies.reduce((acc, movie) => acc + (movie.available_seats < movie.total_seats ? 1 : 0), 0);
    setBookedCount(count);
  }, [movies]);

  const handleBookClick = (movie) => {
    setSelectedMovie(movie);
    setShowPaymentModal(true);
    setPaymentDetails({});
    console.log("Booking clicked for:", movie.title);
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === "Credit Card") {
      if (!paymentDetails.cardNumber || !paymentDetails.cardName) {
        alert("Please enter credit card details");
        return;
      }
    } else if (paymentMethod === "GCash") {
      if (!paymentDetails.gcashRefNumber) {
        alert("Please enter your GCash reference number");
        return;
      }
    } else if (paymentMethod === "PayPal") {
      if (!paymentDetails.paypalEmail) {
        alert("Please enter your PayPal email");
        return;
      }
    }

    fetch("http://localhost/movie/backend/bookMovie.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movie_id: selectedMovie.id,
        user_id: userId,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(`Booking successful via ${paymentMethod}`);
          setShowPaymentModal(false);
          setPaymentDetails({});
          setSelectedMovie(null);
          loadMovies();
        } else {
          alert(data.error || "Booking failed");
        }
      })
      .catch((err) => alert("Error booking movie: " + err));
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  const filteredMovies = useMemo(
    () => movies.filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [movies, searchTerm]
  );

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + moviesPerPage);

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>🎬 Welcome to your Movie Dashboard</h1>

      <p>Movies booked so far: {bookedCount}</p>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Payment Method:{" "}
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              console.log("Payment method changed to:", e.target.value);
            }}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginLeft: "10px",
              fontSize: "16px",
            }}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="GCash">GCash</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search movies by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          onFocus={() => console.log("Search input focused")}
          onBlur={() => console.log("Search input blurred")}
          onKeyDown={(e) => e.key === "Enter" && console.log("Searching for:", searchTerm)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <h2>Available Movies</h2>
      {loadingMovies ? (
        <p>Loading movies...</p>
      ) : currentMovies.length === 0 ? (
        <p>No movies match your search.</p>
      ) : (
        <>
          <table className="movie-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Title</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Director</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Year</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Price</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Available Seats</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentMovies.map((m) => (
                <tr
                  key={m.id}
                  onMouseEnter={() => console.log(`Hovering on ${m.title}`)}
                  onMouseLeave={() => console.log(`Left ${m.title}`)}
                  onDoubleClick={() => alert(`Double-clicked on ${m.title}`)}
                >
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{m.title}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{m.director}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{m.year}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{m.price}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{m.available_seats}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    <button
                      onClick={() => handleBookClick(m)}
                      disabled={m.available_seats <= 0}
                      style={{
                        padding: "8px 15px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: m.available_seats > 0 ? "pointer" : "not-allowed",
                        backgroundColor: m.available_seats > 0 ? "#007bff" : "#6c757d",
                        color: "#fff",
                      }}
                    >
                      {m.available_seats > 0 ? "Book" : "Sold Out"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              gap: "10px",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 15px",
                borderRadius: "6px",
                border: "1px solid #007bff",
                backgroundColor: "#fff",
                color: "#007bff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: "8px 15px",
                  borderRadius: "6px",
                  border: "1px solid #007bff",
                  backgroundColor: page === currentPage ? "#007bff" : "#fff",
                  color: page === currentPage ? "#fff" : "#007bff",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 15px",
                borderRadius: "6px",
                border: "1px solid #007bff",
                backgroundColor: "#fff",
                color: "#007bff",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* GCash Modal */}
      {showPaymentModal && paymentMethod === "GCash" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h2>Pay with GCash</h2>
            <p>Send payment to admin GCash number:</p>
            <h3 style={{ color: "#28a745" }}>{adminGCashNumber}</h3>
            <input
              type="text"
              placeholder="Enter GCash Reference Number"
              value={paymentDetails.gcashRefNumber || ""}
              onChange={(e) =>
                setPaymentDetails((prev) => ({ ...prev, gcashRefNumber: e.target.value }))
              }
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
                marginBottom: "15px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
