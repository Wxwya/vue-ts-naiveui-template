<script lang="ts" setup>
// solar--tuning-square-2-bold
import { NSwitch } from 'naive-ui';
import { computed, ref, inject, h,onMounted,usePage,closeModal,useUserStore,OptionsKeyEnums,useRouter} from "@/rely/lib"
import {XwyaForm,XwyaPopover,XwyaTable,XwyaButton,XwyaIcon,NButton } from "@/rely/page"
import type { PaginationProps, DataTableColumns, DataTableRowKey } from "@/rely/page"
import UpModal from "@/components/MenuModal/index.vue";
import Actions from './actions.vue';
class QueryForm { 
  title: string = ''
  path: string = ''
  status= null
}
const api = inject("api") as Api
const { defaultOptions} = useUserStore()
const { data, page, total, loading } = usePage<Menu.MenuInfo>() 
const { push} = useRouter()
const queryFormData = ref(new QueryForm())
const rowIds = ref<DataTableRowKey[]>([])
const isSearch = ref(false)
const queryFormItem = computed<FormItemRowStruct[]>(() => ([
  { type: "input", item: { label: '菜单名称', path: 'title', }, content: { placeholder: '请输入菜单名称' } },
  { type: "input", item: { label: '菜单路径', path: 'path', }, content: { placeholder: '请输入菜单路径' } },
  { type: "select", item: { label: "状态", path: "status"  }, content: {placeholder: "请选择状态", options: defaultOptions[OptionsKeyEnums.STATUS]} }
  
]))
const pagination = computed<PaginationProps>(() => ({
  itemCount: total.value,
  pageSizes: [10, 20,30,40,50],
  pageSlot: 5,
  pageSize: page.pageSize,
  showSizePicker: true,
  prefix: () => { 
    return '共 ' + total.value + ' 条';
  },
  page: page.pageNum,
  "onUpdate:page": (p: number) => {
    page.pageNum = 1
    page.pageNum = p
    getData()
  },
  "onUpdate:pageSize": (pageSize: number) => {
    page.pageSize = pageSize
    getData()
  }
}))
const onSelect = (keys:DataTableRowKey[]) => {
  rowIds.value = keys
}
const initColumns = ():DataTableColumns<Menu.MenuInfo> => {
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
      render(row:Menu.MenuInfo) { 
        return h(NSwitch, { value: row.status!, 'on-update:value': (val) => changeStatus(row.id!,val) })
      }
    },
    {
      align: "center",
      title: "操作",
      key: "actions",
      render(row:Menu.MenuInfo) {
        return h(Actions, { upData: () => onOpenModal("修改菜单", row), delData: () => onDelete(row.id), toSub: () => push(`/user/subMenu?id=${row.id}&prefix=${row.path}`) })
      }
    }

  ]
}
const onSearch = (state:boolean, change:Function) => { 
  page.pageNum = 1
  if (state) { 
    queryFormData.value = new QueryForm() 
  }
  isSearch.value = !state
  getData()
  change()
}
const onOpenModal = (title:string,row?:Menu.MenuInfo ) => { 
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: {
      width:"600px"
    },
   content: () => h(UpModal, {close:()=>closeModal(m),row,getData,total:total.value})
  })
}
const onBatchDelete = () => {
  window.$dialog.warning({
    title: '温馨提示',
    content: '是否确认批量删除根目录菜单吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      onDelete()
    }
  })
}
const onDelete = async (id?:number) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.menu.delMenu(id ? [id] : rowIds.value )
  if (res.code === 200) { 
    getData()
  }
  m.destroy()
}
const getData = async () => { 
  loading.value = true
  const res = await api.menu.getMenuList(Object.assign(isSearch.value? queryFormData.value : {},page))
  if (res.code === 200) { 
    data.value = res.data!.list
    total.value = res.data!.total
  }
  loading.value = false
}
const changeStatus = async (id: number, val: boolean) => {
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
          <XwyaButton v-has="'xwya:menu:add'"  @click="onOpenModal('新增菜单')" circle type="info" iconSize="20" icon="solar--add-square-bold"  />
        </XwyaPopover>
         
        <XwyaPopover text="批量删除">
          <XwyaButton v-has="'xwya:menu:delete'" :disabled="rowIds.length?false:true" @click="onBatchDelete" circle type="error" iconSize="20" icon="solar--trash-bin-trash-bold"  />
        </XwyaPopover>
        </div>
      </template>
    </XwyaForm>
    <XwyaTable class="flex-1" :scroll-y="true" :columns="initColumns()" :data="data"  :onSelect="onSelect " :pagination="pagination" :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
