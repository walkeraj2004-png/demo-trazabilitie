# Product

## Register

product

## Users

Cuatro actores no técnicos evaluando o usando el mismo expediente digital
durante una demo en vivo para cerrar un piloto:
- **Agrocalidad** — la autoridad regulatoria (valida, certifica).
- **Finca** — el exportador, dueño del pedido.
- **Agencia de carga** — la logística (recepción, peso, consolidación).
- **Expoflores** — el gremio (estadísticas y alertas del sector, sin datos de pedidos individuales).

Contexto de uso: una sala de reunión o una llamada, mostrando la pantalla
a alguien que decide si el piloto avanza. No son desarrolladores ni
usuarios técnicos de software — son gente de campo, aduanas y comercio.

## Product Purpose

Demostrar (y eventualmente operar) un expediente digital único por pedido
de exportación de flores, que avanza por escaneos QR a lo largo de la
cadena (finca → agencia → paletizadora → aerolínea) y que cada actor ve
a través de su propia ventana de permisos. Éxito = que alguien no técnico
entienda en segundos "quién ve qué y por qué es seguro" sin que se lo
expliquen, y que el flujo se sienta como un producto real, no una maqueta.

## Brand Personality

Institucional, sobrio, confiable — software de aduanas/regulación, no
startup de consumo. Serio sin ser frío. La paleta ya establecida (azul
institucional, verde, coral, base tipográfica 17px) viene de un diseñador
que ya acertó el tono; se conserva y se refina, no se reemplaza.

## Anti-references

- Clichés de dashboard SaaS genérico: gradientes morados, eyebrows en
  mayúsculas sobre cada sección, tarjetas idénticas flotando.
- El "todo en un solo scroll infinito" que el propio usuario señaló como
  el problema central: apilar 3-4 secciones completas una tras otra en
  vez de paginar como un producto real.
- Diseño "de folleto": mucho texto explicativo en vez de mostrar el dato.

## Design Principles

1. **Una cosa a la vez.** Nunca mostrar todo el expediente en un solo
   scroll; paginar en sub-vistas con navegación real (ya empezado con
   `SubNav`).
2. **El permiso se siente, no se explica.** El candado "oculto por
   permisos" y el contraste entre roles son la venta del producto; deben
   sentirse al cambiar de pestaña, no leerse en un párrafo.
3. **Confianza institucional sobre brillo de startup.** Sobrio, no
   ruidoso; el pulido va en el detalle (motion, contraste, jerarquía), no
   en efectos llamativos.
4. **Lenguaje plano sobre jerga del sector.** AWB, DAE, CFE, GUIA se
   explican en línea, nunca se asume que el espectador los conoce.
5. **El movimiento se gana su lugar.** Motion con propósito (jerarquía,
   feedback, transición de estado), nunca decorativo porque sí (Emil).

## Accessibility & Inclusion

- Contraste AA como mínimo, incluyendo el texto "oculto por permisos"
  (gris sobre blanco — auditar).
- `prefers-reduced-motion` ya respetado en las animaciones existentes.
- Objetivo: usuarios no técnicos, posiblemente en dispositivos de gama
  media en campo (agentes de agencia escaneando cajas) — texto legible,
  áreas de toque generosas, sin dependencia de hover para información
  crítica (ya corregido: glosas en línea, no tooltips).
