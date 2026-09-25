const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messagesContainer = document.getElementById("messages");
const welcome = document.getElementById("welcome");

let conversationId = localStorage.getItem("conversation_id");

if (!conversationId) {
  conversationId = crypto.randomUUID();
  localStorage.setItem("conversation_id", conversationId);
}

function addMessage(message, sender) {
  const div = document.createElement("div");

  div.className =
    sender === "user"
      ? "message user-message"
      : "message assistant-message";

  div.textContent = message;

  messagesContainer.appendChild(div);
}

async function sendMessage(message) {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      sender: "user",
      message: message
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erreur API :", data);
    throw new Error("Erreur lors de l'enregistrement");
  }

  console.log("Message enregistré :", data);
}

async function loadMessages() {
  try {
    const response = await fetch(
      `/api/messages?conversation_id=${encodeURIComponent(conversationId)}`
    );

    if (!response.ok) return;

    const messages = await response.json();

    // On évite de supprimer les messages déjà affichés
    messagesContainer.innerHTML = "";

    if (messages.length > 0) {
      welcome.style.display = "none";
    } else {
      welcome.style.display = "block";
    }

    messages.forEach((message) => {
      addMessage(message.message, message.sender);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

  } catch (error) {
    console.error("Erreur chargement :", error);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) return;

  input.value = "";

  welcome.style.display = "none";

  // Affichage immédiat
  addMessage(message, "user");

  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    await sendMessage(message);
  } catch (error) {
    console.error(error);
  }
});

// Chargement initial
loadMessages();

// Vérification des nouveaux messages toutes les 3 secondes
setInterval(loadMessages, 3000);
