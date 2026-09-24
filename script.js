const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const welcome = document.querySelector(".welcome");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  welcome.style.display = "none";

  addMessage(text, "user");

  input.value = "";

  // Réponse temporaire
  addMessage("Message reçu. Tu pourras bientôt le voir dans ton espace admin.", "admin");
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
