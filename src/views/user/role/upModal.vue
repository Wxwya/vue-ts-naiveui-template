<script setup>
import { ref, computed,onMounted } from "vue"
import { generateRole,getRoleInfo } from "@/api/role";
import { getMenuOptions  } from "@/api/menu";
import { getPermissionsOptions } from "@/api/permissions";
import { XwyaForm, XwyaButton } from "@/rely/page"
const props = defineProps({
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
const formData = ref({ ...props.row })
const menuOption = ref([])
const permissionsOption = ref([])
const loading = ref(false)
const formItemData = computed(() => ([
  { type: 'input',item:{label: '角色名称', path: 'role_name',},  content: {placeholder: '请输入用户名'}   },
  {type: 'input',item:{label: '角色描述', path: 'description',},  content: {placeholder: '请输入账号'} },
  { type:"tree", item: { label: "菜单配置", path: "menu_ids",  },content: {labelField:"title",keyField: "value",multiple:true,checkable:true,  placeholder:"请选择菜单",options:menuOption.value} },
  { type: "tree", item: { label: "权限配置", path: "permissions_ids" },content: {labelField:"title",multiple:true,checkable:true, keyField:"value", placeholder:"请选择权限",options:permissionsOption.value}},
]))
const rules = computed(() => {
  return formItemData.value.reduce((acc, cur) => {
    if (cur.item.path === 'menu_ids' || cur.item.path === 'permissions_ids') return acc 
    acc[cur.item.path] = [{ required: true, trigger: [],message:cur.content.placeholder }]
    return acc
  }, {})
})
const submit = async (validate) => { 
  validate()(async (errors) => { 
    if (errors) return 
    loading.value = true
  const res = await generateRole(formData.value)
  if (res.code === 200) { 
    props.getData()
    props.close()
  }
  loading.value=false
  })
}
const onLoadRoleInfo = async () => { 
  const res = await getRoleInfo(props.row.id)
  if (res.code === 200) { 
    formData.value = res.data
  }
  
}
const onLoadMenuOptions = async () => {
  const res = await getMenuOptions()
  if (res.code === 200) {
    menuOption.value = res.data
  }
 }
const onLoadPermissionsOptions = async () => { 
  const res = await getPermissionsOptions()
  if (res.code === 200) {
    permissionsOption.value = res.data
    }
}
onMounted(() => {
  props.row.id&& onLoadRoleInfo()
  onLoadMenuOptions()
  onLoadPermissionsOptions()
})
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
