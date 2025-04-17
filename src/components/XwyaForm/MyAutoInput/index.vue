<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path + formItem.isShow" v-bind="{ ...$attrs, ...formItem }">
    <n-auto-complete v-model:value="value[formItem.path]" :input-props="{ autocomplete: 'disabled' }" clearable
      v-bind="content" />
  </n-form-item>
</template>
<script setup>
import { defineProps } from 'vue'
import {NFormItem, NAutoComplete} from 'naive-ui'
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
    type: Object ,
    default: () => ({})
  }
})
</script>
<style lang="css" scoped></style>
