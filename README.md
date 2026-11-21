# Supermercado 38 (三發 M/S 38)

Sitio web de Supermercado 38, en la calle principal de Arraiján, Panamá Oeste.
En vivo: https://lulago3003.github.io/supermercado-38/

El diseño sale de la tienda real: la lámina plateada de la fachada con las letras doradas, las vitrinas con afiches, la puerta de vidrio con el letrero de Abierto/Cerrado, el estacionamiento, la pizarra amarilla de la panadería y la cartulina verde de los precios escritos a mano.

## Páginas

| Archivo | Página |
| --- | --- |
| `index.html` | Inicio: fachada, precios de la pizarra, ofertas, cómo pedir por WhatsApp, horario y preguntas frecuentes |
| `departamentos.html` | Carnicería, panadería, abarrotes, fiestas, mascotas y variedades |
| `panaderia.html` | Pizarra de precios del pan y bolsa de pan |
| `ofertas.html` | Ofertas de la semana y precios fijos de la pizarra |
| `pedidos.html` | Mi lista: el cliente arma su lista y la envía por WhatsApp al 6767-6813 |
| `cotizacion.html` | Pedidos especiales para eventos y negocios |
| `contacto.html` | Cómo llegar: mapa, Waze, Google Maps, horario y formas de pago |
| `404.html` | Página para enlaces que no existen (usa la dirección del sitio en vivo) |

## Cambiar horario, ofertas o precios

Todo está en **`datos.js`**; las páginas se actualizan solas.

- **Ofertas de la semana:** edita `ofertas.lista`. Cuando sean las ofertas reales, pon `ejemplo: false` y llena `desde` y `hasta` (formato `AAAA-MM-DD`). Si la fecha `hasta` ya pasó, la página no muestra ofertas vencidas: invita a preguntar por WhatsApp.
- **Precios de la pizarra:** `pizarras.panaderia` y `pizarras.mascotas`.
- **Horario:** `horario`, un renglón por día. El letrero de Abierto/Cerrado usa la hora de Panamá aunque el cliente esté en otro país.
- **Botones de "Mi lista":** `sugerencias` (por departamento) y `kits` (listas armadas).

La lista del cliente se guarda solo en su celular o computadora; nada se envía hasta que el cliente toca Enviar en WhatsApp.

## Fotos

`img/` tiene las fotos originales en JPG y `img/web/` las versiones WebP livianas que usa la página. Para cambiar una foto, reemplaza el JPG y vuelve a generar sus WebP:

```bash
cwebp -q 72 -resize 600 0 img/foto.jpg -o img/web/foto-600.webp
cwebp -q 72 -resize 1200 0 img/foto.jpg -o img/web/foto-1200.webp
```

## Probar en la computadora

```bash
python3 -m http.server 8038
```

Luego abre http://localhost:8038. También funciona abriendo `index.html` directo en el navegador.
