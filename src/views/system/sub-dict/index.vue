<script setup lang="jsx">

import { usePage, closeModal, inject, ref, onMounted, h, useRoute, computed } from "@/rely/lib"
import { NSwitch, NButton, XwyaPopover, XwyaButton, XwyaTable } from "@/rely/page"
import UpModal from './upModal.vue';

const api = inject("api")
const { data, page, total, loading } = usePage()
const { query } = useRoute()
const rowIds = ref([])

const pagination = computed(() => ({
  itemCount: total.value,
  pageSizes: [10, 20, 30, 40, 50],
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
const getData = async () => {
  loading.value = true
  const res = await api.dict.getDictList(Object.assign(page, { dict_type_id: Number(query.id) }))
  if (res.code === 200) {
    data.value = res.data.list
    total.value = res.data.total
  }
  loading.value = false
}

const onDelete = async (id) => {
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
const onDeleteTips = (row) => {
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
const onOpenModal = (title, row) => {
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: {
      width: "600px"
    },
    content: () => h(UpModal, { close: () => closeModal(m), row: row, getData, dict_type_id: query.id, total: total.value })
  })
}
const changeStatus = async (id, status) => {
  const res = await api.dict.changeDictStatus({ id, status: status })
  if (res.code === 200) {
    getData()
  }
}
const columns = [
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
    render: (row) => <NSwitch value={row.status} onUpdateValue={(val) => changeStatus(row.id, val)} />
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
    render: (row) => (
      <div class="flex items-center gap-2">
        <NButton v-has="xwya:dict:update" text type="info" onClick={() => onOpenModal("修改字典数据", row)}>修改</NButton>
        <NButton v-has="xwya:dict:delete" text type="error" onClick={() => onDeleteTips(row)}>删除</NButton>
      </div>
    )
  }
]
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div class="flex justify-end">
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
