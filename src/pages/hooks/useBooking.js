import { useState } from "react";

export function useBooking() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [paymentDetails, setPaymentDetails] = useState({});

  const bookMovie = async (userId) => {
    if (!selectedMovie) return { success: false, error: "No movie selected" };

    const res = await fetch("http://localhost/movie/backend/bookMovie.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movie_id: selectedMovie.id,
        user_id: userId,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
      }),
    });
    return await res.json();
  };

  return { selectedMovie, setSelectedMovie, paymentMethod, setPaymentMethod, paymentDetails, setPaymentDetails, bookMovie };
}
