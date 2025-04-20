<template>
   <component :is="layout[systemConfig.layout]" />
</template>

<script setup lang="ts">
import vertical from "./vertical.vue"
import level from "./level.vue";
import useSystemConfigStore from "@/store/systemConfigStore";
import {storeToRefs} from "pinia"
const layout = { vertical,level}
const { systemConfig } = storeToRefs(useSystemConfigStore())
</script>
<style  scoped></style>
