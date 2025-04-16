<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path! + formItem!.isShow!" v-bind="{ ...$attrs, ...formItem }">
    <n-input v-bind="(content as FormItemContentMap['input'])" v-model:value="value![formItem!.path!]"
      :key="formItem!.path! + formItem.isShow!" />
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NInput} from 'naive-ui'
import type {PropType} from "vue"
defineProps({
  value:{
    type: Object,
    default: () => ({})
  },
  formItem:{
    type: Object as PropType<FormItemRowStateStruct>,
    default: () => ({})
  },
  content:{
    type: Object as PropType<FormItemRowStruct>,
    default: () => ({})
  }
})
</script>
<style lang="css" scoped></style>
