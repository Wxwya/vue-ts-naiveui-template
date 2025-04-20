<script lang="ts" setup>

import { usePage, useUserStore, OptionsKeyEnums, closeModal, inject,ref, onMounted, h, useRouter, useRoute,computed } from "@/rely/lib"
import {NSwitch,NButton,XwyaForm,XwyaIcon,XwyaPopover,XwyaButton,XwyaTable}from "@/rely/page"
import Actions from './actions.vue';
import UpModal from './upModal.vue';
import type { PaginationProps, DataTableColumns, DataTableRowKey } from "@/rely/page"
class QueryForm { 
  dict_name: string = ''
  username: string = ''
  status:string | null =null
}
const api = inject("api") as Api
const { data, page, total, loading } = usePage<Dict.DictInfo>() 
const { userInfo,defaultOptions} = useUserStore()
const { push } = useRouter()
const { query } = useRoute()
const queryFormData = ref(new QueryForm())
const rowIds = ref<DataTableRowKey[]>([])
const isSearch = ref(false)
const queryFormItem = computed<FormItemRowStruct[]>(() => ([
  { type: "input", item: { label: '字典名称', path: 'dict_label', }, content: { placeholder: '请输入字典类型' } },
  { type: "input", item: { label: '创建者', path: 'username', }, content: { placeholder: '请输入创建者', } },
  { type: "select", item: { label: "状态", path: "status", }, content: { placeholder: "请选择状态", options:defaultOptions[OptionsKeyEnums.STATUS]} },
]
))
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
    page.pageNum = p
    getData()
  },
  "onUpdate:pageSize": (pageSize: number) => {
    page.pageNum = 1
    page.pageSize = pageSize
    getData()
  }
}))
const onSelect = (keys:DataTableRowKey[]) => {
  rowIds.value = keys
}
const getData = async () => { 
  loading.value=true
  const res = await api.dict.getDictList(Object.assign(isSearch.value ? queryFormData.value : {}, page, { dict_type_id: Number((query as any).id) }))
  if (res.code === 200) { 
    data.value = res!.data!.list
    total.value = res!.data!.total
  }
  loading.value=false
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
const onDelete = async (id?:number) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.dict.delDict(id ? [id] : rowIds.value )
  if (res.code === 200) { 
    getData()
  }
  m.destroy()
}
const onBatchDelete = () => {
  window.$dialog.warning({
    title: '温馨提示',
    content: '是否确认批量删除字典吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      onDelete()
    }
  })
}
const onOpenModal = (title:string, row?:Dict.DictInfo) => { 
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: {
      width:"600px"
    },
   content: () => h(UpModal, {close:()=>closeModal(m),row:row!,getData,userInfo:userInfo!,dict_type_id:(query as any).id,total:total.value})
  })
   

}
const changeStatus = async (id:number, status:boolean) => { 
  const res = await api.dict.changeDictStatus({ id, status: status })
  if (res.code === 200) { 
    getData()
  }
}
const initColumns = ():DataTableColumns<Dict.DictInfo> => {
  return [
    {
      type: 'selection',
      fixed: 'left'
    },
    {
      title: '字典名称',
      key: 'dict_label'
    },
    {
      title: '字典值',
      key: 'dict_value'
    },
    {
      title: '排序',
      key: 'order_num'
    },
    {
      title: "状态",
      key: "status",
      render(row:Dict.DictInfo) { 
        return h(NSwitch, { value: row.status, 'on-update:value': (val) => changeStatus(row.id!,val) })
      }
    },
    {
      title: "创建者",
      key: "username"
    },
    {
      title: "创建时间",
      key:"create_time"
    },
    {
      align: "center",
      title: "操作",
      key: "actions",
      render(row:Dict.DictInfo) {
        return h(Actions, { upData: () => onOpenModal("修改字典", row), delData: () =>onDelete(row.id), toSub: () => push(`/system/subDict?id=${row.id}`)  })
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
          <XwyaButton  v-has="'xwya:dict:add'" @click="onOpenModal('新增字典')" circle type="info" iconSize="20" icon="solar--add-square-bold"  />
        </XwyaPopover>
         
        <XwyaPopover text="批量删除">
          <XwyaButton v-has="'xwya:dict:delete'" :disabled="rowIds.length?false:true" @click="onBatchDelete" circle type="error" iconSize="20" icon="solar--trash-bin-trash-bold"  />
        </XwyaPopover>
        </div>
      </template>
    </XwyaForm>
    <XwyaTable class="flex-1" :scroll-y="true"  :columns="initColumns()" :data="data"  :onSelect="onSelect " :pagination="pagination" :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
