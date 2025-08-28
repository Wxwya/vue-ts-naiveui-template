<script lang="ts" setup>
import {ref, computed,OptionsKeyEnums,useUserStore } from "@/rely/lib"
import { generateDictType } from '@/api/dict';
import {XwyaForm,XwyaButton} from "@/rely/page"
import type { PropType } from 'vue'
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
    type: Object as PropType<Dict.DictTypeInfo>,
    default:()=> {}
  },
  userInfo: {
    type: Object as PropType<SystemUser.UserInfo>,
    default: () => { }
  },
})
const { defaultOptions} = useUserStore()
const formData = ref<Dict.DictTypeInfo>({
  ...props.row,
  username:props?.row?.username? props.row.username:props.userInfo.username,
})
const loading = ref(false)
const formItemData = computed<FormItemRowStruct[]>(() => ([
  { type: 'input', item: { label: '字典名称', path: 'dict_name', }, content: { placeholder: '请输入字典名称' } },
  { type: 'input', item: { label: '字典类型', path: 'type_name', }, content: { placeholder: '请输入字典类型' } },
  { type: 'select', item: { label: "系统配置", path: "is_default", isShow: !(props.userInfo.account == 'admin') }, content: { placeholder: "请选择是否系统配置", options: defaultOptions[OptionsKeyEnums.YESNO], ruleType: "array", } },
  { type: 'input', item: { label: '备注:', path: 'comment' }, content: {placeholder: '请输入备注'}},
]))
const rules  = computed<FormRules>(() => {
  return formItemData.value.reduce((acc: FormRules, cur:any, _) => {
    if(cur.item.path==='is_default' || cur.item.path==="comment"  ) return acc 
    acc[cur.item.path] = [{ required: true, trigger: [],message:cur.content.placeholder,type:cur.item.ruleType }]
    return acc
  }, {})
})
const submit = async (validate: FormValidateFunc) => { 
  validate()(async (errors: any) => { 
    if (errors) return 
    loading.value = true
    const res = await generateDictType({...formData.value})
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
