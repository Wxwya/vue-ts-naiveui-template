<script lang="ts" setup>
import { defineProps,ref, computed } from "vue"
import {XwyaForm,XwyaButton } from "@/rely/page"
import { generatePermissions } from '@/api/permissions'; 
import type {PropType} from "vue"
import type { FormRules } from "naive-ui"
const props = defineProps({
  close: {
    type: Function as PropType<() => void>,
    default: () => { }
  },
  getData: {
    type: Function as PropType<() => void>,
    default: () => { }
  },
  row: {
    type: Object as PropType<Permissions.PermissionsInfo>,
    default: {}
  },
  parent_id: {
    type: [Number,String],
    default: 0
  },
  prefix: {
    type: String,
    default: ''
  }
})
const formData = ref<Permissions.PermissionsInfo>({
  ...props.row,
  permission_name:props.prefix?props.prefix:props.row?.permission_name
});
const loading = ref(false)
const formItemData = computed<FormItemRowStruct[]>(() => ([
  { type: 'input',item: {label: '权限名称', path: 'permission_name'}, content: {placeholder: '请输入权限名称'}  },
  {type: 'input', item: {label: '权限描述', path: 'description'}, content: {placeholder: '请输入权限描述',},   },
]))
const rules= computed(() => {
  return formItemData.value.reduce((acc:FormRules, cur:any, _) => {
    acc[cur.item.path] = [{ required: true, trigger: [],message:cur.content.placeholder}]
    return acc
  }, {})
})
const submit = async (validate: FormValidateFunc) => { 
  validate()(async (errors: any) => { 
    if (errors) return 
    loading.value = true
    if (props.parent_id) { 
      if (!formData.value.permission_name.startsWith(props.prefix)) { 
      window.$msg.error('前缀缺少' + props.prefix)
      loading.value=false
      return
    }
    if (formData.value.permission_name == props.prefix) { 
      window.$msg.error('请输入格式'+ props.prefix + ':xxx')
      loading.value=false
      return
    }
    }
    const res = await generatePermissions({...formData.value, parent_id: Number(props.parent_id)})
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
