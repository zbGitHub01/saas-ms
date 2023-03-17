<template>
  <el-dropdown trigger="click">
    <el-button size="small" type="primary">
      <span>更多</span>
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="refresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-dropdown-item>
        <el-dropdown-item @click="maximize">
          <el-icon><FullScreen /></el-icon>
          最大化
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeCurrentTab">
          <el-icon><Remove /></el-icon>
          关闭当前
        </el-dropdown-item>
        <el-dropdown-item @click="closeOtherTab">
          <el-icon><CircleClose /></el-icon>
          关闭其他
        </el-dropdown-item>
        <el-dropdown-item @click="closeAllTab">
          <el-icon><FolderDelete /></el-icon>
          关闭所有
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { inject, nextTick } from 'vue'
import { useTabsStore } from '@/store/modules/tabs'
import { useGlobalStore } from '@/store'
import { HOME_URL } from '@/utils/constant'

const globalStore = useGlobalStore()
const tabStore = useTabsStore()

const refreshCurrentPage = inject('refresh')
const refresh = () => {
  setTimeout(() => {
    refreshCurrentPage(false)
    nextTick(() => {
      refreshCurrentPage(true)
    })
  }, 0)
}

const maximize = () => {
  globalStore.setMaximize(true)
}

const closeCurrentTab = () => {
  if (tabStore.tabsMenuValue === HOME_URL) return
  tabStore.removeTabs(tabStore.tabsMenuValue)
}

const closeOtherTab = () => {
  tabStore.closeMultipleTab(tabStore.tabsMenuValue)
}

// Close All
const closeAllTab = () => {
  tabStore.closeMultipleTab()
  tabStore.goHome()
}
</script>

<style scoped lang="scss"></style>
