<template>
  <div>
    <button class="back-button" @click="$router.push('/')">🏠 Retour à l'accueil</button>

    <video ref="video" autoplay playsinline></video>
    <button @click="capturePhoto">📸 Prendre une photo</button>
    <button v-if="photo" @click="clearPhoto">🗑 Supprimer</button>

    <canvas ref="canvas" style="display: none"></canvas>

    <div v-if="photo">
      <h3>Photo enregistrée :</h3>
      <img :src="photo" alt="Captured Photo" />
    </div>
  </div>
</template>

<script>
export default {
  name: "CameraComponent",
  data() {
    return {
      stream: null,
      photo: localStorage.getItem("capturedPhoto") || null,
    };
  },
  mounted() {
    this.initCamera();
    this.requestNotificationPermission();
  },
  methods: {
    async initCamera() {
      try {
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }

        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });

        const video = this.$refs.video;
        video.srcObject = this.stream;
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la caméra :", error);
      }
    },

    capturePhoto() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");
      this.photo = imageData;
      localStorage.setItem("capturedPhoto", imageData);

      this.showNotification();
    },

    clearPhoto() {
      this.photo = null;
      localStorage.removeItem("capturedPhoto");
    },

    requestNotificationPermission() {
      if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            console.log("Notifications autorisées ✅");
          } else {
            console.warn("Notifications refusées ❌");
          }
        });
      }
    },

    showNotification() {
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification("📸 Photo Capturée !", {
          body: "Votre photo a été enregistrée avec succès.",
          icon: this.photo,
          vibrate: [200, 100, 200],
        });

        if ("vibrate" in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      } else {
        console.warn("Les notifications ne sont pas activées.");
      }
    }
  }
};
</script>

<style scoped>
video {
  width: 100%;
  max-width: 640px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

img {
  width: 100%;
  max-width: 640px;
  height: auto;
  border: 2px solid #42b883;
  border-radius: 4px;
  margin-top: 10px;
}

button {
  padding: 10px 15px;
  font-size: 14px;
  margin: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
