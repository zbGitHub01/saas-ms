<template>
  <div class="flex-wrap">
    <div class="flex-block">
      <div class="title">部门</div>
      <el-scrollbar class="scrollbar">
        <el-tree
          ref="treeRef"
          :data="deptTree"
          node-key="id"
          default-expand-all
          highlight-current
          :props="defaultProps"
          @node-click="checkDept"
        />
      </el-scrollbar>
    </div>
    <el-divider class="divider" direction="vertical" />
    <div class="flex-block">
      <div class="title">员工</div>
      <el-input v-model="employeeName" class="search-form" placeholder="搜索职位" @keyup.enter="onSearch">
        <template #append>
          <el-button :icon="Search" @click="onSearch" />
        </template>
      </el-input>
      <el-scrollbar class="scrollbar">
        <el-tree
          ref="treeRef"
          class="tree"
          :data="employeeList"
          node-key="id"
          default-expand-all
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="checkEmployee"
        />
      </el-scrollbar>
    </div>
    <el-divider class="divider" direction="vertical" />
    <div class="flex-container">
      <div class="title">权限配置</div>
      <PermissionSetting ref="permissionRef" permission-type="employee" :curr-node="currEmployeeNode" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PermissionSetting from '../components/PermissionSetting.vue'
import Apis from '@/api/modules/systemSetting'

const defaultProps = { label: 'name', value: 'id' }
const deptTree = ref([])
const employeeList = ref([])
const permissionRef = ref()
const employeeName = ref('')
const treeRef = ref()
const currDeptNode = ref({})
const currEmployeeNode = ref({})
const fetchDeptTree = async () => {
  const { code, data } = await Apis.findPermissionEmployeeDeptTree()
  console.log(data, '---data')
  if (code === 200) {
    deptTree.value = data
  }
}
const fetchEmployeeList = async () => {
  const { code, data } = await Apis.findPermissionEmployeeList({ deptId: currDeptNode.value.id })
  if (code === 200) {
    employeeList.value = data
  }
}

const checkDept = node => {
  currDeptNode.value = node
  fetchEmployeeList()
}
const checkEmployee = node => {
  currEmployeeNode.value = node
  permissionRef.value.fetchPermission()
}
const onSearch = () => {
  treeRef.value.filter(employeeName.value)
}
const filterNode = (value, data) => {
  return data.name.includes(value)
}

fetchDeptTree()
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
  width: 220px;
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
