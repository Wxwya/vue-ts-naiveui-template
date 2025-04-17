<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path + formItem.isShow" v-bind="{ ...$attrs, ...formItem }">
    <n-radio-group v-model:value="value[formItem.path]" v-bind="content">
      <n-radio v-for="(p, i) in content.options" :key="i" :value="p.value"
        :label="p.label">
      </n-radio>
    </n-radio-group>
  </n-form-item>
</template>
<script setup >
import { defineProps } from 'vue'
import {NFormItem, NRadioGroup, NRadio} from 'naive-ui'
defineProps({
  value:{
    type: Object,
    default: () => ({})
  },
  formItem:{
    type: Object,
    default: () => ({})
  },
  content:{
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped></style>
