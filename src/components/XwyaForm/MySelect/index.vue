<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path + formItem.isShow" v-bind="{ ...$attrs, ...formItem }">
    <n-select v-model:value="value[formItem.path]" v-bind="content" />
  </n-form-item>
</template>
<script setup >
import { defineProps } from 'vue'
import {NFormItem, NSelect} from 'naive-ui'
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
<style lang="css" scoped>
:deep(.n-tag) {
  --n-color: '' !important;
}
</style>
