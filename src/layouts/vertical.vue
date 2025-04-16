<template>
  <n-layout>
    <n-layout-header class="w-full h-[64px] px-4" bordered>
      <n-flex justify="space-between" class="h-full" align="center">
        <XwyaIcon icon="hamburger-left" class="text-2xl" @click="systemConfig.collapsed=!systemConfig.collapsed"  v-if="!systemConfig.isPc" />
        <img v-else src="https://upload.shejihz.com/2020/02/961c95fffbdd3ecc99fdb4e33faa8237.jpg" class="w-[400px] h-full"
          alt="logo">
        <Down />
      </n-flex>
    </n-layout-header>
   <MobileMenu />
    <n-layout class="h-[calc(var(--vh,1vh)*100-64px)]" has-sider  >
      <n-layout-sider v-if="systemConfig.isPc" collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="systemConfig.collapsed" show-trigger
        @collapse="systemConfig.collapsed = true" @expand="systemConfig.collapsed = false" bordered>
        <n-menu   :render-icon="renderMenuIcon" :default-value="path" @update:value="onUpdareValue"  :collapsed="systemConfig.collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menus" />
      </n-layout-sider>
      <n-layout :native-scrollbar="false" content-class="h-full p-4">
          <router-view v-slot="{ Component }">
            <transition appear name="fade-transform" mode="out-in">
              <!-- <keep-alive :exclude="['SubMenu','BuSiness','subDict','ButtonPermissions']"> -->
                <component :is="Component" />
              <!-- </keep-alive> -->
            </transition>
          </router-view>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider, NMenu, NLayoutHeader, NFlex} from 'naive-ui'
import Down from "./down.vue"
import useLayout from './useLayout'
import MobileMenu from "./mobileMenu.vue"
import { XwyaIcon } from '@/rely/page'
const { systemConfig,menus,path,onUpdareValue,renderMenuIcon} = useLayout()

</script>

<style scoped>

</style>
