const allowedOrigins = [
  "http://localhost:4174",
  "http://127.0.0.1:4174",
  "https://miriam-herrero.github.io",
];

const servicesContext = `
Servicios de Miriam Herrero Sánchez:
- Faciales exclusivos: A Medida, Mar Profundo Purificante, Anti-Edad Milagro Facial.
- Cuidado corporal y envolturas: Exfoliación Revitalizante, Envoltura Desintoxicante de Espirulina, Envoltura Hidratante de Arcilla Rosa.
- Masajes manuales: Tejido Profundo, Antiestrés Recuperador, Holístico y Aromaterapia, Escultural con Maderoterapia, Reflexología Podal Holística.
- Rituales especiales del mundo: Éxtasis de Cacao, Cura de Vinoterapia, Masaje con Piedras Calientes.
- Rituales de autor: Para cómo te sientes, Para cómo te ves, Para cómo te transformas.
- Reservas: WhatsApp +34 646 410 037.
`;

function getCorsHeaders(origin) {
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[2];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };
}

function jsonResponse(res, status, body, origin) {
  res.writeHead(status, getCorsHeaders(origin));
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || "";

  if (req.method === "OPTIONS") {
    res.writeHead(204, getCorsHeaders(origin));
    res.end();
    return;
  }

  if (req.method !== "POST") {
    jsonResponse(res, 405, { error: "Method not allowed" }, origin);
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    jsonResponse(res, 500, { error: "Missing OPENAI_API_KEY" }, origin);
    return;
  }

  try {
    const { messages = [] } = req.body || {};
    const sanitizedMessages = messages
      .filter((message) => message && ["user", "assistant"].includes(message.role))
      .slice(-10)
      .map((message) => ({
        role: message.role,
        content: String(message.content || "").slice(0, 1200),
      }));

    if (!sanitizedMessages.length) {
      jsonResponse(res, 400, { error: "Missing messages" }, origin);
      return;
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: `
Eres el asistente digital de Miriam Herrero Sánchez.
Tu función es acoger a la persona usuaria con empatía, tono humano y neutral en cuanto a género.
Ayudas a identificar qué servicio, terapia, taller o recurso puede encajar con su necesidad.
Derivas siempre hacia contacto o reserva para facilitar la contratación.
No haces diagnósticos médicos ni psicológicos, no prometes resultados y no sustituyes una sesión profesional.
Responde en español, de forma breve, clara y cálida.
Incluye el siguiente paso comercial cuando sea natural: reservar o contactar por WhatsApp al +34 646 410 037.

${servicesContext}
        `.trim(),
        input: sanitizedMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      jsonResponse(
        res,
        response.status,
        { error: data.error?.message || "OpenAI request failed" },
        origin,
      );
      return;
    }

    jsonResponse(res, 200, { reply: data.output_text || "" }, origin);
  } catch (error) {
    jsonResponse(res, 500, { error: "Assistant request failed" }, origin);
  }
};
