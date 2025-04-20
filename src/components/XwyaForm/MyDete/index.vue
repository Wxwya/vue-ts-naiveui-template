<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path"
    v-bind="{ ...$attrs, ...formItem }">
    <div class="flex-1">
      <n-date-picker
      value-format="yyyy-MM-dd HH:mm:ss"
      style="width: 100%"
      v-model:formatted-value="(value[formItem.path])"
      type="date"
      :clearable="true"
      v-bind="content"
    />
      <div v-if="content.comment" class=" text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<script setup>
import { defineProps } from 'vue'
import {NFormItem, NDatePicker} from 'naive-ui'
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
    type: Object ,
    default: () => ({})
  }
})
</script>
<style scoped></style>
