<script lang="ts" setup>
//  solar--clipboard-bold
import { computed, inject, onMounted, } from 'vue'
import usePage from '@/hooks/usePage';
import XwyaTable from '@/components/XwyaTable/index.vue'
import type { PaginationProps, DataTableColumns } from "naive-ui"
const api = inject("api") as Api
const { data, total, loading, page } = usePage<Log.LoggerInfo>();
const pagination = computed<PaginationProps>(() => ({
  itemCount: total.value,
  pageSizes: [10, 20,30,40,50],
  pageSlot: 5,
  pageSize: page.pageSize,
  showSizePicker: true,
  prefix: () => { 
    return '共 ' + total.value + ' 条';
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
  },
}))

const initColumns = (): DataTableColumns<Log.LoggerInfo> => {
  return [
    {
      title: '序号',
      key: 'id',
      width: 60,
    },
    {
      title: '状态码',
      key: 'status_code',
      width: 80,
    },
    {
      title: 'ip地址',
      key: 'ip',
      width: 120,
    },
    {
      title: '请求方法',
      key: 'method',
      width: 90,
    },
    {
      width: 200,
      ellipsis: {
        tooltip: true
      },
      ellipsisComponent: "ellipsis",
      title: '请求地址',
      key: 'path',
    },
    {
      width: 500,
      ellipsis: {
        tooltip: true
      },
      ellipsisComponent: "ellipsis",
      title: "错误信息",
      key: "error_content",
    },
    {
      width: 200,
      ellipsis: {
        tooltip: true
      },
      ellipsisComponent: "ellipsis",
      title: "错误文件",
      key: "file",
    },
    {
      width: 80,
      title: "错误行",
      key: "line",
    },
    {
      width: 160,
      title: "发生时间",
      key: "create_time",
    }
  ]
}
const getData = async () => {
  loading.value = true;
  const res = await api.system.getLogList(page)
  if (res.code === 200) {
    data.value = res!.data!.list
    total.value = res!.data!.total
  }
  loading.value = false;
}
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="h-full">
    <XwyaTable class="h-full"  :scroll-y="true"   :columns="initColumns()" :data="data" :pagination="pagination"
      :loading="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
