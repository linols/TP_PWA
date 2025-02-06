<template>
    <div class="chat-container">
      <h2>💬 Chat en temps réel</h2>
  
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{'server-msg': message.type === 'SYSTEME_MSG', 'client-msg': message.type === 'CHAT_MSG'}"
        >
          <strong v-if="message.type === 'CHAT_MSG'">👤 {{ message.autorId }}</strong>
          <strong v-else>🖥️ Serveur</strong>
          <p>{{ message.content }}</p>
          <span class="timestamp">{{ formatDate(message.dateEmis) }}</span>
        </div>
      </div>
  
      <div class="input-container">
        <input v-model="newMessage" type="text" placeholder="Écrire un message..." @keyup.enter="sendMessage" />
        <button @click="sendMessage">📩 Envoyer</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from "vue";
  import { io } from "socket.io-client";
  
  export default {
    name: "ChatComponent",
    setup() {
      const socket = io("http://mohammedelmehdi.makhlouk.angers.mds-project.fr:40220");
      const messages = ref([]);
      const newMessage = ref("");
  
      onMounted(() => {
        console.log(" Connexion au serveur Socket.IO...");
        
        socket.on("SYSTEME_MSG", (msg) => {
          console.log("Message du serveur:", msg);
          messages.value.push({
            type: "SYSTEME_MSG",
            content: msg.content,
            dateEmis: msg.dateEmis,
            serverId: msg.serverId
          });
        });
  

        socket.on("CHAT_MSG", (msg) => {
          console.log(" Message d'un client:", msg);
          messages.value.push({
            type: "CHAT_MSG",
            content: msg.content,
            dateEmis: msg.dateEmis,
            autorId: msg.autorId
          });
        });
      });
  
      onUnmounted(() => {
        console.log(" Déconnexion du serveur Socket.IO...");
        socket.disconnect();
      });
  
      const sendMessage = () => {
        if (newMessage.value.trim() !== "") {
          const messageData = {
            content: newMessage.value,
            dateEmis: new Date().toISOString(),
            autorId: "User-" + Math.floor(Math.random() * 1000)
          };
  
          socket.emit("CHAT_MSG", messageData);
          messages.value.push({ ...messageData, type: "CHAT_MSG" });
          newMessage.value = "";
        }
      };
  
      const formatDate = (date) => {
        return new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      };
  
      return {
        messages,
        newMessage,
        sendMessage,
        formatDate
      };
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 2px solid #42b883;
    border-radius: 8px;
    background: #f9f9f9;
  }
  
  .messages {
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    background: white;
    border-radius: 5px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
  }
  
  .server-msg {
    background: #f1f1f1;
    border-left: 4px solid #42b883;
    padding: 5px;
    margin: 5px 0;
    border-radius: 5px;
  }
  
  .client-msg {
    background: #dff0d8;
    border-left: 4px solid #5cb85c;
    padding: 5px;
    margin: 5px 0;
    border-radius: 5px;
  }
  
  .timestamp {
    font-size: 12px;
    color: gray;
  }
  
  .input-container {
    display: flex;
    gap: 10px;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  button {
    background: #42b883;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background: #368a6e;
  }
  </style>
  