<template>
  <n-config-provider :locale="zhCN" :theme="systemConfig.theme" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-modal-provider>
            <n-dialog-provider>
              <NaiveSetup />
              <router-view v-if="isReady" />
              <div v-else style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;">
                <n-spin size="small" />
              </div>
            </n-dialog-provider>
          </n-modal-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NModalProvider, NDialogProvider, NNotificationProvider, NLoadingBarProvider, NSpin } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref,defineComponent } from 'vue'
import useScreen from '@/hooks/useScreen'
import useUpdate from '@/hooks/useUpdate'
import useSystemConfigStore from '@/store/systemConfigStore'
import useNaive from '@/hooks/useNaive'
import router from '@/router'
const { systemConfig } = storeToRefs(useSystemConfigStore())
useScreen()
useUpdate()
const isReady = ref(false)
router.isReady().then(() => { isReady.value = true })
const NaiveSetup= defineComponent({
  setup() { 
    useNaive()
  },
  render() {
    return null
  }
})
</script>
