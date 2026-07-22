"use client";
/* =====================================================================
   TrazaFlor · demo · relato del paso actual
   El gran arreglo de "entendible": para el estado actual, cuenta en
   lenguaje simple qué pasa, quién es responsable y si hay una alerta.
   Una idea a la vez. El responsable se deriva del actorId del estado.
   ===================================================================== */
import { ESTADOS, TOTAL_ESTADOS, NUM_ALERTA_ABIERTA, NUM_ALERTA_RESUELTA } from "@/domain";
import { useI18n } from "@/i18n";
import { actorLabel } from "@/presentation/actors";
import { QUE_PASA, STORY_UI } from "./narrative";
import styles from "./StepStory.module.css";

export function StepStory({ estado }: { estado: number }) {
  const { t, lang } = useI18n();
  const ui = STORY_UI[lang];
  const paso = ESTADOS[estado - 1]!;
  const nombre = t(`estado_nombre_${paso.key}`);
  const responsable = actorLabel(paso.evento.actorId);
  const queReasa = QUE_PASA[lang][paso.key];

  const alerta =
    estado === NUM_ALERTA_ABIERTA
      ? "alerta"
      : estado === NUM_ALERTA_RESUELTA
        ? "resuelta"
        : null;

  return (
    /* key={estado} re-monta la tarjeta en cada paso → dispara la entrada. */
    <section className={styles.card} key={estado} aria-live="polite">
      <div className={styles.head}>
        <span className={styles.paso}>{ui.paso(estado, TOTAL_ESTADOS)}</span>
        <span className={styles.responsable}>
          {ui.responsable} <strong>{responsable}</strong>
        </span>
      </div>

      <h2 className={styles.titulo}>{nombre}</h2>
      <p className={styles.texto}>{queReasa}</p>

      {alerta === "alerta" && (
        <p className={`${styles.nota} ${styles.notaAlerta}`}>{ui.alertaAbierta}</p>
      )}
      {alerta === "resuelta" && (
        <p className={`${styles.nota} ${styles.notaOk}`}>{ui.alertaResuelta}</p>
      )}
    </section>
  );
}
