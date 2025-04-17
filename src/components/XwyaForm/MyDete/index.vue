<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path + formItem.isShow"
    v-bind="{ ...$attrs, ...formItem }">
    <n-date-picker value-format="yyyy.MM.dd HH:mm:ss" style="width: 100%;"
      v-model:formatted-value="(value[formItem.path])" type="date" :clearable="true"
      v-bind="content" />
  </n-form-item>
</template>
<script setup>
import { defineProps } from 'vue'
import {NFormItem, NDatePicker} from 'naive-ui'
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
<style scoped></style>
