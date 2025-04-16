<template>
   <component :is="layout[systemConfig.layout]" />
</template>

<script setup lang="ts">
import vertical from "./vertical.vue"
import level from "./level.vue";
import useSystemConfigStore from "@/store/systemConfigStore";
import useScreen from "@/hooks/useScreen";
import {storeToRefs} from "pinia"
useScreen()
const layout = { vertical,level}
const { systemConfig} = storeToRefs(useSystemConfigStore())
</script>
<style  scoped></style>
