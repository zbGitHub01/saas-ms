<template>
  <div class="org-department">
    <div class="department-wrap">
      <div class="title">
        机构部门
        <el-button class="add-btn" size="small" :icon="Plus" @click="editDept(null)"></el-button>
      </div>
      <el-scrollbar class="scrollbar">
        <el-tree :data="deptTree" node-key="id" :default-expanded-keys="[0]" highlight-current :props="defaultProps">
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <span>{{ data.name }}</span>
              <span class="operation">
                <el-icon><Edit /></el-icon>
                <el-icon><Delete /></el-icon>
              </span>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <el-divider class="divider" direction="vertical" />
    <div class="employee-wrap">
      <div class="title">
        员工列表
        <el-button class="add-btn" size="small" :icon="Plus" @click="editEmployee(null)"></el-button>
      </div>
      <el-scrollbar class="scrollbar">
        <div class="tag-list">
          <el-tag class="tag" v-for="(item, index) in employeeList" :key="index" size="large">
            <span>{{ `${item.name}(${item.mobile})` }}</span>
            <el-icon class="edit-icon"><Edit /></el-icon>
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <EditDeptDialog v-model:dialog-visible="deptVisible" :dept-tree="deptTree" :dept-item="deptItem" @change="fetchEmployeeList" />
  <EditEmployeeDialog
    v-model:dialog-visible="employeeVisible"
    :dept-tree="deptTree"
    :employee-item="employeeItem"
    @change="fetchEmployeeList"
  />
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import Apis from '@/api/modules/systemSetting'
import EditDeptDialog from './components/EditDeptDialog.vue'
import EditEmployeeDialog from './components/EditEmployeeDialog.vue'

const deptTree = ref([
  {
    id: 0,
    name: '所有部门',
    parentId: 0,
    children: []
  }
])
const defaultProps = {
  label: 'name',
  value: 'id',
}
const employeeList = ref(Array(10).fill({ name: '张兮兮', mobile: '15167696520' }))
const deptVisible = ref(false)
const employeeVisible = ref(false)
let deptItem = null
let employeeItem = null
const editDept = item => {
  deptItem = item
  deptVisible.value = true
}
const editEmployee = item => {
  employeeItem = item
  employeeVisible.value = true
}
const fetchDeptTree = async () => {
  const { code, data } = await Apis.findDeptTree()
  if (code === 200) {
    deptTree.value[0].children = data
  }
}
fetchDeptTree()
const fetchEmployeeList = () => {}
</script>

<style lang="scss" scoped>
.org-department {
  display: flex;
  overflow: hidden;
  height: calc(100vh - 214px);
}
.department-wrap {
  width: 260px;
  height: 100%;
}
.employee-wrap {
  flex: 1;
  height: 100%;
}
.title {
  display: flex;
  align-items: center;
  height: 44px;
  border-bottom: 1px var(--el-border-color) solid;
  margin-bottom: 10px;
}
.add-btn {
  margin-left: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  &:hover {
    .operation {
      display: inline;
    }
  }
  .operation {
    display: none;
    .el-icon {
      margin-right: 2px;
    }
  }
}
.divider {
  height: 100%;
  margin: 0 20px;
}
.tag-list {
  .tag {
    margin-right: 16px;
    margin-bottom: 16px;
    :deep(.el-tag__content) {
      display: flex;
      align-items: center;
    }
    .edit-icon {
      margin-left: 4px;
    }
  }
}
</style>
