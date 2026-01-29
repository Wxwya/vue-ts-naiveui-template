<script setup>
// solar--user-id-bold 显示动态图标
import { computed, ref, inject, h, onMounted, usePage, closeModal, useUserStore, OptionsKeyEnums } from '@/rely/lib'
import { XwyaForm, XwyaPopover, XwyaTable, XwyaButton, XwyaIcon, NSwitch, NButton } from '@/rely/page'
import Acruibs from './actions.vue'
import UpModal from './upModal.vue'
class UserQueryForm {
  username = ''
  account = ''
  email = ''
  phone = ''
  roles = null
  status = null
}
const api = inject('api')
const { data, total, loading, page } = usePage()
const { defaultOptions } = useUserStore()
const rolesOption = ref([])
const queryFormData = ref({})
const rowIds = ref([])
const isSearch = ref(false)
const queryFormItem = computed(() => [
  { type: 'input', item: { label: '用户名', path: 'username' }, content: { placeholder: '请输入用户名' } },
  { type: 'input', item: { label: '账号', path: 'account' }, content: { placeholder: '请输入账号' } },
  { type: 'input', item: { label: '邮箱', path: 'email' }, content: { placeholder: '请输入邮箱' } },
  { type: 'input', item: { label: '手机号', path: 'phone' }, content: { placeholder: '请输入手机号' } },
  { type: 'select', item: { label: '角色', path: 'roles' }, content: { placeholder: '请选择角色', options: rolesOption.value, multiple: true } },
  {
    type: 'select',
    item: { label: '状态', path: 'status' },
    content: { placeholder: '请选择状态', options: defaultOptions[OptionsKeyEnums.STATUS] },
  },
])
const pagination = computed(() => ({
  itemCount: total.value,
  pageSizes: [10, 20, 30, 40, 50],
  pageSlot: 5,
  pageSize: page.pageSize,
  showSizePicker: true,
  prefix: () => {
    return '共 ' + total.value + ' 条'
  },
  page: page.pageNum,
  'onUpdate:page': (p) => {
    page.pageNum = p
    getData()
  },
  'onUpdate:pageSize': (pageSize) => {
    page.pageNum = 1
    page.pageSize = pageSize
    getData()
  },
}))
const onSearch = (state, change) => {
  page.pageNum = 1
  if (state) {
    queryFormData.value = new UserQueryForm()
  }
  isSearch.value = !state
  getData()
  change()
}
const getData = async () => {
  loading.value = true
  const res = await api.user.getUserList(Object.assign(isSearch.value ? queryFormData.value : {}, page))
  if (res.code === 200) {
    data.value = res.data.list??[]
    total.value = res.data.total
  }
  loading.value = false
}
const initColumns = () => {
  return [
    {
      type: 'selection',
      fixed: 'left',
    },
    {
      title: '名称',
      key: 'username',
    },
    {
      title: '账号',
      key: 'account',
    },
    {
      title: '邮箱',
      key: 'email',
    },
    {
      title: '手机号',
      key: 'phone',
    },
    {
      title: '角色',
      key: 'role_info',
      render(row) {
        return h('div', {}, { default: () => row.role_info.join(',') })
      },
    },
    {
      title: '状态',
      key: 'status',
      render(row) {
        return h(NSwitch, { value: row.status, 'on-update:value': (val) => changeStatus(row.id, val) })
      },
    },
    {
      title: '创建时间',
      key: 'create_time',
    },
    {
      align: 'center',
      title: '操作',
      key: 'actions',
      render(row) {
        return h(Acruibs, { upData: () => onOpenModal('修改用户', row), delData: () => onDelete(row.id) })
      },
    },
  ]
}
const onOpenModal = (title, row) => {
  const m = window.$modal.create({
    title,
    preset: 'card',
    style: {
      width: '600px',
    },
    content: () => h(UpModal, { close: () => closeModal(m), row, getData, rolesOption: rolesOption.value }),
  })
}
const onSelect = (keys) => {
  rowIds.value = keys
}
const onBatchDelete = () => {
  window.$dialog.warning({
    title: '温馨提示',
    content: '是否确认批量删除用户?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      onDelete()
    },
  })
}
const onDelete = async (id) => {
  const m = window.$msg.loading('正在删除', { duration: 0 })
  const res = await api.user.delUser(id ? [id] : rowIds.value)
  if (res.code === 200) {
    getData()
  }
  m.destroy()
}
const getRolesOption = async () => {
  const res = await api.role.getRoleOption()
  rolesOption.value = res.data
}
const changeStatus = async (id, status) => {
  const res = await api.user.changeUserStatus({ id, status: status })
  if (res.code === 200) {
    getData()
  }
}
onMounted(() => {
  getRolesOption()
  getData()
})
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <XwyaForm label-placement="left" :item-list="queryFormItem" v-model="queryFormData" :row="4">
      <template #default="{ change, state }">
        <n-button :type="!state ? 'primary' : 'error'" @click="onSearch(state, change)">
          <XwyaIcon v-if="state" icon="solar--close-circle-bold" class="text-base" />
          <XwyaIcon v-else icon="solar--magnifer-linear" class="text-base" />
        </n-button>
      </template>
      <template #button>
        <div class="flex gap-2">
          <XwyaPopover text="新增">
            <XwyaButton v-has="'xwya:user:add'" @click="onOpenModal('新增用户')" circle type="info" iconSize="18" icon="solar--add-square-bold" />
          </XwyaPopover>

          <XwyaPopover text="批量删除">
            <XwyaButton
              v-has="'xwya:user:delete'"
              :disabled="!rowIds.length"
              @click="onBatchDelete"
              circle
              type="error"
              iconSize="20"
              icon="solar--trash-bin-trash-bold"
            />
          </XwyaPopover>
        </div>
      </template>
    </XwyaForm>
    <XwyaTable class="h-full"  :scroll-y="true" :columns="initColumns()" :data="data" :onSelect="onSelect" :pagination="pagination" :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
