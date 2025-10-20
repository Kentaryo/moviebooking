import { useState } from "react";

export function useSearchMovies(movies) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, setSearchTerm, filteredMovies };
}
