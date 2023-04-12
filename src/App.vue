<template>
  <el-config-provider :size="assemblySize">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { useGlobalStore } from '@/store'

const globalStore = useGlobalStore()
// 配置全局组件大小
const assemblySize = computed(() => globalStore.assemblySize)
</script>

<style lang="scss" scoped></style>
