<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path + formItem.isShow" v-bind="{ ...$attrs, ...formItem }">
    <n-input-number style="width: 100%;" button-placement="both" v-model:value="value[formItem.path]"
      v-bind="content" />
  </n-form-item>
</template>

<script setup >
import { defineProps } from 'vue'
import {NFormItem, NInputNumber} from 'naive-ui'
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
