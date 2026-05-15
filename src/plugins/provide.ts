import type { App } from "vue";
import api from "@/api";
import mitt from "mitt";
// import echarts from "@/utils/echart";
// import Ws from "@/utils/socket";
// const webSocket = new Ws({baseUrl: 'ws://localhost:8080'});
const globalConfig = {
  bus: mitt(),
  api,
  // echarts,
  // webSocket
}
export const onLoadProvide = (app:App) => {
  for (const key in globalConfig) {
    app.provide(key, globalConfig[key]);
  }
}



