"use client";
/* =====================================================================
   TrazaFlor · demo · estado de la simulación
   Fuente única del estado del demo: número de estado, pestaña activa,
   pestañas vistas y toast. Persiste en localStorage (mismas claves que el
   POC) y expone las acciones. SSR-safe: arranca en el estado 1 y adopta lo
   persistido al montar.
   ===================================================================== */
import { useCallback, useEffect, useState } from "react";
import { ROLES, TOTAL_ESTADOS, ESTADOS, normalizarEstado } from "@/domain";
import type { Rol } from "@/domain";
import { useT } from "@/i18n";

const KEY_ESTADO = "trazaflor_estado";
const KEY_TAB = "trazaflor_tab";
const KEY_VISTAS = "trazaflor_pestanas_vistas";

function esRol(v: unknown): v is Rol {
  return typeof v === "string" && (ROLES as readonly string[]).includes(v);
}

function leerVistas(): Rol[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY_VISTAS) ?? "null");
    return Array.isArray(raw) ? raw.filter(esRol) : [];
  } catch {
    return [];
  }
}

export interface DemoState {
  estado: number;
  tab: Rol;
  vistas: readonly Rol[];
  toastMsg: string;
  puedeAvanzar: boolean;
  irA: (n: number) => void;
  avanzar: () => void;
  reiniciar: () => void;
  activarTab: (tab: Rol) => void;
}

export function useDemoState(): DemoState {
  const t = useT();
  const [estado, setEstado] = useState(1);
  // Arranca en Finca: es la única vista con el expediente completo desde el
  // paso 1 (data visible de inmediato). Persistencia puede sobrescribir.
  const [tab, setTab] = useState<Rol>("finca");
  const [vistas, setVistas] = useState<readonly Rol[]>([]);
  const [toastMsg, setToastMsg] = useState("");

  // Adopta lo persistido al montar (cliente).
  useEffect(() => {
    const n = parseInt(localStorage.getItem(KEY_ESTADO) ?? "", 10);
    if (Number.isFinite(n)) setEstado(normalizarEstado(n));
    const tabGuardada = localStorage.getItem(KEY_TAB);
    if (esRol(tabGuardada)) setTab(tabGuardada);
    setVistas(leerVistas());
  }, []);

  const activarTab = useCallback(
    (next: Rol) => {
      setTab(next);
      localStorage.setItem(KEY_TAB, next);
      if (!vistas.includes(next)) {
        const merged = [...vistas, next];
        setVistas(merged);
        localStorage.setItem(KEY_VISTAS, JSON.stringify(merged));
      }
    },
    [vistas],
  );

  /* Salta a cualquier estado (adelante o atrás). Al saltar, solo la
     pestaña activa cuenta como vista → reaparecen los puntos de cambio. */
  const irA = useCallback(
    (n: number) => {
      if (n < 1 || n > TOTAL_ESTADOS || n === estado) return;
      setEstado(n);
      localStorage.setItem(KEY_ESTADO, String(n));
      const solo: Rol[] = [tab];
      setVistas(solo);
      localStorage.setItem(KEY_VISTAS, JSON.stringify(solo));
      setToastMsg(t(`estado_toast_${ESTADOS[n - 1]!.key}`));
    },
    [estado, tab, t],
  );

  const avanzar = useCallback(() => irA(estado + 1), [irA, estado]);

  const reiniciar = useCallback(() => {
    setEstado(1);
    localStorage.setItem(KEY_ESTADO, "1");
    setVistas([]);
    localStorage.setItem(KEY_VISTAS, "[]");
    setToastMsg(t("toast_reiniciado"));
  }, [t]);

  return {
    estado,
    tab,
    vistas,
    toastMsg,
    puedeAvanzar: estado < TOTAL_ESTADOS,
    irA,
    avanzar,
    reiniciar,
    activarTab,
  };
}
