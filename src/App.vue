<template>
  <n-config-provider :locale="zhCN" :theme="systemConfig.theme" :date-locale="dateZhCN">
    <router-view></router-view>
  </n-config-provider>

</template>

<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import {storeToRefs} from 'pinia'
import useSystemConfigStore from '@/store/systemConfigStore';
const { systemConfig } = storeToRefs(useSystemConfigStore())

</script>