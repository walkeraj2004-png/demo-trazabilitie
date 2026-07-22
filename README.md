# TrazaFlor — Demo estático (Proof of Concept)

Demo de presentación de un sistema de **visibilidad compartida** sobre la
exportación de flores: un expediente digital único por pedido, cajas con QR,
estados avanzados por escaneos y vistas por rol con permisos diferenciados.

> **URL del demo:** _pendiente — actualizar tras el primer deploy en GitHub Pages_

## Cómo correr localmente

No hay build ni backend. Abrir `index.html` en el navegador (doble click o
`open index.html`). Todo funciona desde `file://`; la única conexión externa
es el CDN de la librería QR (cdnjs).

- `demo.html` — la aplicación: 4 pestañas de rol, barra de simulación y progreso.
- `caja.html?id=ROS-0417-007` — detalle de una caja (destino de cada QR).
- El estado de la simulación vive en `localStorage` (sobrevive refresh;
  el botón **◀ Reiniciar** vuelve al estado 1).

## Deploy en GitHub Pages

1. Crear el repo y subir estos archivos a `main` (raíz).
2. Settings → Pages → Deploy from branch → `main` / root.
3. Editar `data.js` y reemplazar el placeholder de `BASE_URL` con la URL real
   (p. ej. `https://usuario.github.io/trazaflor`). Subir el cambio.
4. Los QR se regeneran solos al recargar — apuntan a `BASE_URL/caja.html?id=…`.

Nota: los QR de las cajas incluyen `&e=<estado>` con el estado vigente al
momento de generarse, para que un teléfono (que no comparte el `localStorage`
del presentador) muestre una timeline coherente con el punto del demo.

## Cómo cambiar el nombre del producto

Editar la constante `APP_NAME` al inicio de `data.js`. Los títulos y el
crédito del header («… · impulsado por Xpotrack») en los HTML usan el nombre
literal — buscar y reemplazar «TrazaFlor» en los tres `.html` si se cambia.

## Guion del demo

1. Abrir `demo.html` → estado 1 de 8.
2. Ocho clicks en **Avanzar simulación ▶** cuentan la historia completa:
   creación → validación GUIA → etiquetado → recepción en agencia (⚠ alerta
   de peso scripted) → paletizado (alerta resuelta) → DAE → embarque →
   CFE/ePhyto emitido.
3. La pestaña **Agrocalidad** es la vista héroe: validación automática,
   emisión de etiquetas con tarifas reales, cadena de custodia por caja
   (activo antinarcóticos) y certificación CFE/ePhyto.
4. Escanear cualquier QR de caja con un teléfono → `caja.html` con la
   cadena de custodia de esa caja.
