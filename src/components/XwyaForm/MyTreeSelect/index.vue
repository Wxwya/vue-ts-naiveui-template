<script setup>
import { defineProps } from 'vue'
import { NFormItem, NTreeSelect } from "naive-ui";
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
<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path + formItem.isShow" v-bind="{ ...$attrs, ...formItem }">
    <n-tree-select v-model:value="value[formItem.path]" v-bind="content" />
  </n-form-item>
</template>
<style lang="scss" scoped></style>
