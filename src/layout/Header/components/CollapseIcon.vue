<template>
  <el-icon class="collapse-icon" @click="authStore.setCollapse()">
    <component :is="isCollapse ? 'Expand' : 'Fold'"></component>
  </el-icon>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
const authStore = useAuthStore()
const isCollapse = computed(() => authStore.isCollapse)
</script>

<style lang="scss" scoped>
.collapse-icon {
  margin-right: 20px;
  font-size: 22px;
  cursor: pointer;
}
</style>
