<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path! + formItem!.isShow!" v-bind="{ ...$attrs, ...formItem }">
    <n-transfer v-model:value="value![formItem!.path!]" style="width: 100%"
      v-bind="(content as FormItemContentMap['transfer'])" />
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import { NFormItem, NTransfer } from 'naive-ui'
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
