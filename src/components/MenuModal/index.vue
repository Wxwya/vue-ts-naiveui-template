<script setup>
import { ref, computed } from "vue"
import { generateMenu } from '@/api/menu';
import { XwyaForm, XwyaButton } from "@/rely/page"
const props = defineProps({
  close: {
    type: Function ,
    default: () => { }
  },
  getData: {
    type: Function,
    default: () => { }
  },
  row: {
    type: Object,
    default:()=> {}
  },
  total: {
    type: Number,
    default: 0
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
const formData = ref({
  ...props.row,
  sort: props?.row?.sort != null ? props.row.sort.toString() : (props.total + 1).toString(),
  path: props.prefix?props.prefix:props.row?.path
});
const loading = ref(false)
const formItemData = computed(() => ([
  { type: 'input', item: { label: '菜单名称', path: 'title', }, content: { placeholder: '请输入角色名称' } },
  { type: 'input', item: { label: '菜单图标', path: 'icon', }, content: { placeholder: '请输入菜单图标' } },
  { type: 'input', item: { label: '菜单路径', path: 'path', }, content: { placeholder: '请输入菜单路径' } },
  { type: 'input', item: { label: '排序', path: 'sort', }, content: { placeholder: '请输入菜单排序' } },
  { type: 'switch', item: { label: '是否隐藏', path: 'hidden', } },
  { type: 'switch', item: { label: '总是显示', path: 'always_show',isShow:!!props.parent_id } },
]))
const rules= computed(() => {
  return formItemData.value.reduce((acc, cur, _) => {
    if(cur.item.path==='icon' || cur.item.path==='hidden' || cur.item.path==='always_show') return acc
    acc[cur.item.path] = [{ required: true, trigger: [],message:cur.content.placeholder}]
    return acc
  }, {})
})
const submit = async (validate) => { 
  validate()(async (errors) => { 
    if (errors) return 
    loading.value = true
    if (props.parent_id) { 
      if (!formData.value.path.startsWith(props.prefix)) { 
      window.$msg.error('路径前缀缺少' + props.prefix)
      loading.value=false
      return
    }
    if (formData.value.path == props.prefix) { 
      window.$msg.error('请输入二级路由路径')
      loading.value=false
      return
    }
    }
    const res = await generateMenu({...formData.value, sort: Number(formData.value.sort),parent_id: Number(props.parent_id)})
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
