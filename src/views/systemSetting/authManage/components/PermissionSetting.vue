<template>
  <div class="flex-wrap">
    <div class="flex-block br1">
      <div class="title">权限选项</div>
      <el-scrollbar class="scrollbar">
        <el-tree
          class="tree"
          ref="treeRef"
          show-checkbox
          :data="menuList"
          node-key="id"
          default-expand-all
          highlight-current
          :props="defaultProps"
          @node-click="nodeClick"
        />
      </el-scrollbar>
    </div>
    <div class="flex-container">
      <div class="title">操作/数据权限</div>
      <div class="table-wrap">
        <el-table :data="dataPermission" default-expand-all border row-key="permissionId">
          <el-table-column prop="menuName" label="操作" width="220" />
          <el-table-column label="数据范围">
            <template #default="scope">不限</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import menuData from '@/store/menu.json'
import cloneDeep from 'lodash/cloneDeep'

const defaultProps = {
  label: 'menuName',
  value: 'permissionId'
}
const menuList = ref(formatMenuData(menuData))
const dataPermission = ref([])
console.log(menuList.value, '---menuList')
const nodeClick = data => {
  console.log(data, '--node')
  dataPermission.value = data.data
}

function formatMenuData(data) {
  function formatMenu(data) {
    data.forEach(item => {
      const firstChild = item.children && item.children.length ? item.children[0] : null
      if (firstChild) {
        if (firstChild.permissionType.type !== 1) {
          item.data = cloneDeep(item.children)
          item.children = null
        } else {
          formatMenu(item.children)
        }
      }
    })
  }
  formatMenu(data)
  return data
}
</script>

<style lang="scss" scoped>
.flex-wrap {
  display: flex;
  .title {
    display: flex;
    align-items: center;
    height: 44px;
    border-bottom: 1px var(--el-border-color) solid;
    font-size: 14px;
    background-color: #f8f8f8;
    color: #909399;
    padding: 0 12px;
  }
}
.flex-block {
  width: 260px;
  height: 100%;
  &.br1 {
    border-right: 1px var(--el-border-color) solid;
  }
}
.flex-container {
  flex: 1;
  height: 100%;
}
.scrollbar {
  height: calc(100% - 116px);
}
.tree {
  margin-top: 10px;
}
.table-wrap {
  margin-left: -1px;
  margin-top: -1px;
}
</style>
