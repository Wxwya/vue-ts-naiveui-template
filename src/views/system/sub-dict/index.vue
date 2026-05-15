<script lang="tsx" setup>

import { usePage, closeModal, inject, ref, onMounted, h, useRoute, computed } from "@/rely/lib"
import { NSwitch, NButton, XwyaPopover, XwyaButton, XwyaTable } from "@/rely/page"
import UpModal from './upModal.vue';
import type { PaginationProps, DataTableColumns, DataTableRowKey } from "@/rely/page"

const api = inject("api") as Api
const { data, page, total, loading } = usePage<Dict.DictRow>()
const { query } = useRoute()
const rowIds = ref<DataTableRowKey[]>([])

const pagination = computed<PaginationProps>(() => ({
  itemCount: total.value,
  pageSizes: [10, 20, 30, 40, 50],
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
const onSelect = (keys: DataTableRowKey[]) => {
  rowIds.value = keys
}
const getData = async () => {
  loading.value = true
  const res = await api.dict.getDictList(Object.assign(page, { dict_type_id: Number(query.id as string) }))
  if (res.code === 200) {
    data.value = res!.data!.list
    total.value = res!.data!.total
  }
  loading.value = false
}

const onDelete = async (id?: number) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.dict.delDict(id ? [id] : rowIds.value)
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
const onDeleteTips = (row: Dict.DictRow) => {
  window.$dialog.warning({
    title: '温馨提示',
    content: `是否确认删除 ${row.dict_label} 字典数据?`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      onDelete(row.id)
    }
  })
}
const onOpenModal = (title: string, row?: Dict.DictRow) => {
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: {
      width: "600px"
    },
    content: () => h(UpModal, { close: () => closeModal(m), row: row!, getData, dict_type_id: query.id as string, total: total.value })
  })


}
const changeStatus = async (id: number, status: boolean) => {
  const res = await api.dict.changeDictStatus({ id, status: status })
  if (res.code === 200) {
    getData()
  }
}
const columns: DataTableColumns<Dict.DictRow> = [
  {
    type: 'selection',
    fixed: 'left'
  },
  { title: 'ID', key: 'id', className: "w-[80px]" },
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
    render(row: Dict.DictRow) {
      return h(NSwitch, { value: row.status, 'on-update:value': (val) => changeStatus(row.id!, val) })
    }
  },
  {
    title: "创建者ID",
    key: "user_id"
  },
  {
    title: "创建时间",
    key: "create_time"
  },
  {
    align: "center",
    title: "操作",
    key: "actions",
    render: (row) => (<div class="flex items-center gap-2">
      <NButton v-has="xwya:dict:update" text type="info" onClick={() => onOpenModal("修改字典数据", row)} >修改</NButton>
      <NButton v-has="xwya:dict:delete" text type="error" onClick={() => onDeleteTips(row)} >删除</NButton>
    </div>)
    // render(row:Dict.DictRow) {
    //   return h(Actions, { upData: () => onOpenModal("修改字典", row), delData: () =>onDelete(row.id), toSub: () => push(`/system/subDict?id=${row.id}`)  })
    // }
  }

]
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div class=" flex justify-end ">
      <div class="flex gap-2">
        <XwyaPopover text="新增">
          <XwyaButton v-has="'xwya:dict:add'" @click="onOpenModal('新增字典')" circle type="info" iconSize="20"
            icon="solar--add-square-bold" />
        </XwyaPopover>

        <XwyaPopover text="批量删除">
          <XwyaButton v-has="'xwya:dict:delete'" :disabled="rowIds.length ? false : true" @click="onBatchDelete" circle
            type="error" iconSize="20" icon="solar--trash-bin-trash-bold" />
        </XwyaPopover>
      </div>
    </div>
    <XwyaTable class="flex-1" :scroll-y="true" :columns="columns" :data="data" :onSelect="onSelect"
      :pagination="pagination" :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
