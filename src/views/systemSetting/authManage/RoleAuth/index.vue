<template>
  <div class="flex-wrap">
    <div class="flex-block">
      <div class="title">机构角色</div>
      <el-input v-model="roleName" class="search-form" placeholder="搜索职位" @keyup.enter="onSearch">
        <template #append>
          <el-button :icon="Search" @click="onSearch" />
        </template>
      </el-input>
      <el-scrollbar class="scrollbar">
        <el-tree
          ref="treeRef"
          class="tree"
          :data="roleList"
          node-key="id"
          default-expand-all
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        />
      </el-scrollbar>
    </div>
    <el-divider class="divider" direction="vertical" />
    <div class="flex-container">
      <div class="title">权限配置</div>
      <PermissionSetting ref="permissionRef" permission-type="role" :curr-node="currRoleNode" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PermissionSetting from '../components/PermissionSetting.vue'
import Apis from '@/api/modules/systemSetting'

const defaultProps = { label: 'name', value: 'id' }
const roleList = ref([])
const permissionRef = ref()
const roleName = ref('')
const treeRef = ref()
const onSearch = () => {
  treeRef.value.filter(roleName.value)
}

const fetchDeptTree = async () => {
  const { code, data } = await Apis.findPermissionRoleList({ name: '' })
  if (code === 200) {
    roleList.value = data
  }
}
fetchDeptTree()
const currRoleNode = ref({})
const nodeClick = node => {
  currRoleNode.value = node
  permissionRef.value.fetchPermission(true)
}
const filterNode = (value, data) => {
  return data.name.includes(value)
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
.search-form {
  margin-bottom: 16px;
}
.scrollbar {
  .tree {
    :deep(.el-tree-node__expand-icon) {
      display: none;
    }
    :deep(.el-tree-node__content) {
      height: 32px;
      padding-left: 10px !important;
    }
    :deep(.is-current) {
      .custom-tree-node {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
