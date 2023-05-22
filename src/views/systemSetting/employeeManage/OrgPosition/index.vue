<template>
  <div class="org-department">
    <div class="department-wrap">
      <div class="title">
        机构部门
        <el-button class="add-btn" size="small" :icon="Plus" @click="editPosition(null)"></el-button>
      </div>
      <el-input class="search-form" v-model="positionName" placeholder="搜索职位" @keyup.enter="onSearch">
        <template #append>
          <el-button :icon="Search" @click="onSearch" />
        </template>
      </el-input>
      <el-scrollbar class="scrollbar">
        <el-tree
          class="tree"
          ref="treeRef"
          :data="positionList"
          node-key="id"
          default-expand-all
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        >
          <template #default="{ data }">
            <div class="custom-tree-node">
              <span>{{ data.name }}</span>
              <span class="operation">
                <el-icon @click.stop="editPosition(data)"><Edit /></el-icon>
                <el-icon @click.stop="delPosition(data)"><Delete /></el-icon>
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
        <el-button v-if="currPositionNode.id" class="add-btn" size="small" :icon="Plus" @click="editEmployee(null)"></el-button>
      </div>
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
  <EditPositionDialog v-model:dialog-visible="positionVisible" :position-item="positionItem" @change="fetchPositionList" />
  <EditEmployeeDialog
    v-model:dialog-visible="employeeVisible"
    :position-list="positionList"
    :employee-item="employeeItem"
    :position-item="currPositionNode"
    @change="fetchEmployeeList"
  />
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Apis from '@/api/modules/systemSetting'
import EditEmployeeDialog from './components/EditEmployeeDialog.vue'
import EditPositionDialog from './components/EditPositionDialog.vue'

const positionName = ref('')
const positionList = ref([])
const treeRef = ref()
const defaultProps = {
  label: 'name',
  value: 'id'
}
const positionVisible = ref(false)
let positionItem = ref(null)
const editPosition = item => {
  positionItem.value = item
  positionVisible.value = true
}
const delPosition = async item => {
  const isConfirm = await ElMessageBox.confirm(`确定删除该机构职位吗？`, '提示', { type: 'warning' }).catch(() => {})
  if (!isConfirm) return
  await Apis.delPosition({ id: item.id })
  ElMessage.success('删除成功')
  await fetchPositionList()
}

const employeeList = ref([])
const employeeVisible = ref(false)
let employeeItem = null
const editEmployee = item => {
  employeeItem = item
  employeeVisible.value = true
}
const onSearch = () => {
  treeRef.value.filter(positionName.value)
}
const filterNode = (value, data) => {
  return data.name.includes(value)
}
const fetchPositionList = async () => {
  const { data } = await Apis.findPositionList({ name: '' })
  positionList.value = data
}
fetchPositionList()

let currPositionNode = ref({})
const fetchEmployeeList = async () => {
  const { data } = await Apis.findPositionEmployeeList({ positionId: currPositionNode.value.id })
  employeeList.value = data
}
const nodeClick = node => {
  currPositionNode.value = node
  fetchEmployeeList()
}
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
.search-form {
  margin-bottom: 16px;
}
.add-btn {
  margin-left: auto;
}
.tree {
  :deep(.el-tree-node__expand-icon) {
    display: none;
  }
  :deep(.el-tree-node__content) {
    height: 32px;
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
