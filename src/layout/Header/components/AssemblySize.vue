<template>
  <el-dropdown trigger="click" @command="setAssemblySize">
    <span class="tool-bar">
      <svg-icon name="content-right"></svg-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in assemblySizeList" :key="item" :disabled="assemblySize === item" :command="item">
          {{ assemblySizeListCh[item] }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useGlobalStore } from '@/store/index'

const globalStore = useGlobalStore()
const assemblySize = computed(() => globalStore.assemblySize)

const assemblySizeList = ['default', 'large', 'small']
const assemblySizeListCh = reactive({
  default: '默认',
  large: '大型',
  small: '小型'
})

const setAssemblySize = item => {
  if (assemblySize.value === item) return
  globalStore.setAssemblySizeSize(item)
}
</script>

<style lang="scss" scoped>
.tool-bar {
  margin-right: 20px;
  font-size: 20px;
  color: #333333;
  cursor: pointer;
}
</style>
