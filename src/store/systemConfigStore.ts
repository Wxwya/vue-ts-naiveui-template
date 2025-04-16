import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
import { ref } from "vue"
import type { Ref } from 'vue'
import type { GlobalTheme } from 'naive-ui'
type LayoutType = 'level' | 'vertical'
type ThemeType = GlobalTheme | null | undefined
interface SystemConfigStore {
  systemConfig: Ref<SystemConfig>
  changeLayout: () => void
  changeTheme: () => void
}
class SystemConfig { 
  layout: LayoutType = 'level'
  collapsed: boolean = false
  isPc: boolean = true
  theme:  ThemeType = null
}
const useSystemConfigStore = defineStore<'systemConfigStore', SystemConfigStore>('systemConfigStore', () => { 
  const systemConfig = ref<SystemConfig>(new SystemConfig())
  const  changeLayout = () => {
    systemConfig.value.layout = systemConfig.value.layout=="level"? "vertical" : "level"
  }
  const onLoadDarkTheme = () => {
    systemConfig.value.theme =  darkTheme 
  }
  const changeTheme = () => {
    systemConfig.value.theme = !!systemConfig.value.theme?null: darkTheme 
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
    pick: ['systemConfig.layout', 'systemConfig.theme',"systemConfig.collapsed"] as const,
    afterHydrate: ({store}) => {
      if (store.$state.systemConfig.theme) {
        store.onLoadDarkTheme()
      }
    }
  }
})

export default useSystemConfigStore
