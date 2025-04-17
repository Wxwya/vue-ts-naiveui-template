
import useUserStore from "@/store/userStore";
export function onLoadAuth(app) {
    app.directive('has', {
      mounted(el, binding) {
        const { permissions} = useUserStore()
        if (!permissions.includes(binding.value)) { 
          el.remove()
        }
        },
    })
}