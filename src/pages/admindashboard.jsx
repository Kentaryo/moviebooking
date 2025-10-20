import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: "",
    director: "",
    year: 0,
    price: 0,
    available_seats: 0,
    page: 1, // NEW: desired page
  });
  const [editingMovie, setEditingMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5;
  const navigate = useNavigate();

  const loadMovies = async () => {
    try {
      const res = await fetch("http://localhost/movie/backend/getMovies.php");
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await fetch("http://localhost/movie/api/getAllBookings.php");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  useEffect(() => {
    loadMovies();
    loadBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let movieToAdd = { ...newMovie };
    if (!editingMovie) {
      // Insert the movie at the correct page position
      const insertIndex = (newMovie.page - 1) * moviesPerPage;
      const updatedMovies = [...movies];
      updatedMovies.splice(insertIndex, 0, movieToAdd);
      setMovies(updatedMovies);
      alert(`Movie added to page ${newMovie.page}`);
    }

    // Save to backend
    const url = editingMovie
      ? `http://localhost/movie/backend/updateMovie.php?id=${editingMovie.id}`
      : "http://localhost/movie/backend/addMovie.php";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });
      const data = await res.json();
      if (data.success) {
        if (editingMovie) alert("Movie updated successfully!");
        setNewMovie({ title: "", director: "", year: 0, price: 0, available_seats: 0, page: 1 });
        setEditingMovie(null);
        await loadMovies();
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (err) {
      alert("Network error: " + err);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setNewMovie({
      title: movie.title,
      director: movie.director,
      year: movie.year,
      price: movie.price,
      available_seats: movie.available_seats,
      page: 1,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      const res = await fetch(`http://localhost/movie/backend/deleteMovie.php?id=${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        alert(data.success);
        await loadMovies();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      alert("Network error: " + err);
    }
  };

  const handleLogout = () => navigate("/");

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const goToPage = (num) => {
    if (num < 1) num = 1;
    else if (num > totalPages) num = totalPages;
    setCurrentPage(num);
  };

  return (
    <div className="dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🎬 Admin Dashboard</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>Logout</button>

      {/* Movie Form */}
      <form onSubmit={handleSubmit} className="movie-form" style={{ marginBottom: "30px" }}>
        <input type="text" placeholder="Title" value={newMovie.title} onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })} required />
        <input type="text" placeholder="Director" value={newMovie.director} onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })} required />
        <input type="number" placeholder="Year" value={newMovie.year} onChange={(e) => setNewMovie({ ...newMovie, year: parseInt(e.target.value) || 0 })} required />
        <input type="number" placeholder="Price" value={newMovie.price} onChange={(e) => setNewMovie({ ...newMovie, price: parseInt(e.target.value) || 0 })} required />
        <input type="number" placeholder="Available Seats" value={newMovie.available_seats} onChange={(e) => setNewMovie({ ...newMovie, available_seats: parseInt(e.target.value) || 0 })} required />
        <input type="number" placeholder="Page Number" value={newMovie.page} onChange={(e) => setNewMovie({ ...newMovie, page: parseInt(e.target.value) || 1 })} min={1} max={Math.max(totalPages, 1)} required />
        <button type="submit">{editingMovie ? "Update Movie" : "Add Movie"}</button>
        {editingMovie && <button type="button" onClick={() => { setEditingMovie(null); setNewMovie({ title: "", director: "", year: 0, price: 0, available_seats: 0, page: 1 }); }}>Cancel</button>}
      </form>

      {/* Movies Table */}
      <h2>Available Movies</h2>
      <table className="movie-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th>Title</th>
            <th>Director</th>
            <th>Year</th>
            <th>Price</th>
            <th>Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.map((m) => (
            <tr key={m.id}>
              <td>{m.title}</td>
              <td>{m.director}</td>
              <td>{m.year}</td>
              <td>{m.price}</td>
              <td>{m.available_seats}</td>
              <td>
                <button onClick={() => handleEdit(m)}>Edit</button>
                <button onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "5px", flexWrap: "wrap" }}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>⬅ Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button key={num} onClick={() => goToPage(num)} style={{ padding: "5px 10px", borderRadius: "5px", backgroundColor: currentPage === num ? "#007bff" : "#eee", color: currentPage === num ? "#fff" : "#000", fontWeight: currentPage === num ? "bold" : "normal" }}>{num}</button>
        ))}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next ➡</button>
      </div>

      {/* Bookings Table */}
      <h2 style={{ marginTop: "40px" }}>All Bookings</h2>
      {bookings.length === 0 ? <p>No bookings yet.</p> : (
        <table className="movie-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th>User Name</th>
              <th>Movie Title</th>
              <th>Director</th>
              <th>Year</th>
              <th>Price</th>
              <th>Seats Booked</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr key={index}>
                <td>{b.name || "User"}</td>
                <td>{b.title}</td>
                <td>{b.director}</td>
                <td>{b.year}</td>
                <td>{b.price}</td>
                <td>{b.seats_booked || 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
