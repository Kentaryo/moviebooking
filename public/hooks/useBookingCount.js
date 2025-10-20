import { useState } from "react";

export function useBookingCount() {
  const [count, setCount] = useState(0);

  const increase = () => setCount(prev => prev + 1);
  const reset = () => setCount(0);

  return { count, increase, reset };
}
