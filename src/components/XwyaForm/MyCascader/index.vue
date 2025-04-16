<template>
  <n-form-item v-show="!formItem.isShow" v-bind="{ ...$attrs, ...formItem }" :key="formItem!.path! + formItem!.isShow!">
    <n-cascader v-model:value="value![formItem!.path!]" expand-trigger="click" check-strategy="child" :show-path="true"
      :filterable="true" v-bind="(content as FormItemContentMap['cascader'])" />
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NCascader} from 'naive-ui'
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
<style lang="scss" scoped></style>
