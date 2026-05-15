<script setup>
import { ref, computed, onMounted } from "vue"
import { createUser, updateUser } from "@/api/user"
import { getDepartmentOptions } from "@/api/department"
import { XwyaForm, XwyaButton } from "@/rely/page"
const props = defineProps({
  rolesOption: {
    type: Array,
    default: () => [],
  },
  close: {
    type: Function,
    default: () => { }
  },
  getData: {
    type: Function,
    default: () => { }
  },
  row: {
    type: Object,
    default: () => ({})
  }
})

const departmentOptions = ref([])
const formData = ref({
  ...props.row,
  role_ids: props.row.roles?.map(r => r.id) ?? [],
  department_ids: props.row.departments?.map(d => d.id) ?? [],
})
const loading = ref(false)

const formItemData = computed(() => ([
  { type: 'input', item: { label: '用户名', path: 'username', ruleType: "string" }, content: { placeholder: '请输入用户名' } },
  { type: 'input', item: { label: '账号', path: 'account', ruleType: "string" }, content: { placeholder: '请输入账号' } },
  { type: 'input', item: { label: "邮箱", path: "email", ruleType: "string" }, content: { placeholder: "请输入邮箱" } },
  { type: 'input', item: { label: "手机号", path: "phone", ruleType: "string" }, content: { placeholder: "请输入手机号" } },
  { type: 'input', item: { label: "密码", path: "password", ruleType: "string" }, content: { placeholder: "请输入密码", type: "password" } },
  { type: "select", item: { label: "角色", path: "role_ids", ruleType: "array" }, content: { filterable: true, multiple: true, placeholder: "请选择角色", options: props.rolesOption } },
  { type: "select", item: { label: "部门", path: "department_ids" }, content: { filterable: true, multiple: true, placeholder: "请选择部门", options: departmentOptions.value } },
]))

const rules = computed(() => {
  return formItemData.value.reduce((acc, cur) => {
    if (cur.item.path === 'password' && props.row.id) return acc
    if (!cur.item.ruleType) return acc
    acc[cur.item.path] = [{ required: true, trigger: [], message: cur.content?.placeholder, type: cur.item.ruleType }]
    return acc
  }, {})
})

const submit = async (validate) => {
  validate()(async (errors) => {
    if (errors) return
    loading.value = true
    const res = formData.value.id > 0
      ? await updateUser(formData.value)
      : await createUser(formData.value)
    if (res.code === 200) {
      props.getData()
      props.close()
    }
    loading.value = false
  })
}

onMounted(async () => {
  const res = await getDepartmentOptions()
  if (res.code === 200) departmentOptions.value = res.data ?? []
})
</script>

<template>
  <div>
    <XwyaForm :rules="rules" label-placement="left" :label-width="80" :item-list="formItemData" v-model="formData">
      <template #default="{ validate }">
        <div class="w-full flex gap-4 justify-end pr-[10px]">
          <XwyaButton @click="submit(validate)" type="success" text="确认" :loading="loading" />
          <XwyaButton @click="props.close" text="取消" />
        </div>
      </template>
    </XwyaForm>
  </div>
</template>

<style lang="scss" scoped></style>
