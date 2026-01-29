import { createRouter,createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// , createWebHistory
import { deepClone } from '@/utils/handle'
import layout from '@/layouts/index.vue'
declare module 'vue-router' {
  interface _RouteRecordBase {
    hidden?: boolean // 是否显示在侧边栏
    alwaysShow?: boolean // 是否总是显示根路由
    title?: string // 菜单标题
    icon?: string // 菜单图标
  }
}

export let pageRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: layout,
    redirect: '/form',
    children: [
      {
        path: '/form',
        name: 'form',
        meta: { title: '表单示例' },
        icon: 'solar--document-text-bold',
        component: () => import('@/views/form/index.vue'),
      },
      {
        path: '/table',
        name: 'table',
        meta: { title: '表格示例' },
        icon: 'solar--clapperboard-bold',
        component: () => import('@/views/table/index.vue'),
      },
      // {
      //   path: '/other',
      //   name: 'other',
      //   title: '其他示例',
      //   icon: 'ic--outline-filter-3',
      //   component: () => import('@/views/other'),
      // },

      // {
      //   path: '/info',
      //   name: 'info',
      //   redirect: '/posts',
      //   title: '测试二级路由',
      //   icon: 'ic--outline-filter-4',
      //   children: [
      //     {
      //       path: '/info/posts',
      //       name: 'posts',
      //       title: '文章',
      //       icon: 'ic--outline-filter-5',
      //       component: () => import('@/views/posts'),
      //     },
      //     {
      //       path: '/info/chart',
      //       name: 'chart',
      //       title: '图表',
      //       icon: 'ic--outline-filter-6' ,
      //       component: () => import('@/views/chart'),
      //     },
      //     {
      //       path: '/info/user',
      //       name: 'user',
      //       title: '用户管理',
      //       icon: 'ic--outline-filter-7',
      //       component: () => import('@/views/user'),
      //     },
      //   ]
      // },
    ],
  },
]
export const getPageRoutes = (): RouteRecordRaw[] => deepClone<RouteRecordRaw[]>(pageRoutes)
export const asyncPageRoutes: RouteRecordRaw[] = []
export const noLoyoutRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
  },
]
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*', // 捕获所有未匹配的路由
    component: () => import('@/views/notFound/index.vue'),
    hidden: true,
  },
]

const _createRouter = () =>
  createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(), //哈希模式
    scrollBehavior: () => ({ top: 0 }),
    routes: [...noLoyoutRoutes],
  })

let router = _createRouter()
export function resetRouter() {
  router = _createRouter()
}
export default router
