<template>
  <el-container>
    <el-aside>
      <Menu />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
        <Tabs />
      </el-header>
      <el-main>
        <router-view v-slot="{ Component, route }">
          <transition appear name="fade-transform" mode="out-in">
            <keep-alive :include="cacheRouter">
              <component :is="Component" v-if="isRouterShow" :key="route.path"></component>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
      <Maximize v-if="maximize" />
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, watch, provide } from 'vue'
import Menu from './Menu/index.vue'
import Header from './Header/index.vue'
import Tabs from './Tabs/index.vue'
import Maximize from './Tabs/components/Maximize.vue'
// import { cacheRouter } from '@/router'
import { useGlobalStore } from '@/store'

const cacheRouter = []
const globalStore = useGlobalStore()

const maximize = computed(() => globalStore.maximize)

watch(
  () => globalStore.maximize,
  value => {
    const app = document.getElementById('app')
    if (value) app.classList.add('main-maximize')
    else app.classList.remove('main-maximize')
  }
)

// 刷新当前页面
const isRouterShow = ref(true)
const refreshCurrentPage = val => (isRouterShow.value = val)
provide('refresh', refreshCurrentPage)
</script>

<style lang="scss" scoped>
.el-container {
  display: flex;
  width: 100%;
  min-width: 970px;
  height: 100%;
  .el-aside {
    width: auto;
    overflow: inherit;
  }
  .el-header,
  .el-footer {
    height: auto;
    padding: 0;
  }
  .el-main {
    box-sizing: border-box;
    padding: 12px 12px;
    /* 防止切换出现横向滚动条 */
    overflow-x: hidden;
    background: var(--color-main-bg);
    .mainBox {
      min-height: 100%;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      box-sizing: border-box;
    }
  }
}
</style>
