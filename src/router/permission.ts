import router from '@/router'
import useUserStore from '@/store/userStore'
import settings from '@/settings'
import cache from '@/utils/cache'
import { TokenEnums } from '@/enums/cacheEnums'
router.beforeEach(async (to: any, _, next: any) => {
  const userStore = useUserStore()
  const token = cache.getLocalStorage(TokenEnums.TOKEN_KEY)
  window.$bar.start()
  if (token) {
    if (!userStore.isLoadRoutes) {
      await userStore.onLoadUserInfo();
      userStore.isLoadRoutes = true;
      next({ ...to, replace: true }); 
    } else {
      if (to.path === '/login') {
        next('/');
      } else {
        next();
      }
    }
  } else { 
    if (to.path === '/login') {
      next()
    } else { 
      next(`/login?redirect=${to.path}`)
    }
  }
})
router.afterEach((to: any) => {
  window.$bar.finish()
  document.title =`${to.meta.title?settings.title+'-'+to.meta.title:settings.title}`
})