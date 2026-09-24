export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {
    const {
      conversationId,
      sender,
      message
    } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({
        error: "Informations manquantes"
      });
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender: sender || "user",
          message
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();

      console.error(error);

      return res.status(500).json({
        error: "Impossible d'enregistrer le message"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur serveur"
    });
  }
}
