import { type App, createApp, h, defineComponent} from 'vue'
import { NSpin,NConfigProvider} from 'naive-ui'
import useUserStore from '@/store/userStore'
import { generateRandomId } from '@/utils/handle'
import useSystemConfigStore from '@/store/systemConfigStore'
import store from '@/store'
import { storeToRefs } from 'pinia'
let loadingDiv:any = null
const loadingMap = new Map()
const size = {
  small: 22,
  medium: 28,
  large: 34,
}
function onCreateLoading() {
  loadingDiv = document.createElement('div')
  loadingDiv.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  loadingDiv.className = 'absolute inset-0 flex justify-center items-center'
  const vnode = defineComponent({
    setup() {
      const { systemConfig } = storeToRefs(useSystemConfigStore())
      loadingDiv.style.background=!systemConfig.value.theme ||  systemConfig.value.theme.name ==='light' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
      return () => h(NConfigProvider, {  theme:systemConfig.value.theme }, {
        default:()=>h(NSpin, { size: 'small',description:"加载中..." })
      }) 
    },
  })
  const app = createApp(vnode)
  app.use(store)
  app.mount(loadingDiv)
}
onCreateLoading()
function onLoadAuth(app: App) {
  app.directive('has', {
    mounted(el, binding) {
      const { permissions } = useUserStore()
      if (!permissions.includes(binding.value)) {
        el.remove()
      }
    },
  })
}
function onLoadTableScrollY(app: App) {
  app.directive('tableY', {
    mounted(el, binding) {
      // 获取--n-pagination-margin 变量
      const margin = el.style.getPropertyValue('--n-pagination-margin')
      const match = margin.match(/^(\d+)/) // 提取第一个数值
      const number = match ? parseInt(match[1], 10) : 0
      el.style.setProperty('--table-height', el.offsetHeight)
      if (binding.value.scrollY) {
        if (binding.value.show) {
          el.style.setProperty('--table-max-height', `${el.offsetHeight - (size.medium + number)}px`)
          return
        }
        if (!binding.value.page || binding.value.page.pageSize * binding.value.page.page >= binding.value.page.itemCount) {
          el.style.setProperty('--table-max-height', `${el.offsetHeight}px`)
          return
        }
        if (!binding.value.page.size) {
          el.style.setProperty('--table-max-height', `${el.offsetHeight - (size.medium + number)}px`)
        } else {
          el.style.setProperty('--table-max-height', `${el.offsetHeight - (size[binding.value.page.size] + number)}px`)
        }
      }
    },
    updated(el, binding) {
      const height = el.style.getPropertyValue('--table-height')
      const margin = el.style.getPropertyValue('--n-pagination-margin')
      const match = margin.match(/^(\d+)/) // 提取第一个数值
      const number = match ? parseInt(match[1], 10) : 0
      if (binding.value.scrollY) {
        if (binding.value.show) {
          el.style.setProperty('--table-max-height', `${height - (size.medium + number)}px`)
          return
        }
        if (!binding.value.page || binding.value.page.pageSize * binding.value.page.page >= binding.value.page.itemCount) {
          el.style.setProperty('--table-max-height', `${height}px`)
          return
        }
        if (!binding.value.page.size) {
          el.style.setProperty('--table-max-height', `${height - (size.medium + number)}px`)
        } else {
          el.style.setProperty('--table-max-height', `${height - (size[binding.value.page.size] + number)}px`)
        }
      }
    },
  })
}
function onLoadLoading(app: App) {
  app.directive('loading', {
    mounted(el, binding) {
      if (binding.value) {
        const id = generateRandomId()
        el.style.position = 'relative' 
        // 复制
        const loadingDivCopy = loadingDiv.cloneNode(true) as HTMLElement
        el.style.setProperty('--loading-id', id)
        loadingMap.set(id, loadingDivCopy)
        el.appendChild(loadingDivCopy)
      }
    },
    updated(el, binding) {
      const id = el.style.getPropertyValue('--loading-id')
      const div = loadingMap.get(id)
      if (binding.value) {
        onCreateLoading()
        div?.remove()
        el.appendChild(loadingDiv)
        loadingMap.set(id, loadingDiv)
      } else {
        div?.remove()
      }
    },
    unmounted(el) {
      const id = el.style.getPropertyValue('--loading-id')
      loadingMap.delete(id)
      console.log(loadingMap.size);
      
    },
   
  })
}

export default function onLoadDirective(app: App) {
  onLoadAuth(app)
  onLoadTableScrollY(app)
  onLoadLoading(app)
}
