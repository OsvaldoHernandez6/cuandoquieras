# cuando quieras — cursos de marketing digital en vivo

Sitio estático (HTML + CSS + JS, sin build). Se despliega en Vercel con `cleanUrls`, así que cada curso tiene su link directo.

## Páginas
| Archivo | URL |
|---|---|
| `index.html` | cuandoquieras.cl |
| `meta-ads.html` | cuandoquieras.cl/meta-ads |
| `estrategia-de-contenidos.html` | cuandoquieras.cl/estrategia-de-contenidos |
| `google-analytics.html` | cuandoquieras.cl/google-analytics |
| `google-tag-manager.html` | cuandoquieras.cl/google-tag-manager |
| `inscripcion.html` | cuandoquieras.cl/inscripcion?curso=meta-ads |
| `privacidad.html` | cuandoquieras.cl/privacidad (link para formularios de Meta) |

`styles.css` tiene todo el diseño y `main.js` la medición, las animaciones y el formulario.

## Formulario de inscripción
- Está en el hero de cada landing (curso fijo), al final del home (con selector de curso) y en /inscripcion.
- Usa FormSubmit y llega a osvaldo.hernandez.o@gmail.com. El asunto dice si es "Inscripción" o "Lista de espera" y el curso.
- El primer envío desde el sitio publicado manda un correo de activación: hay que confirmarlo una vez.
- `?curso=` preselecciona el curso (meta-ads, estrategia-de-contenidos, google-analytics, google-tag-manager).

## Abrir inscripciones de un curso nuevo
En `main.js` cambia `open: false` a `open: true` en ese curso, y actualiza su landing y la tarjeta en `index.html`.

## Eventos (GTM / dataLayer)
`view_curso`, `click_curso`, `click_inscribirme`, `whatsapp_click`, `generate_lead` (con `curso` y `tipo`). En Meta Pixel: ViewContent, Contact y Lead.
