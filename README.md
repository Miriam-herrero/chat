# Visión Interna Chat

Boceto inicial de una web pública de chatbot vinculada al universo visual y terapéutico de
Miriam Herrero Sanchez.

## Estado actual

- Web estática lista para abrir en navegador.
- Interfaz de chat en modo demo.
- Estructura compatible con GitHub Pages.
- Sin conexión real a OpenAI todavía.

## Arquitectura prevista

La web podrá alojarse en GitHub Pages, pero la conexión con OpenAI debe hacerse desde un backend
separado para proteger la API key.

```text
GitHub Pages
  index.html
  styles.css
  script.js
      |
      v
Backend seguro
  /api/chat
  OPENAI_API_KEY en variable de entorno
      |
      v
OpenAI API
```

## Próximos pasos

1. Ajustar diseño, textos y nombre final del espacio.
2. Crear repositorio de GitHub.
3. Publicar el frontend en GitHub Pages.
4. Crear backend seguro en Vercel, Netlify, Cloudflare Workers u otra plataforma.
5. Sustituir las respuestas demo por llamadas reales al endpoint `/api/chat`.
