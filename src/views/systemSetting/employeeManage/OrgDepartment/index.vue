<template>
  <div class="org-department">
    <div class="department-wrap">
      <div class="title">
        机构部门
        <el-button class="add-btn" size="small" :icon="Plus" @click="editDept(null)"></el-button>
      </div>
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
        >
          <template #default="{ data }">
            <div class="custom-tree-node">
              <span>{{ data.name }}</span>
              <span class="operation">
                <el-icon @click.stop="editDept(data)"><Edit /></el-icon>
                <el-icon @click.stop="delDept(data)"><Delete /></el-icon>
              </span>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <el-divider class="divider" direction="vertical" />
    <div class="employee-wrap">
      <div class="title">员工列表</div>
      <el-scrollbar class="scrollbar">
        <div class="tag-list">
          <el-tag v-for="(item, index) in employeeList" :key="index" class="tag" size="large">
            <span>{{ `${item.name}(${item.phone})` }}</span>
            <el-icon class="edit-icon" @click="editEmployee(item)"><Edit /></el-icon>
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <EditDeptDialog v-model:dialog-visible="deptVisible" :dept-tree="deptTree" :dept-item="deptItem" @change="fetchDeptTree" />
  <EditEmployeeDialog
    v-model:dialog-visible="employeeVisible"
    :employee-item="employeeItem"
    :dept-item="currDeptNode"
    @change="fetchEmployeeList"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import Apis from '@/api/modules/systemSetting'
import EditDeptDialog from './components/EditDeptDialog.vue'
import EditEmployeeDialog from './components/EditEmployeeDialog.vue'

const treeRef = ref()
const deptTree = ref([
  {
    id: 0,
    name: '所有部门',
    parentId: 0,
    children: []
  }
])
const defaultProps = { label: 'name', value: 'id' }
const employeeList = ref([])
const deptVisible = ref(false)
const employeeVisible = ref(false)
let deptItem = null
let employeeItem = null
let currDeptNode = null

const fetchDeptTree = async () => {
  const { data } = await Apis.findDeptTree()
  deptTree.value[0].children = data
}
const editDept = node => {
  deptItem = node
  deptVisible.value = true
}
const delDept = async node => {
  const isConfirm = await ElMessageBox.confirm(`确定删除该部门吗？`, '提示', { type: 'warning' }).catch(() => {})
  if (!isConfirm) return
  await Apis.delDept({ id: node.id })
  ElMessage.success('删除成功')
  await fetchDeptTree()
}

const fetchEmployeeList = async () => {
  const { data } = await Apis.findDeptEmployeeList({ deptId: currDeptNode.id })
  employeeList.value = data
}
const nodeClick = node => {
  currDeptNode = node
  fetchEmployeeList()
}
const editEmployee = item => {
  employeeItem = item
  employeeVisible.value = true
}
fetchDeptTree()
</script>

<style lang="scss" scoped>
.org-department {
  display: flex;
  overflow: hidden;
  height: calc(100vh - 214px);
}
.department-wrap {
  display: flex;
  flex-direction: column;
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
