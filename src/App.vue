<template>
<n-config-provider :locale="zhCN" :theme="systemConfig.theme" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-modal-provider>
            <n-dialog-provider>
              <LoadNaiveRouterView />
            </n-dialog-provider>
          </n-modal-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup >
import { NConfigProvider, NMessageProvider, NModalProvider, NDialogProvider, NNotificationProvider, NLoadingBarProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import {storeToRefs} from 'pinia'
import useSystemConfigStore from '@/store/systemConfigStore';
import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'
import useScreen from "@/hooks/useScreen";
import useNaive from '@/hooks/useNaive'
import useUpdate from '@/hooks/useUpdate';
const { systemConfig } = storeToRefs(useSystemConfigStore())
useScreen()
useUpdate()
const LoadNaiveRouterView= defineComponent({
  setup() { 
    useNaive()
  },
  render() {
    return h(RouterView)
  }
})
</script>