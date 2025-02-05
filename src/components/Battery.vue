<template>
    <div class="battery-container">
      <button class="back-button" @click="$router.push('/')">🏠 Retour à l'accueil</button>
  
      <h2>🔋 Niveau de batterie</h2>
      
      <div class="battery" :style="{ width: batteryLevel + '%' }" :class="batteryClass">
        {{ batteryLevel }}%
      </div>
  
      <p v-if="charging">⚡ L'appareil est en charge</p>
      <p v-else>🔌 L'appareil n'est pas en charge</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  
  const batteryLevel = ref(0);
  const charging = ref(false);
  const batteryClass = ref("battery-normal");
  
  const updateBatteryStatus = (battery: BatteryManager) => {
    batteryLevel.value = Math.round(battery.level * 100);
    charging.value = battery.charging;
  
    if (batteryLevel.value > 50) {
      batteryClass.value = "battery-high";
    } else if (batteryLevel.value > 20) {
      batteryClass.value = "battery-normal";
    } else {
      batteryClass.value = "battery-low";
    }
  };
  
  onMounted(async () => {
    if ("getBattery" in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        updateBatteryStatus(battery);
  
        battery.addEventListener("levelchange", () => updateBatteryStatus(battery));
        battery.addEventListener("chargingchange", () => updateBatteryStatus(battery));
      } catch (error) {
        console.error("Erreur lors de la récupération du niveau de batterie :", error);
      }
    } else {
      console.warn("L'API Battery Status n'est pas supportée sur ce navigateur.");
    }
  });
  </script>
  
  <style scoped>
  .battery-container {
    text-align: center;
    margin-top: 20px;
  }
  
  .battery {
    display: inline-block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
    font-weight: bold;
    color: white;
    margin: 10px auto;
    transition: width 0.5s ease-in-out;
  }
  
  .battery-high {
    background-color: green;
  }
  
  .battery-normal {
    background-color: orange;
  }
  
  .battery-low {
    background-color: red;
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
  
  button:hover {
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
  