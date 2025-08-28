<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path!" v-bind="{ ...$attrs, ...formItem }">
    <div class="flex-1">
      <n-auto-complete v-model:value="value![formItem!.path!]" :input-props="{ autocomplete: 'disabled' }" clearable
      v-bind="content" />
      <div v-if="content.comment" class="text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
    
  </n-form-item>
</template>
<script setup lang="ts">
import {NFormItem, NAutoComplete} from 'naive-ui'
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
    type: Object as PropType<FormItemContentMap['auto']>,
    default: () => ({})
  }
})
</script>
<style lang="css" scoped></style>
