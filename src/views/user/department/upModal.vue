<script lang="ts" setup>
import { ref, computed } from "vue"
import type { PropType } from "vue"
import { createDepartment, updateDepartment } from "@/api/department"
import type { FormRules } from "naive-ui"
import { XwyaForm, XwyaButton } from "@/rely/page"

const props = defineProps({
  close: {
    type: Function as PropType<() => void>,
    default: () => { }
  },
  getData: {
    type: Function as PropType<() => void>,
    default: () => { }
  },
  row: {
    type: Object as PropType<Department.DepartmentRow>,
    default: () => ({})
  }
})

const formData = ref<Partial<Department.DepartmentRow>>({ ...props.row })
const loading = ref(false)

const formItemData = computed<FormItemRowStruct[]>(() => ([
  { type: 'input', item: { label: '部门名称', path: 'name', ruleType: 'string' }, content: { placeholder: '请输入部门名称' } },
  { type: 'input', item: { label: '部门描述', path: 'description', ruleType: 'string' }, content: { placeholder: '请输入部门描述', type: 'textarea' } },
]))

const rules = computed<FormRules>(() => ({
  name: [{ required: true, trigger: [], message: '请输入部门名称', type: 'string' }],
}))

const submit = async (validate: FormValidateFunc) => {
  validate()(async (errors) => {
    if (errors) return
    loading.value = true
    const res = formData.value.id
      ? await updateDepartment(formData.value as Record<string, unknown>)
      : await createDepartment(formData.value as Record<string, unknown>)
    if (res.code === 200) {
      props.getData()
      props.close()
    }
    loading.value = false
  })
}
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
