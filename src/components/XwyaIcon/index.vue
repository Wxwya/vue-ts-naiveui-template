<script  setup>
import { computed } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { isIconType } from '@/utils/setIconfont';
const props =  defineProps({
  icon: {
    type: String,
    default: '',
    required: true,
  },
})
const iconType = computed(() => isIconType(props.icon))
</script>
<template>
    <span v-if="iconType=='iconify'" :class="`iconify ${icon}`" v-bind="$attrs"></span>
    <span v-if="iconType== 'ali'" :class="`iconfont ${icon}`" v-bind="$attrs"></span>
    <SvgIcon v-if="iconType=='local'" :name="icon" v-bind="$attrs"></SvgIcon>
</template>
<style lang="scss" scoped></style>
