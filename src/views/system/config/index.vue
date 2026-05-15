<script setup>
// solar--box-minimalistic-bold
import { ref, inject, h, onMounted } from "@/rely/lib"
import { XwyaTable, XwyaPopover, XwyaButton, NButton, NSwitch } from "@/rely/page"
import { closeModal } from "@/rely/lib"
import UpModal from './upModal.vue'

const api = inject("api")
const data = ref([])
const loading = ref(false)
const rowIds = ref([])

const columns = [
  { type: 'selection', fixed: 'left' },
  { title: 'ID', key: 'id', className: "w-[80px]" },
  { title: 'Key', key: 'key', className: "min-w-[180px]" },
  { title: 'Value', key: 'value', className: "min-w-[180px]" },
  {
    title: '状态',
    key: 'enable',
    className: "min-w-[100px]",
    render: (row) => h(NSwitch, { value: row.enable, onUpdateValue: (val) => onUpdateEnable(row.id, val) })
  },
  { title: '备注', key: 'remark', className: "min-w-[200px]", ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'create_time', className: "min-w-[220px]" },
  {
    align: 'center',
    title: '操作',
    key: 'actions',
    className: "min-w-[160px]",
    render: (row) => h('div', { class: "flex items-center gap-2" }, [
      h(NButton, { 'v-has': 'xwya:config:update', text: true, type: 'info', onClick: () => onOpenModal('修改配置', row) }, { default: () => '修改' }),
      h(NButton, { 'v-has': 'xwya:config:delete', text: true, type: 'error', onClick: () => onDeleteTips(row) }, { default: () => '删除' }),
    ])
  }
]

const onSelect = (keys) => {
  rowIds.value = keys
}

const onOpenModal = (title, row) => {
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: { width: '500px' },
    content: () => h(UpModal, { close: () => closeModal(m), row, getData })
  })
}

const onBatchDelete = () => {
  window.$dialog.warning({
    title: '温馨提示',
    content: '是否确认批量删除所选配置?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => onDelete()
  })
}

const onDeleteTips = (row) => {
  window.$dialog.warning({
    title: '温馨提示',
    content: `是否确认删除配置「${row.key}」?`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => onDelete(row.id)
  })
}

const onUpdateEnable = async (id, val) => {
  const res = await api.config.updateConfigEnable({ id, status: val })
  if (res.code === 200) getData()
}

const onDelete = async (id) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.config.delConfig(id ? [id] : rowIds.value)
  if (res.code === 200) getData()
  m.destroy()
}

const getData = async () => {
  loading.value = true
  const res = await api.config.getConfigList({})
  if (res.code === 200) data.value = res.data ?? []
  loading.value = false
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div class="flex justify-end">
      <div class="flex gap-2">
        <XwyaPopover text="新增">
          <XwyaButton v-has="'xwya:config:add'" @click="onOpenModal('新增配置')" circle type="info" iconSize="18"
            icon="solar--add-square-bold" />
        </XwyaPopover>
        <XwyaPopover text="批量删除">
          <XwyaButton v-has="'xwya:config:delete'" :disabled="!rowIds.length" @click="onBatchDelete" circle
            type="error" iconSize="20" icon="solar--trash-bin-trash-bold" />
        </XwyaPopover>
      </div>
    </div>
    <XwyaTable class="flex-1" :scroll-y="true" :columns="columns" :data="data" :onSelect="onSelect"
      :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
