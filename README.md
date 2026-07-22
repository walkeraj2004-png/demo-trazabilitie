# TrazaFlor — Visibilidad compartida para exportación de flores

Demo de presentación de un sistema de **visibilidad compartida** sobre la
exportación de flores: un expediente digital único por pedido, cajas con QR,
estados avanzados por escaneos y vistas por rol con permisos diferenciados.

> **URL del demo:** https://walkeraj2004-png.github.io/demo-trazabilitie/

## Stack

Next.js 16 (App Router) + TypeScript. El dominio (máquina de estados, matriz
de permisos, pedido semilla) vive en `src/domain/`, agnóstico de framework.
El demo estático original (vanilla JS, sin build) se conserva en `legacy/`
solo como referencia; ya no forma parte del build.

## Cómo correr localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Para probar desde el teléfono en la misma red
(útil para escanear los QR), usa la IP de tu máquina en vez de `localhost`.

- `/demo` — la aplicación: 4 pestañas de rol, barra de simulación y progreso.
- `/caja?id=ROS-0417-007` — detalle de una caja (destino de cada QR).
- El estado de la simulación vive en `localStorage` (sobrevive refresh;
  el botón **◀ Reiniciar** vuelve al estado 1).

## Deploy en GitHub Pages (GitHub Actions)

GitHub Pages solo sirve archivos estáticos — sin servidor Node, sin API
routes. El workflow `.github/workflows/deploy.yml` compila la app como
export estático (`next.config.mjs`: `output: "export"`) en cada push a
`main`, y publica el resultado.

Configuración requerida una sola vez en el repo (no vía código):
**Settings → Pages → Source → GitHub Actions** (en vez de "Deploy from
branch").

El workflow fija `NEXT_PUBLIC_BASE_PATH=/demo-trazabilitie` y
`NEXT_PUBLIC_BASE_URL=https://walkeraj2004-png.github.io/demo-trazabilitie`
solo para el build de producción; en local (`npm run dev` / `npm run build`
sin esas variables) el basePath queda vacío y todo corre en la raíz.

**Importante:** este enfoque (export estático) deja de ser viable en cuanto
el backend real (fusión de datos de Xpotrack + couriers, ver `PLAN.md`
fase F1) necesite un servidor de verdad. Ese día el deploy se muda a un
host con servidor (Vercel u otro) y este workflow se retira.

Nota: los QR de las cajas incluyen `&e=<estado>` con el estado vigente al
momento de generarse, para que un teléfono (que no comparte el
`localStorage` del presentador) muestre una timeline coherente con el
punto del demo.

## Cómo cambiar el nombre del producto

Editar la constante `APP_NAME` en `src/config.ts`. Los títulos y el
crédito del header («… · impulsado por Xpotrack») usan el nombre
literal — buscar y reemplazar «TrazaFlor» si se cambia.

## Guion del demo

1. Abrir `/demo` → estado 1 de 9.
2. Ocho clicks en **Avanzar simulación ▶** cuentan la historia completa:
   creación → validación GUIA → etiquetado → recepción en agencia (⚠ alerta
   de peso scripted) → paletizado (alerta resuelta) → DAE → embarque →
   CFE/ePhyto emitido.
3. La pestaña **Agrocalidad** es la vista héroe: validación automática,
   emisión de etiquetas con tarifas reales, cadena de custodia por caja
   (activo antinarcóticos) y certificación CFE/ePhyto.
4. Escanear cualquier QR de caja con un teléfono → `/caja` con la
   cadena de custodia de esa caja.

Ver `PLAN.md` para el roadmap completo (fases F0–F4) y el estado actual.
