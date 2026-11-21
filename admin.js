/*
  Panel de la tienda · Supermercado 38
  La tienda cambia su página desde el celular: secciones y productos con foto, precio y
  características, ofertas, precios de pizarra, horario, aviso, mensajes de WhatsApp,
  textos y preguntas. Todo se guarda como borrador en este aparato y, al publicar, se sube
  a GitHub (Lulago3003/supermercado-38) con una clave de acceso que solo vive aquí.
*/
(function () {
  'use strict';

  /* ---------- Configuración ---------- */
  const REPO = { dueno: 'Lulago3003', nombre: 'supermercado-38', rama: 'main' };
  const API = 'https://api.github.com';
  const ARCHIVO = 'datos.js';
  const LLAVE = 's38-panel-clave';
  const BORRADOR = 's38-borrador';
  const ENCABEZADO = '/*\n  Datos de Supermercado 38 (三發 M/S 38), Arraiján.\n  Los escribe el panel de la tienda (admin.html). Si lo editas a mano, respeta el\n  formato JSON: comillas dobles y sin coma después del último elemento.\n*/\n';

  const app = document.getElementById('app');
  const barra = document.querySelector('[data-barra]');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clonar = (o) => JSON.parse(JSON.stringify(o));
  const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const normalizar = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const slug = (s) => normalizar(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const soloDigitos = (s) => String(s || '').replace(/\D/g, '');
  const precioTexto = (n) => (typeof n === 'number' && isFinite(n) ? n.toFixed(2) : '');
  const leerLocal = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const escribirLocal = (k, v) => {
    try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch (e) { return false; }
  };
  const obtener = (obj, ruta) => ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  function fijar(obj, ruta, valor) {
    const partes = ruta.split('.');
    const ultima = partes.pop();
    const destino = partes.reduce((o, k) => (o[k] == null ? (o[k] = {}) : o[k]), obj);
    destino[ultima] = valor;
  }

  /* ---------- Estado ---------- */
  let clave = leerLocal(LLAVE);
  let publicado = null;     // lo que hoy está en la página
  let sha = null;           // versión de datos.js en GitHub
  let datos = null;         // borrador que se está editando
  let notaInicio = '';      // aviso de conflicto al abrir
  let vistaViva = null;     // redibuja la vista previa de la pantalla actual
  let enfocarPrimero = false;
  let publicando = false;

  /* ---------- Íconos ---------- */
  const TRAZOS = {
    tienda: '<path d="M3.5 9.5 5 4h14l1.5 5.5M4.5 9.5v10h15v-10M9.5 19.5v-5h5v5M3.5 9.5h17"/>',
    oferta: '<path d="M3.5 12.5V4h8.5l8.5 8.5-8 8z"/><circle cx="8" cy="8.5" r="1.4"/>',
    pizarra: '<rect x="3.5" y="4.5" width="17" height="12" rx="1.5"/><path d="M7 8.5h6M7 12.5h10M9 20l3-3.5 3 3.5"/>',
    reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    aviso: '<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17.5 9.5a3.5 3.5 0 0 1 0 5"/>',
    chat: '<path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.45L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z"/>',
    texto: '<path d="M5 6.5h14M5 11h14M5 15.5h9"/>',
    lista: '<path d="M9.5 7h10M9.5 12h10M9.5 17h10M4 7l1.3 1.3L7.5 6M4 12l1.3 1.3L7.5 11M4 17l1.3 1.3L7.5 16"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    arriba: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    abajo: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    basura: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
    volver: '<path d="M15 18l-6-6 6-6"/>',
    comprar: '<path d="M3.5 9.5h17l-1.7 8.7a2 2 0 0 1-2 1.6H7.2a2 2 0 0 1-2-1.6z"/><path d="M8.5 9.5l3-5.5M15.5 9.5l-3-5.5M9.5 13.5v3M14.5 13.5v3"/>',
    encargar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h3"/>',
    averiguar: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.8-1.1 1.5v.5M12 16.6v.1"/>',
    imprimir: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v6.5H7zM17 12h.01"/>'
  };
  TRAZOS.otra = TRAZOS.chat;
  const icono = (n) => '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true">' + (TRAZOS[n] || TRAZOS.chat) + '</svg>';

  /* ---------- Texto en base64 (UTF-8) ---------- */
  function aBase64(texto) {
    const bytes = new TextEncoder().encode(texto);
    let binario = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binario += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(binario);
  }
  function deBase64(b64) {
    const binario = atob(String(b64).replace(/\s/g, ''));
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  const blobABase64 = (blob) => new Promise((ok, mal) => {
    const lector = new FileReader();
    lector.onload = () => ok(String(lector.result).split(',')[1]);
    lector.onerror = () => mal(lector.error);
    lector.readAsDataURL(blob);
  });

  /* ---------- GitHub ---------- */
  async function gh(ruta, opciones = {}) {
    let r;
    try {
      r = await fetch(API + ruta, {
        method: opciones.method || 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + clave, 'X-GitHub-Api-Version': '2022-11-28' },
        body: opciones.body ? JSON.stringify(opciones.body) : undefined
      });
    } catch (e) {
      const error = new Error('red');
      error.tipo = 'red';
      throw error;
    }
    if (!r.ok) {
      const error = new Error('GitHub ' + r.status);
      error.estado = r.status;
      try { error.detalle = (await r.json()).message; } catch (e) { /* sin detalle */ }
      throw error;
    }
    return r.json();
  }
  const rutaApi = (archivo) => '/repos/' + REPO.dueno + '/' + REPO.nombre + '/contents/' + archivo.split('/').map(encodeURIComponent).join('/');
  function interpretar(texto) {
    const inicio = texto.indexOf('{');
    const fin = texto.lastIndexOf('}');
    if (inicio < 0 || fin < inicio) { const e = new Error('formato'); e.tipo = 'formato'; throw e; }
    try { return JSON.parse(texto.slice(inicio, fin + 1)); } catch (e) { const error = new Error('formato'); error.tipo = 'formato'; throw error; }
  }
  async function traerPublicado() {
    const j = await gh(rutaApi(ARCHIVO) + '?ref=' + REPO.rama);
    return { sha: j.sha, datos: interpretar(deBase64(j.content)) };
  }
  const subirArchivo = (archivo, contenido, mensaje, shaActual) => gh(rutaApi(archivo), {
    method: 'PUT',
    body: Object.assign({ message: mensaje, content: contenido, branch: REPO.rama }, shaActual ? { sha: shaActual } : {})
  });
  function mensajeError(e) {
    if (e.tipo === 'red') return 'No hay conexión con GitHub. Revisa el internet y vuelve a intentar. Tus cambios siguen guardados en este aparato.';
    if (e.tipo === 'formato') return 'No se pudo leer el archivo de datos de la página (datos.js). Avísale a Luis.';
    if (e.estado === 401) return 'La clave de acceso no funciona: puede estar incompleta o vencida. Pídele una nueva a Luis.';
    if (e.estado === 403) return 'La clave no tiene permiso para cambiar la página. Pídele a Luis una con permiso para escribir (Contents: Read and write).';
    if (e.estado === 404) return 'La clave no tiene acceso a la página supermercado-38. Pídele a Luis que la revise.';
    return 'Algo salió mal (' + (e.estado || e.message) + '). Tus cambios siguen guardados en este aparato; vuelve a intentar en un rato.';
  }

  /* ---------- Fotos pendientes: viven en este aparato hasta publicar ---------- */
  const fotos = (() => {
    const memoria = new Map();
    let base = null;
    const abrir = () => new Promise((ok) => {
      if (base) { ok(base); return; }
      try {
        const pedido = indexedDB.open('s38-panel', 1);
        pedido.onupgradeneeded = () => pedido.result.createObjectStore('fotos');
        pedido.onsuccess = () => { base = pedido.result; ok(base); };
        pedido.onerror = () => ok(null);
      } catch (e) { ok(null); }
    });
    const operar = async (modo, hacer) => {
      const b = await abrir();
      if (!b) return null;
      return new Promise((ok, mal) => {
        const tx = b.transaction('fotos', modo);
        const pedido = hacer(tx.objectStore('fotos'));
        tx.oncomplete = () => ok(pedido ? pedido.result : null);
        tx.onerror = () => mal(tx.error);
      });
    };
    return {
      async guardar(ruta, blob) { memoria.set(ruta, blob); try { await operar('readwrite', (s) => s.put(blob, ruta)); } catch (e) { /* queda en memoria */ } },
      async leer(ruta) {
        if (memoria.has(ruta)) return memoria.get(ruta);
        try { const blob = await operar('readonly', (s) => s.get(ruta)); if (blob) memoria.set(ruta, blob); return blob || null; } catch (e) { return null; }
      },
      async borrar(ruta) { memoria.delete(ruta); try { await operar('readwrite', (s) => s.delete(ruta)); } catch (e) { /* nada */ } },
      async rutas() {
        const todas = new Set(memoria.keys());
        try { ((await operar('readonly', (s) => s.getAllKeys())) || []).forEach((k) => todas.add(k)); } catch (e) { /* solo memoria */ }
        return Array.from(todas);
      }
    };
  })();
  const urlsTemporales = new Map();
  async function urlFoto(ruta) {
    if (urlsTemporales.has(ruta)) return urlsTemporales.get(ruta);
    const blob = ruta.startsWith('img/subidas/') ? await fotos.leer(ruta) : null;
    const url = blob ? URL.createObjectURL(blob) : ruta;
    if (blob) urlsTemporales.set(ruta, url);
    return url;
  }
  function resolverFotos(raiz) {
    $$('img[data-foto]', raiz).forEach(async (img) => {
      const ruta = img.dataset.foto;
      img.addEventListener('error', () => {
        // Recién publicada: la página tarda un minuto en servirla; mientras, se ve desde GitHub.
        const respaldo = 'https://raw.githubusercontent.com/' + REPO.dueno + '/' + REPO.nombre + '/' + REPO.rama + '/' + ruta;
        if (img.src !== respaldo) img.src = respaldo;
      }, { once: true });
      img.src = await urlFoto(ruta);
    });
  }
  const cargarImagen = (archivo) => new Promise((ok, mal) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => mal(new Error('imagen'));
    img.src = url;
  });
  function reducir(img, ancho, tipo, calidad) {
    const escala = Math.min(1, ancho / img.naturalWidth);
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(img.naturalWidth * escala);
    lienzo.height = Math.round(img.naturalHeight * escala);
    const ctx = lienzo.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
    return new Promise((ok) => lienzo.toBlob(ok, tipo, calidad));
  }
  async function prepararFoto(archivo, nombre) {
    const img = await cargarImagen(archivo);
    let tipo = 'image/webp';
    let grande = await reducir(img, 1200, tipo, 0.8);
    if (!grande || grande.type !== tipo) { tipo = 'image/jpeg'; grande = await reducir(img, 1200, tipo, 0.82); }
    const chica = await reducir(img, 600, tipo, 0.78);
    if (!grande || !chica) throw new Error('imagen');
    const f = new Date();
    const dos = (n) => String(n).padStart(2, '0');
    const marca = f.getFullYear() + dos(f.getMonth() + 1) + dos(f.getDate()) + '-' + dos(f.getHours()) + dos(f.getMinutes()) + dos(f.getSeconds()) + '-' + Math.random().toString(36).slice(2, 5);
    const ext = tipo === 'image/webp' ? 'webp' : 'jpg';
    const base = 'img/subidas/' + ((slug(nombre) || 'foto').slice(0, 40)) + '-' + marca;
    await fotos.guardar(base + '-1200.' + ext, grande);
    await fotos.guardar(base + '-600.' + ext, chica);
    return base + '-1200.' + ext;
  }
  function fotosUsadas(obj, encontradas = new Set()) {
    if (Array.isArray(obj)) obj.forEach((x) => fotosUsadas(x, encontradas));
    else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([k, v]) => {
        if (k === 'foto' && typeof v === 'string' && v.startsWith('img/subidas/')) {
          encontradas.add(v);
          encontradas.add(v.replace(/-1200\.(\w+)$/, '-600.$1'));
        } else fotosUsadas(v, encontradas);
      });
    }
    return encontradas;
  }

  /* ---------- Borrador ---------- */
  function completar(d) {
    d.textos = Object.assign({ lema: '', portada: '', pagos: '', estacionamiento: '' }, d.textos);
    d.aviso = Object.assign({ texto: '', hasta: '' }, d.aviso);
    d.ubicacion = Object.assign({ direccion: '', codigoPlus: '', localidad: '', lat: null, lng: null }, d.ubicacion);
    d.secciones = (d.secciones || []).map((s) => Object.assign({ id: '', nombre: '', cartel: '', color: 'carnes', foto: '', fotoTexto: '', descripcion: '', enPortada: true, sugerencias: [] }, s, {
      productos: (s.productos || []).map((p) => Object.assign({ nombre: '', foto: '', precio: null, unidad: '', porLibra: false, caracteristicas: [], destacado: false }, p))
    }));
    d.ofertas = Object.assign({ ejemplo: false, desde: '', hasta: '' }, d.ofertas);
    d.ofertas.lista = (d.ofertas.lista || []).map((o) => Object.assign({ nombre: '', detalle: '', precio: null, porLibra: false, destacada: false, foto: '' }, o));
    d.pizarras = d.pizarras || {};
    d.opcionesWhatsapp = d.opcionesWhatsapp || [];
    d.preguntas = d.preguntas || [];
    d.kits = d.kits || [];
    d.horario = d.horario || [];
    return d;
  }
  const hayCambios = () => !!(datos && publicado) && !igual(datos, publicado);
  function guardar() {
    if (!escribirLocal(BORRADOR, JSON.stringify({ base: sha, datos }))) {
      avisar('Este aparato no deja guardar el borrador (¿navegación privada?). Publica antes de cerrar la página.');
    }
    pintarBarra();
  }
  const ZONAS_CAMBIO = { secciones: 'secciones', ofertas: 'ofertas', pizarras: 'pizarras', horario: 'horario', aviso: 'aviso', opcionesWhatsapp: 'WhatsApp', textos: 'textos', preguntas: 'preguntas', kits: 'listas armadas', telefono: 'datos', whatsapp: 'datos', ubicacion: 'datos', nombre: 'datos' };
  function zonasCambiadas() {
    if (!hayCambios()) return [];
    const zonas = new Set();
    Object.keys(Object.assign({}, publicado, datos)).forEach((k) => { if (!igual(publicado[k], datos[k])) zonas.add(ZONAS_CAMBIO[k] || k); });
    return Array.from(zonas);
  }

  /* ---------- Aviso flotante y ventanas ---------- */
  const tostada = document.createElement('div');
  tostada.className = 'tostada';
  tostada.setAttribute('role', 'status');
  tostada.setAttribute('aria-live', 'polite');
  document.body.appendChild(tostada);
  let relojTostada;
  function avisar(texto, accion) {
    tostada.textContent = '';
    const span = document.createElement('span');
    span.textContent = texto;
    tostada.appendChild(span);
    if (accion) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = accion.texto;
      b.addEventListener('click', () => { accion.hacer(); tostada.classList.remove('visible'); });
      tostada.appendChild(b);
    }
    tostada.classList.add('visible');
    clearTimeout(relojTostada);
    relojTostada = setTimeout(() => tostada.classList.remove('visible'), accion ? 7000 : 4000);
  }
  function ventana(html, alElegir) {
    const d = document.createElement('dialog');
    d.className = 'panel-dialogo';
    d.innerHTML = '<div class="panel-dialogo-caja">' + html + '</div>';
    document.body.appendChild(d);
    d.addEventListener('click', (e) => {
      if (e.target === d) { d.close(); return; }
      const b = e.target.closest('[data-elegir]');
      if (!b) return;
      d.close();
      if (alElegir) alElegir(b.dataset.elegir);
    });
    d.addEventListener('close', () => d.remove());
    d.showModal();
    return d;
  }

  /* ---------- Piezas de formulario ---------- */
  let contador = 0;
  const nuevoId = () => 'c' + (++contador);
  function campo(ruta, etiqueta, o = {}) {
    const id = nuevoId();
    const valor = obtener(datos, ruta);
    const ayuda = o.ayuda ? '<small class="ayuda" id="' + id + '-a">' + esc(o.ayuda) + '</small>' : '';
    const comun = ' id="' + id + '" data-ruta="' + esc(ruta) + '"' + (o.tipo ? ' data-tipo="' + o.tipo + '"' : '') +
      (o.alCambiar ? ' data-al-cambiar="' + o.alCambiar + '"' : '') + (o.ayuda ? ' aria-describedby="' + id + '-a"' : '') +
      (o.requerido ? ' required' : '') + (o.max ? ' maxlength="' + o.max + '"' : '') + ' placeholder="' + esc(o.ejemplo || '') + '"';
    let control;
    if (o.largo) {
      let texto = valor || '';
      if (o.tipo === 'lineas') texto = (valor || []).join('\n');
      if (o.tipo === 'kit') texto = (valor || []).map(([n, c]) => c + ' ' + n).join('\n');
      control = '<textarea' + comun + ' rows="' + (o.filas || 3) + '">' + esc(texto) + '</textarea>';
    } else if (o.tipo === 'precio') {
      control = '<input' + comun + ' type="text" inputmode="decimal" autocomplete="off" value="' + esc(precioTexto(valor)) + '">';
    } else {
      control = '<input' + comun + ' type="' + (o.html || 'text') + '"' + (o.lista ? ' list="' + o.lista + '"' : '') +
        (o.html === 'text' || !o.html ? ' autocomplete="off"' : '') + ' value="' + esc(valor == null ? '' : valor) + '">';
    }
    return '<div class="campo"><label for="' + id + '">' + esc(etiqueta) + (o.opcional ? ' <small>(opcional)</small>' : '') + '</label>' + control + ayuda + '</div>';
  }
  function siNo(ruta, etiqueta, ayuda) {
    const id = nuevoId();
    return '<label class="opcion campo-sino" for="' + id + '"><input id="' + id + '" type="checkbox" data-ruta="' + esc(ruta) + '" data-tipo="si-no"' +
      (obtener(datos, ruta) ? ' checked' : '') + '><span>' + esc(etiqueta) + (ayuda ? '<small>' + esc(ayuda) + '</small>' : '') + '</span></label>';
  }
  function campoFoto(ruta, etiqueta, nombre, ayuda) {
    const valor = obtener(datos, ruta);
    const id = nuevoId();
    return '<div class="campo campo-foto"><span class="etiqueta">' + esc(etiqueta) + ' <small>(opcional)</small></span>' +
      (valor ? '<img alt="Foto elegida" data-foto="' + esc(valor) + '">' : '<div class="foto-vacia">Sin foto</div>') +
      '<div class="acciones">' +
        '<input class="sr-only" id="' + id + '" type="file" accept="image/*" data-foto-para="' + esc(ruta) + '" data-nombre="' + esc(nombre) + '">' +
        '<label class="boton boton-secundario" for="' + id + '">' + (valor ? 'Cambiar foto' : 'Tomar o elegir foto') + '</label>' +
        (valor ? '<button class="boton boton-claro" type="button" data-accion="quitar-foto" data-campo="' + esc(ruta) + '">Quitar foto</button>' : '') +
      '</div>' + (ayuda ? '<small class="ayuda">' + esc(ayuda) + '</small>' : '') + '</div>';
  }
  const COLORES = [['carnes', 'Amarillo y rojo'], ['panaderia', 'Crema y café'], ['fiestas', 'Blanco y rosado'], ['mascotas', 'Morado y amarillo'], ['variedades', 'Verde'], ['verduras', 'Blanco y verde'], ['lacteos', 'Blanco y azul'], ['sederia', 'Blanco y rojo'], ['farmacia', 'Blanco y turquesa']];
  function campoColor(ruta, texto) {
    let actual = obtener(datos, ruta) || 'carnes';
    if (actual === 'abarrotes') actual = 'carnes';
    const grupo = nuevoId();
    return '<fieldset class="grupo-campos"><legend>Color del cartel</legend><div class="colores">' + COLORES.map(([k, nombre]) => {
      const id = nuevoId();
      return '<label class="color-opcion" for="' + id + '"><input id="' + id + '" type="radio" name="' + grupo + '" value="' + k + '" data-ruta="' + esc(ruta) + '"' +
        (actual === k ? ' checked' : '') + '><span class="cartel cartel-' + k + '">' + esc(texto || 'Cartel') + '</span><small>' + nombre + '</small></label>';
    }).join('') + '</div></fieldset>';
  }
  function lista(rutaLista, items, o) {
    const filas = items.length ? '<ul class="filas">' + items.map((it, i) => {
      const titulo = o.titulo(it) || '(sin nombre)';
      const foto = o.foto ? o.foto(it) : null;
      return '<li class="fila' + (o.foto ? '' : ' sin-foto') + '">' +
        (o.foto ? (foto ? '<img class="fila-foto" alt="" data-foto="' + esc(foto) + '">' : '<span class="fila-foto fila-foto-vacia" aria-hidden="true"></span>') : '') +
        '<a class="fila-texto" href="' + o.editar(i) + '"><strong>' + esc(titulo) + '</strong>' + (o.detalle ? '<span>' + esc(o.detalle(it)) + '</span>' : '') + '</a>' +
        '<div class="fila-botones">' +
          '<button class="boton-icono" type="button" data-accion="subir" data-lista="' + rutaLista + '" data-i="' + i + '" aria-label="Subir «' + esc(titulo) + '»"' + (i === 0 ? ' disabled' : '') + '>' + icono('arriba') + '</button>' +
          '<button class="boton-icono" type="button" data-accion="bajar" data-lista="' + rutaLista + '" data-i="' + i + '" aria-label="Bajar «' + esc(titulo) + '»"' + (i === items.length - 1 ? ' disabled' : '') + '>' + icono('abajo') + '</button>' +
          '<button class="boton-icono boton-icono-peligro" type="button" data-accion="eliminar" data-lista="' + rutaLista + '" data-i="' + i + '" aria-label="Eliminar «' + esc(titulo) + '»">' + icono('basura') + '</button>' +
          '<a class="boton boton-secundario boton-chico" href="' + o.editar(i) + '">Editar</a>' +
        '</div></li>';
    }).join('') + '</ul>' : '<p class="vacio">' + esc(o.vacio) + '</p>';
    return filas + '<button class="boton" type="button" data-accion="agregar" data-lista="' + rutaLista + '" data-plantilla="' + o.plantilla + '" data-ir="' + o.editar('{i}') + '">' + icono('mas') + esc(o.agregar) + '</button>';
  }
  const volverA = (href, texto) => '<a class="volver" href="' + href + '">' + icono('volver') + esc(texto) + '</a>';
  const titulo = (ruta, texto, vacio) => '<h1 data-titulo-de="' + esc(ruta) + '" data-vacio="' + esc(vacio) + '">' + esc(texto || vacio) + '</h1>';
  const botonEliminar = (rutaLista, i, que, despues) => '<div class="zona-peligro"><button class="boton boton-peligro" type="button" data-accion="eliminar" data-lista="' + rutaLista + '" data-i="' + i + '" data-volver="' + despues + '">' + icono('basura') + 'Eliminar ' + esc(que) + '</button></div>';
  const resumen = (t, n = 70) => { const s = String(t || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const fechaBonita = (iso) => (iso ? new Intl.DateTimeFormat('es-PA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z')) : '');

  /* ---------- Vistas previas (con las mismas piezas de la página) ---------- */
  const colorDe = (s) => (/^[a-z]+$/.test(s.color || '') ? s.color : 'carnes');
  const cartelDe = (s) => s.cartel || s.nombre;
  function previaSeccion(s) {
    return '<p class="vista-viva-titulo">Así se ve en la página</p><div class="previa-seccion">' +
      '<div class="vitrina vitrina-muestra"><span class="cartel cartel-' + colorDe(s) + '">' + esc(cartelDe(s) || 'Cartel') + '</span>' +
      (s.foto ? '<img alt="" data-foto="' + esc(s.foto) + '">' : '<span class="vitrina-lista"><span>Sin foto</span></span>') + '</div>' +
      '<div><strong class="previa-nombre">' + esc(s.nombre || 'Sección nueva') + '</strong><p>' + esc(s.descripcion || 'Aquí va la descripción de la sección.') + '</p>' +
      (s.foto ? (s.enPortada ? '<p class="ayuda">Sale como vitrina en la portada.</p>' : '<p class="ayuda">No sale en la portada.</p>') : '<p class="ayuda">Sin foto sale como tarjeta en Departamentos.</p>') + '</div></div>';
  }
  function previaProducto(p) {
    const unidad = p.porLibra ? 'la libra' : p.unidad;
    return '<p class="vista-viva-titulo">Así se ve en la página</p><div class="productos previa-productos"><article class="producto">' +
      (p.foto ? '<div class="producto-foto"><img alt="" data-foto="' + esc(p.foto) + '"></div>' : '') +
      '<div class="producto-cuerpo"><h3>' + esc(p.nombre || 'Nombre del producto') + '</h3>' +
      (typeof p.precio === 'number' ? '<p class="producto-precio"><span>B/.</span> ' + precioTexto(p.precio) + (unidad ? ' <small>' + esc(unidad) + '</small>' : '') + '</p>' : '<p class="ayuda">Sin precio: el cliente lo pregunta por WhatsApp.</p>') +
      ((p.caracteristicas || []).length ? '<ul class="caracteristicas">' + p.caracteristicas.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul>' : '') +
      '<div class="producto-acciones"><span class="muestra-mas">+ Agregar a mi lista</span><span class="enlace-boton">Preguntar</span></div></div></article></div>';
  }
  function previaOferta(o) {
    return '<p class="vista-viva-titulo">Así se ve en la página</p><div class="ofertas previa-ofertas"><article class="oferta' + (o.destacada ? ' oferta-destacada' : '') + '">' +
      (o.foto ? '<div class="oferta-foto"><img alt="" data-foto="' + esc(o.foto) + '"></div>' : '') +
      '<h3>' + esc(o.nombre || 'Producto') + '</h3>' + (o.detalle ? '<p class="oferta-detalle">' + esc(o.detalle) + '</p>' : '') +
      '<p class="oferta-precio"><small>B/.</small> ' + (precioTexto(o.precio) || '0.00') + (o.porLibra ? ' <small>la libra</small>' : '') + '</p></article></div>';
  }
  const previaAviso = (a) => '<p class="vista-viva-titulo">Así se ve en la página</p>' +
    (a.texto ? '<div class="aviso-tienda"><p>' + esc(a.texto) + '</p></div>' : '<p class="ayuda">Sin aviso: no sale nada arriba de la página.</p>') +
    (a.texto && a.hasta ? '<p class="ayuda">Se quita solo después del ' + esc(fechaBonita(a.hasta)) + '.</p>' : '');
  const previaOpcionWA = (o) => '<p class="vista-viva-titulo">Así se ve al tocar WhatsApp</p><ul class="wa-opciones"><li><span class="wa-opcion">' + icono(o.icono) +
    '<span><strong>' + esc(o.titulo || 'Título') + '</strong><small>' + esc(o.detalle) + '</small></span></span></li></ul>' +
    '<p class="vista-viva-titulo">Mensaje que le llega a la tienda</p><div class="chat"><div class="chat-cuerpo"><p class="burbuja">' + esc(o.mensaje || ' ') + '</p></div></div>';

  /* ---------- Pantallas ---------- */
  const ZONAS = [
    { ruta: 'secciones', titulo: 'Productos y secciones', icono: 'tienda', resumen: () => {
      const p = datos.secciones.reduce((s, x) => s + (x.productos || []).length, 0);
      return datos.secciones.length + ' secciones, ' + p + (p === 1 ? ' producto' : ' productos') + ' con foto y precio';
    } },
    { ruta: 'ofertas', titulo: 'Ofertas de la semana', icono: 'oferta', resumen: () => datos.ofertas.lista.length + ' ofertas' + (datos.ofertas.ejemplo ? ', precios de muestra' : datos.ofertas.hasta ? ', hasta el ' + fechaBonita(datos.ofertas.hasta) : '') },
    { ruta: 'pizarras', titulo: 'Precios de la pizarra', icono: 'pizarra', resumen: () => Object.values(datos.pizarras).reduce((s, l) => s + l.length, 0) + ' precios fijos' },
    { ruta: 'datos', titulo: 'Horario y datos', icono: 'reloj', resumen: () => 'Teléfono ' + (datos.telefono || '(falta)') },
    { ruta: 'aviso', titulo: 'Aviso en la página', icono: 'aviso', resumen: () => (datos.aviso.texto ? resumen(datos.aviso.texto, 50) : 'Sin aviso') },
    { ruta: 'whatsapp', titulo: 'Mensajes de WhatsApp', icono: 'chat', resumen: () => datos.opcionesWhatsapp.length + ' opciones del botón' },
    { ruta: 'textos', titulo: 'Textos y preguntas', icono: 'texto', resumen: () => datos.preguntas.length + ' preguntas frecuentes' },
    { ruta: 'listas', titulo: 'Listas armadas', icono: 'lista', resumen: () => datos.kits.length + ' listas para «Mi lista»' }
  ];

  function vistaInicio() {
    return (notaInicio ? '<div class="nota-panel" role="alert">' + notaInicio + '</div>' : '') +
      '<h1>¿Qué quieres cambiar hoy?</h1>' +
      '<p class="panel-intro">Los cambios se guardan solos en este aparato. Cuando estés listo toca <strong>Publicar</strong> y la página se actualiza en uno o dos minutos.</p>' +
      '<div class="tarjetas-panel">' + ZONAS.map((z) =>
        '<a class="tarjeta-panel" href="#/' + z.ruta + '">' + icono(z.icono) + '<strong>' + esc(z.titulo) + '</strong><span>' + esc(z.resumen()) + '</span></a>'
      ).join('') + '</div>' +
      '<section class="bloque-panel"><h2>Más opciones</h2><div class="acciones">' +
        '<button class="boton boton-claro" type="button" data-accion="respaldo">Descargar una copia de los datos</button>' +
        '<button class="boton boton-claro" type="button" data-accion="descartar"' + (hayCambios() ? '' : ' disabled') + '>Descartar cambios sin publicar</button>' +
        '<button class="boton boton-claro" type="button" data-accion="desconectar">Desconectar este aparato</button>' +
      '</div></section>';
  }

  function vistaSecciones() {
    return volverA('#/', 'Inicio') + '<h1>Productos y secciones</h1>' +
      '<p class="panel-intro">Cada sección es un departamento o un servicio de la tienda, por ejemplo «Carnicería» o «Lavandería». Dentro de cada una puedes poner productos con foto, precio y características.</p>' +
      lista('secciones', datos.secciones, {
        titulo: (s) => s.nombre, foto: (s) => s.foto, editar: (i) => '#/secciones/' + i, plantilla: 'seccion',
        agregar: 'Agregar sección', vacio: 'Todavía no hay secciones.',
        detalle: (s) => {
          const p = (s.productos || []).length;
          const b = (s.sugerencias || []).length;
          return [p ? p + (p === 1 ? ' producto' : ' productos') : '', b ? b + ' botones para la lista' : '', s.foto ? 'con foto' : 'sin foto'].filter(Boolean).join(', ');
        }
      });
  }

  function vistaSeccion(i) {
    const s = datos.secciones[i];
    if (!s) return null;
    const r = 'secciones.' + i;
    vistaViva = () => previaSeccion(s);
    return volverA('#/secciones', 'Secciones') + titulo(r + '.nombre', s.nombre, 'Sección nueva') +
      '<div class="vista-viva" data-vista-viva>' + previaSeccion(s) + '</div>' +
      '<section class="bloque-panel">' +
        campo(r + '.nombre', 'Nombre de la sección', { requerido: true, ejemplo: 'Ej.: Lavandería' }) +
        campo(r + '.cartel', 'Palabra del cartel', { opcional: true, ejemplo: s.nombre || 'Ej.: Lavandería', ayuda: 'Lo que dice el afiche de la vitrina. Mejor corto. Si lo dejas vacío se usa el nombre.' }) +
        campoColor(r + '.color', cartelDe(s)) +
        campoFoto(r + '.foto', 'Foto de la sección', s.nombre || 'seccion', 'Mejor horizontal: el lugar o los productos. Sale en la vitrina de la portada y en Departamentos.') +
        (s.foto ? campo(r + '.fotoTexto', 'Describe la foto', { opcional: true, ejemplo: 'Ej.: Lavadoras y secadoras en fila', ayuda: 'La leen en voz alta los celulares de las personas ciegas.' }) : '') +
        campo(r + '.descripcion', 'Descripción', { largo: true, ejemplo: 'Ej.: Lavamos, secamos y doblamos tu ropa el mismo día.' }) +
        siNo(r + '.enPortada', 'Mostrar en la fachada de la portada', 'Las secciones con foto salen como vitrinas; las que no tienen foto, en el afiche de texto.') +
        campo(r + '.sugerencias', 'Botones para «Mi lista»', { largo: true, tipo: 'lineas', filas: 4, opcional: true, ejemplo: 'Uno por línea, por ejemplo:\nDetergente\nSuavizante', ayuda: 'El cliente los toca para sumarlos a su lista de compras.' }) +
      '</section>' +
      '<section class="bloque-panel"><h2>Productos o servicios con foto y precio</h2>' +
        lista(r + '.productos', s.productos || [], {
          titulo: (p) => p.nombre, foto: (p) => p.foto, editar: (j) => '#/secciones/' + i + '/productos/' + j, plantilla: 'producto',
          agregar: 'Agregar producto o servicio', vacio: 'Esta sección todavía no tiene productos con foto y precio.',
          detalle: (p) => (typeof p.precio === 'number' ? 'B/. ' + precioTexto(p.precio) + (p.porLibra ? ' la libra' : p.unidad ? ' ' + p.unidad : '') : 'Sin precio') + (p.destacado ? ', destacado' : '')
        }) +
      '</section>' +
      botonEliminar('secciones', i, 'esta sección', '#/secciones');
  }

  function vistaProducto(i, j) {
    const s = datos.secciones[i];
    const p = s && (s.productos || [])[j];
    if (!p) return null;
    const r = 'secciones.' + i + '.productos.' + j;
    vistaViva = () => previaProducto(p);
    return volverA('#/secciones/' + i, s.nombre || 'Sección') + titulo(r + '.nombre', p.nombre, 'Producto nuevo') +
      '<div class="vista-viva" data-vista-viva>' + previaProducto(p) + '</div>' +
      '<section class="bloque-panel">' +
        campo(r + '.nombre', 'Nombre', { requerido: true, ejemplo: 'Ej.: Lavado y secado' }) +
        campoFoto(r + '.foto', 'Foto', p.nombre || s.nombre || 'producto', 'Una foto clara del producto o del servicio.') +
        campo(r + '.precio', 'Precio en balboas', { tipo: 'precio', opcional: true, ejemplo: 'Ej.: 3.50', ayuda: 'Déjalo vacío si prefieres que pregunten el precio por WhatsApp.' }) +
        campo(r + '.unidad', 'Se cobra', { opcional: true, lista: 'unidades', ejemplo: 'Ej.: por carga, c/u, el paquete' }) +
        siNo(r + '.porLibra', 'El precio es por libra', 'Se pesa en la tienda; no se suma al total de la lista del cliente.') +
        campo(r + '.caracteristicas', 'Características', { largo: true, tipo: 'lineas', filas: 4, opcional: true, ejemplo: 'Una por línea, por ejemplo:\nListo en 24 horas\nIncluye doblado', ayuda: 'Salen como viñetas debajo del precio.' }) +
        siNo(r + '.destacado', 'Mostrar en «Destacados» de la portada', 'Para lo nuevo o lo que quieres vender más.') +
      '</section>' +
      '<datalist id="unidades"><option value="c/u"><option value="por carga"><option value="el paquete"><option value="la docena"><option value="por persona"></datalist>' +
      botonEliminar(r.replace(/\.\d+$/, ''), j, 'este producto', '#/secciones/' + i);
  }

  function vistaOfertas() {
    const o = datos.ofertas;
    return volverA('#/', 'Inicio') + '<h1>Ofertas de la semana</h1>' +
      '<section class="bloque-panel">' +
        siNo('ofertas.ejemplo', 'Son precios de muestra', 'Márcalo mientras no sean las ofertas reales: la página avisa que son de muestra.') +
        '<div class="fechas">' +
          campo('ofertas.desde', 'Desde', { html: 'date', opcional: true }) +
          campo('ofertas.hasta', 'Hasta', { html: 'date', opcional: true }) +
        '</div>' +
        '<p class="ayuda">Después de la fecha «hasta», la página deja de mostrar las ofertas sola.</p>' +
        '<button class="boton boton-claro" type="button" data-accion="semana">Usar esta semana (lunes a domingo)</button>' +
      '</section>' +
      lista('ofertas.lista', o.lista, {
        titulo: (x) => x.nombre, foto: (x) => x.foto, editar: (i) => '#/ofertas/' + i, plantilla: 'oferta',
        agregar: 'Agregar oferta', vacio: 'No hay ofertas. La página invita a preguntar por WhatsApp.',
        detalle: (x) => (typeof x.precio === 'number' ? 'B/. ' + precioTexto(x.precio) + (x.porLibra ? ' la libra' : '') : 'Falta el precio') + (x.detalle ? ', ' + x.detalle : '')
      });
  }

  function vistaOferta(i) {
    const o = datos.ofertas.lista[i];
    if (!o) return null;
    const r = 'ofertas.lista.' + i;
    vistaViva = () => previaOferta(o);
    return volverA('#/ofertas', 'Ofertas') + titulo(r + '.nombre', o.nombre, 'Oferta nueva') +
      '<div class="vista-viva" data-vista-viva>' + previaOferta(o) + '</div>' +
      '<section class="bloque-panel">' +
        campo(r + '.nombre', 'Producto', { requerido: true, ejemplo: 'Ej.: Arroz nacional' }) +
        campo(r + '.detalle', 'Detalle', { opcional: true, ejemplo: 'Ej.: Bolsa de 5 lb' }) +
        campo(r + '.precio', 'Precio de oferta en balboas', { tipo: 'precio', requerido: true, ejemplo: 'Ej.: 2.75' }) +
        siNo(r + '.porLibra', 'El precio es por libra') +
        siNo(r + '.destacada', 'Destacarla (sale más grande)') +
        campoFoto(r + '.foto', 'Foto', o.nombre || 'oferta', 'Sale pegada en la cartulina verde.') +
      '</section>' +
      botonEliminar('ofertas.lista', i, 'esta oferta', '#/ofertas');
  }

  const NOMBRES_PIZARRA = { panaderia: 'Pizarra amarilla de la panadería', mascotas: 'Cartulina verde de comida para perro' };
  function vistaPizarras() {
    return volverA('#/', 'Inicio') + '<h1>Precios de la pizarra</h1>' +
      '<p class="panel-intro">Son los precios fijos que la gente ve escritos en la tienda. El cliente los suma a su lista con el botón +.</p>' +
      Object.keys(datos.pizarras).map((k) => {
        const filas = datos.pizarras[k];
        return '<section class="bloque-panel"><h2>' + esc(NOMBRES_PIZARRA[k] || k) + '</h2>' +
          (filas.length ? '<ul class="filas-pizarra">' + filas.map((x, i) => {
            const r = 'pizarras.' + k + '.' + i;
            const a = nuevoId();
            const b = nuevoId();
            return '<li class="fila-pizarra">' +
              '<label class="sr-only" for="' + a + '">Producto ' + (i + 1) + '</label><input id="' + a + '" type="text" autocomplete="off" data-ruta="' + r + '.nombre" value="' + esc(x.nombre) + '" placeholder="Producto">' +
              '<label class="sr-only" for="' + b + '">Precio de ' + esc(x.nombre || 'producto ' + (i + 1)) + '</label><input id="' + b + '" type="text" inputmode="decimal" autocomplete="off" data-ruta="' + r + '.precio" data-tipo="precio" value="' + esc(precioTexto(x.precio)) + '" placeholder="0.00">' +
              '<div class="fila-botones">' +
                '<button class="boton-icono" type="button" data-accion="subir" data-lista="pizarras.' + k + '" data-i="' + i + '" aria-label="Subir «' + esc(x.nombre) + '»"' + (i === 0 ? ' disabled' : '') + '>' + icono('arriba') + '</button>' +
                '<button class="boton-icono" type="button" data-accion="bajar" data-lista="pizarras.' + k + '" data-i="' + i + '" aria-label="Bajar «' + esc(x.nombre) + '»"' + (i === filas.length - 1 ? ' disabled' : '') + '>' + icono('abajo') + '</button>' +
                '<button class="boton-icono boton-icono-peligro" type="button" data-accion="eliminar" data-lista="pizarras.' + k + '" data-i="' + i + '" aria-label="Eliminar «' + esc(x.nombre) + '»">' + icono('basura') + '</button>' +
              '</div></li>';
          }).join('') + '</ul>' : '<p class="vacio">Sin precios. Esta pizarra no sale en la página.</p>') +
          '<button class="boton boton-secundario" type="button" data-accion="agregar" data-lista="pizarras.' + k + '" data-plantilla="precio">' + icono('mas') + 'Agregar precio</button></section>';
      }).join('');
  }

  function vistaDatos() {
    const hora = (ruta, etiqueta, valor, apagado) => {
      const id = nuevoId();
      return '<div class="campo campo-hora"><label for="' + id + '">' + etiqueta + '</label><input id="' + id + '" type="time" data-ruta="' + ruta + '" value="' + esc(valor) + '"' + (apagado ? ' disabled' : '') + '></div>';
    };
    return volverA('#/', 'Inicio') + '<h1>Horario y datos de la tienda</h1>' +
      '<section class="bloque-panel"><h2>Horario</h2><div class="horario-panel">' + [1, 2, 3, 4, 5, 6, 0].filter((i) => datos.horario[i]).map((i) => {
        const d = datos.horario[i];
        const r = 'horario.' + i;
        return '<fieldset class="dia-fila"><legend>' + esc(d.dia) + '</legend>' + hora(r + '.abre', 'Abre', d.abre, d.cerrado) + hora(r + '.cierra', 'Cierra', d.cierra, d.cerrado) + siNo(r + '.cerrado', 'Cerrado') + '</fieldset>';
      }).join('') + '</div>' +
      '<button class="boton boton-claro" type="button" data-accion="todos-los-dias">Usar el horario del lunes para todos los días</button></section>' +
      '<section class="bloque-panel"><h2>Contacto y dirección</h2>' +
        campo('telefono', 'Teléfono y WhatsApp', { html: 'tel', ejemplo: '6767-6813', alCambiar: 'telefono', ayuda: 'El mismo número para llamar y para WhatsApp. Los botones de la página lo usan solos.' }) +
        campo('ubicacion.direccion', 'Dirección', { ejemplo: 'Calle principal, Arraiján, Panamá Oeste' }) +
        campo('ubicacion.codigoPlus', 'Código plus de Google Maps', { ejemplo: 'W9Q5+P2F', ayuda: 'Lo ves al tocar tu tienda en Google Maps.' }) +
        '<details class="avanzado"><summary>Punto exacto en el mapa (avanzado)</summary>' +
          campo('ubicacion.lat', 'Latitud', { tipo: 'decimal', ejemplo: '8.9394' }) + campo('ubicacion.lng', 'Longitud', { tipo: 'decimal', ejemplo: '-79.6424' }) +
        '</details>' +
      '</section>';
  }

  function vistaAviso() {
    const a = datos.aviso;
    vistaViva = () => previaAviso(a);
    return volverA('#/', 'Inicio') + '<h1>Aviso en la página</h1>' +
      '<p class="panel-intro">Sale en una franja amarilla arriba de todas las páginas. Úsalo para avisos cortos: horario de un feriado, pan especial del día, un día cerrado.</p>' +
      '<div class="vista-viva" data-vista-viva>' + previaAviso(a) + '</div>' +
      '<section class="bloque-panel">' +
        campo('aviso.texto', 'Texto del aviso', { largo: true, max: 160, ejemplo: 'Ej.: El 28 de noviembre abrimos de 9:00 a.m. a 6:00 p.m.' }) +
        campo('aviso.hasta', 'Mostrar hasta', { html: 'date', opcional: true, ayuda: 'Después de esta fecha el aviso se quita solo.' }) +
        (a.texto ? '<button class="boton boton-claro" type="button" data-accion="quitar-aviso">Quitar el aviso</button>' : '') +
      '</section>';
  }

  function vistaWhatsapp() {
    return volverA('#/', 'Inicio') + '<h1>Mensajes de WhatsApp</h1>' +
      '<p class="panel-intro">Son las opciones que salen cuando el cliente toca el botón de WhatsApp. Cada una abre el chat con el mensaje ya escrito.</p>' +
      lista('opcionesWhatsapp', datos.opcionesWhatsapp, {
        titulo: (o) => o.titulo, editar: (i) => '#/whatsapp/' + i, plantilla: 'opcionWA',
        agregar: 'Agregar opción', vacio: 'Sin opciones: el botón abre WhatsApp directo.', detalle: (o) => resumen(o.mensaje, 60)
      });
  }

  function vistaOpcionWA(i) {
    const o = datos.opcionesWhatsapp[i];
    if (!o) return null;
    const r = 'opcionesWhatsapp.' + i;
    const idIcono = nuevoId();
    vistaViva = () => previaOpcionWA(o);
    return volverA('#/whatsapp', 'Mensajes de WhatsApp') + titulo(r + '.titulo', o.titulo, 'Opción nueva') +
      '<div class="vista-viva" data-vista-viva>' + previaOpcionWA(o) + '</div>' +
      '<section class="bloque-panel">' +
        '<div class="campo"><label for="' + idIcono + '">Ícono</label><select id="' + idIcono + '" data-ruta="' + r + '.icono">' +
          [['comprar', 'Canasta (comprar)'], ['encargar', 'Calendario (encargar)'], ['averiguar', 'Pregunta (averiguar)'], ['imprimir', 'Impresora (imprimir)'], ['otra', 'Globo de chat (otra cosa)']]
            .map(([v, t]) => '<option value="' + v + '"' + (o.icono === v ? ' selected' : '') + '>' + t + '</option>').join('') +
        '</select></div>' +
        campo(r + '.titulo', 'Título', { requerido: true, ejemplo: 'Ej.: Quiero imprimir' }) +
        campo(r + '.detalle', 'Explicación corta', { opcional: true, ejemplo: 'Ej.: Mándanos el archivo por el chat' }) +
        campo(r + '.mensaje', 'Mensaje que se escribe solo', { largo: true, filas: 4, ejemplo: 'Hola, Supermercado 38. Quiero…', ayuda: 'El cliente puede completarlo antes de enviarlo.' }) +
      '</section>' +
      botonEliminar('opcionesWhatsapp', i, 'esta opción', '#/whatsapp');
  }

  function vistaTextos() {
    return volverA('#/', 'Inicio') + '<h1>Textos y preguntas</h1>' +
      '<section class="bloque-panel"><h2>Textos de la página</h2>' +
        campo('textos.lema', 'Frase bajo el letrero', { ejemplo: 'Supermercado en la calle principal de Arraiján' }) +
        campo('textos.portada', 'Texto de bienvenida', { largo: true, ayuda: 'Sale en la portada. Al final se agrega solo el horario.' }) +
        campo('textos.pagos', 'Formas de pago', { largo: true }) +
        campo('textos.estacionamiento', 'Estacionamiento', { ejemplo: 'Estacionamiento propio frente a la entrada' }) +
      '</section>' +
      '<section class="bloque-panel"><h2>Preguntas frecuentes</h2>' +
        '<p class="ayuda">Salen al final de la portada. En las respuestas puedes escribir {horario}, {telefono} o {pagos} y se llenan solos.</p>' +
        lista('preguntas', datos.preguntas, {
          titulo: (p) => p.pregunta, editar: (i) => '#/preguntas/' + i, plantilla: 'pregunta',
          agregar: 'Agregar pregunta', vacio: 'Sin preguntas: la sección no sale.', detalle: (p) => resumen(p.respuesta, 70)
        }) +
      '</section>';
  }

  function vistaPregunta(i) {
    const p = datos.preguntas[i];
    if (!p) return null;
    const r = 'preguntas.' + i;
    return volverA('#/textos', 'Textos y preguntas') + titulo(r + '.pregunta', p.pregunta, 'Pregunta nueva') +
      '<section class="bloque-panel">' +
        campo(r + '.pregunta', 'Pregunta', { requerido: true, ejemplo: 'Ej.: ¿Hacen entregas a domicilio?' }) +
        campo(r + '.respuesta', 'Respuesta', { largo: true, filas: 4, ayuda: 'Para un enlace escribe [texto](pagina.html), por ejemplo [Arma tu lista](pedidos.html).' }) +
      '</section>' +
      botonEliminar('preguntas', i, 'esta pregunta', '#/textos');
  }

  function vistaListas() {
    return volverA('#/', 'Inicio') + '<h1>Listas armadas</h1>' +
      '<p class="panel-intro">En «Mi lista», el cliente puede empezar con una de estas listas y después cambiar las cantidades.</p>' +
      lista('kits', datos.kits, {
        titulo: (k) => k.nombre, editar: (i) => '#/listas/' + i, plantilla: 'kit',
        agregar: 'Agregar lista', vacio: 'Sin listas armadas.', detalle: (k) => (k.productos || []).length + ' productos'
      });
  }

  function vistaLista(i) {
    const k = datos.kits[i];
    if (!k) return null;
    const r = 'kits.' + i;
    return volverA('#/listas', 'Listas armadas') + titulo(r + '.nombre', k.nombre, 'Lista nueva') +
      '<section class="bloque-panel">' +
        campo(r + '.nombre', 'Nombre', { requerido: true, ejemplo: 'Ej.: Desayuno' }) +
        campo(r + '.productos', 'Productos', { largo: true, tipo: 'kit', filas: 8, ejemplo: 'Uno por línea, con la cantidad al inicio:\n10 Pan de agua\n1 Leche', ayuda: 'Si el producto está en la pizarra, el precio sale solo.' }) +
      '</section>' +
      botonEliminar('kits', i, 'esta lista', '#/listas');
  }

  function vistaConectar(error) {
    return '<div class="conectar">' +
      '<h1>Panel de la tienda</h1>' +
      '<p class="panel-intro">Desde aquí cambias tu página: productos con foto y precio, ofertas, horario, avisos y los mensajes de WhatsApp.</p>' +
      '<form class="bloque-panel" data-conectar>' +
        '<div class="campo"><label for="clave">Clave de acceso</label>' +
        '<input id="clave" name="clave" type="password" autocomplete="off" spellcheck="false" autocapitalize="off" required aria-describedby="clave-ayuda"' + (error ? ' aria-invalid="true"' : '') + '>' +
        '<small class="ayuda" id="clave-ayuda">Se pide una sola vez y se guarda solo en este celular o computadora. Si no la tienes, pídesela a Luis.</small></div>' +
        (error ? '<p class="error-texto" role="alert">' + esc(error) + '</p>' : '') +
        '<button class="boton" type="submit">Conectar este aparato</button>' +
      '</form>' +
      '<details class="bloque-panel avanzado"><summary>Para Luis: cómo crear la clave</summary><ol class="pasos-clave">' +
        '<li>En GitHub, con la cuenta Lulago3003, abre <strong>Settings → Developer settings → Personal access tokens → Fine-grained tokens</strong> y toca <strong>Generate new token</strong>.</li>' +
        '<li>En <strong>Repository access</strong> elige <strong>Only select repositories</strong> y marca <strong>supermercado-38</strong>.</li>' +
        '<li>En <strong>Permissions → Repository permissions</strong> pon <strong>Contents: Read and write</strong>. Nada más.</li>' +
        '<li>Elige el vencimiento, toca <strong>Generate token</strong> y copia la clave (empieza con <code>github_pat_</code>). Pégala aquí en el aparato de la tienda.</li>' +
      '</ol><p class="ayuda">La clave solo puede cambiar esta página. Si se pierde el celular, bórrala en GitHub y crea otra.</p></details>' +
    '</div>';
  }

  function enrutar(r) {
    const n = (k) => Number(r[k]);
    switch (r[0]) {
      case undefined: return vistaInicio();
      case 'secciones':
        if (r.length === 1) return vistaSecciones();
        if (r.length === 2) return vistaSeccion(n(1));
        if (r[2] === 'productos' && r.length === 4) return vistaProducto(n(1), n(3));
        return null;
      case 'ofertas': return r.length === 1 ? vistaOfertas() : vistaOferta(n(1));
      case 'pizarras': return vistaPizarras();
      case 'datos': return vistaDatos();
      case 'aviso': return vistaAviso();
      case 'whatsapp': return r.length === 1 ? vistaWhatsapp() : vistaOpcionWA(n(1));
      case 'textos': return vistaTextos();
      case 'preguntas': return vistaPregunta(n(1));
      case 'listas': return r.length === 1 ? vistaListas() : vistaLista(n(1));
      default: return null;
    }
  }
  const rutaActual = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

  /* Página que conviene mirar en la vista previa según lo que se está editando */
  function paginaDePrevia() {
    const r = rutaActual();
    if (r[0] === 'secciones') {
      const s = datos.secciones[Number(r[1])];
      return 'departamentos.html?vista-previa' + (s ? '#' + (s.id || slug(s.nombre)) : '');
    }
    if (r[0] === 'ofertas') return 'ofertas.html?vista-previa';
    if (r[0] === 'pizarras') return 'panaderia.html?vista-previa';
    if (r[0] === 'listas') return 'pedidos.html?vista-previa';
    if (r[0] === 'datos') return 'contacto.html?vista-previa';
    return 'index.html?vista-previa';
  }

  function pintarBarra(estado) {
    if (!datos || !clave) { barra.hidden = true; return; }
    barra.hidden = false;
    if (estado) {
      barra.innerHTML = '<div class="contenedor panel-barra-fila"><p role="status"><strong>Publicando…</strong><span>' + esc(estado) + '</span></p></div>';
      return;
    }
    const zonas = zonasCambiadas();
    barra.innerHTML = zonas.length
      ? '<div class="contenedor panel-barra-fila"><p><strong>Cambios sin publicar</strong><span>' + esc(zonas.join(', ')) + '</span></p><div class="acciones">' +
        '<a class="boton boton-claro" href="' + paginaDePrevia() + '" target="_blank" rel="noopener">Ver cómo queda</a>' +
        '<button class="boton" type="button" data-accion="publicar">Publicar</button></div></div>'
      : '<div class="contenedor panel-barra-fila"><p><strong>Todo está publicado</strong><span>Lo que cambies se guarda en este aparato hasta que publiques.</span></p><div class="acciones">' +
        '<a class="boton boton-claro" href="index.html" target="_blank" rel="noopener">Ver mi página</a></div></div>';
  }

  function pintar(mantenerPosicion) {
    vistaViva = null;
    contador = 0;
    if (!clave) { app.innerHTML = vistaConectar(); pintarBarra(); return; }
    if (!datos) { app.innerHTML = '<p class="panel-cargando">Cargando tu página…</p>'; pintarBarra(); return; }
    const html = enrutar(rutaActual());
    if (html == null) { location.hash = '#/'; return; }
    const y = window.scrollY;
    app.innerHTML = html;
    resolverFotos(app);
    pintarBarra();
    if (mantenerPosicion) window.scrollTo(0, y);
    else {
      window.scrollTo(0, 0);
      if (enfocarPrimero) { const primero = $('input[data-ruta], textarea[data-ruta]', app); if (primero) primero.focus(); }
      else app.focus({ preventScroll: true });
    }
    enfocarPrimero = false;
  }
  function refrescar(enfocar) {
    pintar(true);
    if (enfocar) { const el = $(enfocar, app); if (el) el.focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', () => {
    $$('dialog.panel-dialogo[open]').forEach((d) => d.close());
    pintar(false);
  });

  /* ---------- Cambios en los campos ---------- */
  function marcarError(el, mensaje) {
    const caja = el.closest('.campo') || el.parentElement;
    caja.classList.add('campo-error');
    el.setAttribute('aria-invalid', 'true');
    let nota = $('.error-texto', caja);
    if (!nota) { nota = document.createElement('small'); nota.className = 'error-texto'; caja.appendChild(nota); }
    nota.textContent = mensaje;
  }
  function limpiarError(el) {
    const caja = el.closest('.campo') || el.parentElement;
    caja.classList.remove('campo-error');
    el.removeAttribute('aria-invalid');
    const nota = $('.error-texto', caja);
    if (nota) nota.remove();
  }
  function alCambiar(e) {
    const el = e.target;
    if (el.matches('input[type="file"][data-foto-para]')) { if (e.type === 'change') elegirFoto(el); return; }
    const ruta = el.dataset.ruta;
    if (!ruta || !datos) return;
    if (el.type === 'radio' && !el.checked) return;
    let valor;
    switch (el.dataset.tipo) {
      case 'precio': {
        const limpio = el.value.replace(/[^\d.,]/g, '').replace(',', '.');
        if (limpio === '') { valor = null; break; }
        valor = Math.round(Number(limpio) * 100) / 100;
        if (!isFinite(valor)) { marcarError(el, 'Escribe solo el número, por ejemplo 2.75'); return; }
        break;
      }
      case 'decimal': valor = el.value.trim() === '' ? null : Number(el.value.replace(',', '.')); if (valor !== null && !isFinite(valor)) { marcarError(el, 'Escribe un número'); return; } break;
      case 'si-no': valor = el.checked; break;
      case 'lineas': valor = el.value.split('\n').map((s) => s.trim()).filter(Boolean); break;
      case 'kit': valor = el.value.split('\n').map((s) => s.trim()).filter(Boolean).map((linea) => {
        const m = linea.match(/^(\d+)\s*(?:x|×)?\s+(.+)$/i);
        return m ? [m[2].trim(), Math.max(1, Number(m[1]))] : [linea, 1];
      }); break;
      default: valor = el.value;
    }
    limpiarError(el);
    fijar(datos, ruta, valor);
    if (el.dataset.alCambiar === 'telefono') {
      const d = soloDigitos(valor);
      datos.whatsapp = d.length === 8 ? '507' + d : d;
    }
    $$('[data-titulo-de="' + ruta + '"]').forEach((t) => { t.textContent = valor || t.dataset.vacio; });
    guardar();
    if (/\.cerrado$/.test(ruta) && e.type === 'change') { refrescar('[data-ruta="' + ruta + '"]'); return; }
    const viva = $('[data-vista-viva]', app);
    if (viva && vistaViva) { viva.innerHTML = vistaViva(); resolverFotos(viva); }
  }
  app.addEventListener('input', alCambiar);
  app.addEventListener('change', (e) => { if (e.target.matches('input[type="file"], input[type="checkbox"], input[type="radio"], select, input[type="date"], input[type="time"]')) alCambiar(e); });

  async function elegirFoto(input) {
    const archivo = input.files && input.files[0];
    if (!archivo) return;
    avisar('Preparando la foto…');
    try {
      const dueno = obtener(datos, input.dataset.fotoPara.replace(/\.foto$/, '')) || {};
      const ruta = await prepararFoto(archivo, dueno.nombre || input.dataset.nombre);
      fijar(datos, input.dataset.fotoPara, ruta);
      guardar();
      refrescar('label[for="' + input.id + '"]');
      avisar('Foto lista. Se sube a la página cuando publiques.');
    } catch (e) {
      avisar('No se pudo usar esa foto. Prueba con otra en JPG o PNG.');
    }
  }

  /* ---------- Botones ---------- */
  const PLANTILLAS = {
    seccion: () => ({ id: '', nombre: '', cartel: '', color: 'carnes', foto: '', fotoTexto: '', descripcion: '', enPortada: true, sugerencias: [], productos: [] }),
    producto: () => ({ nombre: '', foto: '', precio: null, unidad: '', porLibra: false, caracteristicas: [], destacado: false }),
    oferta: () => ({ nombre: '', detalle: '', precio: null, porLibra: false, destacada: false, foto: '' }),
    precio: () => ({ nombre: '', precio: null }),
    opcionWA: () => ({ icono: 'otra', titulo: '', detalle: '', mensaje: 'Hola, ' + (datos.nombre || 'Supermercado 38') + '. ' }),
    pregunta: () => ({ pregunta: '', respuesta: '' }),
    kit: () => ({ nombre: '', productos: [] })
  };
  function confirmarDosVeces(boton, texto) {
    if (boton.dataset.armado === 'si') return true;
    const original = boton.textContent;
    boton.dataset.armado = 'si';
    boton.textContent = texto;
    setTimeout(() => { if (boton.isConnected) { boton.dataset.armado = ''; boton.textContent = original; } }, 5000);
    return false;
  }
  function semanaActual() {
    const ahora = new Date();
    const panama = new Date(ahora.getTime() + (ahora.getTimezoneOffset() - 300) * 60000);
    const lunes = new Date(panama);
    lunes.setDate(panama.getDate() - ((panama.getDay() + 6) % 7));
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    const iso = (f) => f.getFullYear() + '-' + String(f.getMonth() + 1).padStart(2, '0') + '-' + String(f.getDate()).padStart(2, '0');
    return [iso(lunes), iso(domingo)];
  }

  app.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-conectar]');
    if (!form) return;
    e.preventDefault();
    conectar(form.elements.clave.value);
  });

  app.addEventListener('click', (e) => {
    const b = e.target.closest('[data-accion]');
    if (!b || b.disabled) return;
    const accion = b.dataset.accion;
    if (accion === 'agregar') {
      const lista = obtener(datos, b.dataset.lista);
      lista.push(PLANTILLAS[b.dataset.plantilla]());
      guardar();
      if (b.dataset.ir && b.dataset.ir.includes('{i}')) { enfocarPrimero = true; location.hash = b.dataset.ir.replace('{i}', lista.length - 1); }
      else refrescar('[data-ruta="' + b.dataset.lista + '.' + (lista.length - 1) + '.nombre"]');
    } else if (accion === 'subir' || accion === 'bajar') {
      const lista = obtener(datos, b.dataset.lista);
      const i = Number(b.dataset.i);
      const j = accion === 'subir' ? i - 1 : i + 1;
      if (j < 0 || j >= lista.length) return;
      [lista[i], lista[j]] = [lista[j], lista[i]];
      guardar();
      const destino = '[data-accion="' + accion + '"][data-lista="' + b.dataset.lista + '"][data-i="' + j + '"]';
      refrescar(destino);
      const boton = $(destino, app);
      if (boton && boton.disabled) { const otro = $('[data-lista="' + b.dataset.lista + '"][data-i="' + j + '"]:not([disabled])', app); if (otro) otro.focus(); }
    } else if (accion === 'eliminar') {
      const ruta = b.dataset.lista;
      const lista = obtener(datos, ruta);
      const copia = clonar(lista);
      const quitado = lista.splice(Number(b.dataset.i), 1)[0] || {};
      guardar();
      if (b.dataset.volver) location.hash = b.dataset.volver; else refrescar();
      avisar('Eliminaste «' + (quitado.nombre || quitado.titulo || quitado.pregunta || 'el elemento') + '».', {
        texto: 'Deshacer', hacer: () => { fijar(datos, ruta, copia); guardar(); pintar(true); }
      });
    } else if (accion === 'quitar-foto') {
      fijar(datos, b.dataset.campo, '');
      guardar();
      refrescar();
    } else if (accion === 'semana') {
      const [desde, hasta] = semanaActual();
      datos.ofertas.desde = desde;
      datos.ofertas.hasta = hasta;
      guardar();
      refrescar();
      avisar('Ofertas del ' + fechaBonita(desde) + ' al ' + fechaBonita(hasta) + '.');
    } else if (accion === 'todos-los-dias') {
      const lunes = datos.horario[1];
      datos.horario.forEach((d) => { d.abre = lunes.abre; d.cierra = lunes.cierra; d.cerrado = lunes.cerrado; });
      guardar();
      refrescar();
      avisar('Todos los días quedaron con el horario del lunes.');
    } else if (accion === 'quitar-aviso') {
      datos.aviso = { texto: '', hasta: '' };
      guardar();
      refrescar();
    } else if (accion === 'respaldo') {
      const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'datos-supermercado-38-' + semanaActual()[0] + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else if (accion === 'descartar') {
      if (!confirmarDosVeces(b, 'Toca otra vez para descartar')) return;
      datos = clonar(publicado);
      guardar();
      limpiarFotos(new Set());
      pintar(true);
      avisar('Volviste a lo que está publicado.');
    } else if (accion === 'desconectar') {
      if (!confirmarDosVeces(b, 'Toca otra vez para desconectar')) return;
      escribirLocal(LLAVE, null);
      clave = null;
      location.hash = '#/';
      pintar(false);
    } else if (accion === 'usar-publicado') {
      datos = clonar(publicado);
      notaInicio = '';
      guardar();
      pintar(true);
    } else if (accion === 'usar-borrador') {
      notaInicio = '';
      guardar();
      pintar(true);
    } else if (accion === 'reintentar') {
      iniciar();
    }
  });
  barra.addEventListener('click', (e) => { if (e.target.closest('[data-accion="publicar"]')) publicar(false); });

  /* ---------- Publicar ---------- */
  function problemas() {
    const lista = [];
    const sinNombre = (x, campo = 'nombre') => !String(x[campo] || '').trim();
    datos.secciones.forEach((s, i) => {
      if (sinNombre(s)) lista.push(['La sección ' + (i + 1) + ' no tiene nombre.', '#/secciones/' + i]);
      (s.productos || []).forEach((p, j) => { if (sinNombre(p)) lista.push(['Un producto de «' + (s.nombre || 'la sección ' + (i + 1)) + '» no tiene nombre.', '#/secciones/' + i + '/productos/' + j]); });
    });
    datos.ofertas.lista.forEach((o, i) => {
      if (sinNombre(o)) lista.push(['La oferta ' + (i + 1) + ' no tiene nombre.', '#/ofertas/' + i]);
      else if (typeof o.precio !== 'number') lista.push(['La oferta «' + o.nombre + '» no tiene precio.', '#/ofertas/' + i]);
    });
    Object.entries(datos.pizarras).forEach(([k, filas]) => filas.forEach((x, i) => {
      if (sinNombre(x) || typeof x.precio !== 'number') lista.push(['Falta el nombre o el precio en la fila ' + (i + 1) + ' de la ' + (NOMBRES_PIZARRA[k] || k).toLowerCase() + '.', '#/pizarras']);
    }));
    datos.opcionesWhatsapp.forEach((o, i) => { if (sinNombre(o, 'titulo')) lista.push(['La opción ' + (i + 1) + ' de WhatsApp no tiene título.', '#/whatsapp/' + i]); });
    datos.preguntas.forEach((p, i) => { if (sinNombre(p, 'pregunta')) lista.push(['La pregunta ' + (i + 1) + ' está vacía.', '#/preguntas/' + i]); });
    datos.kits.forEach((k, i) => { if (sinNombre(k)) lista.push(['La lista armada ' + (i + 1) + ' no tiene nombre.', '#/listas/' + i]); });
    datos.horario.forEach((d) => {
      if (d && !d.cerrado && (!d.abre || !d.cierra || d.abre >= d.cierra)) lista.push(['Revisa el horario del ' + d.dia.toLowerCase() + ': la hora de cierre debe ser después de la de apertura.', '#/datos']);
    });
    if (soloDigitos(datos.telefono).length < 7) lista.push(['Falta el teléfono de la tienda.', '#/datos']);
    return lista;
  }
  function ponerIds() {
    const usados = new Set(datos.secciones.map((s) => s.id).filter(Boolean));
    datos.secciones.forEach((s) => {
      if (s.id) return;
      const base = slug(s.nombre) || 'seccion';
      let id = base;
      for (let n = 2; usados.has(id); n++) id = base + '-' + n;
      s.id = id;
      usados.add(id);
    });
  }
  async function limpiarFotos(conservar) {
    for (const ruta of await fotos.rutas()) if (!conservar.has(ruta)) await fotos.borrar(ruta);
  }

  async function publicar(encima) {
    if (publicando || !hayCambios()) return;
    const faltas = problemas();
    if (faltas.length) {
      ventana('<h2>Antes de publicar, revisa esto</h2><ul class="lista-problemas">' +
        faltas.map(([texto, ir]) => '<li><a href="' + ir + '" data-elegir="ir">' + esc(texto) + '</a></li>').join('') +
        '</ul><div class="acciones"><button class="boton" type="button" data-elegir="ok">Entendido</button></div>');
      return;
    }
    publicando = true;
    ponerIds();
    try {
      pintarBarra('Revisando la página…');
      const actual = await gh(rutaApi(ARCHIVO) + '?ref=' + REPO.rama);
      if (actual.sha !== sha && !encima) {
        publicando = false;
        pintarBarra();
        ventana('<h2>Alguien publicó cambios mientras editabas</h2><p>La página cambió desde otro aparato. ¿Qué quieres hacer?</p><div class="acciones acciones-columna">' +
          '<button class="boton" type="button" data-elegir="encima">Publicar mis cambios encima</button>' +
          '<button class="boton boton-claro" type="button" data-elegir="cargar">Ver lo publicado (pierdo mis cambios)</button>' +
          '<button class="boton boton-claro" type="button" data-elegir="no">Cancelar</button></div>', async (v) => {
          if (v === 'encima') publicar(true);
          if (v === 'cargar') { publicado = interpretar(deBase64(actual.content)); sha = actual.sha; completar(publicado); datos = clonar(publicado); guardar(); pintar(true); }
        });
        return;
      }
      const usadas = fotosUsadas(datos);
      const pendientes = (await fotos.rutas()).filter((r) => usadas.has(r));
      for (let i = 0; i < pendientes.length; i++) {
        pintarBarra('Subiendo fotos (' + (i + 1) + ' de ' + pendientes.length + ')…');
        const blob = await fotos.leer(pendientes[i]);
        if (!blob) continue;
        try {
          await subirArchivo(pendientes[i], await blobABase64(blob), 'Panel: foto ' + pendientes[i].split('/').pop());
        } catch (e) {
          if (e.estado !== 422) throw e;   // 422: ya se había subido en un intento anterior
        }
      }
      pintarBarra('Guardando los cambios…');
      const zonas = zonasCambiadas();
      const texto = ENCABEZADO + 'window.S38 = ' + JSON.stringify(datos, null, 2) + ';\n';
      const r = await subirArchivo(ARCHIVO, aBase64(texto), 'Panel: actualiza ' + (zonas.join(', ') || 'la página'), actual.sha);
      sha = r.content.sha;
      publicado = clonar(datos);
      guardar();
      await limpiarFotos(new Set());
      publicando = false;
      pintar(true);
      ventana('<h2>¡Publicado!</h2><p>Tus cambios ya están guardados. La página los muestra en uno o dos minutos; si no los ves, recárgala.</p>' +
        '<div class="acciones"><a class="boton" href="index.html" target="_blank" rel="noopener" data-elegir="ver">Ver mi página</a><button class="boton boton-claro" type="button" data-elegir="ok">Seguir editando</button></div>');
    } catch (e) {
      publicando = false;
      pintarBarra();
      ventana('<h2>No se pudo publicar</h2><p>' + esc(mensajeError(e)) + '</p><div class="acciones">' +
        (e.estado === 401 ? '<button class="boton boton-claro" type="button" data-elegir="salir">Desconectar este aparato</button>' : '') +
        '<button class="boton" type="button" data-elegir="ok">Entendido</button></div>', (v) => {
        if (v === 'salir') { escribirLocal(LLAVE, null); clave = null; pintar(false); }
      });
    }
  }

  /* ---------- Conectar y cargar ---------- */
  async function cargarDatos() {
    const traido = await traerPublicado();
    publicado = completar(traido.datos);
    sha = traido.sha;
    let borrador = null;
    try { borrador = JSON.parse(leerLocal(BORRADOR)); } catch (e) { /* sin borrador */ }
    notaInicio = '';
    if (borrador && borrador.datos && borrador.base === sha) datos = completar(borrador.datos);
    else if (borrador && borrador.datos && borrador.base && !igual(completar(borrador.datos), publicado)) {
      datos = completar(borrador.datos);
      notaInicio = '<p><strong>Tenías cambios sin publicar, pero la página se actualizó desde otro lugar.</strong> Si sigues con tus cambios y publicas, reemplazas lo de ese otro lugar.</p>' +
        '<div class="acciones"><button class="boton" type="button" data-accion="usar-borrador">Seguir con mis cambios</button>' +
        '<button class="boton boton-claro" type="button" data-accion="usar-publicado">Empezar con lo publicado</button></div>';
    } else datos = clonar(publicado);
    escribirLocal(BORRADOR, JSON.stringify({ base: sha, datos }));
  }
  async function conectar(valor) {
    clave = String(valor || '').trim();
    if (!clave) return;
    app.innerHTML = '<p class="panel-cargando">Revisando la clave…</p>';
    try {
      await cargarDatos();
      escribirLocal(LLAVE, clave);
      location.hash = '#/';
      pintar(false);
      avisar('¡Listo! Este aparato ya puede cambiar la página.');
    } catch (e) {
      clave = null;
      app.innerHTML = vistaConectar(mensajeError(e));
      const campoClave = $('#clave', app);
      if (campoClave) campoClave.focus();
    }
  }
  async function iniciar() {
    if (!clave) { pintar(false); return; }
    app.innerHTML = '<p class="panel-cargando">Cargando tu página…</p>';
    try {
      await cargarDatos();
      pintar(false);
    } catch (e) {
      app.innerHTML = '<div class="bloque-panel"><h1>No se pudo abrir el panel</h1><p>' + esc(mensajeError(e)) + '</p><div class="acciones">' +
        '<button class="boton" type="button" data-accion="reintentar">Volver a intentar</button>' +
        '<button class="boton boton-claro" type="button" data-accion="desconectar">Desconectar este aparato</button></div></div>';
    }
  }
  iniciar();
})();
