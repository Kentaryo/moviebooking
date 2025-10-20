import { useState } from "react";

export function usePagination(items, itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goPrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goTo = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return { currentPage, currentItems, totalPages, goNext, goPrev, goTo };
}
