
import router from "@/router"
import store from '@/store';
import "@/router/permission"
import "./naive"
import { onLoadAuth } from './auth';
import { onLoadProvide} from  "./provide"
import { setCssCdn,setJsCdn } from '@/utils/setIconfont';
if (import.meta.env.MODE === 'development' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) { 
  const VConsole = await import('vconsole')
  new VConsole.default()
}
const init = (app) => {
  app.use(router)
  app.use(store)
  onLoadAuth(app)
  onLoadProvide(app)
  setCssCdn()
  setJsCdn()
}

export default init