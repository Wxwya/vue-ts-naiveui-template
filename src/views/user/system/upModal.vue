<script lang="ts" setup>
import { ref,computed } from "vue"
import type {PropType} from "vue"
import { generateUser } from "@/api/user"
import type { FormRules } from "naive-ui"
import {XwyaForm,XwyaButton } from "@/rely/page"
const props = defineProps({
  rolesOption: {
    type: Array ,
    default: () => [],
  },
  close: {
    type: Function as PropType<() => void>,
    default: () => { }
  },
  getData: {
    type: Function as PropType<() => void>,
    default: () => { }
  },
  row: {
    type: Object as PropType<SystemUser.UserInfo>,
    default: {}
  }

})
const formData = ref<SystemUser.UserInfo>({...props.row})
const loading = ref<boolean>(false)
const formItemData = computed<FormItemRowStruct[]>(() => ([
  { type: 'input', item: { label: '用户名', path: 'username',ruleType:"string" }, content: {placeholder: '请输入用户名',}},
  { type: 'input',item: { label: '账号', path: 'account',ruleType:"string" }, content: {placeholder: '请输入账号'} },
  { type: 'input',item: { label: "邮箱", path: "email",ruleType:"string" }, content: {placeholder: "请输入邮箱",} },
  { type: 'input',item: { label: "手机号", path: "phone",ruleType:"string" }, content: {placeholder: "请输入手机号",}},
  {type: 'input',item: { label:"密码",path:"password",ruleType:"string" },content: {placeholder:"请输入密码",type:"password"}},
  { type: "select", item: { label: "角色", path: "role_ids", ruleType: "array" }, content: {filterable:true,multiple:true, placeholder:"请选择角色",options:props.rolesOption}},
]))
const rules= computed<FormRules>(() => {
  return formItemData.value.reduce((acc:FormRules, cur:any, _) => {
    if(cur.item.path==='password' && props.row.id) return acc 
    acc[(cur as FormItemRowStruct)!.item!.path!] = [{ required: true, trigger: [],message:(cur.content.placeholder) as string,type:cur.item.ruleType }]
    return acc
  }, {})
})
const submit = async (validate: FormValidateFunc) => { 
  validate()(async (errors: any) => { 
    if (errors) return 
    loading.value = true
  const res = await generateUser(formData.value)
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
