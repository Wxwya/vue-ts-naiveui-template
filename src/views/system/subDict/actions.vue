<script lang="ts" setup>
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import { XwyaRemind,XwyaPopover,XwyaButton } from '@/rely/page'
const props = defineProps({
  delData: {
    type: Function ,
    default: () => {},
  },
  upData: {
    type: Function as PropType<() => void>,
    default: () => {},
  }

})
const handlePositiveClick = () => { 
  props.delData()
}
</script>

<template>
  <div class=" flex gap-2 justify-center">
    <XwyaPopover text="修改">
          <XwyaButton v-has="'xwya:dict:update'" @click="props.upData"   circle type="warning" iconSize="20" icon="solar--pen-2-bold"  />
        </XwyaPopover>
        <XwyaRemind  :pop-config="{ onPositiveClick: handlePositiveClick, }"
        :tooltip-config="{ placement: 'top' }" pop-text="确认删除吗" tooltip-text="删除">
          <XwyaButton v-has="'xwya:dict:delete'"   circle type="error" iconSize="20" icon="solar--trash-bin-trash-bold"  />
        </XwyaRemind>
  </div>
</template>

<style lang="scss" scoped></style>
