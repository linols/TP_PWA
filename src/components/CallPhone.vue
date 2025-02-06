<template>
    <div class="call-container">
      <button class="back-button" @click="$router.push('/')">Retour à l'accueil</button>
  
      <h2>Passer un appel</h2>
  
      <input type="tel" v-model="phoneNumber" placeholder="Entrez un numéro" />
  
      <a :href="callLink">
        <button :disabled="!isValidNumber">📲 Appeler</button>
      </a>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  
  const phoneNumber = ref("");
  
  // Générer le lien `tel:` dynamiquement
  const callLink = computed(() => `tel:${phoneNumber.value}`);
  
  // Vérifier si le numéro est valide (au moins 10 chiffres)
  const isValidNumber = computed(() => {
    return phoneNumber.value.replace(/\D/g, "").length >= 10;
  });
  </script>
  
  <style scoped>
  .call-container {
    text-align: center;
    margin-top: 20px;
  }
  
  input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 80%;
    max-width: 300px;
    margin-bottom: 15px;
  }
  
  button {
    padding: 12px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .back-button {
    display: block;
    margin: 10px auto;
    background-color: #42b883;
  }
  
  .back-button:hover {
    background-color: #368a6e;
  }
  </style>
  