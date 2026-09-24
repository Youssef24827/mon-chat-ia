const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

let conversationId = localStorage.getItem("conversation_id");

if (!conversationId) {
  conversationId = crypto.randomUUID();
  localStorage.setItem("conversation_id", conversationId);
}

async function loadMessages() {
  try {
    const response = await fetch(
      `/api/messages?conversation_id=${encodeURIComponent(conversationId)}`
    );

    if (!response.ok) return;

    const messages = await response.json();

    chat.innerHTML = "";

    messages.forEach((msg) => {
      addMessage(msg.message, msg.sender);
    });

    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    console.error(error);
  }
}

function addMessage(message, sender) {
  const div = document.createElement("div");

  div.className =
    sender === "user"
      ? "message user"
      : "message assistant";

  div.textContent = message;

  chat.appendChild(div);
}

async function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  input.value = "";

  addMessage(message, "user");
  chat.scrollTop = chat.scrollHeight;

  try {
    await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        sender: "user",
        message
      })
    });
  } catch (error) {
    console.error(error);
  }
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

loadMessages();

setInterval(loadMessages, 3000);
