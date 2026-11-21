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
| `admin.html` | Panel de la tienda (ver abajo) |

## Panel de la tienda: la tienda edita su propia página

**https://lulago3003.github.io/supermercado-38/admin.html** (no está enlazado en la página; se le pasa el enlace a la tienda para que lo guarde en su celular).

Desde el celular, la tienda puede:

- Agregar o cambiar **secciones** (por ejemplo «Lavandería») con foto, descripción y color del cartel. Las que tienen foto salen como vitrinas en la fachada de la portada.
- Poner **productos o servicios** dentro de cada sección con foto, precio, unidad («por carga», «c/u»…), características y marcarlos como **destacados** para que salgan en la portada.
- Cambiar las **ofertas de la semana** (con fecha de fin), los **precios de la pizarra**, el **horario**, el teléfono y la dirección.
- Poner un **aviso** arriba de todas las páginas, que se quita solo en la fecha que elijan.
- Editar los **mensajes del botón de WhatsApp**, los textos de la portada, las **preguntas frecuentes** y las **listas armadas** de «Mi lista».
- **Ver cómo queda** antes de publicar.

Cómo funciona: los cambios se guardan como borrador en el aparato (las fotos se achican en el celular a 1200 y 600 px). Al tocar **Publicar**, el panel sube las fotos nuevas a `img/subidas/` y reescribe `datos.js` en GitHub; GitHub Pages actualiza la página en uno o dos minutos. Si alguien publicó desde otro aparato mientras tanto, el panel avisa antes de reemplazar nada.

### Clave de acceso (la crea Luis una sola vez)

1. En GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access:** *Only select repositories* → `supermercado-38`.
3. **Permissions → Repository permissions:** `Contents: Read and write`. Nada más.
4. Copiar la clave (empieza con `github_pat_`) y pegarla en el panel desde el celular de la tienda. Se guarda solo en ese aparato.

Esa clave solo puede cambiar esta página. Si se pierde el celular, se borra la clave en GitHub y se crea otra.

## Datos de la página

Todo lo que se puede cambiar vive en **`datos.js`** (JSON dentro de JavaScript), que normalmente escribe el panel. Si se edita a mano: comillas dobles y sin coma después del último elemento.

- `secciones`: departamentos y servicios, con `productos` (foto, precio, características) y `sugerencias` (botones para «Mi lista»).
- `ofertas`: con `ejemplo: true` la página avisa que son precios de muestra; con `hasta` vencido deja de mostrarlas.
- `pizarras`, `horario`, `aviso`, `textos`, `preguntas` (admiten `{horario}`, `{telefono}` y `{pagos}`), `opcionesWhatsapp` y `kits`.

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
