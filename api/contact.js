import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // 🔹 CORS
    res.setHeader("Access-Control-Allow-Origin", "https://byronjvh.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ message: "❌ Method not allowed" });

    try {
        const { name, email, message } = await parseJSONBody(req);

        console.log("BODY RECIBIDO:", { name, email, message });
        if (!name || !email || !message) {
            return res.status(400).json({ message: "❌ Todos los campos son requeridos" });
        }

        try {
            const data = await resend.emails.send({
                from: "Contacto Web byronjvh.com",
                to: "byronjvh02@gmail.com",
                subject: `Nuevo mensaje de ${name}`,
                html: `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong> ${message}</p>
    `,
            });

            return res.status(200).json({ message: "✅ Mensaje enviado con éxito", data });
        } catch (err) {
            console.error("ERROR RESEND:", err); // 🔹 esto aparece en logs de Vercel
            return res.status(500).json({
                message: "❌ Error al enviar el correo",
                error: String(err),
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "❌ Error interno", error: String(err) });
    }
}

// Función helper para parsear JSON
function parseJSONBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
        req.on("error", reject);
    });
}
