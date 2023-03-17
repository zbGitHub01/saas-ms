<template>
  <div class="header">
    <div class="header-lf flx-center">
      <CollapseIcon />
      <Breadcrumb />
    </div>
    <div class="header-ri flx-center">
      <!--      <SearchMenu />-->
      <AssemblySize />
      <Fullscreen />
      <span class="username">{{ userInfo?.username }}</span>
      <Avatar />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CollapseIcon from './components/CollapseIcon.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Fullscreen from './components/Fullscreen.vue'
import AssemblySize from './components/AssemblySize.vue'
import Avatar from './components/Avatar.vue'
import { useGlobalStore } from '@/store/index'

const GlobalStore = useGlobalStore()
const userInfo = computed(() => GlobalStore.userInfo)
</script>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 55px;
  padding: 0 15px;
  background-color: #ffffff;
  border-bottom: 1px solid #f6f6f6;
}
.header-ri {
  margin: 0 30px;
}
.username {
  margin: 0 20px 0 0;
  font-size: 15px;
  color: rgb(0 0 0 / 75%);
}
</style>
