<template>
  <n-data-table
    v-tableY="{ scrollY: scrollY, page: pagination, show: paginateSinglePage }"
    :remote="true"
    size="large"
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
</style>
