<template>
  <n-button v-bind="$attrs">
    <template #icon v-if="icon">
      <n-icon :size="iconSize">
        <XwyaIcon :icon="icon" />
      </n-icon>
    </template>
    <span v-if="text">{{ text }}</span>
    <template v-if="!text" #default>
      <slot></slot>
    </template>
  </n-button>
</template>
<script setup >
import { defineProps } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import XwyaIcon from '@/components/XwyaIcon/index.vue'
defineProps({
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconSize: {
    type: [Number, String],
    default: 24
  }
})
</script>
<style lang="scss" scoped></style>
