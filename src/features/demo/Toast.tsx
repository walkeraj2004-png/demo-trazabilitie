"use client";
/* =====================================================================
   TrazaFlor · demo · toast
   Muestra el mensaje del estado destino unos segundos. Re-aparece cada vez
   que cambia el mensaje.
   ===================================================================== */
import { useEffect, useState } from "react";
import { cx } from "@/presentation/ui";

export function Toast({ msg }: { msg: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!msg) return;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), 4200);
    return () => clearTimeout(id);
  }, [msg]);

  return (
    <div id="toast" className={cx(visible && "visible")} role="status" aria-live="polite">
      {msg}
    </div>
  );
}
