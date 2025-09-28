<script  setup>
import { ref,computed} from "vue"
import { generateUser } from "@/api/user"
import {XwyaForm,XwyaButton } from "@/rely/page"
const props = defineProps({
  rolesOption: {
    type: Array ,
    default: () => [],
  },
  close: {
    type: Function,
    default: () => { }
  },
  getData: {
    type: Function,
    default: () => { }
  },
  row: {
    type: Object,
    default: ()=>{}
  }

})
const formData = ref({...props.row})
const loading = ref(false)
const formItemData = computed(() => ([
  { type: 'input', item: { label: '用户名', path: 'username',ruleType:"string" }, content: {placeholder: '请输入用户名',}},
  { type: 'input',item: { label: '账号', path: 'account',ruleType:"string" }, content: {placeholder: '请输入账号'} },
  { type: 'input',item: { label: "邮箱", path: "email",ruleType:"string" }, content: {placeholder: "请输入邮箱",} },
  { type: 'input',item: { label: "手机号", path: "phone",ruleType:"string" }, content: {placeholder: "请输入手机号",}},
  {type: 'input',item: { label:"密码",path:"password",ruleType:"string" },content: {placeholder:"请输入密码",type:"password"}},
  { type: "select", item: { label: "角色", path: "role_ids", ruleType: "array" }, content: {filterable:true,multiple:true, placeholder:"请选择角色",options:props.rolesOption}},
]))
const rules= computed(() => {
  return formItemData.value.reduce((acc, cur) => {
    if(cur.item.path==='password' && props.row.id) return acc 
    acc[cur.item.path] = [{ required: true, trigger: [],message:cur.content.placeholder,type:cur.item.ruleType }]
    return acc
  }, {})
})
const submit = async (validate) => { 
  validate()(async (errors) => { 
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
