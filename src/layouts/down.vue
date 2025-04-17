<template>
  <n-dropdown :options="options"  trigger="click" @select="handleSelect">
    <!-- <n-button>xwya</n-button> -->
    <n-space class=" items-center">
      <n-avatar v-if="settings.avatar" round size="small" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
      <div>xwya</div>
    </n-space>
  </n-dropdown>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { NDropdown, NAvatar, NSpace } from 'naive-ui'
import useSystemConfigStore from '@/store/systemConfigStore'
import useUserStore from '@/store/userStore'
import settings from '@/settings'
const systemConfigStore = useSystemConfigStore()
const  userStore=useUserStore()
const api = inject("api")
const { push } = useRouter()
const options = [
  {
    label: '用户资料',
    key: 'profile',
  },
  {
    label: '切换布局',
    key: 'layout',
  },
  {
    label: '切换主题',
    key: 'theme',
  },
  {
    label: '退出登录',
    key: 'logout',
  }
]
const handleSelect = (key) => { 
  switch (key) { 
    case 'layout':
    systemConfigStore.changeLayout()
      break;
    case 'theme':
      systemConfigStore.changeTheme()
      break;
    case 'logout':
      logout()
      break;
    default:
      console.log('default');
      break;
  }
}
const logout = async () => { 
  const res = await api.system.logout()
  if (res.code === 200) { 
    userStore.reset()
    push("/login")
  }
}
</script>
<style lang="scss" scoped></style>
