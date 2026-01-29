
import { ref, watch, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia"
import type{ MenuOption } from "naive-ui";
import useSystemConfigStore from "@/store/systemConfigStore";
import useUserStore from "@/store/userStore";
import { isExternal } from "@/utils/vaildate";

const useLayout = () => { 
  const { push } = useRouter()
  const r = useRoute()
  const path = ref('')
  const { systemConfig } = storeToRefs(useSystemConfigStore())
  const userStore = useUserStore()
  const onUpdareValue = (key: string) => {
    if (!systemConfig.value.isPc) { 
      systemConfig.value.collapsed=false
    }
    if (isExternal(key)) {
      window.open(key, '_blank')
    } else {
      push(key)
     }
  }
  const renderMenuIcon = (option: MenuOption) => {
    return option.icon?h(option.icon):false
  }
  watch(() => r.path, () => { 
    path.value = r.path
  }, { immediate: true })
  return {
    menus:userStore.menus,
    path,
    onUpdareValue,
    renderMenuIcon,
    systemConfig,
  }
}
export default useLayout;