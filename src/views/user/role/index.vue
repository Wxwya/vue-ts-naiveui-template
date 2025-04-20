<script  setup>
// solar--user-bold 图标展示
import { computed, ref, inject, h,onMounted,usePage,closeModal } from "@/rely/lib"
import { XwyaForm, XwyaPopover, XwyaTable, XwyaButton, XwyaIcon,NButton } from "@/rely/page"
import Acruibs from "./actions.vue"
import UpModal from "./upModal.vue"
class QueryForm { 
  role_name= ''
  description = ''
}
const api = inject("api")
const { data,page,total,loading} = usePage() 
const queryFormData = ref(new QueryForm())
const rowIds = ref([])
const isSearch = ref(false)
const queryFormItem = computed(() => ([
  { type: 'input', item: { label: '角色名称', path: 'role_name' }, content: {placeholder: '请输入角色名称'}   },
  { type: 'input', item: { label: '角色描述', path: 'description', }, content: { placeholder: '请输入描述', } }
]
))
const onSelect = (keys) => {
  rowIds.value = keys
}
const pagination = computed(() => ({
  itemCount: total.value,
  pageSizes: [10, 20,30,40,50],
  pageSlot: 5,
  pageSize: page.pageSize,
  showSizePicker: true,
  prefix: () => { 
    return '共 ' + total.value + ' 条';
  },
  page: page.pageNum,
  "onUpdate:page": (p) => {
    page.pageNum = p
    getData()
  },
  "onUpdate:pageSize": (pageSize) => {
    page.pageNum = 1
    page.pageSize = pageSize
    getData()
  }
}))
const getData = async () => { 
  loading.value=true
  const res = await api.role.getRoleList(Object.assign(isSearch.value ?queryFormData.value: {},page))
  if (res.code === 200) { 
    data.value = res.data.list
    total.value = res.data.total
  }
  loading.value=false
}
const onSearch = (state, change) => { 
  page.pageNum = 1
  if (state) { 
    queryFormData.value = new QueryForm()
  }
  isSearch.value = !state
  getData()
  change()
}
const onBatchDelete = () => {
  window.$dialog.warning({
    title: '温馨提示',
    content: '是否确认批量删除用户？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      onDelete()
    }
  })
}
const onDelete = async (id) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.role.delRole( id ? [id] : rowIds.value )
  if (res.code === 200) { 
    getData()
  }
  m.destroy()
}
const onOpenModal = (title, row) => { 
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: {
      width:"600px"
    },
   content: () => h(UpModal, {close:()=>closeModal(m),row,getData})
  })
}
const initColumns = () => {
  return [
    {
      type: 'selection',
      fixed: 'left'
    },
    {
      title: '角色名称',
      key: 'role_name'
    },
    {
      title: '描述',
      key: 'description'
    },
    {
      title: "创建时间",
      key:"create_time"
    },
    {
      align: "center",
      title: "操作",
      key: "actions",
      render(row) {
        return h(Acruibs, {upData:()=>onOpenModal("修改角色",row),delData:()=>onDelete(row.role_id) })
      }
    }

  ]
}
onMounted(() => { 
  getData()
})
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <XwyaForm   label-placement="left" :item-list="queryFormItem" v-model="queryFormData" :row="5">
      <template #default="{ change, state }">
        <n-button :type="!state ? 'primary' : 'error'" @click="onSearch(state, change)">
          <XwyaIcon v-if="state" icon="solar--close-circle-bold" class="text-base" />
          <XwyaIcon v-else icon="solar--magnifer-linear" class="text-base" />
        </n-button>
      </template>
      <template #button>
        <div class="flex gap-2">
            <XwyaPopover text="新增">
          <XwyaButton v-has="'xwya:role:add'"  @click="onOpenModal('新增角色')" circle type="info" iconSize="20" icon="solar--add-square-bold"  />
        </XwyaPopover>
         
        <XwyaPopover text="批量删除">
          <XwyaButton v-has="'xwya:role:delete'"  :disabled="rowIds.length?false:true" @click="onBatchDelete" circle type="error" iconSize="20" icon="solar--trash-bin-trash-bold"  />
        </XwyaPopover>
        </div>
      </template>
    </XwyaForm>
    <XwyaTable class="h-full"  :scroll-y="true" :row-key="(r)=>r.role_id" :columns="initColumns()" :data="data"  :onSelect="onSelect " :pagination="pagination" :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
