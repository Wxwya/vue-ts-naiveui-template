<template>
  <n-form-item v-show="!formItem.isShow" v-bind="{ ...$attrs, ...formItem }" :key="formItem!.path! + formItem!.isShow!">
    <n-checkbox-group v-model:value="value![formItem!.path!] " v-bind="(content as FormItemContentMap['check'])">
      <n-checkbox v-for="(p, i) in (content as FormItemContentMap['check']).options" :key="p.value || i" :value="p.value"
        :label="p.label">
      </n-checkbox>
    </n-checkbox-group>
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NCheckboxGroup, NCheckbox} from 'naive-ui'
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
