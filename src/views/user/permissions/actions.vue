<script lang="ts" setup>
import type { PropType } from 'vue'
import {XwyaPopover,XwyaButton,XwyaRemind } from "@/rely/page"
const props = defineProps({
  delData: {
    type: Function as PropType<() => void>,
    default: () => { },
  },
  upData: {
    type: Function as PropType<() => void>,
    default: () => { },
  },
  toSub: {
    type: Function as PropType<() => void>,
    default: () => { },
  }

})
const handlePositiveClick = () => {
  props.delData()
}
</script>

<template>
  <div class=" flex gap-2 justify-center">
    <XwyaPopover text="修改">
      <XwyaButton v-has="'xwya:permission:update'" @click="props.upData" circle type="warning" iconSize="20"
        icon="solar--pen-2-bold" />
    </XwyaPopover>
    <XwyaPopover text="按钮权限管理">
      <XwyaButton v-has="'xwya:permission:bnt'" @click="props.toSub" circle type="primary" iconSize="20"
        icon="solar--align-left-bold " />
    </XwyaPopover>
    <XwyaRemind :pop-config="{ onPositiveClick: handlePositiveClick, }" :tooltip-config="{ placement: 'top' }"
      pop-text="确认删除吗" tooltip-text="删除">
      <XwyaButton v-has="'xwya:permission:delete'" circle type="error" iconSize="20"
        icon="solar--trash-bin-trash-bold" />
    </XwyaRemind>
  </div>
</template>

<style lang="scss" scoped></style>
