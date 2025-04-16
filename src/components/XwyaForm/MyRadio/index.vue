<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path! + formItem!.isShow!" v-bind="{ ...$attrs, ...formItem }">
    <n-radio-group v-model:value="value![formItem!.path!]" v-bind="(content as FormItemContentMap['radio'])">
      <n-radio v-for="(p, i) in (content as FormItemContentMap['radio']).options!" :key="i" :value="p.value"
        :label="p.label">
      </n-radio>
    </n-radio-group>
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NRadioGroup, NRadio} from 'naive-ui'
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
