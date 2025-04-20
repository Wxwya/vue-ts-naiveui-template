<template>
  <n-form
    class="xwya-form"
    ref="formRef"
    label-width="auto"
    label-align="right"
    :model="modelValue"
    :disabled="disabled"
    v-bind="$attrs"
    :inline="false"
  >
    <div class="flex flex-col gap-2">
      <div v-for="(c, index) in colRowConfig.col" :key="index">
        <n-flex>
          <component
            v-for="(p) in itemList.slice(index * colRowConfig.row, (index + 1) * colRowConfig.row)"
            :key="p.item.path"
            :is="type[p.type]"
            :value="modelValue"
            :style="{
              width: rowFlex
                ? p?.itemWidth
                  ? p.itemWidth
                  : '100%'
                : p?.itemWidth
                ? p.itemWidth
                : `calc((100% - ${(colRowConfig.row - 1) * 12}px) / ${colRowConfig.row}`,
            }"
            class="max-md:!w-full"
            :formItem="p.item"
            :content="p.content"
          ></component>
          <div
            v-if="c == colRowConfig.col"
            class="flex flex-wrap gap-2 items-center max-md:justify-end max-md:!w-full"
            :style="{ width: rowFlex?'100%': colRowConfig.row === 1 ? '100%' : 'auto' }"
          >
            <slot
              v-for="(_, name) in $slots"
              :key="name"
              :name="name"
              :change="onChange"
              :state="disabled"
              :validate="validate"
              :reset="reset"
            ></slot>
          </div>
        </n-flex>
      </div>
    </div>
  </n-form>
</template>
<script  setup>
import { defineProps, ref, computed, defineExpose } from 'vue'
import { NForm, NFlex } from 'naive-ui'
import MyInput from './MyInput/index.vue'
import MyCheck from './MyCheck/index.vue'
import MySelect from './MySelect/index.vue'
import MyDate from './MyDete/index.vue'
import MyRadio from './MyRadio/index.vue'
import MyTags from './MyTags/index.vue'
import MyNumberInput from './MyNumberInput/index.vue'
import MySwitch from './MySwitch/index.vue'
import MyCascader from './MyCascader/index.vue'
import MyTransfer from './MyTransfer/index.vue'
import MyAutoInput from './MyAutoInput/index.vue'
import MyUpload from './MyUpload/index.vue'
import MyTreeSelect from './MyTreeSelect/index.vue'
const type = {
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
  tree: MyTreeSelect,
}
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  itemList: {
    type: Array,
    default: () => [],
  },
  row: {
    type: Number,
    default: 1,
  },
  col: {
    type: Number,
    default: 1,
  },

  rowFlex: {
    type: Boolean,
    default: false,
  },
})
const disabled = ref(false)
const formRef = ref(null)
const colRowConfig = computed(() => {
  if (props.col === 1 && props.row === 1) {
    if (props.rowFlex) {
      return { col: 1, row: Math.ceil(props.itemList.length / props.col) }
    } else {
      return { col: Math.ceil(props.itemList.length / props.col), row: 1 }
    }
  }
  if (props.col * props.row < props.itemList.length) {
    return { col: props.col, row: Math.ceil(props.itemList.length / props.col) }
  }
  return { col: props.col, row: props.row }
})
const onChange = () => {
  disabled.value = !disabled.value
}
const validate = () => {
  return formRef.value.validate
}
const reset = () => {
  formRef.value && formRef.value.restoreValidation()
}
defineExpose({
  validate,
  disabled,
})
</script>
<style></style>