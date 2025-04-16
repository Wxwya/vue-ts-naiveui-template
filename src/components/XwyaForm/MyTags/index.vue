<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path! + formItem!.isShow!" v-bind="{ ...$attrs, ...formItem }">
    <n-dynamic-tags v-model:value="value![formItem!.path!]" v-bind="(content as FormItemContentMap['tags'])" />
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NDynamicTags} from 'naive-ui'
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
<style lang="css" scoped>
:deep(.n-tag) {
  --n-color: "" !important;
}
</style>
