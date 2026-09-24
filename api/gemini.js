export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    const conversation = history
      .map((m) => `${m.sender === "user" ? "Utilisateur" : "Admin"}: ${m.message}`)
      .join("\n");

    const prompt = `
Tu es l'IA d'un site de discussion amusant.
Réponds naturellement et de façon crédible.

Historique :
${conversation}

Dernier message de l'utilisateur :
${message}

Rédige uniquement la réponse que l'IA pourrait envoyer à l'utilisateur.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || "Erreur Gemini",
      });
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Je n'ai pas réussi à générer une réponse.";

    return res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erreur serveur",
    });
  }
}
