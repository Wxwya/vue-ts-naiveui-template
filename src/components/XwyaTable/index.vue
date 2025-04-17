<template>
  <n-data-table :remote="true" size="small" @update:checked-row-keys="onSelect!" bordered :single-line="false"
    :columns="columns" :data="data" :pagination="(pagination)" :paginate-single-page="false"
    :loading="loading" :striped="true" :row-key="(r) => r.id" :scroll-x="1660" v-bind="$attrs">
    <template v-for="(value, name) in $slots" #[name] :key="name">
      <slot :name="name" :slot="value"></slot>
    </template>
  </n-data-table>
</template>

<script lang="ts" setup generic="T">
import { defineProps } from "vue";
import { NDataTable } from "naive-ui";
defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({})
  },
  onSelect: {
    type: Function,
    default: () => () => { }
  }
})
</script>
<style  scoped></style>
