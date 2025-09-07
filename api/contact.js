import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // 🔹 Headers CORS
    res.setHeader("Access-Control-Allow-Origin", "https://byronjvh.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 🔹 Manejar preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }


    if (req.method !== "POST") {
        return res.status(405).json({ message: "❌ Method not allowed" });
    }

    try {
        const { name, email, message } = req.body;

        const { data, error } = await resend.emails.send({
            from: "Contacto Web byronjvh.com",
            to: "byronjvh02@gmail.com",
            subject: `Nuevo mensaje de ${name}`,
            html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
        });

        if (error) {
            return res.status(400).json({
                message: "❌ Error al enviar",
                error,
            });
        }

        return res.status(200).json({
            message: "✅ Mensaje enviado con éxito",
            data,
        });
    } catch (err) {
        return res.status(500).json({
            message: "❌ Error interno",
            error: String(err),
        });
    }
}
