/* =====================================================================
   TrazaFlor · app.js
   Máquina de estados, render por rol, notificaciones, QRs y
   persistencia en localStorage. Enruta según <body data-page="…">.
   Todas las cadenas visibles salen de i18n.js vía t(); no hay texto de
   interfaz escrito directamente aquí.
   ===================================================================== */

(function () {
  "use strict";

  var t = window.TrazaflorI18n.t;
  var getLang = window.TrazaflorI18n.getLang;

  var KEY_ESTADO = "trazaflor_estado";
  var KEY_TAB = "trazaflor_tab";
  var KEY_VISTAS = "trazaflor_pestanas_vistas";
  var TABS = ["finca", "expoflores", "agencia", "agrocalidad"];

  /* Índices (0-based) de estados clave. Se derivan de la posición real en
     ESTADOS, no de números fijos, para que un futuro reordenamiento no
     deje nada apuntando a un estado viejo. */
  var IDX_CFE_EMITIDO = ESTADOS.findIndex(function (e) { return e.key === "cfe_emitido"; });
  var IDX_PALETIZADO = ESTADOS.findIndex(function (e) { return e.key === "paletizado"; });

  /* ---------- estado global ---------- */

  function getEstado() {
    var n = parseInt(localStorage.getItem(KEY_ESTADO), 10);
    return n >= 1 && n <= ESTADOS.length ? n : 1;
  }

  function setEstado(n) {
    localStorage.setItem(KEY_ESTADO, String(n));
  }

  /* ---------- pestañas vistas (para el punto de "cambios sin ver") ----------
     Conjunto de pestañas que el presentador ya vio DURANTE el estado actual.
     Se vacía al avanzar o reiniciar; se completa al cambiar de pestaña. */

  function getVistas() {
    var raw;
    try { raw = JSON.parse(localStorage.getItem(KEY_VISTAS)); } catch (e) { raw = null; }
    return Array.isArray(raw) ? raw : [];
  }

  function setVistas(arr) {
    localStorage.setItem(KEY_VISTAS, JSON.stringify(arr));
  }

  function marcarVista(tab) {
    var vistas = getVistas();
    if (vistas.indexOf(tab) === -1) {
      vistas.push(tab);
      setVistas(vistas);
    }
  }

  /* ---------- utilidades ---------- */

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $all(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  function sumaMinutos(hhmm, min) {
    var p = hhmm.split(":");
    var t2 = parseInt(p[0], 10) * 60 + parseInt(p[1], 10) + min;
    var h = Math.floor(t2 / 60) % 24;
    var m = t2 % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  /* URL absoluta de una caja (para QRs escaneables desde un teléfono).
     Incluye &e=<estado> para que la timeline sea coherente aunque el
     teléfono no comparta el localStorage del presentador, y &lang=
     para que el teléfono abra en el mismo idioma que la proyección. */
  function urlCaja(id, estado) {
    return BASE_URL + "/caja.html?id=" + id + "&e=" + estado + "&lang=" + getLang();
  }

  /* Enlace relativo (misma máquina, respeta localStorage). */
  function hrefCaja(id) {
    return "caja.html?id=" + id;
  }

  /* ---------- resaltado de cambios recientes ----------
     Sin temporizadores ni flags en localStorage: cada elemento compara su
     propio "changedAt" contra el estado actual en cada render. Solo el
     paso más reciente queda marcado "nuevo"; al avanzar un estado más,
     el elemento vuelve a su estilo normal por sí solo. */
  function nuevoTag() { return ' <span class="nuevo-tag">' + t("nuevo") + "</span>"; }

  function claseSiNuevo(cond) { return cond ? "nuevo" : ""; }

  /* Campo del expediente según matriz de permisos.
     resaltar=true marca el campo como recién cambiado en este estado. */
  function campo(rol, key, etiqueta, valor, resaltar) {
    var visible = PERMISOS[rol][key];
    return '<div class="campo ' + claseSiNuevo(resaltar) + '">' +
      '<span class="campo-k">' + etiqueta + "</span>" +
      (visible
        ? '<span class="campo-v">' + valor + (resaltar ? nuevoTag() : "") + "</span>"
        : '<span class="campo-v oculto" title="' + t("campo_oculto_title") + '">' + t("campo_oculto_texto") + "</span>") +
      "</div>";
  }

  /* Log del expediente (append-only, derivado del estado actual).
     Cada evento lleva el número de estado en que ocurrió (para resaltar
     solo la fila más reciente) y un tipo explícito ('normal' | 'alerta' |
     'resuelta') para la clasificación visual — así no depende del texto
     traducido de la acción. */
  var IDX_ALERTA_ABIERTA = ESTADOS.findIndex(function (e) { return e.key === "recibido_agencia"; });
  /* La alerta se resuelve justo antes de emitir el CFE — mismo estado. */
  var IDX_ALERTA_RESUELTA = IDX_CFE_EMITIDO;

  function buildLog(estado) {
    var eventos = [];
    for (var i = 0; i < estado; i++) {
      var ev = ESTADOS[i].evento;
      /* La resolución de la alerta es requisito previo a la emisión del
         CFE, así que en ese estado se registra ANTES del evento principal
         (orden cronológico: primero se resuelve, luego se emite el CFE). */
      if (i === IDX_ALERTA_RESUELTA) {
        eventos.push({
          estado: IDX_ALERTA_RESUELTA + 1,
          hora: ALERTA.resuelta.hora,
          actor: ALERTA.resuelta.actor,
          accion: t("alerta_resuelta_accion"),
          lugar: ALERTA.resuelta.lugar,
          tipo: "resuelta"
        });
      }
      eventos.push({
        estado: i + 1,
        hora: ev.hora,
        actor: ev.actor,
        accion: t("estado_evento_" + ESTADOS[i].key),
        lugar: ev.lugar,
        tipo: "normal"
      });
      if (i === IDX_ALERTA_ABIERTA) {
        eventos.push({
          estado: IDX_ALERTA_ABIERTA + 1,
          hora: ALERTA.abierta.hora,
          actor: t("sistema_actor", { app: APP_NAME }),
          accion: t("alerta_abierta_accion"),
          lugar: ALERTA.abierta.lugar,
          tipo: "alerta"
        });
      }
    }
    return eventos;
  }

  /* estadoActual se usa solo para resaltar la fila recién agregada. */
  function tablaLog(eventos, estadoActual) {
    if (!eventos.length) return '<p class="vacio">' + t("vacio_sin_eventos") + "</p>";
    return '<table class="tabla"><thead><tr><th>' + t("tabla_hora") + "</th><th>" + t("tabla_actor") + "</th><th>" + t("tabla_accion") + "</th><th>" + t("tabla_ubicacion") + "</th></tr></thead><tbody>" +
      eventos.map(function (e) {
        var esNueva = e.estado === estadoActual;
        var clases = (e.tipo === "alerta" ? "fila-alerta" : e.tipo === "resuelta" ? "fila-ok" : "") + " " + claseSiNuevo(esNueva);
        return '<tr class="' + clases + '">' +
          "<td>" + e.hora + "</td><td>" + e.actor + "</td><td>" + e.accion + (esNueva ? nuevoTag() : "") + "</td><td>" + e.lugar + "</td></tr>";
      }).join("") +
      "</tbody></table>";
  }

  /* Eventos de la cadena de custodia de una caja hasta el estado dado.
     Cada evento lleva el número de estado en que ocurrió. */
  function eventosCaja(idx, estado) {
    var out = [];
    for (var i = 0; i < estado; i++) {
      var ce = ESTADOS[i].cajaEvento;
      if (!ce) continue;
      out.push({
        estado: i + 1,
        hora: sumaMinutos(ce.hora, ce.esEscaneo ? (idx % 7) : 0),
        actor: ce.actor,
        accion: t("caja_evento_" + ESTADOS[i].key),
        lugar: ce.lugar,
        esEscaneo: ce.esEscaneo
      });
    }
    return out;
  }

  function ultimoEscaneo(idx, estado) {
    var evs = eventosCaja(idx, estado).filter(function (e) { return e.esEscaneo; });
    return evs.length ? evs[evs.length - 1] : null;
  }

  /* Banner de alerta según estado (pestañas Finca, Agencia, Expoflores).
     Cada variante solo se muestra en el estado exacto en que aparece, así
     que siempre lleva la marca "nuevo" mientras está visible. */
  function bannerAlerta(estado) {
    if (estado === IDX_ALERTA_ABIERTA + 1) {
      return '<div class="banner banner-alerta nuevo">⚠ <strong>' + t("alerta_activa_label") + "</strong> " + t("alerta_texto_abierta") + nuevoTag() + "</div>";
    }
    if (estado === IDX_ALERTA_RESUELTA + 1) {
      return '<div class="banner banner-ok nuevo">✔ <strong>' + t("alerta_texto_resuelta") + "</strong> " + t("alerta_archivada_sufijo") + nuevoTag() + "</div>";
    }
    return "";
  }

  /* QRs: los slots llevan data-url y data-size; se montan tras el render. */
  function slotQR(url, size) {
    return '<div class="qr-slot" data-url="' + url + '" data-size="' + size + '"></div>';
  }

  function montarQRs(scope) {
    $all(".qr-slot", scope).forEach(function (slot) {
      slot.innerHTML = "";
      if (typeof QRCode === "undefined") {
        slot.textContent = t("qr_no_disponible");
        slot.classList.add("qr-fallback");
        return;
      }
      new QRCode(slot, {
        text: slot.getAttribute("data-url"),
        width: parseInt(slot.getAttribute("data-size"), 10) || 72,
        height: parseInt(slot.getAttribute("data-size"), 10) || 72,
        correctLevel: QRCode.CorrectLevel.M
      });
    });
  }

  /* Toast. */
  var toastTimer = null;
  function toast(msg) {
    var elt = $("#toast");
    if (!elt) return;
    elt.textContent = msg;
    elt.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { elt.classList.remove("visible"); }, 4200);
  }

  /* =====================================================================
     PÁGINA: index
     ===================================================================== */

  function initIndex() {
    var slot = $("#qr-demo");
    if (slot) {
      slot.setAttribute("data-url", BASE_URL + "/demo.html");
      slot.setAttribute("data-size", "220");
      slot.classList.add("qr-slot");
      montarQRs(document);
    }
  }

  /* =====================================================================
     PÁGINA: demo
     ===================================================================== */

  /* Cada nodo es un <button> real (navegable, activable con Enter/Espacio).
     El nodo del estado actual lleva aria-current pero no responde al click:
     irA() no hace nada cuando el destino es igual al estado actual. */
  function renderProgreso(estado) {
    var ol = $("#progreso");
    ol.innerHTML = ESTADOS.map(function (e, i) {
      var n = i + 1;
      var actual = n === estado;
      var cls = n < estado ? "hecho" : actual ? "actual" : "pendiente";
      var nombre = t("estado_nombre_" + e.key);
      var label = t("nodo_ir_a_estado", { n: n, nombre: nombre });
      return '<li class="' + cls + '"><button class="nodo-btn" data-estado="' + n + '"' +
        (actual ? ' aria-current="step"' : '') +
        ' title="' + label + '" aria-label="' + label + '">' +
        '<span class="nodo">' + (n < estado ? "✓" : n) + "</span>" +
        '<span class="nodo-label">' + nombre + "</span></button></li>";
    }).join("");
  }

  /* ---------- Pestaña 1 · Finca ---------- */

  function htmlFinca(estado) {
    var p = PEDIDO;
    var editable = estado < 2;
    var html = "";
    var descripcion = t("producto_descripcion");
    var tallosTotal = (p.producto.cajas * p.producto.tallosPorCaja).toLocaleString("en-US") + " " + t("unidad_tallos");

    html += bannerAlerta(estado);

    html += '<div class="panel ' + claseSiNuevo(estado === 1) + '"><div class="panel-cabecera"><h2>' + t("expediente_titulo", { id: p.id }) + "</h2>" +
      '<button class="btn btn-sec ' + claseSiNuevo(estado === 2) + '" disabled title="' +
      (editable ? t("title_accion_simulada") : t("title_edicion_bloqueada")) +
      '">' + (editable ? t("btn_editar_pedido") : t("btn_edicion_bloqueada")) + (estado === 2 ? nuevoTag() : "") + "</button></div>" +
      '<div class="campos">' +
      campo("finca", "finca", t("label_finca"), p.finca.nombre + " · " + p.finca.ubicacion) +
      campo("finca", "finca", t("label_operador_guia"), p.finca.operador + " · " + t("finca_bpa_vigente")) +
      campo("finca", "cliente", t("label_cliente"), p.cliente.nombre + " · " + p.cliente.ciudad) +
      campo("finca", "monto", t("label_monto"), p.monto) +
      campo("finca", "producto", t("label_producto"), t("campo_producto_resumen", { descripcion: descripcion, cajas: p.producto.cajas, tallosPorCaja: p.producto.tallosPorCaja, total: tallosTotal })) +
      campo("finca", "peso", t("label_peso_declarado"), p.producto.pesoDeclarado + (estado >= IDX_ALERTA_ABIERTA + 1 ? ' · <span class="dato-alerta">' + t("palabra_escaneado") + " " + p.producto.pesoEscaneado + "</span>" : ""), estado === IDX_ALERTA_ABIERTA + 1) +
      campo("finca", "logistica", t("label_agencia_carga"), p.agencia.nombre + " · " + p.agencia.agente) +
      campo("finca", "logistica", t("label_awb_hawb"), p.awb + " / " + p.hawb) +
      campo("finca", "logistica", t("label_dae_destino_vuelo"), p.dae + " · " + p.destino + " · " + p.vuelo) +
      "</div></div>";

    /* Documentos */
    html += '<div class="panel"><h3>' + t("documentos_titulo") + '</h3><ul class="docs">' +
      '<li class="' + claseSiNuevo(estado === 2) + '">' + t("doc_factura_prefix") + " " + p.monto + " — " + (estado === 1 ? t("doc_factura_borrador") : t("doc_factura_registrada")) + (estado === 2 ? nuevoTag() : "") + "</li>" +
      '<li class="' + claseSiNuevo(estado === 3) + '">' + (estado >= 3 ? t("doc_etiquetas_emitidas") + (estado === 3 ? nuevoTag() : "") : '<span class="pendiente-doc">' + t("doc_etiquetas_pendientes") + "</span>") + "</li>" +
      '<li class="' + claseSiNuevo(estado === IDX_CFE_EMITIDO + 1) + '">' + (estado >= IDX_CFE_EMITIDO + 1 ? t("doc_cfe_emitido", { numero: p.cfe.numero, ephyto: p.cfe.ephyto }) + (estado === IDX_CFE_EMITIDO + 1 ? nuevoTag() : "") : '<span class="pendiente-doc">' + t("doc_cfe_pendiente") + "</span>") + "</li>" +
      "</ul></div>";

    /* Cajas con QR */
    var cajasResaltar = estado === 1 || estado === 3;
    html += '<div class="panel ' + claseSiNuevo(cajasResaltar) + '"><h3>' + t("cajas_titulo") + "</h3>" +
      '<details><summary>' + t("resumen_ver_cajas") + (cajasResaltar ? nuevoTag() : "") + '</summary><div class="grid-cajas">' +
      CAJAS.map(function (c) {
        return '<a class="caja-card" href="' + hrefCaja(c.id) + '">' +
          slotQR(urlCaja(c.id, estado), 72) +
          '<span class="caja-id">' + c.id + "</span>" +
          '<span class="caja-etq">' + (estado >= 3 ? c.etiqueta : t("sin_etiqueta")) + "</span></a>";
      }).join("") +
      "</div></details></div>";

    /* Historial — se resalta solo la fila más reciente, no todo el panel */
    var logFinca = buildLog(estado);
    html += '<div class="panel"><h3>' + t("historial_titulo") + '</h3>' +
      '<details><summary>' + t("resumen_historial", { n: logFinca.length }) + '</summary>' + tablaLog(logFinca, estado) + "</details></div>";

    return html;
  }

  function renderFinca(estado) {
    $("#tab-finca").innerHTML = htmlFinca(estado);
  }

  /* ---------- Pestaña 2 · Expoflores ---------- */

  function htmlExpoflores(estado) {
    var alertaAbierta = estado === IDX_ALERTA_ABIERTA + 1;
    var alertaResuelta = estado === IDX_ALERTA_RESUELTA + 1;
    var alertas = alertaAbierta ? AGREGADOS.alertasAbiertas + 1 : AGREGADOS.alertasAbiertas;
    var flag = alertaAbierta
      ? '<span class="flag flag-alerta">' + t("flag_alerta_peso") + "</span>"
      : estado >= 5 ? '<span class="flag flag-ok">' + t("flag_sin_alertas") + "</span>" : '<span class="flag">—</span>';

    var html = "";
    html += bannerAlerta(estado);

    html += '<div class="nota-gobernanza">' + t("nota_gobernanza") + "</div>";

    html += '<div class="kpis">' +
      kpi(AGREGADOS.pedidosActivos, t("kpi_pedidos_activos")) +
      kpi(AGREGADOS.cajasEtiquetadasHoy, t("kpi_cajas_etiquetadas")) +
      kpi(String(alertas), t("kpi_alertas_abiertas"), alertaAbierta ? "kpi-alerta" : "", alertaAbierta || alertaResuelta) +
      kpi(AGREGADOS.tiempoPromedio, t("kpi_tiempo_promedio")) +
      "</div>";

    /* La celda "Estado" cambia en cada paso — se resalta siempre. Lleva
       además "nuevo-constante": no es un cambio puntual (changedAt de un
       estado específico), sino un resaltado permanente, así que el punto
       de "pestaña sin ver" de la pestaña no debe contarlo como cambio.
       "Alertas" solo cuando la alerta se abre o se resuelve. */
    html += '<div class="panel"><h3>' + t("pedidos_titulo") + '</h3>' +
      '<table class="tabla"><thead><tr><th>' + t("tabla_pedido") + "</th><th>" + t("tabla_estado") + "</th><th>" + t("tabla_alertas") + "</th><th>" + t("tabla_cliente") + "</th><th>" + t("tabla_monto") + "</th></tr></thead><tbody>" +
      "<tr><td><strong>" + PEDIDO.id + "</strong></td>" +
      '<td class="nuevo nuevo-constante">' + t("estado_nombre_" + ESTADOS[estado - 1].key) + " (" + estado + "/" + ESTADOS.length + ")" + nuevoTag() + "</td>" +
      '<td class="' + claseSiNuevo(alertaAbierta || alertaResuelta) + '">' + flag + (alertaAbierta || alertaResuelta ? nuevoTag() : "") + "</td>" +
      '<td><span class="oculto">' + t("oculto_simple") + "</span></td>" +
      '<td><span class="oculto">' + t("oculto_simple") + "</span></td></tr>" +
      "</tbody></table>" +
      '<p class="nota-tabla">' + t("nota_gremio") + "</p></div>";

    return html;
  }

  function renderExpoflores(estado) {
    $("#tab-expoflores").innerHTML = htmlExpoflores(estado);
  }

  function kpi(valor, etiqueta, extra, resaltar) {
    return '<div class="kpi ' + (extra || "") + " " + claseSiNuevo(resaltar) + '"><span class="kpi-valor">' + valor + '</span><span class="kpi-etiqueta">' + etiqueta + (resaltar ? nuevoTag() : "") + "</span></div>";
  }

  /* ---------- Pestaña 3 · Agencia de carga ---------- */

  function htmlAgencia(estado) {
    var p = PEDIDO;
    var html = "";
    var descripcion = t("producto_descripcion");
    var tallosTotal = (p.producto.cajas * p.producto.tallosPorCaja).toLocaleString("en-US") + " " + t("unidad_tallos");

    html += bannerAlerta(estado);

    html += '<div class="panel ' + claseSiNuevo(estado === 1) + '"><div class="panel-cabecera"><h2>' + t("agencia_titulo", { agencia: p.agencia.nombre, id: p.id }) + "</h2>" +
      '<button id="btn-escanear-agencia" class="btn btn-pri ' + claseSiNuevo(estado === 3) + '" ' + (estado === 3 ? "" : "disabled") +
      ' title="' + (estado === 3 ? t("title_simular_escaneo") : t("title_escaneo_no_disponible")) + '">' +
      t("btn_escanear_recepcion") + (estado === 3 ? nuevoTag() : "") + "</button></div>" +
      '<p class="nota-tabla">' + t("nota_escaneo_mecanismo") + '</p>' +
      '<div class="campos">' +
      campo("agencia", "finca", t("label_finca"), p.finca.nombre + " · " + p.finca.ubicacion) +
      campo("agencia", "cliente", t("label_consignatario"), p.cliente.nombre + " · " + p.cliente.ciudad) +
      campo("agencia", "producto", t("label_carga"), t("campo_carga_valor", { cajas: p.producto.cajas, descripcion: descripcion, total: tallosTotal })) +
      campo("agencia", "peso", t("label_peso"), p.producto.pesoDeclarado + " " + t("palabra_declarado") + (estado >= IDX_ALERTA_ABIERTA + 1 ? ' · <span class="dato-alerta">' + p.producto.pesoEscaneado + " " + t("palabra_escaneado") + "</span>" : ""), estado === IDX_ALERTA_ABIERTA + 1) +
      campo("agencia", "logistica", t("label_awb_hawb"), p.awb + " / " + p.hawb) +
      campo("agencia", "logistica", t("label_dae"), p.dae) +
      campo("agencia", "logistica", t("label_destino_vuelo"), p.destino + " · " + p.vuelo) +
      campo("agencia", "monto", t("label_monto_pedido"), p.monto) +
      "</div>";

    /* La paletizadora no consolida carga sin el CFE emitido: la línea
       deja explícita esa precondición y se resalta justo cuando se
       levanta, en el estado de paletizado. */
    var consolidacionAutorizada = estado >= IDX_PALETIZADO + 1;
    var consolidacionResaltar = estado === IDX_PALETIZADO + 1;
    html += '<div class="banner ' + (consolidacionAutorizada ? "banner-ok" : "banner-alerta") + " " + claseSiNuevo(consolidacionResaltar) + '">' +
      (consolidacionAutorizada ? t("consolidacion_autorizada", { numero: PEDIDO.cfe.numero }) : t("consolidacion_bloqueada")) +
      (consolidacionResaltar ? nuevoTag() : "") +
      "</div></div>";

    var logAgencia = buildLog(estado).filter(function (e) {
      return e.actor.indexOf("AeroCarga") === 0;
    });
    html += '<div class="panel"><h3>' + t("log_agencia_titulo") + '</h3>' +
      (logAgencia.length ? tablaLog(logAgencia, estado) : '<p class="vacio">' + t("vacio_sin_escaneos_agencia") + "</p>") +
      "</div>";

    return html;
  }

  function renderAgencia(estado) {
    $("#tab-agencia").innerHTML = htmlAgencia(estado);
  }

  /* ---------- Pestaña 4 · Agrocalidad (vista héroe) ---------- */

  function htmlAgrocalidad(estado) {
    var p = PEDIDO;
    var html = "";

    /* Datos comerciales siempre con candado — la neutralidad se VE. */
    html += '<div class="panel panel-compacto"><div class="campos campos-linea">' +
      campo("agrocalidad", "cliente", t("label_cliente"), p.cliente.nombre) +
      campo("agrocalidad", "monto", t("label_monto"), p.monto) +
      campo("agrocalidad", "finca", t("label_finca"), p.finca.nombre + " · " + p.finca.ubicacion) +
      campo("agrocalidad", "logistica", t("label_dae"), p.dae) +
      "</div></div>";

    /* a) Validación automática */
    html += '<div class="panel ' + claseSiNuevo(estado === 2) + '"><h3>' + t("validacion_titulo") + ' <span class="tag">' + t("tag_estado", { n: 2 }) + '</span>' + (estado === 2 ? nuevoTag() : "") + '</h3>' +
      (estado >= 2
        ? '<ul class="checks">' +
          '<li class="check-ok">' + t("check_operador", { operador: p.finca.operador }) + ' <span class="check-hora">08:05:12</span></li>' +
          '<li class="check-ok">' + t("check_bpa") + ' <span class="check-hora">08:05:14</span></li>' +
          '<li class="check-ok">' + t("check_variedad") + ' <span class="check-hora">08:05:15</span></li>' +
          '</ul><p class="nota-tabla">' + t("nota_simulacion_api") + '</p>'
        : '<p class="vacio">' + t("vacio_validacion") + '</p>') +
      "</div>";

    /* b) Emisión de etiquetas */
    html += '<div class="panel ' + claseSiNuevo(estado === 3) + '"><h3>' + t("emision_titulo") + ' <span class="tag">' + t("tag_estado", { n: 3 }) + '</span>' + (estado === 3 ? nuevoTag() : "") + '</h3>';
    if (estado >= 3) {
      html += '<p class="destacado">' + t("etiquetas_emitidas", { n: 24, total: p.tarifas.etiquetasTotal, detalle: p.tarifas.etiquetasDetalle }) + "</p>" +
        '<p class="nota-recaudo">' + t("nota_recaudo_prefix") + " " + t("agregados_recaudacion_dia") + "</p>" +
        '<details><summary>' + t("resumen_ver_etiquetas") + '</summary><div class="grid-cajas grid-cajas-chica">' +
        CAJAS.map(function (c) {
          return '<a class="caja-card" href="' + hrefCaja(c.id) + '">' +
            slotQR(urlCaja(c.id, estado), 64) +
            '<span class="caja-id">' + c.id + "</span>" +
            '<span class="caja-etq">' + c.etiqueta + "</span></a>";
        }).join("") +
        "</div></details>";
    } else {
      html += '<p class="vacio">' + t("vacio_etiquetas") + '</p>';
    }
    html += "</div>";

    /* c) Cadena de custodia — se resalta SOLO la fila cuyo último escaneo
       ocurrió en el estado actual, nunca el panel completo. */
    html += '<div class="panel"><h3>' + t("custodia_titulo") + ' <span class="tag-coral">' + t("tag_antinarcoticos") + '</span></h3>';
    if (estado >= 3) {
      html += '<details><summary>' + t("resumen_ver_custodia") + '</summary><table class="tabla"><thead><tr><th>' + t("tabla_caja") + "</th><th>" + t("tabla_etiqueta") + "</th><th>" + t("tabla_ultimo_escaneo") + "</th><th>" + t("tabla_actor") + "</th><th>" + t("tabla_lugar") + "</th><th>" + t("tabla_hora") + "</th></tr></thead><tbody>" +
        CAJAS.map(function (c, i) {
          var u = ultimoEscaneo(i, estado);
          var filaNueva = !!(u && u.estado === estado);
          return '<tr class="' + claseSiNuevo(filaNueva) + '"><td><a href="' + hrefCaja(c.id) + '">' + c.id + "</a></td>" +
            "<td>" + c.etiqueta + "</td>" +
            "<td>" + (u ? u.accion : "—") + (filaNueva ? nuevoTag() : "") + "</td>" +
            "<td>" + (u ? u.actor : "—") + "</td>" +
            "<td>" + (u ? u.lugar : "—") + "</td>" +
            "<td>" + (u ? u.hora : "—") + "</td></tr>";
        }).join("") +
        "</tbody></table></details>";
    } else {
      html += '<p class="vacio">' + t("vacio_custodia") + '</p>';
    }
    html += "</div>";

    /* d) Certificación — el CFE requiere la discrepancia de peso resuelta;
       en el estado en que se detecta (recibido_agencia) queda bloqueado,
       y se emite en el estado siguiente (cfe_emitido), antes del
       paletizado. */
    html += '<div class="panel ' + claseSiNuevo(estado === IDX_CFE_EMITIDO + 1) + '"><h3>' + t("certificacion_titulo") + ' <span class="tag">' + t("tag_estado", { n: IDX_CFE_EMITIDO + 1 }) + '</span>' + (estado === IDX_CFE_EMITIDO + 1 ? nuevoTag() : "") + '</h3>';
    if (estado >= IDX_CFE_EMITIDO + 1) {
      html += '<p class="check-ok">' + t("certificacion_requisito_cumplido") + '</p>' +
        '<div class="banner banner-ok">' + t("cfe_emitido", { cfe: p.tarifas.cfe, numero: p.cfe.numero, ephyto: p.cfe.ephyto }) + "</div>" +
        '<div class="cardinalidad"><span>' + t("cardinalidad_pedido") + '</span><span class="flecha">→</span><span>' + t("cardinalidad_cfe") + '</span><span class="flecha">→</span><span>' + t("cardinalidad_etiquetas") + "</span></div>";
    } else if (estado === IDX_ALERTA_ABIERTA + 1) {
      html += '<div class="banner banner-alerta nuevo">' + t("certificacion_bloqueada") + nuevoTag() + "</div>";
    } else {
      html += '<p class="vacio">' + t("vacio_certificacion") + '</p>';
    }
    html += "</div>";

    return html;
  }

  function renderAgrocalidad(estado) {
    $("#tab-agrocalidad").innerHTML = htmlAgrocalidad(estado);
  }

  /* ---------- pestañas con cambios sin ver ----------
     Deriva, sin tablas escritas a mano, si una pestaña tiene algún elemento
     resaltado (.nuevo) en el estado dado: renderiza esa pestaña fuera del
     DOM visible y revisa si quedó algo marcado "nuevo". Se excluyen los
     elementos ocultos por permisos (.oculto) y los resaltados permanentes
     marcados "nuevo-constante" (no son un cambio puntual del estado). */

  var TAB_HTML_BUILDERS = {
    finca: htmlFinca,
    expoflores: htmlExpoflores,
    agencia: htmlAgencia,
    agrocalidad: htmlAgrocalidad
  };

  function tabTieneCambios(tab, estado) {
    var builder = TAB_HTML_BUILDERS[tab];
    if (!builder) return false;
    var scratch = document.createElement("div");
    scratch.innerHTML = builder(estado);
    var nuevos = scratch.querySelectorAll(".nuevo");
    for (var i = 0; i < nuevos.length; i++) {
      var el = nuevos[i];
      if (el.classList.contains("nuevo-constante")) continue;
      if (!el.querySelector(".oculto")) return true;
    }
    return false;
  }

  /* mostrarPunto(pestaña) = tieneCambios(estadoActual) && !vista && !activa.
     Sin resaltado alguno en el estado 1: nada ha cambiado todavía. */
  function mostrarPunto(tab, estado, activa, vistas) {
    if (estado <= 1) return false;
    if (tab === activa) return false;
    if (vistas.indexOf(tab) !== -1) return false;
    return tabTieneCambios(tab, estado);
  }

  function renderPuntos() {
    var estado = getEstado();
    var vistas = getVistas();
    var activa = localStorage.getItem(KEY_TAB) || "finca";
    TABS.forEach(function (tab) {
      var btn = $('.tabs button[data-tab="' + tab + '"]');
      if (!btn) return;
      var punto = btn.querySelector(".punto-cambio");
      if (!punto) return;
      var mostrar = mostrarPunto(tab, estado, activa, vistas);
      punto.classList.toggle("visible", mostrar);
      if (mostrar) btn.setAttribute("aria-describedby", punto.id);
      else btn.removeAttribute("aria-describedby");
    });
  }

  /* ---------- orquestación demo ---------- */

  function renderDemo() {
    var estado = getEstado();
    document.title = t("titulo_demo", { id: PEDIDO.id });
    $("#sim-estado").innerHTML = t("estado_actual", { n: estado, nombre: t("estado_nombre_" + ESTADOS[estado - 1].key) });
    $("#btn-avanzar").disabled = estado >= ESTADOS.length;
    renderProgreso(estado);
    renderFinca(estado);
    renderExpoflores(estado);
    renderAgencia(estado);
    renderAgrocalidad(estado);
    montarQRs(document);
    activarTab(localStorage.getItem(KEY_TAB) || "finca");
  }

  function activarTab(tab) {
    if (TABS.indexOf(tab) === -1) tab = "finca";
    localStorage.setItem(KEY_TAB, tab);
    marcarVista(tab);
    $all(".tabs button").forEach(function (b) {
      b.classList.toggle("activa", b.getAttribute("data-tab") === tab);
    });
    TABS.forEach(function (tb) {
      $("#tab-" + tb).classList.toggle("visible", tb === tab);
    });
    renderPuntos();
  }

  /* Salta a cualquier estado (adelante o atrás), sin confirmación. Mismo
     mecanismo que "Avanzar": vacía pestañasVistas, re-renderiza todo desde
     cero (nada se acumula) y muestra el toast del estado DESTINO. Un salto
     al estado ya actual no hace nada — así el nodo actual "no responde al
     click" sin necesidad de deshabilitar el botón. */
  function irA(n) {
    if (n < 1 || n > ESTADOS.length) return;
    if (n === getEstado()) return;
    setEstado(n);
    setVistas([localStorage.getItem(KEY_TAB) || "finca"]);
    renderDemo();
    toast(t("estado_toast_" + ESTADOS[n - 1].key));
  }

  function avanzar() {
    irA(getEstado() + 1);
  }

  function reiniciar() {
    setEstado(1);
    setVistas([]);
    renderDemo();
    toast(t("toast_reiniciado"));
  }

  function initDemo() {
    $("#btn-avanzar").addEventListener("click", avanzar);
    $("#btn-reiniciar").addEventListener("click", reiniciar);
    $all(".tabs button").forEach(function (b) {
      b.addEventListener("click", function () { activarTab(b.getAttribute("data-tab")); });
    });
    /* El botón de escaneo de la agencia y los nodos de la barra de progreso
       se re-crean en cada render: delegación de eventos. */
    document.addEventListener("click", function (ev) {
      var nodo = ev.target.closest && ev.target.closest(".nodo-btn");
      if (nodo) { irA(parseInt(nodo.getAttribute("data-estado"), 10)); return; }
      var btn = ev.target.closest && ev.target.closest("#btn-escanear-agencia");
      if (btn && !btn.disabled) avanzar();
    });
    document.addEventListener("trazaflor:langchange", renderDemo);
    renderDemo();
  }

  /* =====================================================================
     PÁGINA: caja
     ===================================================================== */

  function renderCaja() {
    var params = new URLSearchParams(location.search);
    var id = params.get("id") || "";
    var idx = CAJAS.findIndex(function (c) { return c.id === id; });
    var main = $("#caja-main");

    document.title = t("titulo_caja");

    if (idx === -1) {
      main.innerHTML = '<div class="panel"><h2>' + t("caja_no_encontrada_titulo") + "</h2>" +
        "<p>" + t("caja_no_encontrada_texto", { id: id.replace(/[<>&"]/g, ""), pedido: PEDIDO.id }) + "</p>" +
        '<p><a href="demo.html">' + t("volver_demo") + "</a></p></div>";
      return;
    }

    /* Estado: ?e= (QR escaneado desde otro dispositivo) > localStorage > 1 */
    var e = parseInt(params.get("e"), 10);
    var estado = e >= 1 && e <= ESTADOS.length ? e : getEstado();
    var caja = CAJAS[idx];
    var evs = eventosCaja(idx, estado);

    var html = '<div class="panel">' +
      '<p class="caja-pedido">' + t("caja_pedido_label", { id: PEDIDO.id }) + "</p>" +
      "<h2>" + caja.id + "</h2>" +
      '<div class="campos">' +
      '<div class="campo"><span class="campo-k">' + t("label_etiqueta_agrocalidad") + '</span><span class="campo-v">' + (estado >= 3 ? caja.etiqueta : t("etiqueta_aun_no_emitida")) + "</span></div>" +
      '<div class="campo"><span class="campo-k">' + t("label_finca") + '</span><span class="campo-v">' + PEDIDO.finca.nombre + " · " + PEDIDO.finca.ubicacion + "</span></div>" +
      '<div class="campo"><span class="campo-k">' + t("label_producto") + '</span><span class="campo-v">' + t("campo_producto_simple", { descripcion: t("producto_descripcion"), tallos: PEDIDO.producto.tallosPorCaja }) + "</span></div>" +
      '<div class="campo"><span class="campo-k">' + t("label_cfe") + '</span><span class="campo-v">' + (estado >= IDX_CFE_EMITIDO + 1 ? PEDIDO.cfe.numero + " · " + PEDIDO.cfe.ephyto : t("cfe_pendiente_texto")) + "</span></div>" +
      "</div></div>";

    html += '<div class="panel"><h3>' + t("custodia_simple_titulo") + '</h3>';
    if (evs.length) {
      html += '<ol class="timeline">' + evs.map(function (ev2, i) {
        var esUltimo = i === evs.length - 1;
        return '<li class="' + (ev2.esEscaneo ? "tl-escaneo" : "tl-hito") + " " + claseSiNuevo(esUltimo) + '">' +
          '<span class="tl-hora">' + ev2.hora + "</span>" +
          '<span class="tl-accion">' + ev2.accion + (esUltimo ? nuevoTag() : "") + "</span>" +
          '<span class="tl-meta">' + ev2.actor + " · " + ev2.lugar + "</span></li>";
      }).join("") + "</ol>";
    } else {
      html += '<p class="vacio">' + t("vacio_sin_eventos") + '</p>';
    }
    html += '<p class="nota-tabla">' + t("estado_pedido_resumen", { n: estado, nombre: t("estado_nombre_" + ESTADOS[estado - 1].key) }) + "</p></div>";

    main.innerHTML = html;
  }

  function initCaja() {
    document.addEventListener("trazaflor:langchange", renderCaja);
    renderCaja();
  }

  /* =====================================================================
     Arranque
     ===================================================================== */

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    if (page === "index") initIndex();
    else if (page === "demo") initDemo();
    else if (page === "caja") initCaja();
  });
})();
