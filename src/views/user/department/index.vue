<script lang="tsx" setup>
// 	solar--layers-bold
import { computed, ref, inject, h, onMounted, usePage, closeModal, useUserStore, OptionsKeyEnums } from "@/rely/lib"
import { XwyaForm, XwyaPopover, XwyaTable, XwyaButton, XwyaIcon, NSwitch, NButton } from "@/rely/page"
import type { PaginationProps, DataTableColumns, DataTableRowKey } from "@/rely/page"
import { storeToRefs } from "pinia"
import UpModal from './upModal.vue'

class QueryForm {
  name = ''
  status = null
}

const api = inject("api") as Api

const { defaultOptions } = storeToRefs(useUserStore())
const { data, total, loading, page } = usePage<Department.DepartmentRow>()
const queryFormData = ref(new QueryForm())
const rowIds = ref<DataTableRowKey[]>([])
const isSearch = ref(false)

const queryFormItem = computed<FormItemRowStruct[]>(() => [
  { type: 'input', itemWidth: "260px", item: { label: '部门名称', path: 'name' }, content: { placeholder: '请输入部门名称' } },
  { type: "select", itemWidth: "260px", item: { label: "状态", path: "status" }, content: { placeholder: "请选择状态", options: defaultOptions.value[OptionsKeyEnums.STATUS] } },
])

const pagination = computed<PaginationProps>(() => ({
  itemCount: total.value,
  pageSizes: [10, 20, 30, 40, 50],
  pageSlot: 5,
  pageSize: page.pageSize,
  showSizePicker: true,
  prefix: () => '共 ' + total.value + ' 条',
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

const columns: DataTableColumns<Department.DepartmentRow> = [
  { type: 'selection', fixed: 'left' },
  { title: 'ID', key: 'id', className: "w-[80px]" },
  { title: '部门名称', key: 'name', className: "min-w-[140px]" },
  { title: '部门描述', key: 'description', className: "min-w-[200px]" },
  {
    title: '状态',
    key: 'status',
    className: "min-w-[100px]",
    render: (row) => <NSwitch value={row.status} onUpdateValue={(val) => changeStatus(row.id, val)} />
  },
  { title: '创建时间', key: 'create_time', className: "min-w-[220px]" },
  {
    align: "center",
    title: "操作",
    key: "actions",
    className: "min-w-[160px]",
    render: (row) => (
      <div class="flex items-center gap-2">
        <NButton v-has="xwya:department:update" text type="info" onClick={() => onOpenModal("修改部门", row)}>修改</NButton>
        <NButton v-has="xwya:department:delete" text type="error" onClick={() => onDeleteTips(row)}>删除</NButton>
      </div>
    )
  }
]

const onSearch = (state: boolean, change: Function) => {
  page.pageNum = 1
  if (state) queryFormData.value = new QueryForm()
  isSearch.value = !state
  getData()
  change()
}

const onOpenModal = (title: string, row?: Department.DepartmentRow) => {
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: { width: "500px" },
    content: () => h(UpModal, { close: () => closeModal(m), row, getData })
  })
}

const onBatchDelete = () => {
  window.$dialog.warning({
    title: '温馨提示',
    content: '是否确认批量删除所选部门?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => onDelete()
  })
}

const onDeleteTips = (row: Department.DepartmentRow) => {
  window.$dialog.warning({
    title: '温馨提示',
    content: `是否确认删除部门「${row.name}」?`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => onDelete(row.id)
  })
}

const onDelete = async (id?: number) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.department.delDepartment(id ? [id] : rowIds.value)
  if (res.code === 200) getData()
  m.destroy()
}

const getData = async () => {
  loading.value = true
  const res = await api.department.getDepartmentList(Object.assign(isSearch.value ? queryFormData.value : {}, page))
  if (res.code === 200) {
    data.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  }
  loading.value = false
}

const changeStatus = async (id: number, status: boolean) => {
  const res = await api.department.changeDepartmentStatus({ id, status })
  if (res.code === 200) getData()
}

const onSelect = (keys: DataTableRowKey[]) => {
  rowIds.value = keys
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <XwyaForm label-placement="left" :item-list="queryFormItem" v-model="queryFormData" :row="4" :col="1">
      <template #default="{ change, state }">
        <n-button :type="!state ? 'primary' : 'error'" @click="onSearch(state, change)">
          <XwyaIcon v-if="state" icon="solar--close-circle-bold" class="text-base" />
          <XwyaIcon v-else icon="solar--magnifer-linear" class="text-base" />
        </n-button>
      </template>
      <template #button>
        <div class="flex gap-2">
          <XwyaPopover text="新增">
            <XwyaButton v-has="'xwya:department:add'" @click="onOpenModal('新增部门')" circle type="info" iconSize="18"
              icon="solar--add-square-bold" />
          </XwyaPopover>
          <XwyaPopover text="批量删除">
            <XwyaButton v-has="'xwya:department:delete'" :disabled="!rowIds.length" @click="onBatchDelete" circle
              type="error" iconSize="20" icon="solar--trash-bin-trash-bold" />
          </XwyaPopover>
        </div>
      </template>
    </XwyaForm>
    <XwyaTable class="flex-1" :scroll-y="true" :columns="columns" :data="data" :onSelect="onSelect"
      :pagination="pagination" :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
