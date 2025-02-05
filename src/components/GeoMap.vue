<template>
  <div>
    <button class="back-button" @click="$router.push('/')">🏠 Retour à l'accueil</button>
    
    <h2>📍 Ma Position Actuelle</h2>
    <button @click="getLocation">🔄 Mettre à jour ma position</button>

    <div v-if="error" class="error">{{ error }}</div>

    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const mapContainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const error = ref<string | null>(null);
const userLocation = ref<{ latitude: number; longitude: number } | null>(null);

const getLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        userLocation.value = { latitude, longitude };
        updateMap(latitude, longitude);
      },
      (err) => {
        error.value = "⚠️ Erreur de géolocalisation : " + err.message;
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    error.value = "❌ La géolocalisation n'est pas supportée sur ce navigateur.";
  }
};

const updateMap = (latitude: number, longitude: number) => {
  if (!map.value && mapContainer.value) {
    map.value = L.map(mapContainer.value).setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map.value);

    marker.value = L.marker([latitude, longitude], { icon: defaultIcon }).addTo(map.value)
      .bindPopup("📍 Vous êtes ici !")
      .openPopup();
  } else if (map.value) {
    map.value.setView([latitude, longitude], 15);
    if (marker.value) {
      marker.value.setLatLng([latitude, longitude])
        .bindPopup("📍 Vous êtes ici !")
        .openPopup();
    }
  }
};

onMounted(() => {
  getLocation();
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
  margin-top: 10px;
  border-radius: 8px;
  border: 2px solid #42b883;
}

button {
  padding: 10px 15px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
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

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
