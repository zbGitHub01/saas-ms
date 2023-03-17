<template>
  <div
    class="menu"
    :style="{ width: isCollapse ? '65px' : '260px' }"
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.01)"
  >
    <div class="menu-bg"></div>
    <Logo :is-collapse="isCollapse" />
    <el-scrollbar class="scrollbar" :class="!isCollapse && 'pd20'">
      <el-menu
        :default-active="activeMenu"
        :router="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened="true"
        background-color="rgba(31, 46, 84, 0)"
        text-color="#ffffff"
        active-text-color="#2fcea8"
      >
        <SubItem :menu-list="menuList" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import Logo from './components/Logo.vue'
import SubItem from './components/SubItem.vue'

const route = useRoute()
const authStore = useAuthStore()
const menuList = computed(() => authStore.menuList)
console.log(menuList.value, '---xoxo')
const isCollapse = computed(() => authStore.isCollapse)
const activeMenu = computed(() => {
  if (route.meta.activeMenu) {
    return route.meta.activeMenu
  }
  return route.path
})

const loading = ref(false)
let screenWidth = 0
// 监听窗口大小变化，合并 aside
const listeningWindow = () => {
  window.onresize = () => {
    return (() => {
      screenWidth = document.body.clientWidth
      if (!isCollapse.value && screenWidth < 1200) authStore.setCollapse()
      if (isCollapse.value && screenWidth > 1200) authStore.setCollapse()
    })()
  }
}
listeningWindow()
</script>

<style lang="scss" scoped>
.menu {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: linear-gradient(143deg, #184eae 0%, #437fec 46%, #55aff2 92%, #51b7ed 100%);
  transition: all 0.3s ease;
  .menu-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/menu-bg.png');
    background-repeat: no-repeat;
    background-position: bottom left;
    z-index: 0;
  }
  .el-scrollbar {
    height: calc(100% - 85px);
    box-sizing: border-box;
    &.pd20 {
      padding: 0 20px;
    }
    .el-menu {
      flex: 1;
      overflow: auto;
      overflow-x: hidden;
      border-right: none;
    }
  }
  :deep(.el-menu-item:hover) {
    //background-color: var(--el-color-primary);
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff !important;
    border-radius: 4px;
  }
  //:deep(.el-popper.is-light) {
  //  background: #2c3049 !important;
  //}
  :deep(.el-menu--vertical > .el-menu-item.is-active) {
    background-color: #2fcea8;
    color: #ffffff !important;
    border-radius: 4px;
  }
  :deep(.el-menu--inline > .is-active > .el-sub-menu__title) {
    color: #2fcea8 !important;
  }
  :deep(.el-menu--vertical > .is-active > .el-sub-menu__title) {
    background-color: #2fcea8 !important;
    color: #ffffff !important;
    border-radius: 4px;
  }
}
</style>
<style lang="scss">
body .el-popper.is-light {
  background: #488dee;
}
</style>
