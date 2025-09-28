<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path" v-bind="{ ...$attrs, ...formItem }">
    <div class="flex-1">
      <n-radio-group v-model:value="value[formItem.path]" v-bind="content">
        <n-radio v-for="(p, i) in content.options" :key="i" :value="p.value" :label="p.label"> </n-radio>
      </n-radio-group>
      <div v-if="content.comment" class="text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<script setup >
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
