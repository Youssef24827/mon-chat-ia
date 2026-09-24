const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");

const conversationId =
  localStorage.getItem("conversation_id") ||
  crypto.randomUUID();

localStorage.setItem("conversation_id", conversationId);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  input.disabled = true;

  welcome.style.display = "none";

  addMessage(text, "user");

  input.value = "";

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        conversationId,
        sender: "user",
        message: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur");
    }

  } catch (error) {
    console.error(error);

    addMessage(
      "Impossible d'envoyer le message pour le moment.",
      "admin"
    );
  }

  input.disabled = false;
  input.focus();
});

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;

  const content = document.createElement("div");
  content.className = "message-content";
  content.textContent = text;

  message.appendChild(content);
  messages.appendChild(message);

  message.scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
}
