import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
import router from "./router";

registerSW({
  onNeedRefresh() {
    if (confirm("Nouvelle version disponible. Recharger l’application ?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("L’application est prête pour une utilisation hors ligne !");
  }
});


async function requestNotificationPermission() {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notifications autorisées !");
    } else {
      console.warn("❌ Notifications refusées !");
    }
  }
}


async function sendNotification(body: string): Promise<void> {
  const title = "📢 Notification de votre PWA";

  const registration = await navigator.serviceWorker.getRegistration();

  if ("Notification" in window && Notification.permission === "granted") {
    if (registration && "showNotification" in registration) {
      registration.showNotification(title, {
        body,
        icon: "/pwa-192x192.png"
      });
    } else {
      new Notification(title, { body });
    }

    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  } else {
    console.warn("Notifications non autorisées.");
  }
}



document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.querySelector("#sendNotification");
  if (sendButton) {
    sendButton.addEventListener("click", () => sendNotification("Ceci est une notification test 🚀"));
  }
});


requestNotificationPermission();

const app = createApp(App);
app.use(router);
app.mount("#app");
