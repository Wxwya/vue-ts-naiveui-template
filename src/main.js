import { createApp } from 'vue'
import 'virtual:svg-icons-register'
import '@/styles/global.css'
import init from "@/plugins"
import App from './App.vue'
const app = createApp(App)
init(app)
app.mount('#app')
