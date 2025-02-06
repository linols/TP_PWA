import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import Camera from "./components/Camera.vue";
import GeoMap from "./components/GeoMap.vue";
import CallPhone from "./components/CallPhone.vue";
import Battery from "./components/Battery.vue";
import ChatComponent from "./components/ChatComponent.vue";
import WebAuth from "./components/WebAuth.vue";
import Payment from "./components/Payment.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/camera", component: Camera },
  { path: "/map", component: GeoMap },
  { path: "/call", component: CallPhone },
  { path: "/battery", component: Battery },
  { path: "/chat", component: ChatComponent },
  { path: "/auth", component: WebAuth },
  { path: "/payment", component: Payment },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
