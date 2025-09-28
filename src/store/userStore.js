import { h} from 'vue'
import { defineStore } from 'pinia'
import router, { getPageRoutes, staticRoutes, resetRouter } from '@/router'
// asyncPageRoutes,
import { getUserInfo } from '@/api/user'
import { getDefaultDiceOptions } from '@/api/dict'
import XwyaIcon from '@/components/XwyaIcon/index.vue'
import cache from '@/utils/cache'
import { TokenEnums } from '@/enums/cacheEnums'

const pages = import.meta.glob('@/views/**/index.vue')
class UserStore {
  permissions= []
  userInfo = null
  menus = []
  isLoadRoutes = false
  defaultOptions = {}
}
const useUserStore = defineStore('userStore', {
  state: () => ({
    ...new UserStore(),
  }),
  actions: {
    async onLoadUserInfo() {
      // 发请求获取用户信息逻辑
      const res = await getUserInfo()
      if (res.code === 200) {
        this.userInfo = res.data
        this.permissions = res.data.permissions
        this.handleRoutes(res.data.routes)
        this.onLoadDefaultOptions()
      }
    },
    addRoutes(asyncRoutes) {
      let pageRoutes = getPageRoutes()
      // const asyncRoutes = this.handlePermissionsRoutes(asyncPageRoutes)
      if (asyncRoutes.length) {
        pageRoutes[0].children = [...(pageRoutes?.[0]?.children || []), ...asyncRoutes]
      }
      // console.log(pageRoutes[0]);
      const routes = [...pageRoutes, ...staticRoutes]
      routes.forEach((item) => {
        router.addRoute(item)
      })
      // @ts-ignore
      this.menus = this.handleNav(pageRoutes?.[0]?.children)
      console.log('添加路由完成', this.menus)
    },
    handleRoutes(routes) {
      const newRoutes = []
      if (routes) {
        routes.forEach((elemnt) => {
          let item = { ...elemnt, meta: {title:elemnt.title,sort:elemnt.sort} } 
          if (item?.children && item?.children?.length > 0) {
            item.children = item.children.map((p) => {
              const arr = p.path.split('/')
              return {
                path: p.path,
                name: `${arr[1]}-${arr[2]}`,
                meta: { title: p.title,sort:p.sort},
                icon: p.icon,
                hidden: p.hidden,
                component: pages[`/src/views${p.path}/index.vue`],
              }
            })
          } else {
            item.component = pages[`/src/views${item.path}/index.vue`]
          }
          newRoutes.push(item)
        })
      }
      this.addRoutes(newRoutes)
    },
    handlePermissionsRoutes(routes) {
      return routes.filter((item) => {
        if (item.children && item.children.length > 0) {
          item.children = this.handlePermissionsRoutes(item.children)
        }
        return this.permissions.includes(item?.name)
      })
    },
    handleNav(routes) {
      return routes
        .map((item) => {
          if (item.hidden) return null // 如果 hidden，则不处理该项
          let p = { label: item.meta.title, key: item.path }
          if (item?.icon) {
            p.icon = () => h(XwyaIcon, { icon: item.icon ?? '' })
          }
          if (item.children && item.children.length > 0) {
            if (!item.alwaysShow && item.children.length === 1) {
              const child = item.children[0]
              if (child.icon) {
                p.icon = () => h(XwyaIcon, { icon: child.icon ?? '' })
              }
              p.label = child.meta.title
              p.key = child.path
            } else {
              p.children = this.handleNav(item.children)
            }
          }
          return p
        })
        .filter(Boolean)
    },
    async onLoadDefaultOptions() { 
      const res = await getDefaultDiceOptions()
      if (res.code === 200) { 
        this.defaultOptions = res.data.reduce((acc, item) => {
          const { type } = item;
          const keys = type.split(':');
          if (!acc[keys[keys.length-1]]) {
            acc[keys[keys.length-1]] = [];
          }
          acc[keys[keys.length-1]].push(item);
          return acc;
        }, {});
      }
    },
    reset() {
      cache.remove(TokenEnums.TOKEN_KEY)
      cache.remove(TokenEnums.REFRESH_KEY)
      this.$reset()
      resetRouter()
    },
  },
})
export default useUserStore
