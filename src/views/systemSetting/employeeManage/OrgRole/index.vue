<template>
  <div class="org-role">
    <div class="column-wrap">
      <div class="title">
        机构角色
        <el-button class="add-btn" size="small" :icon="Plus" @click="editRole(null)"></el-button>
      </div>
      <el-input v-model="roleName" class="search-form" placeholder="搜索职位" @keyup.enter="onSearch">
        <template #append>
          <el-button :icon="Search" @click="onSearch" />
        </template>
      </el-input>
      <el-scrollbar class="scrollbar">
        <el-tree
          class="tree"
          ref="treeRef"
          :data="roleList"
          node-key="id"
          default-expand-all
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="checkRole"
        >
          <template #default="{ data }">
            <el-tooltip :disabled="!data.remark" effect="dark" :content="data.remark" placement="bottom">
              <div class="custom-tree-node">
                <span>{{ data.name }}</span>
                <span class="operation">
                  <el-icon @click="editRole(data)"><Edit /></el-icon>
                  <el-icon><Delete /></el-icon>
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <el-divider class="divider" direction="vertical" />
    <div class="column-wrap">
      <div class="title">授权部门</div>
      <el-scrollbar class="scrollbar">
        <el-tree
          class="tree"
          :data="roleDeptList"
          node-key="id"
          default-expand-all
          highlight-current
          :props="defaultProps"
          @node-click="checkDept"
        >
          <template #default="{ data }">
            <div class="custom-tree-node">
              <span>{{ data.name }}</span>
              <span class="operation">
                <el-icon @click="delDept(data)"><Delete /></el-icon>
              </span>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <el-divider class="divider" direction="vertical" />
    <div class="paved-wrap">
      <div class="title">
        员工列表
        <el-button class="add-btn" size="small" :icon="Plus" @click="addEmployee"></el-button>
      </div>
      <el-scrollbar class="scrollbar">
        <div class="tag-list">
          <el-tag v-for="(item, index) in employeeList" :key="index" class="tag" size="large">
            <span>{{ `${item.name}(${item.phone})` }}</span>
            <el-icon class="edit-icon" @click="delEmployee(item)"><Delete /></el-icon>
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <EditRoleDialog v-model:dialog-visible="roleVisible" :item="roleItem" @change="fetchRoleList" />
  <AddEmployeeDialog
    v-model:dialog-visible="employeeVisible"
    :dept-item="currDeptNode"
    :role-item="currRoleNode"
    @change="fetchEmployeeList"
  />
</template>
<script setup>
import { ref } from 'vue'
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import Apis from '@/api/modules/systemSetting'
import EditRoleDialog from './components/EditRoleDialog.vue'
import AddEmployeeDialog from './components/AddEmployeeDialog.vue'

const roleName = ref('')
const roleVisible = ref(false)
const employeeVisible = ref(false)
let roleItem = null
const treeRef = ref()
const onSearch = () => {
  treeRef.value.filter(roleName.value)
}
const filterNode = (value, data) => {
  return data.name.includes(value)
}
const editRole = item => {
  roleItem = item
  roleVisible.value = true
}

const defaultProps = {
  label: 'name',
  value: 'id'
}
const roleList = ref([])
const roleDeptList = ref([])
const employeeList = ref([])
const fetchRoleList = async () => {
  const { code, data } = await Apis.findRoleList({ name: '' })
  if (code === 200) {
    roleList.value = data
  }
}
fetchRoleList()

let currRoleNode = {}
const fetchRoleDeptList = async () => {
  const { code, data } = await Apis.findRoleDeptList({ roleId: currRoleNode.id })
  if (code === 200) {
    roleDeptList.value = data
    // roleDeptList.value = [{ id: 1, name: '商务中心' }]
  }
}
const checkRole = node => {
  currRoleNode = node
  employeeList.value = []
  currDeptNode = {}
  fetchRoleDeptList()
}
const delDept = async item => {
  const isConfirm = await ElMessageBox.confirm('是否确认移除授权部门？', '提示', { type: 'warning' }).catch(() => {})
  if (!isConfirm) return
  const { code } = await Apis.removeDept({ deptId: item.id, roleId: currRoleNode.id })
  if (code === 200) {
    ElMessage.success('删除成功！')
    await fetchRoleDeptList()
  }
}

let currDeptNode = {}
const checkDept = node => {
  currDeptNode = node
  fetchEmployeeList()
}
// 员工列表
const fetchEmployeeList = async () => {
  const { code, data } = await Apis.findRoleEmployeeList({ deptId: currDeptNode.id, roleId: currRoleNode.id })
  if (code === 200) {
    employeeList.value = data
  }
}
const addEmployee = () => {
  if (!currDeptNode.id || !currRoleNode.id) {
    ElMessage.warning('请先选择机构角色和授权部门')
    return
  }
  employeeVisible.value = true
}
const delEmployee = async item => {
  const isConfirm = await ElMessageBox.confirm('是否确认移除员工角色？', '提示', { type: 'warning' }).catch(() => {})
  if (!isConfirm) return
  const { code } = await Apis.removeRoleEmployee({ employeeId: item.id, roleId: currRoleNode.id })
  if (code === 200) {
    await fetchEmployeeList()
  }
}
</script>

<style lang="scss" scoped>
.org-role {
  display: flex;
  overflow: hidden;
  height: calc(100vh - 214px);
  .title {
    display: flex;
    align-items: center;
    height: 44px;
    border-bottom: 1px var(--el-border-color) solid;
    margin-bottom: 10px;
    .add-btn {
      margin-left: auto;
    }
  }
}
.column-wrap {
  width: 260px;
  height: 100%;
}
.paved-wrap {
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
    }
    :deep(.is-current) {
      .custom-tree-node {
        color: var(--el-color-primary);
      }
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding-left: 4px;
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
