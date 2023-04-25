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
      <el-dropdown trigger="click">
        <span class="username">
          hi，{{ userInfo?.username }}-{{ tenantInfo.tenantName }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-item v-for="item in tenantList" :key="item.tenantId" @click="chooseTenant(item)">
            {{ item.name }}
          </el-dropdown-item>
        </template>
      </el-dropdown>
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

const globalStore = useGlobalStore()
const userInfo = computed(() => globalStore.userInfo)
const tenantInfo = computed(() => globalStore.tenantInfo)
const tenantList = computed(() => globalStore.tenantList)

const chooseTenant = async item => {
  // if (item.tenantId === tenantInfo.value.tenantId) return
  await globalStore.chooseTenant(item.tenantId)
}
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
  cursor: pointer;
}
</style>
