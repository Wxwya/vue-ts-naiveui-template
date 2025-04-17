import { createRouter,createWebHistory } from 'vue-router'
//  ,createWebHashHistory
import { deepClone } from '@/utils/handle'
import layout from '@/layouts/index.vue'

export let pageRoutes= [
  {
    path: '/',
    name: 'layout',
    component: layout,
    redirect: '/form',
    children: [
      {
        path: '/form',
        name: 'form',
        meta: {title:"表单示例"},
        icon: 'solar--document-text-bold',
        component: () => import('@/views/form/index.vue'),
      },
      {
        path: '/table',
        name: 'table',
        meta: {title:"表格示例"},
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
export const getPageRoutes = () => deepClone(pageRoutes)
export const asyncPageRoutes = []
export const noLoyoutRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
  },
]
export const staticRoutes = [
  {
    path: '/:pathMatch(.*)*', // 捕获所有未匹配的路由
    component: () => import('@/views/notFound/index.vue'),
    hidden: true,
  },
]

const _createRouter = () =>
  createRouter({
    history: createWebHistory(),
    // history: createWebHashHistory(), //哈希模式
    scrollBehavior: () => ({ top: 0 }),
    routes: [...noLoyoutRoutes],
  })

let router = _createRouter()
export function resetRouter() {
  router = _createRouter()
}
export default router
