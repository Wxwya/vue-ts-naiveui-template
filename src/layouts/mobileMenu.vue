<script  setup>
import { NDrawer, NMenu } from 'naive-ui'
import useLayout from './useLayout'
const { systemConfig, menus, path, onUpdareValue, renderMenuIcon} = useLayout()
</script>
<template>
   <n-drawer v-if="!systemConfig.isPc" v-model:show="systemConfig.collapsed" :width="200" placement="left">
      <n-menu :render-icon="renderMenuIcon" :default-value="path" @update:value="onUpdareValue" :collapsed="!systemConfig.collapsed"
          :collapsed-width="64" :collapsed-icon-size="22" :options="menus" />
    </n-drawer>
</template>
<style lang="scss" scoped></style>
