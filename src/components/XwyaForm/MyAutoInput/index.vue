<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path! + formItem!.isShow!" v-bind="{ ...$attrs, ...formItem }">
    <n-auto-complete v-model:value="value![formItem!.path!]" :input-props="{ autocomplete: 'disabled' }" clearable
      v-bind="(content as FormItemContentMap['auto'])" />
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NAutoComplete} from 'naive-ui'
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
