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

const app = createApp(App);
app.use(router);
app.mount("#app");
