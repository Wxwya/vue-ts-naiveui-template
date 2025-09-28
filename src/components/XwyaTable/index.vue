<template>
  <n-data-table
    v-tableY="{ scrollY: scrollY, page: pagination, show: paginateSinglePage }"
    :remote="true"
    size="large"
    @update:checked-row-keys="onSelect"
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

<script setup >
import { defineProps } from 'vue'
import { NDataTable } from 'naive-ui'
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: [Object, Boolean],
    default: false,
  },
  onSelect: {
    type: Function,
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
