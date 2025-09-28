<template>
  <n-form-item v-show="!formItem.isShow" v-bind="{ ...$attrs, ...formItem }" :key="formItem.path">
    <div class="flex-1">
      <n-checkbox-group v-model:value="value[formItem.path] " v-bind="content">
      <n-checkbox v-for="(p, i) in content.options" :key="p.value || i" :value="p.value"
        :label="p.label">
      </n-checkbox>
    </n-checkbox-group>
    <div v-if="content.comment"  class=" text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
import {NFormItem, NCheckboxGroup, NCheckbox} from 'naive-ui'
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
