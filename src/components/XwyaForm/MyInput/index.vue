<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path!" v-bind="{ ...$attrs, ...formItem }">
    <div class="flex-1">
      <n-input v-bind="content" v-model:value="value![formItem!.path!]" />
      <div v-if="content.comment" class="text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<script setup lang="ts">
import { NFormItem, NInput } from 'naive-ui'
import type { PropType } from 'vue'
defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  formItem: {
    type: Object as PropType<FormItemRowStateStruct>,
    default: () => ({}),
  },
  content: {
    type: Object as PropType<FormItemContentMap['input']>,
    default: () => ({}),
  },
})

</script>
<style lang="css" scoped></style>
