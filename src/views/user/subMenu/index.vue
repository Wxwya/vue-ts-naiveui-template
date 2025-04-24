<script  setup>
import { computed, ref, inject, h,onMounted,usePage,closeModal,useUserStore,OptionsKeyEnums,useRoute } from "@/rely/lib"
import { XwyaForm, XwyaPopover, XwyaTable, XwyaButton, XwyaIcon,NSwitch,NButton } from "@/rely/page"
import UpModal from "@/components/MenuModal/index.vue";
import Actions from './actions.vue';
class QueryForm { 
  title = ''
  path = ''
  status= null
}
const { query } = useRoute()
const api = inject("api") 
const { defaultOptions} = useUserStore()
const { data, page, total, loading } = usePage() 
const queryFormData = ref(new QueryForm())
const rowIds = ref([])
const isSearch = ref(false)
const queryFormItem = computed(() => ([
  { type: "input", item: { label: '菜单名称', path: 'title', }, content: { placeholder: '请输入菜单名称' } },
  { type: "input", item: { label: '菜单路径', path: 'path', }, content: { placeholder: '请输入菜单路径' } },
  { type: "select", item: { label: "状态", path: "status"  }, content: {placeholder: "请选择状态", options: defaultOptions[OptionsKeyEnums.STATUS]} }
  
]))
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
const onSelect = (keys) => {
  rowIds.value = keys
}
const initColumns = () => {
  return [
    {
      type: 'selection',
      fixed: 'left'
    },
    {
      title: '菜单名称',
      key: 'title'
    },
    {
      title: '菜单图标',
      key: 'icon'
    },
    {
      title: '菜单路径',
      key: 'path'
    },
    {
      title: "状态",
      key: "status",
      render(row) { 
        return h(NSwitch, { value: row.status, 'on-update:value': (val) => changeStatus(row.id,val) })
      }
    },
    {
      align: "center",
      title: "操作",
      key: "actions",
      render(row) {
        return h(Actions, { upData: () => onOpenModal("修改子菜单", row), delData: () => onDelete(row.id) })
      }
    }

  ]
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
const onOpenModal = (title,row ) => { 
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: {
      width:"600px"
    },
   content: () => h(UpModal, {close:()=>closeModal(m),row,getData,parent_id:query.id, total:total.value,prefix:row?'':query.prefix})
  })
}
const onBatchDelete = () => {
  window.$dialog.warning({
    title: '温馨提示',
    content: '是否确认批量删除子菜单吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      onDelete()
    }
  })
}
const onDelete = async (id) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.menu.delMenu(id ? [id] : rowIds.value )
  if (res.code === 200) { 
    getData()
  }
  m.destroy()
}
const getData = async () => { 
  loading.value = true
  const res = await api.menu.getMenuList(Object.assign(isSearch.value ? queryFormData.value : {}, page, {parent_id:parseInt(query.id)}))
  if (res.code === 200) { 
    data.value = res.data.list
    total.value = res.data.total
  }
  loading.value = false
}
const changeStatus = async (id, val) => {
  const res = await api.menu.changeMenuStatus({ id, status: val })
  if (res.code === 200) { 
    getData()
  }
}
onMounted(() => { 
  getData()
})

</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <XwyaForm  label-placement="left" :item-list="queryFormItem" v-model="queryFormData" :row="5">
      <template #default="{ change, state }">
        <n-button :type="!state ? 'primary' : 'error'" @click="onSearch(state, change)">
          <XwyaIcon v-if="state" icon="solar--close-circle-bold" class="text-base" />
          <XwyaIcon v-else icon="solar--magnifer-linear" class="text-base" />
        </n-button>
      </template>
      <template #button>
        <div class="flex gap-2">
            <XwyaPopover text="新增">
          <XwyaButton  v-has="'xwya:menu:add'" @click="onOpenModal('新增子菜单')" circle type="info" iconSize="20" icon="solar--add-square-bold"  />
        </XwyaPopover>
         
        <XwyaPopover text="批量删除">
          <XwyaButton v-has="'xwya:menu:delete'" :disabled="rowIds.length?false:true" @click="onBatchDelete" circle type="error" iconSize="20" icon="solar--trash-bin-trash-bold"  />
        </XwyaPopover>
        </div>
      </template>
    </XwyaForm>
    <XwyaTable class="h-full"  :scroll-y="true" :columns="initColumns()" :data="data"  :onSelect="onSelect " :pagination="pagination" :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
