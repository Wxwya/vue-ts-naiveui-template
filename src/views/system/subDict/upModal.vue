<script lang="ts" setup>
import { ref, computed} from 'vue'
import { generateDict } from '@/api/dict';
import {XwyaForm,XwyaButton} from "@/rely/page"
import type {PropType} from 'vue'
import type { FormRules } from "naive-ui"
const props = defineProps({
  close: {
    type: Function as PropType<() => void>,
    default: () => { }
  },
  getData: {
    type: Function,
    default: () => { }
  },
  row: {
    type: Object as PropType<any>,
    default: {}
  },
  userInfo: {
    type: Object as PropType<SystemUser.UserInfo>,
    default: () => { }
  },
  dict_type_id: {
    type: String,
    default: ''
  },
  total: {
    type: Number,
    default: 1
  }
})

const formData = ref({
  ...props.row,
  order_num: props.row.order_num ? props.row.order_num.toString() : (props.total + 1).toString(),
  username: props.row?.username ? props.row.username : props.userInfo.username,
})
const loading = ref(false)
const formItemData = computed<FormItemRowStruct[]>(() => ([
  { type: "input", item: { label: '字典键', path: 'dict_label', }, content: { placeholder: '请输入字典键' } },
  { type: "input", item: { label: '字典值', path: 'dict_value',}, content: { placeholder: '请输入字典值' } },
  { type: "input", item: {label: "排序", path: "order_num",  }, content: { placeholder: "请输入排序", } },
]))
const rules = computed<FormRules>(() => {
  return formItemData.value.reduce((acc: FormRules, cur:any, _) => {
    if(cur.item.path==='is_default' ) return acc 
    acc[cur.item.path] = [{ required: true, trigger: [],message:cur.content.placeholder,type:cur.item.ruleType }]
    return acc
  }, {})
})
const submit = async (validate: FormValidateFunc) => { 
  validate()(async (errors: any) => { 
    if (errors) return 
    loading.value = true
    const res = await generateDict({dict_type_id:Number(props.dict_type_id),...formData.value,order_num:Number(formData.value.order_num)})
  if (res.code === 200) { 
    props.getData()
    props.close()
  }
  loading.value=false
  })
}

</script>

<template>
  <div class="">
    <XwyaForm  :rules="rules" label-placement="left" :label-width="80" :item-list="formItemData" v-model="formData" >
      <template #default="{validate}">
        <div class="w-full flex gap-4 justify-end pr-[10px]">
      <XwyaButton  @click="submit(validate)" type="success" text="确认" :loading="loading" />
      <XwyaButton  @click="props.close" text="取消" />
    </div>
      </template>
    </XwyaForm>
  
  </div>


</template>

<style lang="scss" scoped></style>
