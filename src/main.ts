import { createApp } from 'vue'
// import 'vfonts/Lato.css'
// import 'vfonts/FiraCode.css'
import 'virtual:svg-icons-register'
import '@/styles/global.css'
import init from "@/plugins"
import App from './App.vue'
const app = createApp(App)
init(app)
app.mount('#app')
