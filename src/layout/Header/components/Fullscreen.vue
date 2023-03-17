<template>
  <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
    <span class="icon-style">
      <svg-icon :name="isFullscreen ? 'small-screen' : 'full-screen'" @click="toggle" />
    </span>
  </el-tooltip>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
const { toggle, isFullscreen } = useFullscreen()
</script>

<style scoped lang="scss">
.icon-style {
  margin: 0 22px 0 0;
  font-size: 18px;
  color: rgb(0 0 0 / 75%);
  cursor: pointer;
}
</style>
