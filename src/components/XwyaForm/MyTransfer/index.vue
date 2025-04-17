<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path + formItem.isShow" v-bind="{ ...$attrs, ...formItem }">
    <n-transfer v-model:value="value[formItem.path]" style="width: 100%"
      v-bind="content" />
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
