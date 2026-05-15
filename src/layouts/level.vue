<template>
  <n-layout has-sider>
    <n-layout-sider v-if="systemConfig.isPc" collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="systemConfig.collapsed"
       @collapse="systemConfig.collapsed = true" @expand="systemConfig.collapsed = false" bordered>
      <div>
        <img :src="getImgUrl" class="w-full h-[54px]" alt="logo" v-if="set.sidebarLogo">
        <n-menu :render-icon="renderMenuIcon" :default-value="path" @update:value="onUpdareValue" :collapsed="systemConfig.collapsed"
          :collapsed-width="64" :collapsed-icon-size="22" :options="menus" />
      </div>
    </n-layout-sider>
    <MobileMenu />
    <n-layout class="h-[calc(var(--vh,1vh)*100)]">
      <n-layout-header class="w-full h-[64px] px-4" bordered>
        <div class="flex w-full h-full items-center justify-between"   >
          <XwyaIcon :icon="systemConfig.collapsed?'hamburger-right':'hamburger-left' " class="text-2xl" @click="systemConfig.collapsed=!systemConfig.collapsed"   />
            <Down />
        </div>
      </n-layout-header>
      <n-layout class="h-[calc(var(--vh,1vh)*100-64px)]" :native-scrollbar="false" content-class="h-full p-4" >
        <router-view #default="{ Component,route }">
            <transition appear name="fade-transform" mode="out-in">
            <!-- <keep-alive :exclude="['SubMenu','BuSiness','SubDict','ButtonPermissions']"> -->
              <component :key="route.name || route.path" :is="Component" />
            <!-- </keep-alive> -->
          </transition>
        </router-view>
      </n-layout>
    </n-layout>
    
  </n-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NLayout, NLayoutSider, NMenu, NLayoutHeader} from 'naive-ui'
import Down from "./down.vue"
import useLayout from './useLayout'
import set from "@/settings"
import MobileMenu from "./mobileMenu.vue"
import { XwyaIcon } from '@/rely/page'
const { systemConfig, menus, path, onUpdareValue, renderMenuIcon } = useLayout()
const getImgUrl = computed<string>(() => {
  return systemConfig.value.collapsed? 'https://img1.baidu.com/it/u=3430690511,3867923153&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=453' : 'https://img2.baidu.com/it/u=3294558343,1244226277&fm=253&fmt=auto&app=138&f=JPEG?w=607&h=407'
})
</script>

<style scoped></style>
