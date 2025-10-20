import { useState } from "react";

export function useSeatSelection(totalSeats = 10) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  return { selectedSeats, toggleSeat };
}
