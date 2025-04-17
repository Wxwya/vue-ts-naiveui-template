import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useSystemConfigStore from '@/store/systemConfigStore'
const WIDTH = 992 // 重新计算宽度
const useScreen = () => {
  const { body } = document
  const { systemConfig } = storeToRefs(useSystemConfigStore())
  const isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }
  const resizeHandler = () => {
    if (!document.hidden) {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      const is = isMobile()
      systemConfig.value.isPc = !is
      if (is) {
        systemConfig.value.collapsed = false
      }
    }
  }
  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
  onMounted(() => {
    const is = isMobile()
    if (is) {
      systemConfig.value.isPc = !is
      systemConfig.value.collapsed = false
    }
  })
}
export default useScreen
