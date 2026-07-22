---
name: TrazaFlor
description: Expediente digital compartido para exportación de flores, con vistas por rol y permisos.
colors:
  institutional-navy: "#1F5C8B"
  soft-navy: "#7FA8C9"
  navy-mist: "#EEF4F9"
  clearance-green: "#1D9E75"
  green-mist: "#E4F5EE"
  alert-terracotta: "#D85A30"
  terracotta-mist: "#FCEDE6"
  slate: "#6B7684"
  hairline: "#D9E0E7"
  paper-grey: "#F5F7F9"
  ink: "#22303C"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "14px"
  pill: "999px"
spacing:
  sm: "0.5rem"
  md: "1.2rem"
  lg: "1.6rem"
  xl: "2.6rem"
components:
  button-primary:
    backgroundColor: "{colors.clearance-green}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1.1rem"
  button-primary-hover:
    backgroundColor: "#17825f"
  button-cta:
    backgroundColor: "{colors.institutional-navy}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "1rem 2.6rem"
  button-cta-hover:
    backgroundColor: "#17466B"
  chip-active:
    backgroundColor: "{colors.institutional-navy}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.4rem 1rem"
  panel:
    backgroundColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "1.2rem 1.4rem"
---

# Design System: TrazaFlor

## 1. Overview

**Creative North Star: "The Customs Officer's Desk"**

Software de aduanas y regulación, no una app de consumo. TrazaFlor se
diseñó para inspirar la misma confianza que un formulario oficial bien
hecho: sobrio, legible, sin ambigüedad sobre quién puede ver qué. La base
tipográfica de 17px (más grande que la mayoría de apps web) es
deliberada — este producto se proyecta en una sala y se lee desde lejos,
no se desliza en un teléfono a las 2am.

El sistema rechaza explícitamente el lenguaje visual del SaaS genérico:
nada de gradientes morados, nada de tarjetas idénticas flotando, nada de
eyebrows en mayúsculas sobre cada sección. También rechaza el "todo en un
solo scroll infinito" — la superficie más densa del producto (los
paneles de Agrocalidad y Finca) se paginan en sub-vistas navegables, no
se apilan sin fin.

**Key Characteristics:**
- Paleta de cuatro colores con roles fijos: azul (autoridad), verde
  (aprobado/finca), coral (alerta/logística), gris (neutral/gremio).
- Sin sombras de elevación; la profundidad viene de bordes hairline y
  anillos de color (`box-shadow` de offset 0), no de blur.
- Radios contenidos (8-14px) más un único caso de píldora completa
  (999px) para chips/selectores — nunca ambos en el mismo componente.
- Candados y textos "oculto por permisos" son un componente de primera
  clase, no un estado de error disfrazado.

## 2. Colors

Cuatro acentos con roles narrativos fijos (no intercambiables) sobre una
base neutra de grises fríos.

### Primary
- **Institutional Navy** (#1F5C8B): autoridad y marca. Header (borde
  inferior de 3px), CTA principal, pestaña/banner de Agrocalidad, enlaces.

