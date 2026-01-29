<template>
  <n-popconfirm v-bind="popConfig">
    <template #icon v-if="icon">
      <n-icon :size="iconSize">
        <XwyaIcon :icon="icon" />
      </n-icon>
    </template>
    <template #trigger>
      <n-tooltip trigger="hover" v-bind="tooltipConfig">
        <template #trigger>
            <slot ></slot>
        </template>
        <span>{{ tooltipText }}</span>
      </n-tooltip>
    </template>
   {{ popText }}
  </n-popconfirm>
</template>

<script setup lang="ts">
import { NPopconfirm, NTooltip, NIcon } from 'naive-ui'
import { XwyaIcon } from '@/rely/page'
import type { PropType } from 'vue'
import type { TooltipProps, PopconfirmProps } from 'naive-ui'
defineProps({
  tooltipConfig: {
    type: Object as PropType<TooltipProps>,
    default: () => { }
  },
  popConfig: {
    type: Object as PropType<PopconfirmProps>,
    default: () => { }
  },
  popText: {
    type: String,
    default:""
  },
  tooltipText: {
    type: String,
    default:""
  },
  icon: {
    type: String,
    default:""
  },
  iconSize: {
    type: [Number, String],
    default:24
  }
})
</script>

<style lang="scss" scoped></style>
