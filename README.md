# Visión Interna Chat

Boceto inicial de una web pública de chatbot vinculada al universo visual y terapéutico de
Miriam Herrero Sanchez.

## Estado actual

- Web estática lista para abrir en navegador.
- Interfaz de chat en modo demo.
- Estructura compatible con GitHub Pages.
- Sin conexión real a OpenAI todavía.

## Arquitectura prevista

La web puede alojarse como estática, pero la conexión con OpenAI debe hacerse desde un backend
separado para proteger la API key. Este proyecto incluye una función compatible con Vercel en
`api/chat.js`.

```text
Frontend
  index.html
  styles.css
  script.js
      |
      v
Vercel
  /api/chat
  OPENAI_API_KEY en variable de entorno
      |
      v
OpenAI API
```

## Conectar OpenAI con Vercel

1. Crear una cuenta/proyecto en Vercel.
2. Importar este repositorio de GitHub.
3. En Vercel, añadir la variable de entorno:

```text
OPENAI_API_KEY=tu_api_key
```

Opcionalmente:

```text
OPENAI_MODEL=gpt-5-mini
```

4. Desplegar el proyecto.
5. Si se usa GitHub Pages para el frontend, configurar la URL del backend Vercel en el frontend
   con `window.CHAT_API_URL`. Si se usa Vercel para servir toda la web, el frontend llamará
   automáticamente a `/api/chat`.

## Próximos pasos

1. Ajustar diseño, textos y nombre final del espacio.
2. Crear repositorio de GitHub.
3. Publicar el frontend en GitHub Pages.
4. Crear despliegue en Vercel para el backend seguro.
5. Añadir `OPENAI_API_KEY` como secreto en Vercel.
