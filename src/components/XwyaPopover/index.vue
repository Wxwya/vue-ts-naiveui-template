<template>
  <n-tooltip v-bind="$attrs">
    <template  #trigger>
      <slot ></slot>
    </template>
      {{ text }}
  </n-tooltip>
</template>

<script setup>
import { NTooltip } from 'naive-ui'
defineProps({
  text: {
    type: String,
    default: ''
  }
})

</script>

<style lang="scss" scoped></style>
