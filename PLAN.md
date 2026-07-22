# Plan de acción — TrazaFlor (rama `desarrollo`)

## Contexto y decisión estratégica

- **Qué es:** demo estático de trazabilidad de exportación de flores (expediente único, QR por caja, vistas por rol con permisos).
- **Objetivo real (elegido):** base de producto real, priorizando tener **una idea vendible** — donde "vendible" = demostrar la fusión multi-fuente (Xpotrack + couriers + backend propio + Agrocalidad), NO un reskin visual.
- **Backend:** frontend que agrega API de Xpotrack + API propia + APIs de couriers para mejorar la trazabilidad.

## Corrección al enfoque inicial

El código actual **no es espagueti**: tiene separación por archivo, patrón IIFE sin globales, índices derivados de la máquina de estados, permisos como dato. El problema real no es desorden, es:

1. `app.js` (700 líneas) mezcla demasiadas responsabilidades en un archivo (SRP a nivel de módulo).
2. Render por concatenación de strings → frágil, no testeable, no escapa datos.
3. Acoplamiento oculto UI↔dominio por convención de strings (`e.actor.indexOf("AeroCarga")`).
4. Pedido único hardcodeado (natural en un POC).

**Activo a preservar:** la máquina de estados como fuente única desde la que se *deriva* todo (log, custodia, resaltados, puntos de cambio). Es agnóstica al framework y sobrevive a cualquier stack.

## Decisión de stack: Next.js (App Router)

Justificación (no es moda):
- **Restricción dura de seguridad:** consumir APIs de couriers/Xpotrack con llaves exige servidor. Las keys no pueden vivir en el cliente (OWASP). GitHub Pages es estático → inviable. Esto obliga a un runtime servidor.
- **Backend propio + proxy de fusión en el mismo repo** (API routes) → sin infra separada, ideal para equipo chico.
- **SEO de la landing** vía SSG.
- Ecosistema y contratación amplios.
- Alternativa viable: **SvelteKit** si se prioriza velocidad pura de build sobre contratación (los stores/derived calzan con el modelo derivado). Decisión reversible en F0.

## Fases

### F0 — Scaffold + preservar dominio
- Esqueleto Next (App Router, TypeScript).
- Extraer `ESTADOS`, `PERMISOS`, `PEDIDO`, `CAJAS` a módulos puros TS (dominio, agnóstico).
- Migrar i18n existente (ES/EN ya construido) a la capa de la app.

### F1 — La prueba vendible (el foso)
- Endpoint server que ingiere UN evento real de courier/Xpotrack y avanza el expediente en vivo.
- Modelo de actor con **IDs** en el dominio → eliminar acoplamiento por strings.
- Demostrar la fusión multi-fuente en una sola línea de tiempo coherente.

### F2 — Capa de render limpia
- `/clean-code` real (ya sobre código que se queda): componentes de render por rol.
- `/solid-oop` en los servicios de fusión (ports/adapters por fuente de datos: Xpotrack, courier X, backend propio).

### F3 — Sistema de diseño
- `/design-taste-frontend`: tokens (color, tipografía, espaciado) primero — sobreviven.
- `/apple-design`: pulido e interacciones al final.

### F4 — Seguridad
- `/owasp-enterprise` cuando haya auth y manejo real de secretos.

## Reglas de trabajo
- Todo en la rama `desarrollo`. No se toca `main`.
- Preservar comportamiento del dominio salvo mejora explícita.
- El diseño visual va al final; la base técnica y la prueba de fusión van primero.

## Estado actual
- [x] Rama `desarrollo` creada
- [x] Auditoría y decisión de stack
- [x] Go de stack: **Next.js** confirmado
- [x] F0 · scaffold Next 16 + TS (build y typecheck en verde)
- [x] F0 · dominio extraído a TS puro tipado (`src/domain/*`)
- [x] F0 · legacy preservado en `legacy/`
- [x] F0 · i18n portado (ES/EN): `t()` pura + provider React SSR-safe + toggle
- [x] F2 (adelanto) · landing reconstruida como pantalla React (`/`)
- [x] F1 · pantalla del demo completa: simulación + 4 vistas por rol + custodia por caja + QR
- [x] Diseño: sistema visual del POC adoptado (no placeholder IA)
- [x] F1 · pantalla `/caja` (destino de los QR) — flujo completo cerrado
- [ ] Landing: faltan secciones "guía" y "escáneame" (QR) del POC
- [ ] F1 · endpoint de fusión (Xpotrack/courier) + prueba vendible ← **el foso**
- [ ] F3 · elevación de diseño (design-taste-frontend + apple-design)

### Arquitectura del demo (F1)
- Dominio puro: `timeline.ts` (buildLog/eventosCaja/ultimoEscaneo) sin DOM ni i18n.
- Estado: `useDemoState` (fuente única, persistencia localStorage).
- Cambios sin ver: `changes.ts` (predicado explícito por pestaña, no DOM-scraping).
- Presentación: `actorLabel` resuelve ActorId→texto; paneles por rol reusan
  las clases del sistema visual real.

### Cómo ver el avance
- Local: http://localhost:3000  ·  Teléfono (misma WiFi): http://192.168.0.164:3000
- `npm run dev` corriendo con hot-reload (task bmff2hr7t).

### Notas de seguridad (F4, registradas ya)
- next@15.1.6 tenía CVE crítico (CVE-2025-66478) → resuelto subiendo a 16.2.11.
- Advertencia transitiva de `sharp`/libvips pendiente; `npm audit fix --force`
  degrada Next a 9.3.3 (destructivo) → NO ejecutar. Revisar override en F4.
