# cuando quieras — sitio web

Sitio estático (HTML + CSS + JS, sin dependencias ni build).

## Estructura
```
index.html          → el sitio completo
main.js             → menú, chat animado del hero y formulario de contacto
favicon.png         → ícono de la pestaña
apple-touch-icon.png
og-image.png        → imagen al compartir el link (1200×630)
```

## Publicar en GitHub + Vercel
1. Crea un repositorio nuevo en GitHub y sube todos estos archivos a la raíz.
2. En Vercel: **Add New → Project → Import** el repositorio.
3. Framework Preset: **Other**. Sin comando de build, Output Directory vacío (raíz).
4. **Deploy**. Luego, en Settings → Domains, conecta tu dominio.

## Formulario de contacto
Usa FormSubmit y envía a osvaldo.hernandez.o@gmail.com.
- El primer envío desde el sitio publicado manda un correo de activación a esa casilla: hay que confirmarlo una vez.
- Después de activarlo, FormSubmit entrega un código aleatorio. Reemplaza el correo en el `action` del `<form>` de `index.html` por ese código para no exponer tu email.

## Pendientes
- Foto de Osvaldo (buscar `[Tu foto, 1:1]` en index.html).
- Logos de clientes (hoy son nombres en texto).
