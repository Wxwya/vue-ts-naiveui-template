import { h} from 'vue'
import { defineStore } from 'pinia'
import router, { getPageRoutes, staticRoutes, resetRouter } from '@/router'
// asyncPageRoutes,
import { getUserInfo } from '@/api/user'
import { getDefaultDiceOptions } from '@/api/dict'
import XwyaIcon from '@/components/XwyaIcon/index.vue'
import cache from '@/utils/cache'
import { TokenEnums } from '@/enums/cacheEnums'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuOption } from 'naive-ui'
const pages = import.meta.glob<{ [ket: string]: any }>('@/views/**/index.vue')
class UserStore {
  permissions: string[] = []
  userInfo: SystemUser.UserInfo | null = null
  menus: MenuOption[] = []
  isLoadRoutes: boolean = false
  defaultOptions: Record<string, DefaultOptions[]> = {}
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
        this.userInfo = res.data!
        this.permissions = res.data!.permissions
        this.handleRoutes(res.data!.routes)
        this.onLoadDefaultOptions()
      }
    },
    addRoutes(asyncRoutes: RouteRecordRaw[]) {
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
    handleRoutes(routes: SystemUser.Route[]) {
      const newRoutes: RouteRecordRaw[] = []
      if (routes) {
        routes.forEach((elemnt: SystemUser.Route) => {
          let item :any = { ...elemnt, meta: {title:elemnt.title,sort:elemnt.sort} } 
          if (item?.children && item?.children?.length > 0) {
            item.children = item.children.map((p: SystemUser.Route) => {
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
          newRoutes.push((item as RouteRecordRaw))
        })
      }
      this.addRoutes(newRoutes)
    },
    handlePermissionsRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
      return routes.filter((item: RouteRecordRaw) => {
        if (item.children && item.children.length > 0) {
          item.children = this.handlePermissionsRoutes(item.children)
        }
        return this.permissions.includes(item?.name as string)
      })
    },
    handleNav(routes: RouteRecordRaw[]): MenuOption[] {
      return routes
        .map((item: RouteRecordRaw) => {
          if (item.hidden) return null // 如果 hidden，则不处理该项
          let p: MenuOption = { label: item!.meta!.title!, key: item.path }
          if (item?.icon) {
            p.icon = () => h(XwyaIcon, { icon: item.icon ?? '' })
          }
          if (item.children && item.children.length > 0) {
            if (!item.alwaysShow && item.children.length === 1) {
              const child = item.children[0]
              if (child.icon) {
                p.icon = () => h(XwyaIcon, { icon: child.icon ?? '' })
              }
              p.label = child!.meta!.title!
              p.key = child.path
            } else {
              p.children = this.handleNav(item.children)
            }
          }
          return p
        })
        .filter(Boolean) as MenuOption[]
    },
    async onLoadDefaultOptions() { 
      const res = await getDefaultDiceOptions()
      if (res.code === 200) { 
        this.defaultOptions = res.data!.reduce((acc, item) => {
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
