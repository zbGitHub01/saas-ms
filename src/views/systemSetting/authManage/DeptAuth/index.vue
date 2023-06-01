<template>
  <div class="flex-wrap">
    <div class="flex-block">
      <div class="title">机构部门</div>
      <el-scrollbar class="scrollbar">
        <el-tree
          ref="treeRef"
          :data="deptTree"
          node-key="id"
          :expand-on-click-node="false"
          default-expand-all
          highlight-current
          :props="defaultProps"
          @node-click="nodeClick"
        />
      </el-scrollbar>
    </div>
    <el-divider class="divider" direction="vertical" />
    <div class="flex-container">
      <div class="title">权限配置</div>
      <PermissionSetting ref="permissionRef" permission-type="dept" :curr-node="currDeptNode" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import PermissionSetting from '../components/PermissionSetting.vue'
import Apis from '@/api/modules/systemSetting'

const defaultProps = { label: 'name', value: 'id' }
const deptTree = ref([])
const permissionRef = ref()

const fetchDeptTree = async () => {
  const { data } = await Apis.findPermissionDeptTree()
  deptTree.value = data
}
fetchDeptTree()
const currDeptNode = ref({})
const nodeClick = node => {
  currDeptNode.value = node
  nextTick(() => {
    permissionRef.value.fetchPermission(true)
  })
}
</script>

<style lang="scss" scoped>
.flex-wrap {
  display: flex;
  overflow: hidden;
  height: calc(100vh - 214px);
  .title {
    display: flex;
    align-items: center;
    height: 44px;
    border-bottom: 1px var(--el-border-color) solid;
    margin-bottom: 10px;
  }
}
.flex-block {
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
}
.flex-container {
  flex: 1;
  height: 100%;
}
.divider {
  height: 100%;
  margin: 0 20px;
}
</style>
