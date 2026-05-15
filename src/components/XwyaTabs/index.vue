<template>
   <n-tabs type="line" animated v-bind="$attrs">
      <n-tab-pane  v-if="pane" v-for="(item,index) in tablist" :key="index"  v-bind="bindItem(item)" >
          <component v-if="item.children" :is='initComponent(item.children)'></component>
      </n-tab-pane>
      <n-tab v-if="!pane" v-for="(item,index) in tablist" :key="index" :name="item.name" />
      <template  v-for="(value, name) in $slots" #[name] :key="name">
      <slot :name="name" :slot="value"></slot>
    </template>
    </n-tabs>
</template>

<script setup>
import  {NTabs,NTab,NTabPane } from "naive-ui";
import { defineComponent} from 'vue';

 defineProps({
  pane: {
    type: Boolean,
    default: false
  },
  tablist: {
    type: Array,
    default:()=>[]
  }
 })
 const initComponent = (com) => {
  return defineComponent({
    render() {
      if (typeof com === 'function') {
        return com();
      }
      return com;
    }
  });
}
const bindItem = (com) => {
  const obj = {...com}
  delete obj.children
  return obj
 }
</script>

<style lang="scss" scoped></style>
