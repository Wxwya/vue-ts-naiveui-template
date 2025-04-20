<script  setup>
import { usePage, computed, onMounted } from '@/rely/lib'
import XwyaTable from '@/components/XwyaTable/index.vue'
import useSystemConfigStore from '@/store/systemConfigStore'
import { storeToRefs } from 'pinia'
const { page, total, loading, data } = usePage()
const { systemConfig } = storeToRefs(useSystemConfigStore())
const arr = Array.from({ length: 46 }).map((_, index) => ({
  id: index + 1,
  name: `Edward King ${index}`,
  age: 32,
  sex: '男',
  address: `London, Park Lane no. ${index}`
}
))
const pagination = computed(() => ({
  itemCount: total.value,
  pageSizes: [10, 20,30,40,50],
  pageSlot: 5,
  pageSize: page.pageSize,
  showSizePicker: true,
  prefix: () => { 
    return systemConfig.value.isPc?'共 ' + total.value + ' 条':"";
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
const columns = [
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
const requestData =  () => { 
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
const onSelect = (keys,rows,meta) => {
  console.log(keys,rows,meta);
}
const setRowKey = (obj) => {
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