### Secondary
- **Clearance Green** (#1D9E75): aprobado, resuelto, autorizado. Botones
  primarios de acción, banners `banner-ok`, pestaña/banner de Finca.
- **Alert Terracotta** (#D85A30): alerta activa, bloqueo, atención
  requerida. Banners `banner-alerta`, pestaña/banner de Agencia de carga
  (la logística es donde las alertas se detectan primero).

### Neutral
- **Slate** (#6B7684): texto secundario, etiquetas, pestaña/banner del
  Gremio (Expoflores ve lo mínimo — su color es el más apagado a propósito).
- **Hairline** (#D9E0E7): todos los bordes y divisores del sistema.
- **Paper Grey** (#F5F7F9): fondos de superficie secundaria (paneles
  compactos, fondo del selector de idioma).
- **Ink** (#22303C): texto de cuerpo. Nunca negro puro.

### Named Rules
**The Fixed-Role Rule.** Cada color de acento tiene un significado, no
solo una posición. Verde nunca decora; significa "aprobado". Coral nunca
decora; significa "alerta o atención". Si un componente nuevo necesita un
acento sin ese significado, usa Institutional Navy, no un color nuevo.

## 3. Typography

**Display Font:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
Helvetica, Arial, sans-serif (system sans; sin webfont propia)
**Body Font:** la misma familia — un solo stack tipográfico en todo el
sistema.

**Character:** neutral y funcional a propósito. Este no es un producto que
vende con tipografía; vende con claridad. Una sola familia con contraste
de peso, base 17px (no 16px) para legibilidad a distancia de proyección.

### Hierarchy
- **Display** (700, 3rem, line-height 1.1, letter-spacing -0.02em): el
  `<h1>` del hero de la landing únicamente.
- **Title** (700, 1.3rem): títulos de panel (`<h2>`), nombres de rol en
  el banner de identidad.
- **Body** (400, 17px, line-height 1.55): todo el texto de contenido.
- **Label** (700, 0.78rem, letter-spacing 0.04em, uppercase): encabezados
  de tabla, encabezados de columna en "Restricciones → Soluciones".

### Named Rules
**The One Family Rule.** Un solo stack tipográfico para todo el sistema.
El contraste de jerarquía viene de peso y tamaño, nunca de mezclar
familias.

## 4. Elevation

El sistema es plano por defecto: sin sombras de desenfoque en ninguna
parte. La profundidad y el estado se comunican con bordes hairline
(1px, `--gris-borde`) y con anillos de color de offset 0 alrededor de
marcadores activos — nunca con blur.

### Shadow Vocabulary
- **Ring de estado activo** (`box-shadow: 0 0 0 5px var(--azul-fondo)`):
  el nodo del paso actual en la barra de progreso.
- **Ring de escaneo** (`box-shadow: 0 0 0 2px var(--azul)` / `var(--verde)`):
  puntos de la timeline en `/caja` (hito vs. escaneo).

### Named Rules
**The Flat-By-Default Rule.** Ninguna tarjeta lleva sombra en reposo. Si
algo necesita destacarse, usa un borde de acento (ver el acento superior
en `.panel.nuevo`) o un fondo de tinte, nunca una sombra añadida.

## 5. Components

### Buttons
- **Shape:** 8px la mayoría de botones (`.btn`); 10px en CTAs grandes
  (`.btn-grande`, `.btn-avanzar`, chips de sub-navegación en píldora
  completa 999px).
- **Primary:** fondo Clearance Green, texto blanco, sin borde
  (`.btn-pri`, botón "Avanzar simulación").
- **CTA grande:** fondo Institutional Navy, texto blanco, padding
  generoso (`1rem 2.6rem`) — único uso de este tamaño (CTA de landing).
- **Secondary/Ghost:** fondo Paper Grey, texto Ink, borde Hairline
  (`.btn-sec`, "Editar pedido" deshabilitado).
- **Hover:** oscurece el color base (~10-15% más oscuro), sin transform.
- **Disabled:** opacidad 0.45, cursor not-allowed — nunca se oculta un
  botón deshabilitado, se muestra apagado (la acción existe, no procede).

### Chips (sub-navegación de rol / lente)
- **Style:** fondo tintado del rol en reposo (`--rol-x-fondo`), texto del
  color del rol; activo = fondo sólido del color del rol, texto blanco.
  Radio píldora completa (999px) — el único componente con este radio.
- **State:** `:active` aplica `scale(0.97)` con transición 140ms
  ease-out (feedback táctil, ver Do's).

### Cards / Containers (`.panel`)
- **Corner Style:** 12px.
- **Background:** blanco sólido; `.panel-compacto` usa Paper Grey.
- **Shadow Strategy:** ninguna (ver Elevation). Estado "nuevo" en un panel
  grande = acento superior de 3px en `#BA7517` (ámbar), nunca relleno
  completo de color.
- **Border:** 1px Hairline.
- **Internal Padding:** `1.2rem 1.4rem`.

### Inputs / Fields
No hay formularios editables en el producto actual (todo el pedido es de
solo lectura en la simulación); si se agregan, heredar el radio de 8px y
el borde Hairline de `.btn-sec`.

### Navigation (pestañas de rol)
- Fondo Paper Grey en reposo, texto Slate; activa = fondo sólido del
  color de ESE rol específico (no un azul genérico) + texto blanco.
  Radio superior 10px, sin radio inferior (se funden con el panel).
- El header global usa un borde inferior sólido de 3px en Institutional
  Navy — el único borde grueso de acento en todo el sistema.

### RoleBanner (componente de firma)
Badge circular de 38px con iniciales del rol (color sólido del rol) +
nombre + descripción de una línea de qué hace ese actor. Primera cosa que
se renderiza en cada panel de rol — resuelve "de quién es esta pantalla"
sin texto explicativo largo.

## 6. Do's and Don'ts

### Do:
- **Do** usar el color de rol consistente en pestaña activa + banner de
  identidad + cualquier acento futuro de ese rol (mismo azul en
  Agrocalidad siempre).
- **Do** mostrar los datos ocultos por permisos con candado explícito
  (🔒 "oculto por permisos"), nunca solo omitirlos — el dato existe, la
  neutralidad se ve.
- **Do** paginar contenido denso en sub-vistas navegables (`SubNav`) en
  vez de apilar secciones en un scroll continuo.
- **Do** usar bordes hairline y tintes de fondo para jerarquía, no sombras.
- **Do** explicar siglas del sector en línea junto al dato (glosas), nunca
  solo en un tooltip que depende de hover.

### Don't:
- **Don't** usar gradientes morados, glassmorphism decorativo, ni eyebrows
  en mayúsculas sobre cada sección — clichés de SaaS genérico que este
  producto rechaza explícitamente (ver PRODUCT.md).
- **Don't** pintar un panel grande completo de ámbar/color para indicar
  "esto es nuevo" — se lee como error. Usar el acento superior de 3px.
- **Don't** usar `border-left` grueso como acento decorativo de tarjeta.
- **Don't** mezclar radio píldora (999px) con radio de tarjeta (12px) en
  el mismo componente — el sistema no perdona formas inconsistentes.
- **Don't** apilar 3+ secciones completas verticalmente cuando existe
  `SubNav` como alternativa — el "todo en un solo scroll" es el problema
  que ya se corrigió una vez; no reintroducirlo.
- **Don't** introducir una segunda familia tipográfica. Un solo stack
  sans para todo el sistema.
