<template>
  <n-form-item v-show="!formItem.isShow" v-bind="{ ...$attrs, ...formItem }" :key="formItem.path">
    <div class="flex-1">
      <n-switch v-model:value="value[formItem.path]" v-bind="content" />
      <div v-if="content.comment" class="text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<script setup>
import { defineProps } from 'vue'
import {NFormItem, NSwitch} from 'naive-ui'
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

<style lang="css" scoped></style>