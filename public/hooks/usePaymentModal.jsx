import { useState } from "react";

export function usePaymentModal() {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return { visible, open, close };
}
