<template>
  <n-form-item v-show="!formItem.isShow" v-bind="{ ...$attrs, ...formItem }" :key="formItem.path + formItem.isShow">
    <n-cascader v-model:value="value[formItem.path]" expand-trigger="click" check-strategy="child" :show-path="true"
      :filterable="true" v-bind="content" />
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NCascader} from 'naive-ui'
defineProps({
  value:{
    type: Object,
    default: () => ({})
  },
  formItem:{
    type: Object,
    default: () => ({})
  },
  content:{
    type: Object,
    default: () => ({})
  }
})
</script>
<style lang="scss" scoped></style>
