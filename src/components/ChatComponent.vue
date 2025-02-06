<template>
  <div class="chat-container">
    <h2>Chat</h2>


    <div v-if="!isConnected" class="login-container">
      <input v-model="pseudo" type="text" placeholder="Entrez votre pseudo..." @keyup.enter="connectToChat" />
      <button @click="connectToChat">Rejoindre</button>
    </div>


    <div v-else>
      <div class="messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{
            'server-msg': message.type === 'SYSTEME_MSG',
            'client-msg': message.type === 'CHAT_MSG' && message.pseudo !== pseudo,
            'own-msg': message.type === 'CHAT_MSG' && message.pseudo === pseudo
          }"
        >
          <strong v-if="message.type === 'CHAT_MSG'">{{ message.pseudo }}</strong>
          <strong v-else>Serveur</strong>
          <p>{{ message.content }}</p>
          <span class="timestamp">{{ formatDate(message.dateEmis) }}</span>
        </div>
      </div>

      <div class="input-container">
        <input v-model="newMessage" type="text" placeholder="Écrire un message..." @keyup.enter="sendMessage" />
        <button @click="sendMessage">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { io } from "socket.io-client";

export default {
  name: "ChatComponent",
  setup() {
    const socket = io("http://mohammedelmehdi.makhlouk.angers.mds-project.fr:40220", {
      transports: ["websocket"],
      withCredentials: true
    });

    const messages = ref([]);
    const newMessage = ref("");
    const pseudo = ref("");
    const roomId = "general";
    const isConnected = ref(false);
    const messagesContainer = ref(null);

    const connectToChat = () => {
      if (pseudo.value.trim() !== "") {


        socket.emit("chat-join-room", {
          pseudo: pseudo.value,
          roomId: roomId
        });

        isConnected.value = true;
      }
    };

    onMounted(() => {
      socket.on("SYSTEME_MSG", (msg) => {
        messages.value.push({
          type: "SYSTEME_MSG",
          content: msg.content,
          dateEmis: msg.dateEmis,
          serverId: msg.serverId
        });
        scrollToBottom();
      });

      socket.on("chat-msg", (msg) => {
        messages.value.push({
          type: "CHAT_MSG",
          content: msg.content,
          dateEmis: msg.dateEmis,
          pseudo: msg.pseudo
        });
        scrollToBottom();
      });
    });

    onUnmounted(() => {
      socket.disconnect();
    });

    const sendMessage = () => {
      if (newMessage.value.trim() !== "") {
        const messageData = {
          msg: newMessage.value,
          roomId: roomId
        };

        socket.emit("chat-msg", messageData);
        newMessage.value = "";
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    };

    return {
      messages,
      newMessage,
      sendMessage,
      formatDate,
      messagesContainer,
      pseudo,
      isConnected,
      connectToChat
    };
  }
};
</script>

<style scoped>

.chat-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 2px solid #42b883;
  border-radius: 8px;
  background: #f9f9f9;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

h2 {
  color: #2c3e50;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}



.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 10px;
}

.login-container input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 80%;
}

.login-container button {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.login-container button:hover {
  background: #368a6e;
}


.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: white;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  height: 60vh;
  max-height: 60vh;
}



.server-msg {
  background: #424242;
  color: white;
  border-left: 4px solid #42b883;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  text-align: center;
}


.client-msg {
  background: #dff0d8;
  color: black;
  border-left: 4px solid #5cb85c;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  align-self: flex-start;
  max-width: 75%;
}


.own-msg {
  background: #b3e5fc;
  color: black;
  border-left: 4px solid #0288d1;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  align-self: flex-end;
  max-width: 75%;
}


.timestamp {
  font-size: 12px;
  color: gray;
  display: block;
  text-align: right;
  margin-top: 5px;
}


.input-container {
  display: flex;
  gap: 10px;
  padding-top: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

button {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #368a6e;
}
</style>
