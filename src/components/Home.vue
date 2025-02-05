<template>
    <div class="home">
      <h2>Bienvenue sur mon app Vue PWA</h2>
      <button @click="goTo('/camera')">📸 Ouvrir la Caméra</button>
      <button @click="goTo('/map')">🗺️ Afficher la Carte</button>
      <button @click="goTo('/call')">📞 Passer un appel</button>
      <button @click="goTo('/battery')">🔋 Voir le niveau de batterie</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const goTo = (path: string) => {
    router.push(path);
  };
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    margin-top: 20px;
  }
  
  button {
    padding: 12px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin: 10px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  