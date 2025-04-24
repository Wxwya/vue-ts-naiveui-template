import cache from "@/utils/cache";
import { VERSION } from "@/enums/cacheEnums";
import { onBeforeUnmount, onMounted } from "vue";
let version:any = cache.getLocalStorage(VERSION);
let timer: any = null;
let isModal= false
const TIME_DATE = 1000 * 60 * 30 
const useUpdate = () => { 
  const getVersion = async () => {
    try { 
      const res = await fetch("/version.json")
      const data = await res.json();
      if (!version) { 
        version = data.version;
        cache.setLocalStorage(VERSION, version);
      }
      if (version !== data.version) {
        if(isModal) return;
        window.$dialog.info({
          title: "更新版本",
          content: "检测到版本更新，请刷新页面~~",
          positiveText: "刷新",
          closable: false,
          closeOnEsc: false,
          maskClosable:false,
          onPositiveClick: () => {
            cache.setLocalStorage(VERSION, data.version);
            location.reload();
          }
        })
        isModal = true
         
      }
    }catch (err) {
       window.$msg.error(`获取版本信息失败:${JSON.stringify(err)}`)
    }
    
  }
  const loop = () => { 
    getVersion();
    timer = setInterval(() => {
      getVersion();
    }, TIME_DATE) // 每天获取一次版本信息
  }
  onMounted(() => { 
    loop();
  })
  onBeforeUnmount(() => { 
    timer && clearInterval(timer)
  })
}
export default useUpdate;