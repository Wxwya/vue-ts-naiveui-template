<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path" v-bind="{ ...$attrs, ...formItem }">
    <div class="flex-1">
      <n-transfer v-model:value="value[formItem.path]" style="width: 100%" v-bind="content" />
      <div v-if="content.comment" class="text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<script setup >
import { defineProps } from 'vue'
import { NFormItem, NTransfer } from 'naive-ui'
defineProps({
  value:{
    type: Object,
    default: () => ({})
  },
  formItem:{
    type: Object ,
    default: () => ({})
  },
  content:{
    type: Object ,
    default: () => ({})
  }
})
</script>
<style lang="scss" scoped></style>
