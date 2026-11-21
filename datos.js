/*
  Datos de Supermercado 38 (三發 M/S 38), Arraiján.
  ─────────────────────────────────────────────────
  Este es el ÚNICO archivo que hay que tocar para cambiar horario,
  ofertas de la semana o precios de la pizarra. La página se actualiza sola.

  · Precios en balboas, con punto decimal: 0.15, 20, 2.75
  · Para quitar algo, borra su línea completa (desde { hasta },).
  · Fechas en formato AAAA-MM-DD, por ejemplo '2026-11-23'.
*/
window.S38 = {
  nombre: 'Supermercado 38',
  telefono: '6767-6813',
  whatsapp: '50767676813',
  sitio: 'https://lulago3003.github.io/supermercado-38/',

  ubicacion: {
    direccion: 'Calle principal, Arraiján, Panamá Oeste',
    codigoPlus: 'W9Q5+P2F Arraiján',
    lat: 8.9394,
    lng: -79.6424
  },

  // Horario de domingo (0) a sábado (6). Para un día cerrado usa: { dia: 'Domingo', cerrado: true }
  horario: [
    { dia: 'Domingo', abre: '07:00', cierra: '22:00' },
    { dia: 'Lunes', abre: '07:00', cierra: '22:00' },
    { dia: 'Martes', abre: '07:00', cierra: '22:00' },
    { dia: 'Miércoles', abre: '07:00', cierra: '22:00' },
    { dia: 'Jueves', abre: '07:00', cierra: '22:00' },
    { dia: 'Viernes', abre: '07:00', cierra: '22:00' },
    { dia: 'Sábado', abre: '07:00', cierra: '22:00' }
  ],

  ofertas: {
    // true mientras estos precios sean de muestra. Cuando pongas las ofertas reales
    // de la semana, cámbialo a false y llena "desde" y "hasta".
    ejemplo: true,
    desde: '',
    hasta: '',
    lista: [
      { nombre: 'Pollo entero', detalle: 'Por libra', precio: 0.99, porLibra: true, destacada: true },
      { nombre: 'Arroz nacional', detalle: 'Bolsa de 5 lb', precio: 2.75 },
      { nombre: 'Aceite vegetal', detalle: 'Botella de 1 litro', precio: 2.10 },
      { nombre: 'Papel higiénico', detalle: 'Paquete de 12 rollos', precio: 4.50 },
      { nombre: 'Gaseosa', detalle: 'Botella de 2.5 litros', precio: 1.85 }
    ]
  },

  // Precios tomados de las pizarras de la tienda.
  pizarras: {
    panaderia: [
      { nombre: 'Pan de agua', precio: 0.15 },
      { nombre: 'Pan de leche', precio: 0.18 },
      { nombre: 'Pan francés', precio: 0.20 },
      { nombre: 'Pan dulce', precio: 0.25 },
      { nombre: 'Croissant', precio: 0.30 },
      { nombre: 'Galletas', precio: 0.30 },
      { nombre: 'Donas', precio: 0.35 },
      { nombre: 'Empanada', precio: 0.40 },
      { nombre: 'Muffin', precio: 0.50 },
      { nombre: 'Queque', precio: 1.50 }
    ],
    mascotas: [
      { nombre: 'Pet Master 20 kg', precio: 20.00 },
      { nombre: 'Ascan 18 kg', precio: 30.00 }
    ]
  },

  // Opciones que salen al tocar el botón de WhatsApp. Cada una abre el chat
  // con el mensaje ya escrito. Íconos disponibles: comprar, encargar, averiguar, imprimir, otra.
  opcionesWhatsapp: [
    { icono: 'comprar', titulo: 'Quiero comprar', detalle: 'Dinos qué necesitas y te confirmamos', mensaje: 'Hola, Supermercado 38. Quiero comprar:\n' },
    { icono: 'encargar', titulo: 'Quiero encargar algo', detalle: 'Para una fecha o en cantidad', mensaje: 'Hola, Supermercado 38. Quiero encargar:\n\nLo necesito para el día: ' },
    { icono: 'averiguar', titulo: 'Quiero averiguar', detalle: 'Si tienen un producto o cuánto cuesta', mensaje: 'Hola, Supermercado 38. Quiero averiguar si tienen: ' },
    { icono: 'imprimir', titulo: 'Quiero imprimir', detalle: 'Mándanos el archivo por el chat', mensaje: 'Hola, Supermercado 38. Quiero imprimir algo. Ahora les mando el archivo.\nCopias: \n¿A color o en blanco y negro?: ' },
    { icono: 'otra', titulo: 'Otra cosa', detalle: 'Escríbenos lo que necesites', mensaje: 'Hola, Supermercado 38. Les escribo desde la página web.' }
  ],

  // Ideas que aparecen como botones en "Mi lista" y en Departamentos.
  // Son sugerencias: la tienda confirma disponibilidad por WhatsApp.
  sugerencias: {
    carniceria: ['Pollo entero', 'Pechuga de pollo', 'Muslos de pollo', 'Carne molida', 'Bistec de res', 'Carne para asar', 'Costilla de cerdo', 'Chuleta de cerdo', 'Chorizo', 'Salchichas', 'Jamón', 'Mortadela'],
    abarrotes: ['Arroz', 'Frijoles', 'Lentejas', 'Porotos', 'Aceite', 'Azúcar', 'Sal', 'Café', 'Pasta', 'Salsa de tomate', 'Atún', 'Sardinas', 'Avena', 'Harina'],
    verduras: ['Cebolla', 'Tomate', 'Papa', 'Ñame', 'Yuca', 'Otoe', 'Plátano', 'Guineo', 'Zapallo', 'Ajo', 'Culantro', 'Ají', 'Limón', 'Lechuga'],
    lacteos: ['Leche', 'Huevos', 'Queso blanco', 'Queso amarillo', 'Mantequilla', 'Yogur'],
    sederia: ['Papel higiénico', 'Jabón de baño', 'Pasta dental', 'Champú', 'Desodorante', 'Detergente', 'Cloro', 'Lavaplatos', 'Toallas sanitarias', 'Pañales'],
    fiestas: ['Velas de número', 'Velitas', 'Globos', 'Letrero de Feliz cumpleaños', 'Topper para pastel', 'Gorritos de fiesta', 'Platos desechables', 'Vasos desechables', 'Papel de regalo'],
    mascotas: ['Snacks para perro', 'Correa', 'Juguete para mascota'],
    variedades: ['Limpiapipas', 'Pompones', 'Acuarelas', 'Cuaderno', 'Lupa', 'Animalitos de juguete']
  },

  // Listas armadas en "Mi lista". Si el producto está en la pizarra, toma su precio.
  kits: [
    { nombre: 'Desayuno', productos: [['Pan de agua', 10], ['Pan de leche', 6], ['Huevos', 1], ['Leche', 1], ['Queso blanco', 1], ['Café', 1]] },
    { nombre: 'Compra de la semana', productos: [['Arroz', 1], ['Frijoles', 1], ['Aceite', 1], ['Azúcar', 1], ['Café', 1], ['Huevos', 1], ['Leche', 2], ['Pollo entero', 1], ['Cebolla', 1], ['Papa', 1], ['Plátano', 2], ['Papel higiénico', 1], ['Detergente', 1]] },
    { nombre: 'Asado en casa', productos: [['Carne para asar', 1], ['Costilla de cerdo', 1], ['Chorizo', 1], ['Pan francés', 10], ['Cebolla', 1], ['Tomate', 1], ['Limón', 1], ['Gaseosa', 2]] },
    { nombre: 'Cumpleaños', productos: [['Velas de número', 1], ['Velitas', 1], ['Globos', 1], ['Letrero de Feliz cumpleaños', 1], ['Gorritos de fiesta', 1], ['Platos desechables', 1], ['Vasos desechables', 1]] },
    { nombre: 'Para el perro', productos: [['Pet Master 20 kg', 1], ['Snacks para perro', 1]] }
  ]
};
