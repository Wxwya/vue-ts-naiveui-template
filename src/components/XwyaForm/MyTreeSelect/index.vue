<script lang="ts" setup>
import { defineProps } from 'vue'
import { NFormItem, NTreeSelect } from "naive-ui";
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
<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path! + formItem!.isShow!" v-bind="{ ...$attrs, ...formItem }">
    <n-tree-select v-model:value="value![formItem!.path!]" v-bind="(content as FormItemContentMap['tree'])" />
  </n-form-item>
</template>
<style lang="scss" scoped></style>
