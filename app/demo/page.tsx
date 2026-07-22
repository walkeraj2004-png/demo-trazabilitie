"use client";
import Link from "next/link";
import { useT } from "@/i18n";
import { PEDIDO, TOTAL_ESTADOS } from "@/domain";

export default function DemoPage() {
  const t = useT();
  return (
    <main style={{ maxWidth: "48rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.5rem", color: "#14532d" }}>
        {t("titulo_demo", { id: PEDIDO.id })}
      </h1>
      <p style={{ marginTop: "1rem", color: "#555" }}>
        Pantalla del demo en construcción (F1): las 4 vistas por rol, la barra
        de simulación y el avance por escaneo se reconstruyen aquí sobre el
        dominio ya extraído ({TOTAL_ESTADOS} estados).
      </p>
      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/" style={{ color: "#14532d" }}>
          ← {t("volver_demo").replace("←", "").trim()}
        </Link>
      </p>
    </main>
  );
}
