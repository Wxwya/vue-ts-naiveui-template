<script setup>
import { NFormItem, NTreeSelect } from 'naive-ui'
defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  formItem: {
    type: Object,
    default: () => ({}),
  },
  content: {
    type: Object,
    default: () => ({}),
  },
})
</script>
<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path" v-bind="{ ...$attrs, ...formItem }">
    <div class="flex-1">
      <n-tree-select v-model:value="value[formItem.path]" v-bind="content" />
      <div v-if="content.comment" class="text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<style lang="scss" scoped></style>
