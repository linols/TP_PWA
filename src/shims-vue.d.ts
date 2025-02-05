declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  declare module "leaflet" {
    import * as L from "leaflet";
    export = L;
  }
  
  interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    addEventListener(type: "chargingchange" | "levelchange", listener: () => void): void;
  }
  
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }

  