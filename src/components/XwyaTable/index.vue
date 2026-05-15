<template>
  <n-data-table
    v-tableY="{ scrollY: scrollY, page: pagination, show: paginateSinglePage }"
    :remote="true"
    size="small"
    @update:checked-row-keys="onSelect!"
    bordered
    :single-line="false"
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :paginate-single-page="paginateSinglePage"
    :loading="loading"
    :striped="true"
    :row-key="(r) => r.id"
    :scroll-x="1024"
    v-bind="$attrs"
  >
    <template v-for="(value, name) in $slots" #[name] :key="name">
      <slot :name="name" :slot="value"></slot>
    </template>
  </n-data-table>
</template>

<script lang="ts" setup generic="T">
import { NDataTable } from 'naive-ui'
import type { PropType } from 'vue'
import type { PaginationProps, DataTableColumns, DataTableRowKey, DataTableRowData } from 'naive-ui'
 defineProps({
  columns: {
    type: Array as PropType<DataTableColumns<T>>,
    default: () => [],
  },
  data: {
    type: Array as PropType<DataTableRowData[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: [Object, Boolean] as PropType<PaginationProps | false>,
    default: false,
  },
  onSelect: {
    type: Function as PropType<(rowKeys: DataTableRowKey[], rows: T[], meta: TableCheckMeta<T>) => void>,
    default: () => () => {},
  },
  paginateSinglePage: {
    type: Boolean,
    default: false,
  },
  scrollY: {
    type: Boolean,
    default: false,
  },
})
</script>
<style lang="css" scoped>
.n-data-table {
  --table-max-height: auto;
}
.n-data-table > :deep(.n-data-table-wrapper) > .n-data-table-base-table > .n-data-table-base-table-body {
  max-height: var(--table-max-height);
}
.n-data-table >:deep(.n-data-table-wrapper) >.n-data-table-base-table{
  position: relative;
  height: 100% !important;
}
.n-data-table >:deep(.n-data-table-wrapper){
  height: 100% !important;
}
.n-data-table >:deep(.n-data-table-wrapper) >.n-data-table-base-table>.n-data-table-base-table-body>.n-scrollbar-container>.n-scrollbar-content{
  height: 100%;
  min-width:100% !important ;
  overflow-x: auto;
}
.n-data-table >:deep(.n-data-table-wrapper) >.n-data-table-base-table .n-empty{
  position: absolute;
  inset: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.n-data-table >:deep(.n-data-table-wrapper) >.n-data-table-base-table>.n-data-table-base-table-body .n-data-table-table >.n-data-table-thead{
  /* background-color: red !important; */
  position: sticky !important;
  top: 0 !important;
  z-index: 10 !important;
}
</style>
