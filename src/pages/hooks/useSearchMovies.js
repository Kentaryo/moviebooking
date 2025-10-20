import React, { useState, useEffect } from "react";

function LoadMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost/movie/backend/getMovies.php")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  return (
    <div>
      <h2>Available Movies:</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default LoadMovies;
