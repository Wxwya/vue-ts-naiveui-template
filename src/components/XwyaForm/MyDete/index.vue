<template>
  <n-form-item v-show="!formItem.isShow!" :key="formItem!.path! + formItem!.isShow!"
    v-bind="{ ...$attrs, ...formItem }">
    <n-date-picker value-format="yyyy.MM.dd HH:mm:ss" style="width: 100%;"
      v-model:formatted-value="(value![formItem!.path!])" type="date" :clearable="true"
      v-bind="(content as FormItemContentMap['date'])" />
  </n-form-item>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
import {NFormItem, NDatePicker} from 'naive-ui'
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
<style scoped></style>
