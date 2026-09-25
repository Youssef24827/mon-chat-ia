const form =
  document.getElementById("chat-form");

const input =
  document.getElementById("message-input");

const messagesContainer =
  document.getElementById("messages");

const welcome =
  document.getElementById("welcome");

const historyContainer =
  document.getElementById("history");

const newChatButton =
  document.getElementById("new-chat");


// =========================================
// CONVERSATION ACTUELLE
// =========================================

let conversationId =
  localStorage.getItem("conversation_id");


// =========================================
// HISTORIQUE
// =========================================

let history =
  JSON.parse(
    localStorage.getItem("chat_history") || "[]"
  );


// =========================================
// SI AUCUNE CONVERSATION
// =========================================

if (!conversationId) {

  conversationId =
    crypto.randomUUID();

  localStorage.setItem(
    "conversation_id",
    conversationId
  );

}


// =========================================
// AFFICHER UN MESSAGE
// =========================================

function addMessage(message, sender) {

  const div =
    document.createElement("div");

  if (sender === "user") {

    div.className =
      "message user-message";

  } else {

    div.className =
      "message assistant-message";

  }

  div.textContent = message;

  messagesContainer.appendChild(div);
}


// =========================================
// ENREGISTRER MESSAGE
// =========================================

async function sendMessage(message) {

  const response =
    await fetch("/api/messages", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        conversation_id:
          conversationId,

        sender: "user",

        message: message

      })

    });


  const data =
    await response.json();


  if (!response.ok) {

    console.error(
      "Erreur API :",
      data
    );

    throw new Error(
      "Erreur lors de l'enregistrement"
    );

  }

  return data;
}


// =========================================
// CHARGER UNE CONVERSATION
// =========================================

async function loadConversation(id) {

  conversationId = id;

  localStorage.setItem(
    "conversation_id",
    conversationId
  );


  try {

    const response =
      await fetch(
        `/api/messages?conversation_id=${encodeURIComponent(id)}`
      );


    if (!response.ok) {
      return;
    }


    const messages =
      await response.json();


    messagesContainer.innerHTML = "";


    if (messages.length === 0) {

      welcome.style.display =
        "flex";

    } else {

      welcome.style.display =
        "none";

    }


    messages.forEach(message => {

      addMessage(
        message.message,
        message.sender
      );

    });


    messagesContainer.scrollTop =
      messagesContainer.scrollHeight;


    renderHistory();


  } catch (error) {

    console.error(
      "Erreur chargement :",
      error
    );

  }

}


// =========================================
// NOUVELLE CONVERSATION
// =========================================

function newConversation() {

  conversationId =
    crypto.randomUUID();


  localStorage.setItem(
    "conversation_id",
    conversationId
  );


  messagesContainer.innerHTML = "";


  welcome.style.display =
    "flex";


  input.value = "";


  input.focus();


  renderHistory();

}


// =========================================
// AJOUTER UNE CONVERSATION À L'HISTORIQUE
// =========================================

function addToHistory(message) {

  const existing =
    history.find(
      item =>
        item.id === conversationId
    );


  if (existing) {
    return;
  }


  const title =
    message.length > 35
      ? message.substring(0, 35) + "..."
      : message;


  history.unshift({

    id: conversationId,

    title: title

  });


  localStorage.setItem(
    "chat_history",
    JSON.stringify(history)
  );


  renderHistory();

}


// =========================================
// AFFICHER L'HISTORIQUE
// =========================================

function renderHistory() {

  historyContainer.innerHTML = "";


  history.forEach(item => {

    const div =
      document.createElement("div");


    div.className =
      "history-item";


    if (
      item.id === conversationId
    ) {

      div.classList.add(
        "active"
      );

    }


    div.textContent =
      item.title;


    div.addEventListener(
      "click",
      () => {

        loadConversation(
          item.id
        );

      }
    );


    historyContainer.appendChild(
      div
    );

  });

}


// =========================================
// ENVOYER MESSAGE
// =========================================

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const message =
      input.value.trim();


    if (!message) {
      return;
    }


    input.value = "";


    welcome.style.display =
      "none";


    // Affichage immédiat

    addMessage(
      message,
      "user"
    );


    messagesContainer.scrollTop =
      messagesContainer.scrollHeight;


    // Historique

    addToHistory(
      message
    );


    try {

      await sendMessage(
        message
      );

    } catch (error) {

      console.error(
        error
      );

    }

  }
);


// =========================================
// BOUTON RECOMMENCER
// =========================================

newChatButton.addEventListener(
  "click",
  () => {

    newConversation();

  }
);


// =========================================
// DÉMARRAGE
// =========================================

renderHistory();

loadConversation(
  conversationId
);


// =========================================
// ACTUALISATION
// =========================================

setInterval(
  () => {

    loadConversation(
      conversationId
    );

  },
  3000
);
