<template>
  <n-form-item v-show="!formItem.isShow" :key="formItem.path" v-bind="{ ...$attrs, ...formItem }">
    <div class="flex-1">
      <n-upload
        v-model:file-list="value[formItem.path]"
        list-type="image-card"
        :custom-request="customRequest"
        v-bind="content"
      />
      <div v-if="content.comment" class="text-zinc-400 mt-1">{{ content.comment }}</div>
    </div>
  </n-form-item>
</template>
<script setup>
import { NFormItem, NUpload } from "naive-ui";
import { uploadFile } from "@/api/system"

defineProps({
  value:{
    type: Object,
    default: () => ({})
  },
  formItem:{
    type: Object ,
    default: () => ({})
  },
  content:{
    type: Object,
    default: () => ({})
  }
})
const customRequest = async ({ file, data, onFinish, onError }) => {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
  }
  formData.append('file', file.file)
  const res = await uploadFile(formData)
  if (res.code == 200) {
    file.url = res.data.url
    onFinish()
  } else {
    onError()
  }
}
</script>

<style lang="scss" scoped></style>
