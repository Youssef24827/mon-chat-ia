export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: "Supabase n'est pas configuré"
    });
  }

  try {
    // RÉCUPÉRER LES MESSAGES
    if (req.method === "GET") {
      const conversationId = req.query.conversation_id;

      let url =
        `${supabaseUrl}/rest/v1/messages?select=*&order=created_at.asc`;

      if (conversationId) {
        url += `&conversation_id=eq.${encodeURIComponent(conversationId)}`;
      }

      const response = await fetch(url, {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(500).json({
          error: data
        });
      }

      return res.status(200).json(data);
    }

    // ENREGISTRER UN MESSAGE
    if (req.method === "POST") {
      const {
        conversation_id,
        conversationId,
        sender,
        message
      } = req.body;

      const id = conversation_id || conversationId;

      if (!id || !message) {
        return res.status(400).json({
          error: "Informations manquantes"
        });
      }

      const response = await fetch(
        `${supabaseUrl}/rest/v1/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Prefer": "return=representation"
          },
          body: JSON.stringify({
            conversation_id: id,
            sender: sender || "user",
            message
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);

        return res.status(500).json({
          error: "Impossible d'enregistrer le message"
        });
      }

      return res.status(200).json({
        success: true,
        data
      });
    }

    return res.status(405).json({
      error: "Méthode non autorisée"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur serveur"
    });
  }
}
