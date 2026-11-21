/*
  Supermercado 38 · funciones del sitio.
  Todo lo que la tienda puede cambiar (secciones, productos, ofertas, precios, horario,
  textos, avisos y mensajes de WhatsApp) vive en datos.js, que se edita desde el
  panel de la tienda (admin.html).
  Funciona en GitHub Pages y también abriendo los archivos directo en el navegador.
*/
(function () {
  'use strict';

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
  const pagina = (location.pathname.split('/').pop() || 'index.html').replace(/(\.html)?$/, '.html');

  /* ---------- Datos (o el borrador del panel, en la vista previa) ---------- */
  const vistaPrevia = new URLSearchParams(location.search).has('vista-previa');
  let D = window.S38;
  if (vistaPrevia) {
    try {
      const borrador = JSON.parse(localStorage.getItem('s38-borrador'));
      if (borrador && borrador.datos) D = borrador.datos;
    } catch (e) { /* sin borrador: se ve lo publicado */ }
  }
  if (!D) return;
  D.textos = D.textos || {};
  D.ubicacion = D.ubicacion || {};
  D.secciones = D.secciones || [];
  D.preguntas = D.preguntas || [];
  D.pizarras = D.pizarras || {};
  D.ofertas = D.ofertas || { lista: [] };
  D.ofertas.lista = D.ofertas.lista || [];
  D.kits = D.kits || [];
  D.horario = D.horario || [];

  /* ---------- Utilidades ---------- */
  const precio = (n) => Number(n).toFixed(2);
  const dinero = (n) => 'B/. ' + precio(n);
  const soloDigitos = (s) => String(s || '').replace(/\D/g, '');
  const digitosTel = soloDigitos(D.telefono);
  const numeroWA = soloDigitos(D.whatsapp) || (digitosTel.length === 8 ? '507' + digitosTel : digitosTel);
  const enlaceWA = (texto) => 'https://wa.me/' + numeroWA + (texto ? '?text=' + encodeURIComponent(texto) : '');
  const normalizar = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  const slug = (s) => normalizar(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const escapar = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icono = (nombre) => {
    const trazos = { mas: '<path d="M12 5v14M5 12h14"/>', menos: '<path d="M5 12h14"/>' };
    return '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true">' + trazos[nombre] + '</svg>';
  };
  const idSeccion = (s) => s.id || slug(s.nombre) || 'seccion';
  const textoCartel = (s) => s.cartel || s.nombre;
  const claseCartel = (s) => 'cartel cartel-' + (/^[a-z]+$/.test(s.color || '') ? s.color : 'carnes');

  /* Fotos: las originales tienen versiones WebP; las que sube el panel vienen en 600 y 1200 px */
  const ORIGINALES = ['carniceria', 'panaderia', 'fiestas', 'mascotas', 'variedades', 'fachada'];
  function htmlFoto(ruta, alt, tamanos, perezosa = true) {
    if (!ruta) return '';
    const carga = perezosa ? ' loading="lazy" decoding="async"' : '';
    const original = /^img\/([a-z0-9-]+)\.jpg$/.exec(ruta);
    if (original && ORIGINALES.includes(original[1])) {
      return '<picture><source type="image/webp" srcset="img/web/' + original[1] + '-600.webp 600w, img/web/' + original[1] + '-1200.webp 1200w" sizes="' + tamanos + '">' +
        '<img src="' + escapar(ruta) + '" alt="' + escapar(alt) + '"' + carga + '></picture>';
    }
    const chica = /-1200\.(jpe?g|webp|png)$/i.test(ruta) ? ruta.replace(/-1200\.(jpe?g|webp|png)$/i, '-600.$1') : '';
    return '<img src="' + escapar(ruta) + '"' + (chica ? ' srcset="' + escapar(chica) + ' 600w, ' + escapar(ruta) + ' 1200w" sizes="' + tamanos + '"' : '') +
      ' alt="' + escapar(alt) + '"' + carga + ' data-foto="' + escapar(ruta) + '">';
  }

  /* Precio conocido de un producto (pizarras, ofertas por unidad y productos de las secciones) */
  const preciosConocidos = new Map();
  const nombreOferta = (o) => (o.detalle && !o.porLibra ? o.nombre + ' (' + o.detalle.toLowerCase() + ')' : o.nombre);
  Object.values(D.pizarras).forEach((lista) => (lista || []).forEach((p) => { if (typeof p.precio === 'number') preciosConocidos.set(normalizar(p.nombre), p.precio); }));
  D.ofertas.lista.forEach((o) => { if (!o.porLibra && typeof o.precio === 'number') preciosConocidos.set(normalizar(nombreOferta(o)), o.precio); });
  D.secciones.forEach((s) => (s.productos || []).forEach((p) => {
    if (p && p.nombre && typeof p.precio === 'number' && !p.porLibra) preciosConocidos.set(normalizar(p.nombre), p.precio);
  }));

  /* ---------- Textos, teléfono, dirección y mapa ---------- */
  $$('[data-texto]').forEach((el) => { const t = D.textos[el.dataset.texto]; if (t) el.textContent = t; });
  if (D.telefono) $$('[data-tel]').forEach((el) => { el.textContent = D.telefono; });
  if (D.ubicacion.direccion) $$('[data-direccion]').forEach((el) => { el.textContent = D.ubicacion.direccion; });
  if (D.ubicacion.codigoPlus) {
    $$('[data-codigo-plus]').forEach((el) => { el.textContent = D.ubicacion.codigoPlus; });
    $$('[data-copiar]').forEach((b) => { b.dataset.copiar = (D.ubicacion.codigoPlus + ' ' + (D.ubicacion.localidad || '')).trim(); });
  }
  if (digitosTel) $$('a[href^="tel:"]').forEach((a) => { a.href = 'tel:+' + (digitosTel.length === 8 ? '507' : '') + digitosTel; });
  if (numeroWA) $$('a[href*="wa.me/"]').forEach((a) => { a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + numeroWA); });
  const { lat, lng } = D.ubicacion;
  if (typeof lat === 'number' && typeof lng === 'number') {
    $$('[data-mapa="waze"]').forEach((a) => { a.href = 'https://waze.com/ul?ll=' + lat + '%2C' + lng + '&navigate=yes'; });
    $$('[data-mapa="google"]').forEach((a) => { a.href = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + '%2C' + lng; });
    $$('iframe[data-mapa]').forEach((f) => {
      const [a, b] = (new URL(f.src).searchParams.get('q') || '').split(',').map(Number);
      if (Math.abs(a - lat) > 1e-5 || Math.abs(b - lng) > 1e-5) f.src = 'https://maps.google.com/maps?q=' + lat + ',' + lng + '&z=16&hl=es&output=embed';
    });
  }

  /* ---------- Menú del celular ---------- */
  const menuBoton = $('.menu-boton');
  const cerrarMenu = () => { document.body.classList.remove('menu-abierto'); if (menuBoton) menuBoton.setAttribute('aria-expanded', 'false'); };
  if (menuBoton) {
    menuBoton.addEventListener('click', () => {
      const abrir = menuBoton.getAttribute('aria-expanded') !== 'true';
      menuBoton.setAttribute('aria-expanded', String(abrir));
      document.body.classList.toggle('menu-abierto', abrir);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-abierto')) { cerrarMenu(); menuBoton.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('menu-abierto') && !e.target.closest('.cabecera')) cerrarMenu();
    });
  }
  $$('.menu a, .pie-enlaces a').forEach((a) => {
    if (a.getAttribute('href') === pagina) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Botón de WhatsApp: el cliente elige qué quiere hacer ---------- */
  const opcionesWA = D.opcionesWhatsapp || [];
  if (opcionesWA.length && typeof HTMLDialogElement === 'function') {
    const trazosWA = {
      comprar: '<path d="M3.5 9.5h17l-1.7 8.7a2 2 0 0 1-2 1.6H7.2a2 2 0 0 1-2-1.6z"/><path d="M8.5 9.5l3-5.5M15.5 9.5l-3-5.5M9.5 13.5v3M14.5 13.5v3"/>',
      encargar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h3"/>',
      averiguar: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.8-1.1 1.5v.5M12 16.6v.1"/>',
      imprimir: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v6.5H7zM17 12h.01"/>',
      otra: '<path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.45L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z"/>'
    };
    const dialogo = document.createElement('dialog');
    dialogo.className = 'wa-menu';
    dialogo.setAttribute('aria-labelledby', 'wa-menu-titulo');
    dialogo.innerHTML =
      '<div class="wa-menu-caja">' +
        '<div class="wa-menu-cabeza"><div><h2 id="wa-menu-titulo">¿Qué quieres hacer?</h2>' +
        '<p>Elige una opción y te abrimos WhatsApp con el mensaje listo para el ' + escapar(D.telefono) + '.</p>' +
        '<p class="estado" data-estado></p></div>' +
        '<button type="button" class="wa-menu-cerrar" aria-label="Cerrar">×</button></div>' +
        '<ul class="wa-opciones">' + opcionesWA.filter((o) => o && o.titulo).map((o) =>
          '<li><a class="wa-opcion" href="' + escapar(enlaceWA(o.mensaje)) + '" target="_blank" rel="noopener">' +
          '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true">' + (trazosWA[o.icono] || trazosWA.otra) + '</svg>' +
          '<span><strong>' + escapar(o.titulo) + '</strong><small>' + escapar(o.detalle) + '</small></span></a></li>'
        ).join('') + '</ul>' +
        '<p class="wa-menu-pie">¿Son varios productos? <a href="pedidos.html">Arma tu lista</a> y envíala de una vez.</p>' +
      '</div>';
    document.body.appendChild(dialogo);
    document.addEventListener('click', (e) => {
      const boton = e.target.closest('[data-wa-menu]');
      if (!boton) return;
      e.preventDefault();
      cerrarMenu();
      dialogo.showModal();
    });
    dialogo.addEventListener('click', (e) => {
      // Un clic fuera de la caja (en el fondo oscuro) o en la X cierra el menú.
      if (e.target === dialogo || e.target.closest('.wa-menu-cerrar')) dialogo.close();
      else if (e.target.closest('.wa-opcion')) setTimeout(() => dialogo.close(), 150);
    });
  }

  /* ---------- Abierto o cerrado (hora de Panamá, UTC−5 todo el año) ---------- */
  const horaPanama = () => {
    const ahora = new Date();
    return new Date(ahora.getTime() + (ahora.getTimezoneOffset() - 300) * 60000);
  };
  const hoyISO = () => {
    const f = horaPanama();
    return f.getFullYear() + '-' + String(f.getMonth() + 1).padStart(2, '0') + '-' + String(f.getDate()).padStart(2, '0');
  };
  const aMinutos = (hhmm) => { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + m; };
  const formatoHora = (hhmm) => {
    const [h, m] = String(hhmm).split(':').map(Number);
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + String(m).padStart(2, '0') + (h < 12 || h === 24 ? ' a.m.' : ' p.m.');
  };
  const horarioDia = (d) => (d && !d.cerrado ? formatoHora(d.abre) + ' a ' + formatoHora(d.cierra) : 'Cerrado');

  function estadoTienda() {
    const fecha = horaPanama();
    const dia = fecha.getDay();
    const minutos = fecha.getHours() * 60 + fecha.getMinutes();
    const hoy = D.horario[dia];
    if (hoy && !hoy.cerrado) {
      const abre = aMinutos(hoy.abre);
      const cierra = aMinutos(hoy.cierra);
      if (minutos >= abre && minutos < cierra) {
        const faltan = cierra - minutos;
        if (faltan <= 60) return { abierto: true, pronto: true, titulo: 'Abierto', detalle: 'cierra en ' + faltan + ' min' };
        return { abierto: true, titulo: 'Abierto', detalle: 'hasta las ' + formatoHora(hoy.cierra) };
      }
      if (minutos < abre) return { abierto: false, titulo: 'Cerrado', detalle: 'abre hoy a las ' + formatoHora(hoy.abre) };
    }
    for (let i = 1; i <= 7; i++) {
      const otro = D.horario[(dia + i) % 7];
      if (otro && !otro.cerrado) {
        const cuando = i === 1 ? 'mañana' : 'el ' + otro.dia.toLowerCase();
        return { abierto: false, titulo: 'Cerrado', detalle: 'abre ' + cuando + ' a las ' + formatoHora(otro.abre) };
      }
    }
    return { abierto: false, titulo: 'Cerrado', detalle: '' };
  }

  function pintarEstado() {
    const e = estadoTienda();
    $$('[data-estado]').forEach((el) => {
      el.classList.add('estado');
      el.classList.toggle('esta-abierto', e.abierto && !e.pronto);
      el.classList.toggle('cierra-pronto', !!e.pronto);
      el.classList.toggle('esta-cerrado', !e.abierto);
      el.innerHTML = '<strong>' + e.titulo + '</strong> <span>' + e.detalle + '</span>';
    });
    const hoy = horaPanama().getDay();
    $$('[data-dia]').forEach((fila) => {
      const esHoy = Number(fila.dataset.dia) === hoy;
      fila.classList.toggle('es-hoy', esHoy);
      const marca = $('.hoy', fila);
      if (esHoy && !marca) $('th', fila).insertAdjacentHTML('beforeend', '<span class="hoy">Hoy</span>');
      if (!esHoy && marca) marca.remove();
    });
  }

  $$('[data-horario]').forEach((tabla) => {
    const cuerpo = [1, 2, 3, 4, 5, 6, 0].filter((i) => D.horario[i]).map((i) =>
      '<tr data-dia="' + i + '"><th scope="row">' + escapar(D.horario[i].dia) + '</th><td>' + horarioDia(D.horario[i]) + '</td></tr>'
    ).join('');
    tabla.innerHTML = '<caption>Horario</caption><tbody>' + cuerpo + '</tbody>';
  });
  const resumenHorario = () => {
    const textos = D.horario.map(horarioDia);
    if (textos.length && textos.every((t) => t === textos[0])) return 'todos los días de ' + textos[0];
    const hoy = D.horario[horaPanama().getDay()];
    return hoy && !hoy.cerrado ? 'hoy de ' + horarioDia(hoy) : 'otro día: hoy está cerrado';
  };
  $$('[data-horario-resumen]').forEach((el) => { el.textContent = resumenHorario(); });
  pintarEstado();
  setInterval(pintarEstado, 60000);

  /* ---------- Aviso de la tienda (sale arriba en todas las páginas) ---------- */
  const aviso = D.aviso || {};
  if (aviso.texto && (!aviso.hasta || hoyISO() <= aviso.hasta)) {
    const cabecera = $('.cabecera');
    if (cabecera) cabecera.insertAdjacentHTML('afterend', '<div class="aviso-tienda" role="note"><div class="contenedor"><p>' + escapar(aviso.texto) + '</p></div></div>');
  }

  /* ---------- Aviso flotante ---------- */
  const tostada = document.createElement('div');
  tostada.className = 'tostada';
  tostada.setAttribute('role', 'status');
  tostada.setAttribute('aria-live', 'polite');
  document.body.appendChild(tostada);
  let tostadaReloj;
  function avisar(texto, accion) {
    tostada.textContent = '';
    const span = document.createElement('span');
    span.textContent = texto;
    tostada.appendChild(span);
    if (accion) {
      const el = document.createElement(accion.href ? 'a' : 'button');
      el.textContent = accion.texto;
      if (accion.href) el.href = accion.href;
      else { el.type = 'button'; el.addEventListener('click', () => { accion.hacer(); tostada.classList.remove('visible'); }); }
      tostada.appendChild(el);
    }
    tostada.classList.add('visible');
    clearTimeout(tostadaReloj);
    tostadaReloj = setTimeout(() => tostada.classList.remove('visible'), accion && !accion.href ? 6000 : 3500);
  }

  /* ---------- Mi lista (se guarda en este celular o computadora) ---------- */
  const CLAVE = 's38-lista';
  const leer = () => {
    try {
      const v = JSON.parse(localStorage.getItem(CLAVE));
      return Array.isArray(v) ? v.filter((i) => i && i.nombre && i.cantidad > 0) : [];
    } catch (e) { return []; }
  };
  let items = leer();
  const avisarCambio = () => {
    try { localStorage.setItem(CLAVE, JSON.stringify(items)); } catch (e) { /* modo privado: la lista vive solo en esta visita */ }
    document.dispatchEvent(new CustomEvent('lista:cambio'));
  };
  const Lista = {
    todos: () => items.slice(),
    cantidad: (nombre) => { const i = items.find((x) => x.id === normalizar(nombre)); return i ? i.cantidad : 0; },
    agregar(nombre, cantidad = 1, valor) {
      nombre = String(nombre).trim().replace(/\s+/g, ' ');
      if (!nombre) return;
      const id = normalizar(nombre);
      const existente = items.find((x) => x.id === id);
      const conocido = preciosConocidos.has(id) ? preciosConocidos.get(id) : null;
      if (existente) existente.cantidad = Math.min(existente.cantidad + cantidad, 999);
      else items.push({ id, nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1), cantidad: Math.min(cantidad, 999), precio: typeof valor === 'number' ? valor : conocido });
      avisarCambio();
    },
    fijar(nombre, cantidad, valor) {
      const id = normalizar(nombre);
      const existente = items.find((x) => x.id === id);
      if (!existente) { if (cantidad > 0) Lista.agregar(nombre, cantidad, valor); return; }
      if (cantidad <= 0) items = items.filter((x) => x.id !== id);
      else existente.cantidad = Math.min(cantidad, 999);
      avisarCambio();
    },
    vaciar() { items = []; avisarCambio(); },
    reponer(copia) { items = copia.map((i) => Object.assign({}, i)); avisarCambio(); },
    productos: () => items.length
  };
  window.addEventListener('storage', (e) => { if (e.key === CLAVE) { items = leer(); document.dispatchEvent(new CustomEvent('lista:cambio')); } });

  const enlaceLista = pagina === 'pedidos.html' ? '#tu-lista' : 'pedidos.html#tu-lista';

  function pintarContadores(saltar) {
    const n = Lista.productos();
    $$('[data-contador]').forEach((el) => {
      el.textContent = n;
      el.hidden = n === 0;
      if (saltar) { el.classList.remove('salta'); void el.offsetWidth; el.classList.add('salta'); }
    });
    $$('[data-lista-enlace]').forEach((a) => a.setAttribute('aria-label', n ? 'Mi lista, ' + n + (n === 1 ? ' producto' : ' productos') : 'Mi lista, vacía'));
  }

  /* Botones + y − */
  const crearPaso = (nombre, valor, cantidad = Lista.cantidad(nombre)) =>
    '<div class="paso' + (cantidad > 0 ? ' tiene' : '') + '" data-paso data-nombre="' + escapar(nombre) + '"' + (typeof valor === 'number' ? ' data-precio="' + valor + '"' : '') + '>' +
      '<button type="button" class="paso-menos" aria-label="Quitar uno: ' + escapar(nombre) + '">' + icono('menos') + '</button>' +
      '<output aria-label="Cantidad en tu lista">' + cantidad + '</output>' +
      '<button type="button" class="paso-mas" aria-label="Agregar a mi lista: ' + escapar(nombre) + '">' + icono('mas') + '</button>' +
    '</div>';

  function pintarPasos() {
    $$('[data-paso]').forEach((p) => {
      const n = Lista.cantidad(p.dataset.nombre);
      p.classList.toggle('tiene', n > 0);
      $('output', p).textContent = n;
    });
    $$('[data-sugerir]').forEach((chip) => {
      const n = Lista.cantidad(chip.dataset.sugerir);
      chip.classList.toggle('en-lista', n > 0);
      chip.setAttribute('aria-pressed', String(n > 0));
      const badge = $('.chip-n', chip);
      if (badge) { badge.textContent = n; badge.hidden = n < 2; }
    });
  }

  document.addEventListener('click', (e) => {
    const mas = e.target.closest('.paso-mas');
    const menos = e.target.closest('.paso-menos');
    if (mas || menos) {
      const p = (mas || menos).closest('[data-paso]');
      const nombre = p.dataset.nombre;
      const valor = p.dataset.precio ? Number(p.dataset.precio) : undefined;
      const n = Lista.cantidad(nombre);
      if (mas) {
        Lista.fijar(nombre, n + 1, valor);
        avisar(nombre + ': ' + (n + 1) + ' en tu lista', { texto: 'Ver lista', href: enlaceLista });
      } else {
        const copia = Lista.todos();
        Lista.fijar(nombre, n - 1, valor);
        if (n - 1 <= 0) avisar('Quitaste ' + nombre, { texto: 'Deshacer', hacer: () => Lista.reponer(copia) });
      }
      return;
    }
    const chip = e.target.closest('[data-sugerir]');
    if (chip) {
      Lista.agregar(chip.dataset.sugerir, 1);
      avisar(chip.dataset.sugerir + ' en tu lista', { texto: 'Ver lista', href: enlaceLista });
    }
  });

  const chip = (nombre) => '<button type="button" class="chip" data-sugerir="' + escapar(nombre) + '" aria-pressed="false">' + escapar(nombre) + ' <span class="chip-n" hidden></span></button>';

  /* ---------- Productos con foto, precio y características ---------- */
  function htmlProducto(p) {
    const conPrecio = typeof p.precio === 'number';
    const unidad = p.porLibra ? 'la libra' : p.unidad;
    return '<article class="producto">' +
      (p.foto ? '<div class="producto-foto">' + htmlFoto(p.foto, p.nombre, '(min-width: 700px) 18rem, 50vw') + '</div>' : '') +
      '<div class="producto-cuerpo">' +
        '<h3>' + escapar(p.nombre) + '</h3>' +
        (conPrecio ? '<p class="producto-precio"><span>B/.</span> ' + precio(p.precio) + (unidad ? ' <small>' + escapar(unidad) + '</small>' : '') + '</p>' : '') +
        ((p.caracteristicas || []).length ? '<ul class="caracteristicas">' + p.caracteristicas.map((c) => '<li>' + escapar(c) + '</li>').join('') + '</ul>' : '') +
        '<div class="producto-acciones">' + crearPaso(p.nombre, conPrecio && !p.porLibra ? p.precio : undefined) +
          '<a class="enlace-boton" href="' + escapar(enlaceWA('Hola, ' + D.nombre + '. Quiero averiguar sobre: ' + p.nombre)) + '" target="_blank" rel="noopener">Preguntar</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }
  const productosDe = (s) => (s.productos || []).filter((p) => p && p.nombre);
  const pizarraHtml = (k) => (k === 'panaderia'
    ? '<div class="pizarra pizarra-depto" data-pizarra="panaderia"><h3 class="pizarra-titulo">Panadería</h3><ul class="pizarra-lista"></ul></div>'
    : '<div class="cartulina cartulina-depto" data-pizarra="' + escapar(k) + '"><h3 class="pizarra-titulo">Precios en la tienda</h3><ul class="pizarra-lista"></ul></div>');

  /* ---------- Portada: las vitrinas de la fachada ---------- */
  const frente = $('[data-frente]');
  if (frente && D.secciones.length) {
    const conFoto = D.secciones.filter((s) => s.foto && s.enPortada !== false).slice(0, 7);
    const sinFoto = D.secciones.filter((s) => !s.foto && s.enPortada !== false);
    const vitrinas = conFoto.map((s) =>
      '<a class="vitrina" href="' + escapar(s.enlace && s.enlace.url ? s.enlace.url : 'departamentos.html#' + idSeccion(s)) + '">' +
      '<span class="' + claseCartel(s) + '">' + escapar(textoCartel(s)) + '</span>' + htmlFoto(s.foto, '', '(min-width: 1000px) 10rem, 45vw', false) + '</a>'
    );
    if (sinFoto.length) {
      const primera = sinFoto[0];
      const resto = sinFoto.slice(1, 6);
      const lineas = (resto.length ? resto.map(textoCartel) : (primera.sugerencias || []).slice(0, 5)).map((t) => '<span>' + escapar(t) + '</span>');
      vitrinas.push('<a class="vitrina vitrina-texto" href="departamentos.html#' + escapar(idSeccion(primera)) + '"><span class="' + claseCartel(primera) + '">' +
        escapar(textoCartel(primera)) + '</span><span class="vitrina-lista">' + lineas.join('') + '</span></a>');
    }
    if (vitrinas.length) {
      $('[data-vitrinas]', frente).innerHTML = vitrinas.join('');
      const izq = Math.ceil(vitrinas.length / 2);
      const der = vitrinas.length - izq;
      frente.style.gridTemplateColumns = 'repeat(' + izq + ', minmax(0, 1fr)) minmax(0, 1.75fr)' + (der ? ' repeat(' + der + ', minmax(0, 1fr))' : '');
      $('.puerta', frente).style.gridColumn = String(izq + 1);
    }
  }

  /* ---------- Portada: destacados de la tienda ---------- */
  const destacados = $('[data-destacados]');
  if (destacados) {
    const lista = [];
    D.secciones.forEach((s) => productosDe(s).forEach((p) => { if (p.destacado) lista.push(p); }));
    destacados.hidden = !lista.length;
    if (lista.length) $('[data-destacados-lista]', destacados).innerHTML = lista.slice(0, 8).map(htmlProducto).join('');
  }

  /* ---------- Departamentos ---------- */
  const contSecciones = $('[data-secciones]');
  if (contSecciones) {
    const bloques = [];
    let tarjetas = [];
    const cerrarTarjetas = () => { if (tarjetas.length) { bloques.push('<div class="deptos-compactos">' + tarjetas.join('') + '</div>'); tarjetas = []; } };
    D.secciones.forEach((s) => {
      if (!s || !s.nombre) return;
      const id = escapar(idSeccion(s));
      const productos = productosDe(s);
      const desc = s.descripcion ? '<p>' + escapar(s.descripcion) + '</p>' : '';
      const pizarra = s.pizarra ? pizarraHtml(s.pizarra) : '';
      const enlace = s.enlace && s.enlace.url ? '<div class="acciones"><a class="boton" href="' + escapar(s.enlace.url) + '">' + escapar(s.enlace.texto || 'Ver más') + '</a></div>' : '';
      const chips = (s.sugerencias || []).length ? '<p class="depto-etiqueta">Suma a tu lista</p><div class="chips">' + s.sugerencias.map(chip).join('') + '</div>' : '';
      if (!s.foto && !productos.length) {
        tarjetas.push('<section class="depto-tarjeta" id="' + id + '" aria-labelledby="d-' + id + '"><span class="' + claseCartel(s) + '">' + escapar(textoCartel(s)) + '</span>' +
          '<div class="depto-tarjeta-cuerpo"><h2 class="h3" id="d-' + id + '">' + escapar(s.nombre) + '</h2>' + desc + pizarra + enlace + chips + '</div></section>');
        return;
      }
      cerrarTarjetas();
      const figura = s.foto
        ? '<figure class="depto-vitrina"><span class="' + claseCartel(s) + '">' + escapar(textoCartel(s)) + '</span>' + htmlFoto(s.foto, s.fotoTexto || 'Foto de ' + s.nombre, '(min-width: 860px) 34rem, 100vw') + '</figure>'
        : '<div class="depto-letrero"><span class="' + claseCartel(s) + '">' + escapar(textoCartel(s)) + '</span></div>';
      bloques.push('<section class="depto' + (s.foto ? '' : ' depto-sin-foto') + '" id="' + id + '" aria-labelledby="d-' + id + '">' + figura +
        '<div><h2 id="d-' + id + '">' + escapar(s.nombre) + '</h2>' + desc + pizarra + enlace + chips + '</div>' +
        (productos.length ? '<div class="productos">' + productos.map(htmlProducto).join('') + '</div>' : '') + '</section>');
    });
    cerrarTarjetas();
    contSecciones.innerHTML = bloques.join('') || '<p class="vacio">Todavía no hay secciones publicadas.</p>';
    const indice = $('[data-indice]');
    if (indice) indice.innerHTML = D.secciones.filter((s) => s && s.nombre).map((s) => '<a href="#' + escapar(idSeccion(s)) + '">' + escapar(s.nombre) + '</a>').join('');
    if (location.hash) {
      const destino = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (destino) requestAnimationFrame(() => destino.scrollIntoView());
    }
  }

  /* ---------- Preguntas frecuentes ---------- */
  function textoConEnlaces(t) {
    const valores = { horario: resumenHorario(), telefono: D.telefono || '', pagos: D.textos.pagos || '', direccion: D.ubicacion.direccion || '' };
    const lleno = String(t || '').replace(/\{(horario|telefono|pagos|direccion)\}/g, (m, k) => valores[k]).replace(/([^.])\.\.(?!\.)/g, '$1.');
    const texto = escapar(lleno);
    return texto.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, etiqueta, url) => {
      if (!/^(https?:\/\/|tel:|[\w-]+\.html(#[\w-]+)?$)/i.test(url)) return etiqueta;
      return '<a href="' + url + '"' + (/^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : '') + '>' + etiqueta + '</a>';
    });
  }
  const contPreguntas = $('[data-preguntas]');
  if (contPreguntas && D.preguntas.length) {
    contPreguntas.innerHTML = D.preguntas.filter((p) => p && p.pregunta).map((p) =>
      '<details><summary>' + escapar(p.pregunta) + '</summary><p>' + textoConEnlaces(p.respuesta) + '</p></details>'
    ).join('');
  }

  /* ---------- Pizarras con precios ---------- */
  $$('[data-pizarra]').forEach((caja) => {
    const lista = D.pizarras[caja.dataset.pizarra] || [];
    const ul = $('.pizarra-lista', caja);
    if (!ul) return;
    ul.innerHTML = lista.filter((p) => p && p.nombre && typeof p.precio === 'number').map((p) =>
      '<li class="pizarra-fila"><span class="pizarra-nombre">' + escapar(p.nombre) + '</span>' +
      '<span class="pizarra-precio">' + precio(p.precio) + '</span>' + crearPaso(p.nombre, p.precio) + '</li>'
    ).join('');
  });

  /* Resumen de pan en la página de panadería */
  const bolsa = $('[data-bolsa]');
  function pintarBolsa() {
    if (!bolsa) return;
    const nombres = new Set((D.pizarras.panaderia || []).map((p) => normalizar(p.nombre)));
    let unidades = 0; let suma = 0;
    Lista.todos().forEach((i) => { if (nombres.has(i.id)) { unidades += i.cantidad; suma += i.cantidad * (i.precio || 0); } });
    $('[data-bolsa-texto]', bolsa).innerHTML = unidades
      ? 'Llevas <strong>' + unidades + (unidades === 1 ? ' pieza' : ' piezas') + '</strong> de pan: <strong>' + dinero(suma) + '</strong>'
      : 'Toca + en la pizarra para armar tu bolsa de pan.';
  }

  /* Resumen de la lista junto a la pizarra */
  function pintarResumen() {
    $$('[data-resumen]').forEach((caja) => {
      const lista = Lista.todos();
      const n = lista.length;
      const conPrecio = lista.filter((i) => i.precio != null);
      const suma = conPrecio.reduce((s, i) => s + i.precio * i.cantidad, 0);
      $('[data-resumen-texto]', caja).innerHTML = n
        ? 'Tienes <strong>' + n + (n === 1 ? ' producto' : ' productos') + '</strong> en tu lista' +
          (conPrecio.length ? '. Lo que tiene precio suma <strong>' + dinero(suma) + '</strong>.' : '.')
        : 'Toca + en la pizarra para empezar tu lista.';
    });
  }

  /* ---------- Ofertas ---------- */
  const O = D.ofertas;
  const fechaLarga = new Intl.DateTimeFormat('es-PA', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  function periodoOfertas() {
    if (O.desde && O.hasta) {
      const a = new Date(O.desde + 'T12:00:00Z');
      const b = new Date(O.hasta + 'T12:00:00Z');
      const mismoMes = a.getUTCMonth() === b.getUTCMonth();
      return 'Del ' + (mismoMes ? a.getUTCDate() : fechaLarga.format(a)) + ' al ' + fechaLarga.format(b) + '. Hasta agotar existencias.';
    }
    return 'Precios de la semana. Hasta agotar existencias.';
  }
  const vencidas = () => !!O.hasta && O.hasta < hoyISO();
  $$('[data-ofertas]').forEach((caja) => {
    const limite = Number(caja.dataset.limite) || Infinity;
    const lista = O.lista.filter((o) => o && o.nombre && typeof o.precio === 'number').slice(0, limite);
    if (!lista.length || vencidas()) {
      caja.innerHTML = '<p class="vacio">Estamos preparando las ofertas de esta semana. Pregunta por la oferta del día en la tienda o por <a href="' + escapar(enlaceWA('Hola, ¿qué ofertas tienen esta semana?')) + '" target="_blank" rel="noopener">WhatsApp</a>.</p>';
      return;
    }
    caja.innerHTML = lista.map((o) =>
      '<article class="oferta' + (o.destacada ? ' oferta-destacada' : '') + '">' +
        (o.foto ? '<div class="oferta-foto">' + htmlFoto(o.foto, '', '(min-width: 640px) 16rem, 80vw') + '</div>' : '') +
        '<h3>' + escapar(o.nombre) + '</h3>' +
        (o.detalle ? '<p class="oferta-detalle">' + escapar(o.detalle) + '</p>' : '') +
        '<p class="oferta-precio"><small>B/.</small> ' + precio(o.precio) + (o.porLibra ? ' <small>la libra</small>' : '') + '</p>' +
        crearPaso(nombreOferta(o), o.porLibra ? undefined : o.precio) +
      '</article>'
    ).join('');
  });
  $$('[data-ofertas-nota]').forEach((el) => {
    if (vencidas() || !O.lista.length) { el.innerHTML = ''; return; }
    el.innerHTML = O.ejemplo
      ? '<span aria-hidden="true">✱</span><span><strong>Precios de muestra.</strong> Confirma el precio del día en la tienda o por WhatsApp antes de venir.</span>'
      : '<span aria-hidden="true">✱</span><span><strong>' + escapar(periodoOfertas()) + '</strong> Precios en balboas. El precio final es el de caja.</span>';
  });

  /* ---------- Mi lista: sugerencias por sección y listas armadas ---------- */
  $$('[data-grupos]').forEach((caja) => {
    const ancho = window.matchMedia('(min-width: 980px)').matches;
    const grupos = D.secciones.filter((s) => s && s.nombre).map((s) => {
      const vistos = new Set();
      const nombres = (s.sugerencias || []).concat(productosDe(s).map((p) => p.nombre)).filter((n) => {
        if (!n || vistos.has(normalizar(n))) return false;
        vistos.add(normalizar(n));
        return true;
      });
      return { titulo: s.nombre, nombres };
    }).filter((g) => g.nombres.length);
    caja.innerHTML = grupos.map((g, i) =>
      '<details class="grupo"' + (ancho || i === 0 ? ' open' : '') + '><summary>' + escapar(g.titulo) + '</summary><div class="chips">' + g.nombres.map(chip).join('') + '</div></details>'
    ).join('');
  });
  $$('[data-kits]').forEach((caja) => {
    const kits = D.kits.filter((k) => k && k.nombre && (k.productos || []).length);
    caja.innerHTML = kits.map((k, i) =>
      '<button type="button" class="kit" data-kit="' + i + '"><strong>' + escapar(k.nombre) + '</strong><span>' + k.productos.length + ' productos</span></button>'
    ).join('');
    caja.addEventListener('click', (e) => {
      const b = e.target.closest('[data-kit]');
      if (!b) return;
      const kit = kits[Number(b.dataset.kit)];
      const copia = Lista.todos();
      kit.productos.forEach(([nombre, cantidad]) => Lista.agregar(nombre, Number(cantidad) || 1));
      avisar('Agregamos ' + kit.productos.length + ' productos de «' + kit.nombre + '»', { texto: 'Deshacer', hacer: () => Lista.reponer(copia) });
    });
  });

  /* ---------- Página Mi lista ---------- */
  const panel = $('[data-pedido]');
  const formAgregar = $('[data-agregar]');
  if (formAgregar) {
    formAgregar.addEventListener('submit', (e) => {
      e.preventDefault();
      const campo = $('input', formAgregar);
      const texto = campo.value.trim();
      if (!texto) { avisar('Escribe el nombre de un producto'); campo.focus(); return; }
      Lista.agregar(texto, 1);
      avisar(texto + ' en tu lista', { texto: 'Ver lista', href: '#tu-lista' });
      campo.value = '';
      campo.focus();
    });
  }

  const DATOS = 's38-datos';
  function mensajeLista() {
    const f = panel ? new FormData($('[data-datos]', panel)) : new FormData();
    const lineas = ['Hola, ' + D.nombre + '. Quiero hacer este pedido:', ''];
    Lista.todos().forEach((i) => lineas.push('• ' + i.cantidad + ' ' + i.nombre + (i.precio != null ? ' (' + dinero(i.precio) + (i.cantidad > 1 ? ' c/u' : '') + ')' : '')));
    lineas.push('');
    if (f.get('nombre')) lineas.push('Nombre: ' + f.get('nombre'));
    if (f.get('entrega')) lineas.push(f.get('entrega'));
    if (f.get('cuando')) lineas.push('Lo necesito ' + f.get('cuando').toLowerCase() + '.');
    if (f.get('notas')) lineas.push('Notas: ' + f.get('notas'));
    lineas.push('', '¿Me confirman disponibilidad y el total? Gracias.');
    return lineas.join('\n').replace(/\n{3,}/g, '\n\n');
  }

  function pintarPanel() {
    if (!panel) return;
    const lista = Lista.todos();
    const ul = $('[data-items]', panel);
    // Si el foco estaba en un botón de la lista, vuelve al mismo producto después de redibujar.
    const activo = document.activeElement;
    let foco = null;
    if (activo && ul.contains(activo)) {
      const p = activo.closest('[data-paso]');
      foco = { nombre: p && p.dataset.nombre, mas: activo.classList.contains('paso-mas'), indice: $$('.item', ul).indexOf(activo.closest('.item')) };
    }
    ul.innerHTML = lista.map((i) =>
      '<li class="item"><span class="item-nombre">' + escapar(i.nombre) + '</span>' +
      (i.precio != null ? '<span class="item-precio">' + dinero(i.precio) + ' c/u</span>' : '<span class="item-precio">Precio en tienda</span>') +
      crearPaso(i.nombre, i.precio != null ? i.precio : undefined, i.cantidad) + '</li>'
    ).join('');
    if (foco) {
      const p = $$('[data-paso]', ul).find((x) => x.dataset.nombre === foco.nombre);
      let destino = p ? $(foco.mas ? '.paso-mas' : '.paso-menos', p) : null;
      if (!destino) {
        const filas = $$('.item', ul);
        const fila = filas[Math.min(foco.indice, filas.length - 1)];
        destino = fila ? $('.paso-menos', fila) : $('[data-agregar] input');
      }
      if (destino) destino.focus();
    }
    $('[data-vacia]', panel).hidden = lista.length > 0;
    const conPrecio = lista.filter((i) => i.precio != null);
    const suma = conPrecio.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const sub = $('[data-subtotal]', panel);
    sub.hidden = conPrecio.length === 0;
    sub.innerHTML = conPrecio.length === lista.length
      ? 'Suma según la pizarra: <strong>' + dinero(suma) + '</strong>. La tienda te confirma el total.'
      : 'Lo que tiene precio publicado suma <strong>' + dinero(suma) + '</strong>. El resto te lo confirma la tienda.';
    const enviar = $('[data-enviar]', panel);
    enviar.setAttribute('aria-disabled', String(lista.length === 0));
    enviar.href = lista.length ? enlaceWA(mensajeLista()) : '#tu-lista';
    $('[data-mensaje]', panel).textContent = lista.length ? mensajeLista() : 'Agrega productos y aquí verás el mensaje que le llega a la tienda.';
    $('[data-vaciar]', panel).hidden = lista.length === 0;
  }

  if (panel) {
    const form = $('[data-datos]', panel);
    try {
      const guardados = JSON.parse(localStorage.getItem(DATOS)) || {};
      Object.entries(guardados).forEach(([k, v]) => {
        const campos = form.elements[k];
        if (!campos) return;
        if (campos instanceof RadioNodeList) Array.from(campos).forEach((r) => { r.checked = r.value === v; });
        else campos.value = v;
      });
    } catch (e) { /* sin datos guardados */ }
    form.addEventListener('input', () => {
      const datos = {};
      new FormData(form).forEach((v, k) => { datos[k] = v; });
      try { localStorage.setItem(DATOS, JSON.stringify(datos)); } catch (e) { /* sin almacenamiento */ }
      pintarPanel();
    });
    form.addEventListener('submit', (e) => e.preventDefault());
    $('[data-enviar]', panel).addEventListener('click', (e) => {
      if (!Lista.productos()) {
        e.preventDefault();
        avisar('Agrega al menos un producto a tu lista');
        const campo = $('[data-agregar] input');
        if (campo) campo.focus();
        return;
      }
      e.currentTarget.href = enlaceWA(mensajeLista());
      avisar('Abrimos WhatsApp con tu lista. Solo tienes que tocar Enviar.');
    });
    $('[data-vaciar]', panel).addEventListener('click', () => {
      const copia = Lista.todos();
      Lista.vaciar();
      avisar('Vaciaste tu lista', { texto: 'Deshacer', hacer: () => Lista.reponer(copia) });
    });
  }

  /* ---------- Pedidos especiales ---------- */
  const especial = $('[data-especial]');
  if (especial) {
    const vista = $('[data-especial-mensaje]');
    const boton = $('[data-especial-enviar]');
    const mensajeEspecial = () => {
      const f = new FormData(especial);
      const intereses = f.getAll('interes');
      const fecha = f.get('fecha') ? new Intl.DateTimeFormat('es-PA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(f.get('fecha') + 'T12:00:00Z')) : '';
      const lineas = ['Hola, ' + D.nombre + '. Quiero hacer un pedido especial.', ''];
      lineas.push('Nombre: ' + (f.get('nombre') || '(sin indicar)'));
      if (f.get('contacto')) lineas.push('Contacto: ' + f.get('contacto'));
      lineas.push('Es para: ' + (f.get('tipo') || '(sin indicar)'));
      if (intereses.length) lineas.push('Me interesa: ' + intereses.join(', '));
      if (f.get('presupuesto')) lineas.push('Presupuesto: ' + f.get('presupuesto'));
      if (fecha) lineas.push('Lo necesito para el ' + fecha + '.');
      if (f.get('detalle')) lineas.push('', 'Detalle:', f.get('detalle'));
      lineas.push('', '¿Me confirman disponibilidad y precio? Gracias.');
      return lineas.join('\n');
    };
    const pintar = () => {
      vista.textContent = mensajeEspecial();
      boton.href = enlaceWA(mensajeEspecial());
    };
    const kit = new URLSearchParams(location.search).get('kit');
    if (kit) {
      const detalle = especial.elements.detalle;
      if (detalle && !detalle.value) detalle.value = 'Quiero opciones de ' + kit.toLowerCase() + '.';
    }
    especial.addEventListener('input', pintar);
    especial.addEventListener('change', pintar);
    boton.addEventListener('click', (e) => {
      if (!especial.reportValidity()) { e.preventDefault(); return; }
      boton.href = enlaceWA(mensajeEspecial());
      avisar('Abrimos WhatsApp con tu solicitud. Solo tienes que tocar Enviar.');
    });
    especial.addEventListener('submit', (e) => e.preventDefault());
    pintar();
  }

  /* ---------- Copiar código plus ---------- */
  $$('[data-copiar]').forEach((b) => b.addEventListener('click', () => {
    const texto = b.dataset.copiar;
    const listo = () => avisar('Copiado: ' + texto);
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(listo, () => avisar(texto));
    else {
      const t = document.createElement('textarea');
      t.value = texto; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); listo(); } catch (e) { avisar(texto); }
      t.remove();
    }
  }));

  /* ---------- Año del pie y datos para Google ---------- */
  $$('[data-anio]').forEach((el) => { el.textContent = horaPanama().getFullYear(); });
  $$('script[type="application/ld+json"]').forEach((s) => {
    try {
      const j = JSON.parse(s.textContent);
      if (D.telefono) j.telephone = '+507 ' + D.telefono;
      if (j.address && D.ubicacion.direccion) j.address.streetAddress = D.ubicacion.direccion.split(',')[0].trim();
      if (j.geo && typeof lat === 'number') { j.geo.latitude = lat; j.geo.longitude = lng; }
      const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const grupos = {};
      D.horario.forEach((d, i) => {
        if (!d || d.cerrado) return;
        const k = d.abre + '-' + d.cierra;
        (grupos[k] = grupos[k] || { '@type': 'OpeningHoursSpecification', dayOfWeek: [], opens: d.abre, closes: d.cierra }).dayOfWeek.push(dias[i]);
      });
      j.openingHoursSpecification = Object.values(grupos);
      s.textContent = JSON.stringify(j);
    } catch (e) { /* se queda el que trae la página */ }
  });

  /* ---------- Vista previa desde el panel ---------- */
  if (vistaPrevia) {
    $$('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!/^[\w-]+\.html([?#].*)?$/.test(href)) return;
      const [base, ancla] = href.split('#');
      a.setAttribute('href', base + (base.includes('?') ? '&' : '?') + 'vista-previa' + (ancla ? '#' + ancla : ''));
    });
    document.body.insertAdjacentHTML('afterbegin', '<div class="aviso-vista-previa" role="note"><div class="contenedor">' +
      '<p><strong>Vista previa.</strong> Así se verá la página con tus cambios; todavía no están publicados.</p>' +
      '<a class="boton boton-claro" href="admin.html">Volver al panel</a></div></div>');
    // Las fotos nuevas todavía no están en la página: se guardaron en este aparato.
    try {
      const pedido = indexedDB.open('s38-panel', 1);
      pedido.onupgradeneeded = () => pedido.result.createObjectStore('fotos');
      pedido.onsuccess = () => {
        const almacen = () => pedido.result.transaction('fotos').objectStore('fotos');
        $$('img[data-foto^="img/subidas/"]').forEach((img) => {
          const leida = almacen().get(img.dataset.foto);
          leida.onsuccess = () => { if (leida.result) { img.removeAttribute('srcset'); img.src = URL.createObjectURL(leida.result); } };
        });
      };
    } catch (e) { /* sin fotos guardadas */ }
  }

  /* ---------- Pintar todo y escuchar cambios ---------- */
  function pintarTodo(saltar) { pintarContadores(saltar); pintarPanel(); pintarPasos(); pintarBolsa(); pintarResumen(); }
  document.addEventListener('lista:cambio', () => pintarTodo(true));
  pintarTodo(false);
})();
