import { defineStore } from 'pinia'
import { darkTheme, lightTheme } from 'naive-ui'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { GlobalTheme } from 'naive-ui'
type LayoutType = 'level' | 'vertical'
interface SystemConfigStore {
  systemConfig: Ref<SystemConfig>
  changeLayout: () => void
  changeTheme: () => void
}
type SystemConfig = {
  layout: LayoutType
  collapsed: boolean
  isPc: boolean
  theme: GlobalTheme | null
}
const useSystemConfigStore = defineStore<'systemConfigStore', SystemConfigStore>(
  'systemConfigStore',
  () => {
    const systemConfig = ref<SystemConfig>({
      layout: 'level',
      collapsed: false,
      isPc: true,
      theme: null,
    })
    const changeLayout = () => {
      systemConfig.value.layout = systemConfig.value.layout == 'level' ? 'vertical' : 'level'
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
  },
  {
    persist: {
      key: 'system',
      storage: localStorage,
      pick: ['systemConfig.layout', 'systemConfig.theme', 'systemConfig.collapsed'] as const,
      afterHydrate: ({ store }) => {
        store.onLoadTheme()
      }
    },
  }
)

export default useSystemConfigStore
