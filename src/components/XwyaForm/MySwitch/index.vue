<template>
  <n-form-item v-show="!formItem.isShow" v-bind="{ ...$attrs, ...formItem }" :key="formItem!.path! + formItem!.isShow!">
    <n-switch v-model:value="value![formItem!.path!]" v-bind="(content as FormItemContentMap['switch'])" />
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NSwitch} from 'naive-ui'
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