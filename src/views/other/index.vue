<template>
  <div class="p-4">
    <div class="border-0 border-l-4 border-solid border-green-400 text-2xl font-bold pl-4 ">按钮用法</div>
    <div class="py-10">
      <NSpace>
        <XwyaButton type="info" :iconSize="30" size="large" text="按钮111" icon="emojione-v1--baby-chick" />
        <XwyaButton type="error" text="error" />
        <XwyaButton tertiary circle iconSize="30" icon="emojione-v1--bear-face" size="large" />
      </NSpace>
    </div>
    <div class="border-0 border-l-4 border-solid border-green-400 text-2xl font-bold pl-4 ">tabs示例(默认不是使用面板)</div>
    <div class="py-10">
      <XwyaTabs :tablist="tablist"></XwyaTabs>
    </div>
    <div class="border-0 border-l-4 border-solid border-green-400 text-2xl font-bold pl-4 ">tabs示例使用面板</div>
    <div class="py-10">
      <XwyaTabs :pane="true" :tablist="tablist"></XwyaTabs>
    </div>
    <div class="border-0 border-l-4 border-solid border-green-400 text-2xl font-bold pl-4 ">信息弹窗提示</div>
    <div class="py-10">
      <XwyaRemind icon="emojione-v1--airplane" :pop-config="{ onPositiveClick: handlePositiveClick, onNegativeClick: handleNegativeClick }"
        :tooltip-config="{ placement: 'bottom' }" pop-text="确认删除吗" tooltip-text="删除">
        <XwyaButton type="error" text="error" />
      </XwyaRemind>
    </div>

  </div>
</template>

<script setup>
import {h} from 'vue'
import { XwyaRemind,XwyaButton,XwyaTabs,NSpace } from '@/rely/page';
const tablist = [
  { name: "tabs1", children: h("div", {}, 'Hello1') },
  { name: "tabs2", children: h("div", {}, 'Hello2') },
  { name: "tabs3", children: h("div", {}, 'Hello3') },
]
const handlePositiveClick = () => {
  window.$msg.info('是的')
}
const handleNegativeClick = () => {
  window.$msg.info('并不')
}
</script>

<style lang="scss" scoped></style>
