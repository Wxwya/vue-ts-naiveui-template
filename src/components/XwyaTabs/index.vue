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

<script setup lang="ts">
import  {NTabs,NTab,NTabPane } from "naive-ui";
import { defineComponent } from 'vue';
import type { VNode,PropType } from 'vue';
export type NTabPaneProps = {
  closable?: boolean; // 是否允许关闭标签（仅在父组件的 type="card" 时生效）
  disabled?: boolean; // 是否禁用标签
  displayDirective?: 'show' | 'if' | 'show:lazy'; // 内容渲染方式
  name: string; // 标签的唯一标识，对应 n-tab 的 name
  tab?: string | VNode | (() => VNode); // 标签标题（支持动态渲染）
  tabProps?: Record<string, any>; // 标签的 DOM 属性
  children:  VNode | (() => VNode) ; // 标签内容
};
 defineProps({
  pane: {
    type: Boolean,
    default: false
  },
  tablist: {
    type: Array as PropType<NTabPaneProps[]>,
    default:()=>[]
  }
 })
 const initComponent = (com: VNode | (() => VNode)) => {
  return defineComponent({
    render() {
      if (typeof com === 'function') {
        return com();
      }
      return com;
    }
  });
}
const bindItem = (com: NTabPaneProps) => {
  const obj:any = {...com}
  delete obj.children
  return obj
 }
</script>

<style lang="scss" scoped></style>
