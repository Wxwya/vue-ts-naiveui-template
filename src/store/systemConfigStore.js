import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
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
  const onLoadDarkTheme = () => {
    systemConfig.value.theme =  darkTheme 
  }
  const changeTheme = () => {
    systemConfig.value.theme = systemConfig.value.theme?null: darkTheme 
  }

  return {
    systemConfig,
    changeLayout,
    changeTheme,
    onLoadDarkTheme
  }
}, {
  persist: {
    key: 'system',
    storage: localStorage,
    pick: ['systemConfig.layout', 'systemConfig.theme',"systemConfig.collapsed"],
    afterHydrate: ({store}) => {
      if (store.$state.systemConfig.theme) {
        store.onLoadDarkTheme()
      }
    }
  }
})

export default useSystemConfigStore
