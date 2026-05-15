<script lang="ts" setup>
import { usePage, computed, onMounted } from '@/rely/lib'
import XwyaTable from '@/components/XwyaTable/index.vue'
import { storeToRefs } from 'pinia'
import useSystemConfigStore from '@/store/systemConfigStore'
import type { PaginationProps, DataTableColumns, DataTableRowKey } from "naive-ui"
type User = {
  name: string
  age: number
  address: string
  sex: string
  id: number
}
const { page, total, loading, data } = usePage<User>()
const { systemConfig } = storeToRefs(useSystemConfigStore())
const arr:User[] = Array.from({ length: 46 }).map((_, index):User => ({
  id: index + 1,
  name: `Edward King ${index}`,
  age: 32,
  sex: '男',
  address: `London, Park Lane no. ${index}`
}
))
const pagination = computed<PaginationProps>(() => ({
  itemCount: total.value,
  pageSizes: [10, 20,30,40,50],
  pageSlot: 5,
  pageSize: page.pageSize,
  showSizePicker: true,
  prefix: () => { 
    return systemConfig.value.isPc?'共 ' + total.value + ' 条':"";
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
const columns: DataTableColumns<User> = [
  {
    type: 'selection',
    fixed: 'left'
  },
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age'
  },
  {
    title: 'Sex',
    key: 'sex'
  },
  {
    title: "Address",
    key: 'address'
  }
]
const requestData =  ():Promise<User[]> => { 
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(arr.slice((page.pageNum-1) * page.pageSize, page.pageNum * page.pageSize))
    }, 1000)
  })
}
const getData = async () => { 
  loading.value = true
  const res = await requestData()
  data.value = res
  total.value = arr.length
  loading.value = false
}
const onSelect = (keys:DataTableRowKey[],rows:User[],meta:TableCheckMeta<User>) => {
  console.log(keys,rows,meta);
}
const setRowKey = (obj: User) => {
  return obj.id
}
onMounted(() => { 
  getData()
})
</script>

<template>
  <div class=" h-full w-full">
    <div class="border-0 border-l-4 border-solid border-green-400 text-2xl font-bold pl-4">表格示例</div>
    <div class="py-10">
      <XwyaTable  :columns="columns" :data="data" :row-key="setRowKey" :onSelect="onSelect " :pagination="pagination" :loading="loading" />
    </div>
  </div>

</template>

<style lang="scss" scoped></style>
