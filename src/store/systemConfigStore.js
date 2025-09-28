import { defineStore } from 'pinia'
import { darkTheme,lightTheme } from 'naive-ui'
import { ref } from "vue"

class SystemConfig { 
  layout= 'level'
  collapsed = false
  isPc= true
  theme= null
}
const useSystemConfigStore = defineStore('systemConfigStore', () => { 
  const systemConfig = ref(new SystemConfig())
  const  changeLayout = () => {
    systemConfig.value.layout = systemConfig.value.layout=="level"? "vertical" : "level"
  }
  const onLoadTheme = () => { 
    if (!systemConfig.value.theme || systemConfig.value.theme.name === 'light') {
      systemConfig.value.theme = lightTheme
    } else {
      systemConfig.value.theme = darkTheme
    }
  }
  const changeTheme = () => {
    if (systemConfig.value.theme && systemConfig.value.theme.name === 'dark') {
      systemConfig.value.theme = lightTheme
    } else {
      systemConfig.value.theme = darkTheme
    }
  }

  return {
    systemConfig,
    changeLayout,
    changeTheme,
    onLoadTheme
  }
}, {
  persist: {
    key: 'system',
    storage: localStorage,
    pick: ['systemConfig.layout', 'systemConfig.theme', "systemConfig.collapsed"],
    afterHydrate: ({ store }) => {
      store.onLoadTheme()
    }
  }
})

export default useSystemConfigStore
