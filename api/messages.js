export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: "Configuration Supabase manquante"
    });
  }

  try {
    const url = `${supabaseUrl}/rest/v1/messages`;

    // GET : récupérer les messages
    if (req.method === "GET") {
      const conversationId = req.query.conversation_id;

      let query = "?select=*&order=created_at.asc";

      if (conversationId) {
        query += `&conversation_id=eq.${encodeURIComponent(conversationId)}`;
      }

      const response = await fetch(url + query, {
        method: "GET",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data
        });
      }

      return res.status(200).json(data);
    }

    // POST : enregistrer un message
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

      const response = await fetch(url, {
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
          message: message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data
        });
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({
      error: "Méthode non autorisée"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}
