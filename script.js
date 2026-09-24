const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const welcome = document.querySelector(".welcome");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  // Cache le message d'accueil
  welcome.style.display = "none";

  // Ajoute le message de l'utilisateur
  addMessage(text, "user");

  // Vide le champ
  input.value = "";

  // Pour l'instant, réponse temporaire
  setTimeout(() => {
    addMessage(
      "Ton message a bien été reçu. La connexion à Gemini et au panneau admin sera ajoutée juste après.",
      "admin"
    );
  }, 500);
});

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;

  const content = document.createElement("div");
  content.className = "message-content";
  content.textContent = text;

  message.appendChild(content);
  messages.appendChild(message);

  // Descendre automatiquement vers le dernier message
  messages.scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
}
