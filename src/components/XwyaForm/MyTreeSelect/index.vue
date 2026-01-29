<script lang="ts" setup>
import { NFormItem, NTreeSelect } from "naive-ui";
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
    type: Object as PropType<FormItemContentMap['tree']>,
    default: () => ({})
  }
})
</script>
<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem!.path!" v-bind="{ ...$attrs, ...formItem }">
    <div class="flex-1">
      <n-tree-select v-model:value="value![formItem!.path!]" v-bind="content" />
      <div v-if="content.comment" class=" text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<style lang="scss" scoped></style>
