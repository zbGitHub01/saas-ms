<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="removeTab">
        <el-tab-pane
          v-for="item in tabsMenuList"
          :key="item.path"
          :path="item.path"
          :label="item.title"
          :name="item.path"
          :closable="item.close"
        >
          <template #label>
            <el-icon class="tabs-icon">
              <component :is="item.icon" v-if="item.icon"></component>
              <Menu v-else />
            </el-icon>
            {{ item.title }}
          </template>
        </el-tab-pane>
      </el-tabs>
      <MoreButton />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'
import MoreButton from './components/MoreButton.vue'

const tabStore = useTabsStore()

const tabsMenuList = computed(() => tabStore.tabsMenuList)
console.log(tabsMenuList.value, '----tabs')
const tabsMenuValue = computed({
  get: () => tabStore.tabsMenuValue,
  set: val => tabStore.setTabsMenuValue(val)
})

const route = useRoute()
const router = useRouter()
// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
  () => route.path,
  () => {
    let params = {
      title: route.meta.title,
      path: route.path,
      icon: route.meta.icon,
      close: true
    }
    tabStore.addTabs(params)
    // setTimeout(() => {
    //   console.log()
    // }, 200)
  },
  {
    immediate: true
  }
)

const tabClick = tabItem => {
  let path = tabItem.props.name
  router.push(path)
}
const removeTab = activeTabPath => {
  tabStore.removeTabs(activeTabPath)
}
</script>

<style lang="scss" scoped>
.tabs-box {
  :deep(.tabs-menu) {
    position: relative;
    width: 100%;
    .el-dropdown {
      position: absolute;
      top: 8px;
      right: 13px;
    }
    .tabs-icon {
      top: 2px;
      margin-right: 2px;
    }
    .el-tabs__nav-wrap {
      position: absolute;
      width: calc(100% - 120px);
    }
    .el-tabs--card > .el-tabs__header {
      box-sizing: border-box;
      height: 40px;
      padding: 0 10px;
      margin: 0;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item {
      color: #cccccc;
      border: none;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
      color: var(--el-color-primary);
      border-bottom: 2px solid var(--el-color-primary);
    }
    .el-tabs__item .is-icon-close svg {
      margin-top: 0.5px;
    }
  }
}
</style>
