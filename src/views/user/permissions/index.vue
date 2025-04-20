<script  setup>
// solar--user-check-rounded-bold
import { computed, ref, inject, h,onMounted,usePage,closeModal,useRouter } from "@/rely/lib"
import { XwyaForm, XwyaPopover, XwyaTable, XwyaButton, XwyaIcon,NButton } from "@/rely/page"
import UpModal from "@/components/PermissionsModal/index.vue";
import Actions from './actions.vue';
class QueryForm {
  permission_name = ''
  description= ''
}
const api = inject("api") 
const { data, page, total, loading } = usePage()
const { push } = useRouter()
const queryFormData = ref(new QueryForm())
const rowIds = ref([])
const isSearch = ref(false)
const queryFormItem = computed(() => ([
  { type: 'input', item: { label: '权限名称', path: 'permission_name' }, content: { placeholder: '请输入权限名称' } },
  { type: 'input', item: { label: '权限描述', path: 'description' }, content: { placeholder: '请输入权限描述' } },
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
      title: '权限名称',
      key: 'permission_name'
    },
    {
      title: '权限描述',
      key: 'description'
    },
    {
      title: "创建时间",
      key: "create_time"
    },

    {
      align: "center",
      title: "操作",
      key: "actions",
      render(row) {
        return h(Actions, { upData: () => onOpenModal("修改权限", row), delData: () => onDelete(row.permission_id), toSub: () => push(`/user/buttonPermissions?id=${row.permission_id}&prefix=${row.permission_name}`) })
      }
    }

  ]
}
const onBatchDelete = () => {
  window.$dialog.warning({
    title: '温馨提示',
    content: '是否确认批量删除权限？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      onDelete()
    }
  })
}
const onDelete = async (id) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.permissions.delPermissions(id ? [id] : rowIds.value)
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
      width: "600px"
    },
    content: () => h(UpModal, { close: () => closeModal(m), row, getData })
  })
}
const getData = async () => {
  loading.value = true
  const res = await api.permissions.getPermissionsList(Object.assign(isSearch.value ? queryFormData.value : {},page))
  if (res.code === 200) {
    data.value = res.data.list
    total.value = res.data.total
  }
  loading.value = false
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
onMounted(() => {
  getData()
})
</script>
<template>
  <div class="h-full flex flex-col gap-4">
    <XwyaForm label-placement="left" :item-list="queryFormItem" v-model="queryFormData" :row="5">
      <template #default="{ change, state }">
        <n-button :type="!state ? 'primary' : 'error'" @click="onSearch(state, change)">
          <XwyaIcon v-if="state" icon="solar--close-circle-bold" class="text-base" />
          <XwyaIcon v-else icon="solar--magnifer-linear" class="text-base" />
        </n-button>
      </template>
      <template #button>
        <div class="flex gap-2">
          <XwyaPopover text="新增">
            <XwyaButton v-has="'xwya:permission:add'" @click="onOpenModal('新增权限')" circle type="info" iconSize="20"
              icon="solar--add-square-bold" />
          </XwyaPopover>

          <XwyaPopover text="批量删除">
            <XwyaButton v-has="'xwya:permission:delete'" :disabled="rowIds.length ? false : true"
              @click="onBatchDelete" circle type="error" iconSize="20" icon="solar--trash-bin-trash-bold" />
          </XwyaPopover>
        </div>
      </template>
    </XwyaForm>
    <XwyaTable class="h-full"  :scroll-y="true" :row-key="(r) => r.permission_id" :columns="initColumns()" :data="data" :onSelect="onSelect"
      :pagination="pagination" :loading="loading" />
  </div>
</template>
<style lang="scss" scoped></style>
