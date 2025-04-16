<template>
  <n-form class="xwya-form" :inline="false" ref="formRef" label-width="auto" label-align="right" :model="modelValue"
    :disabled="disabled" v-bind="$attrs">
    <div class="flex flex-col gap-2">
      <div v-for="(c, index) in colNum" :key="index" >
        <n-flex>
          <component v-for="(p, i) in itemList.slice(index * rowNum, (index + 1) * rowNum)" :key="i" :is="type[p.type]"
            :value="modelValue"
            :style="{ width: p?.itemWidth ? p.itemWidth : `calc((100% - ${(rowNum - 1) * 12}px) / ${rowNum}` }"
            class="  max-md:!w-full" :formItem="p.item" :content="p.content"></component>
          <div v-if="c== colNum" class="flex flex-wrap gap-2 items-center max-md:justify-end  max-md:!w-full"
            :style="{ width: row === 1 ? '100%' : 'auto' }">
            <slot v-for="(_, name) in $slots" :key="name" :name="name" :change="onChange" :state="disabled"
              :validate="validate" :reset="reset"></slot>
          </div>
        </n-flex>
      </div>
    </div>

  </n-form>
</template>
<script lang="ts" setup>
import { defineProps, ref,computed,defineExpose } from "vue"
import type { PropType } from "vue"
import { NForm, NFlex } from "naive-ui";
import type { FormInst } from "naive-ui";
import MyInput from "./MyInput/index.vue"
import MyCheck from "./MyCheck/index.vue"
import MySelect from "./MySelect/index.vue"
import MyDate from "./MyDete/index.vue";
import MyRadio from "./MyRadio/index.vue";
import MyTags from "./MyTags/index.vue"
import MyNumberInput from './MyNumberInput/index.vue'
import MySwitch from "./MySwitch/index.vue"
import MyCascader from './MyCascader/index.vue'
import MyTransfer from './MyTransfer/index.vue'
import MyAutoInput from "./MyAutoInput/index.vue"
import MyUpload from './MyUpload/index.vue'
import MyTreeSelect from './MyTreeSelect/index.vue'
const type: ComponentMap = {
  input: MyInput,
  check: MyCheck,
  select: MySelect,
  date: MyDate,
  radio: MyRadio,
  tags: MyTags,
  number: MyNumberInput,
  switch: MySwitch,
  cascader: MyCascader,
  transfer: MyTransfer,
  auto: MyAutoInput,
  upload: MyUpload,
  tree: MyTreeSelect
}
const props =defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  itemList: {
    type: Array as PropType<FormItemRowStruct[]>,
    default: () => []
  },
  row: {
    type: Number,
    default: 1
  },
  col: {
    type: Number,
    default: 1
  },
})
const disabled = ref<boolean>(false)
const formRef = ref<FormInst | null>(null)
const colNum = computed(() => {
  let count =  Math.ceil(props.itemList.length / props.row)
  if (props.col > count)  return count
  return props.col===1?Math.ceil(props.itemList.length/props.row):props.col
})
const rowNum = computed(() => {
  if(props.row === 1 && props.col === 1) return props.row
  return props.row*props.col< props.itemList.length ? Math.ceil(props.itemList.length / props.col) : props.row
})
const onChange = () => {
  disabled.value = !disabled.value
}
const validate = () => {
  return formRef.value!.validate!
}
const reset = () => {
  formRef.value && formRef.value.restoreValidation()
}
defineExpose({
  validate,
  disabled
})
</script>
<style></style>
