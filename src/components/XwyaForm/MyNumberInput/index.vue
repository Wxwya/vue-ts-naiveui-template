<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path! + formItem!.isShow!" v-bind="{ ...$attrs, ...formItem }">
    <n-input-number style="width: 100%;" button-placement="both" v-model:value="value![formItem!.path!]"
      v-bind="(content as FormItemContentMap['number'])" />
  </n-form-item>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NInputNumber} from 'naive-ui'
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
