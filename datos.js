/*
  Datos de Supermercado 38 (三發 M/S 38), Arraiján.
  Los escribe el panel de la tienda (admin.html). Si lo editas a mano, respeta el
  formato JSON: comillas dobles y sin coma después del último elemento.
*/
window.S38 = {
  "nombre": "Supermercado 38",
  "telefono": "6767-6813",
  "whatsapp": "50767676813",
  "sitio": "https://lulago3003.github.io/supermercado-38/",
  "ubicacion": {
    "direccion": "Calle principal, Arraiján, Panamá Oeste",
    "codigoPlus": "W9Q5+P2F",
    "localidad": "Arraiján",
    "lat": 8.9394,
    "lng": -79.6424
  },
  "horario": [
    { "dia": "Domingo", "abre": "07:00", "cierra": "22:00", "cerrado": false },
    { "dia": "Lunes", "abre": "07:00", "cierra": "22:00", "cerrado": false },
    { "dia": "Martes", "abre": "07:00", "cierra": "22:00", "cerrado": false },
    { "dia": "Miércoles", "abre": "07:00", "cierra": "22:00", "cerrado": false },
    { "dia": "Jueves", "abre": "07:00", "cierra": "22:00", "cerrado": false },
    { "dia": "Viernes", "abre": "07:00", "cierra": "22:00", "cerrado": false },
    { "dia": "Sábado", "abre": "07:00", "cierra": "22:00", "cerrado": false }
  ],
  "aviso": { "texto": "", "hasta": "" },
  "textos": {
    "lema": "Supermercado en la calle principal de Arraiján",
    "portada": "Carnes, pan, abarrotes, verduras, cosas para fiestas y comida para tu mascota.",
    "pagos": "Efectivo, tarjetas de débito y crédito, y pago sin contacto con el celular o la tarjeta.",
    "estacionamiento": "Estacionamiento propio frente a la entrada"
  },
  "secciones": [
    {
      "id": "carniceria",
      "nombre": "Carnicería",
      "cartel": "Carnes",
      "color": "carnes",
      "foto": "img/carniceria.jpg",
      "fotoTexto": "Vitrina refrigerada con cortes de res, cerdo y pollo",
      "descripcion": "Res, pollo y cerdo en la vitrina, y embutidos para el desayuno o la parrillada del fin de semana.",
      "enPortada": true,
      "sugerencias": ["Pollo entero", "Pechuga de pollo", "Muslos de pollo", "Carne molida", "Bistec de res", "Carne para asar", "Costilla de cerdo", "Chuleta de cerdo", "Chorizo", "Salchichas", "Jamón", "Mortadela"],
      "productos": []
    },
    {
      "id": "panaderia",
      "nombre": "Panadería",
      "cartel": "",
      "color": "panaderia",
      "foto": "img/panaderia.jpg",
      "fotoTexto": "Estantes con pan, croissants, donas y queques",
      "descripcion": "Pan de agua, de leche, francés y dulce, croissants, donas, empanadas, muffins, galletas y queque. Los precios están en la pizarra.",
      "enPortada": true,
      "enlace": { "texto": "Ver precios del pan", "url": "panaderia.html" },
      "sugerencias": [],
      "productos": []
    },
    {
      "id": "abarrotes",
      "nombre": "Abarrotes",
      "cartel": "",
      "color": "abarrotes",
      "foto": "",
      "fotoTexto": "",
      "descripcion": "Granos, aceite, café, enlatados y todo lo de la compra de la semana.",
      "enPortada": true,
      "sugerencias": ["Arroz", "Frijoles", "Lentejas", "Porotos", "Aceite", "Azúcar", "Sal", "Café", "Pasta", "Salsa de tomate", "Atún", "Sardinas", "Avena", "Harina"],
      "productos": []
    },
    {
      "id": "verduras",
      "nombre": "Verduras y frutas",
      "cartel": "Verduras frescas",
      "color": "verduras",
      "foto": "",
      "fotoTexto": "",
      "descripcion": "Verduras y viandas frescas para la cocina de todos los días.",
      "enPortada": true,
      "sugerencias": ["Cebolla", "Tomate", "Papa", "Ñame", "Yuca", "Otoe", "Plátano", "Guineo", "Zapallo", "Ajo", "Culantro", "Ají", "Limón", "Lechuga"],
      "productos": []
    },
    {
      "id": "lacteos",
      "nombre": "Lácteos y huevos",
      "cartel": "Lácteos",
      "color": "lacteos",
      "foto": "",
      "fotoTexto": "",
      "descripcion": "Leche, huevos, queso, mantequilla y yogur.",
      "enPortada": true,
      "sugerencias": ["Leche", "Huevos", "Queso blanco", "Queso amarillo", "Mantequilla", "Yogur"],
      "productos": []
    },
    {
      "id": "sederia",
      "nombre": "Sedería y limpieza",
      "cartel": "Sedería",
      "color": "sederia",
      "foto": "",
      "fotoTexto": "",
      "descripcion": "Cuidado personal y productos de limpieza para la casa.",
      "enPortada": true,
      "sugerencias": ["Papel higiénico", "Jabón de baño", "Pasta dental", "Champú", "Desodorante", "Detergente", "Cloro", "Lavaplatos", "Toallas sanitarias", "Pañales"],
      "productos": []
    },
    {
      "id": "farmacia",
      "nombre": "Farmacia",
      "cartel": "",
      "color": "farmacia",
      "foto": "",
      "fotoTexto": "",
      "descripcion": "Lo básico del botiquín, sin hacer otra parada.",
      "enPortada": true,
      "sugerencias": [],
      "productos": []
    },
    {
      "id": "fiestas",
      "nombre": "Fiestas y cumpleaños",
      "cartel": "Fiestas",
      "color": "fiestas",
      "foto": "img/fiestas.jpg",
      "fotoTexto": "Pared con velas de número, velitas, letreros de Feliz cumpleaños, globos y gorritos",
      "descripcion": "Una pared completa para celebrar: velas de número doradas y plateadas, velitas, letreros de Feliz cumpleaños, toppers para el pastel, globos, gorritos y papel de regalo.",
      "enPortada": true,
      "sugerencias": ["Velas de número", "Velitas", "Globos", "Letrero de Feliz cumpleaños", "Topper para pastel", "Gorritos de fiesta", "Platos desechables", "Vasos desechables", "Papel de regalo"],
      "productos": []
    },
    {
      "id": "mascotas",
      "nombre": "Mascotas",
      "cartel": "",
      "color": "mascotas",
      "foto": "img/mascotas.jpg",
      "fotoTexto": "Sacos de comida para perro Pet Master, Ascan y Master Dog apilados en el pasillo",
      "descripcion": "Sacos de comida para perro de varias marcas, snacks, correas y juguetes para los consentidos de la casa.",
      "enPortada": true,
      "pizarra": "mascotas",
      "sugerencias": ["Snacks para perro", "Correa", "Juguete para mascota"],
      "productos": []
    },
    {
      "id": "variedades",
      "nombre": "Variedades y manualidades",
      "cartel": "Variedades",
      "color": "variedades",
      "foto": "img/variedades.jpg",
      "fotoTexto": "Pared de manualidades con limpiapipas, pompones, acuarelas, lupas y animalitos de juguete",
      "descripcion": "Para las tareas de la escuela y los ratos libres: limpiapipas, pompones, acuarelas, cuadernos, lupas y juguetes.",
      "enPortada": true,
      "sugerencias": ["Limpiapipas", "Pompones", "Acuarelas", "Cuaderno", "Lupa", "Animalitos de juguete"],
      "productos": []
    }
  ],
  "ofertas": {
    "ejemplo": true,
    "desde": "",
    "hasta": "",
    "lista": [
      { "nombre": "Pollo entero", "detalle": "Por libra", "precio": 0.99, "porLibra": true, "destacada": true, "foto": "" },
      { "nombre": "Arroz nacional", "detalle": "Bolsa de 5 lb", "precio": 2.75, "porLibra": false, "destacada": false, "foto": "" },
      { "nombre": "Aceite vegetal", "detalle": "Botella de 1 litro", "precio": 2.1, "porLibra": false, "destacada": false, "foto": "" },
      { "nombre": "Papel higiénico", "detalle": "Paquete de 12 rollos", "precio": 4.5, "porLibra": false, "destacada": false, "foto": "" },
      { "nombre": "Gaseosa", "detalle": "Botella de 2.5 litros", "precio": 1.85, "porLibra": false, "destacada": false, "foto": "" }
    ]
  },
  "pizarras": {
    "panaderia": [
      { "nombre": "Pan de agua", "precio": 0.15 },
      { "nombre": "Pan de leche", "precio": 0.18 },
      { "nombre": "Pan francés", "precio": 0.2 },
      { "nombre": "Pan dulce", "precio": 0.25 },
      { "nombre": "Croissant", "precio": 0.3 },
      { "nombre": "Galletas", "precio": 0.3 },
      { "nombre": "Donas", "precio": 0.35 },
      { "nombre": "Empanada", "precio": 0.4 },
      { "nombre": "Muffin", "precio": 0.5 },
      { "nombre": "Queque", "precio": 1.5 }
    ],
    "mascotas": [
      { "nombre": "Pet Master 20 kg", "precio": 20 },
      { "nombre": "Ascan 18 kg", "precio": 30 }
    ]
  },
  "opcionesWhatsapp": [
    { "icono": "comprar", "titulo": "Quiero comprar", "detalle": "Dinos qué necesitas y te confirmamos", "mensaje": "Hola, Supermercado 38. Quiero comprar:\n" },
    { "icono": "encargar", "titulo": "Quiero encargar algo", "detalle": "Para una fecha o en cantidad", "mensaje": "Hola, Supermercado 38. Quiero encargar:\n\nLo necesito para el día: " },
    { "icono": "averiguar", "titulo": "Quiero averiguar", "detalle": "Si tienen un producto o cuánto cuesta", "mensaje": "Hola, Supermercado 38. Quiero averiguar si tienen: " },
    { "icono": "imprimir", "titulo": "Quiero imprimir", "detalle": "Mándanos el archivo por el chat", "mensaje": "Hola, Supermercado 38. Quiero imprimir algo. Ahora les mando el archivo.\nCopias: \n¿A color o en blanco y negro?: " },
    { "icono": "otra", "titulo": "Otra cosa", "detalle": "Escríbenos lo que necesites", "mensaje": "Hola, Supermercado 38. Les escribo desde la página web." }
  ],
  "preguntas": [
    { "pregunta": "¿A qué hora abren y cierran?", "respuesta": "Abrimos {horario}." },
    { "pregunta": "¿Puedo hacer mi pedido por WhatsApp?", "respuesta": "Sí. [Arma tu lista](pedidos.html) en esta página o escríbenos al {telefono}. Te confirmamos disponibilidad y el total antes de prepararla." },
    { "pregunta": "¿Qué formas de pago aceptan?", "respuesta": "{pagos}" },
    { "pregunta": "¿Dónde me estaciono?", "respuesta": "Tenemos estacionamiento propio justo frente a la entrada." },
    { "pregunta": "¿Tienen cosas para cumpleaños?", "respuesta": "Sí: velas de número, velitas, globos, letreros de Feliz cumpleaños, toppers para pastel, gorritos y más. Mira el departamento de [fiestas](departamentos.html#fiestas)." },
    { "pregunta": "¿Los precios de la página son los de la tienda?", "respuesta": "Los de la pizarra son los mismos de la tienda, pero pueden cambiar sin aviso. El precio final siempre es el de caja." }
  ],
  "kits": [
    { "nombre": "Desayuno", "productos": [["Pan de agua", 10], ["Pan de leche", 6], ["Huevos", 1], ["Leche", 1], ["Queso blanco", 1], ["Café", 1]] },
    { "nombre": "Compra de la semana", "productos": [["Arroz", 1], ["Frijoles", 1], ["Aceite", 1], ["Azúcar", 1], ["Café", 1], ["Huevos", 1], ["Leche", 2], ["Pollo entero", 1], ["Cebolla", 1], ["Papa", 1], ["Plátano", 2], ["Papel higiénico", 1], ["Detergente", 1]] },
    { "nombre": "Asado en casa", "productos": [["Carne para asar", 1], ["Costilla de cerdo", 1], ["Chorizo", 1], ["Pan francés", 10], ["Cebolla", 1], ["Tomate", 1], ["Limón", 1], ["Gaseosa", 2]] },
    { "nombre": "Cumpleaños", "productos": [["Velas de número", 1], ["Velitas", 1], ["Globos", 1], ["Letrero de Feliz cumpleaños", 1], ["Gorritos de fiesta", 1], ["Platos desechables", 1], ["Vasos desechables", 1]] },
    { "nombre": "Para el perro", "productos": [["Pet Master 20 kg", 1], ["Snacks para perro", 1]] }
  ]
};
