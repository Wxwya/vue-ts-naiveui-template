import type { App } from "vue";

import useUserStore from "@/store/userStore";
export function onLoadAuth(app: App) {
    app.directive('has', {
      mounted(el, binding) {
        const { permissions} = useUserStore()
        if (!permissions.includes(binding.value)) { 
          el.remove()
        }
        },
    })
}