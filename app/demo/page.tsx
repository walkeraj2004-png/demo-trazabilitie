"use client";
/* =====================================================================
   TrazaFlor · pantalla del demo (rediseñada)
   Flujo legible de arriba abajo para un comprador no técnico:
     controles → viaje (9 pasos) → relato del paso en lenguaje simple →
     lente de rol (quién ve qué) → el expediente por esa lente.
   Anclada en Agrocalidad (autoridad). El estado vive en useDemoState.
   ===================================================================== */
import { useEffect } from "react";
import { PEDIDO } from "@/domain";
import { useI18n } from "@/i18n";
import { useDemoState } from "@/features/demo/useDemoState";
import { SimBar } from "@/features/demo/SimBar";
import { Progreso } from "@/features/demo/Progreso";
import { StepStory } from "@/features/demo/StepStory";
import { LensBar } from "@/features/demo/LensBar";
import { Toast } from "@/features/demo/Toast";
import { FincaPanel } from "@/features/demo/panels/FincaPanel";
import { ExpofloresPanel } from "@/features/demo/panels/ExpofloresPanel";
import { AgenciaPanel } from "@/features/demo/panels/AgenciaPanel";
import { AgrocalidadPanel } from "@/features/demo/panels/AgrocalidadPanel";
import swap from "@/features/demo/panelSwap.module.css";

const ARIA: Record<string, string> = {
  finca: "aria_vista_finca",
  expoflores: "aria_vista_expoflores",
  agencia: "aria_vista_agencia",
  agrocalidad: "aria_vista_agrocalidad",
};

export default function DemoPage() {
  const { t } = useI18n();
  const s = useDemoState();

  useEffect(() => {
    document.title = t("titulo_demo", { id: PEDIDO.id });
  }, [t]);

  return (
    <>
      <SimBar
        estado={s.estado}
        puedeAvanzar={s.puedeAvanzar}
        onAvanzar={s.avanzar}
        onReiniciar={s.reiniciar}
      />

      <Progreso estado={s.estado} onIr={s.irA} />

      <StepStory estado={s.estado} />

      <LensBar
        estado={s.estado}
        activa={s.tab}
        vistas={s.vistas}
        onActivar={s.activarTab}
      />

      <main>
        {/* key = lente + paso → dispara el crossfade al cambiar cualquiera */}
        <section
          className={`tab-panel visible ${swap.swap}`}
          key={`${s.tab}-${s.estado}`}
          aria-label={t(ARIA[s.tab]!)}
        >
          {s.tab === "finca" && <FincaPanel estado={s.estado} />}
          {s.tab === "expoflores" && <ExpofloresPanel estado={s.estado} />}
          {s.tab === "agencia" && <AgenciaPanel estado={s.estado} onEscanear={s.avanzar} />}
          {s.tab === "agrocalidad" && <AgrocalidadPanel estado={s.estado} />}
        </section>
      </main>

      <Toast msg={s.toastMsg} />
    </>
  );
}
