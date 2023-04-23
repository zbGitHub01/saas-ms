<template>
  <div class="permission-wrap">
    <div class="flex-block br1">
      <div class="title">权限选项</div>
      <el-scrollbar class="scrollbar">
        <el-tree
          class="tree"
          ref="treeRef"
          show-checkbox
          :data="menuList"
          node-key="permissionId"
          default-expand-all
          highlight-current
          :props="defaultProps"
          @node-click="nodeClick"
          @check="onMenuCheck"
        />
      </el-scrollbar>
    </div>
    <div class="flex-container">
      <div class="title">操作/数据权限</div>
      <div class="table-wrap">
        <el-table class="table" :data="dataPermission" height="100%" default-expand-all border row-key="id">
          <el-table-column type="selection" width="55" reserve-selection align="center">
            <template #default="scope">
              <el-checkbox v-model="scope.row.isChecked" @change="checkboxChange($event, scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="220" />
          <el-table-column label="数据范围">
            <template #default="scope">
              <el-tag class="tag" @click="onSetDataRange(scope.row)">
                <span>不限</span>
                <el-icon class="filter-icon"><Filter /></el-icon>
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <DataRangeDrawer v-model:drawer-visible="drawerVisible" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { Filter } from '@element-plus/icons-vue'
import DataRangeDrawer from './DataRangeDrawer.vue'
import Apis from '@/api/modules/systemSetting'
import menuData from './permissionData.json'
import cloneDeep from 'lodash/cloneDeep'
import { setUpTree, setDownTree } from '@/utils/tree'

const props = defineProps({
  permissionType: {
    type: String,
    default: 'dept'
  },
  currNode: {
    type: Object,
    default: () => {
      return {}
    },
    required: true
  }
})
const defaultProps = {
  label: 'name',
  value: 'id  '
}
const treeRef = ref()
const menuList = ref([])
const dataPermission = ref([])
const drawerVisible = ref(false)
const permissionParams = computed(() => {
  const paramsConfig = {
    dept: { deptId: props.currNode.id },
    role: { roleId: props.currNode.id },
    employee: { employeeId: props.currNode.id }
  }
  return paramsConfig[props.permissionType]
})

const fetchPermission = async () => {
  const apiConfigFn = {
    dept: Apis.findPermissionDeptPermit,
    role: Apis.findPermissionRolePermit,
    employee: Apis.fetchPermissionEmployeePermit
  }
  const { code, data } = await apiConfigFn[props.permissionType](permissionParams.value)
  console.log(code, data)
  if (code === 200) {
    menuList.value = formatMenuData(menuData)
  }
}
// 菜单权限操作
const getCheckedKeys = () => {
  const checkedKeys = []
  function getIds(data) {
    data.forEach(item => {
      if (item.isChecked) {
        if (item.children && item.children.length) {
          getIds(item.children)
          const isAllChildChecked = item.children.find(child => !child.isChecked)
          if (!isAllChildChecked) {
            checkedKeys.push(item.permissionId)
          } else {
            item.isChecked = false
          }
        } else {
          checkedKeys.push(item.permissionId)
        }
      }
    })
  }
  getIds(cloneDeep(menuList.value))
  return checkedKeys
}

let rootOperationId = null
const nodeClick = data => {
  console.log(data, '---data')
  rootOperationId = data.id
  dataPermission.value = data.data
}
let prevCheckedKeys = []
const onMenuCheck = (data, node) => {
  console.log(data, node, prevCheckedKeys, '---onMenuCheck')
  const allChecked = [...node.checkedKeys, ...node.halfCheckedKeys]
  const isChecked = prevCheckedKeys.length < allChecked.length
  let permissionIds = []
  if (isChecked) {
    permissionIds = allChecked.filter(item => !prevCheckedKeys.includes(item))
  } else {
    permissionIds = prevCheckedKeys.filter(item => !allChecked.includes(item))
  }
  console.log(permissionIds, '---permissionIds')
  prevCheckedKeys = allChecked
}
// 过滤出权限类型是菜单权限的children
function formatMenuData(data) {
  function formatMenu(data) {
    data.forEach(item => {
      const firstChild = item.children && item.children.length ? item.children[0] : null
      if (firstChild) {
        if (firstChild.type !== 1) {
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
const onSetDataRange = data => {
  drawerVisible.value = true
  console.log(data, '--data')
}

// 页面按钮权限操作
const checkboxChange = (value, row) => {
  console.log(value, row, '----row')
  const permissionIds = [row.id]
  if (value && row.parentId !== rootOperationId) {
    const parentIds = setUpTree(dataPermission.value, row.parentId, node => {
      node.isChecked = value
    }).map(item => item.id)
    permissionIds.push(...parentIds)
    console.log(parentIds, '---parentIds')
  }
  if (row.children && row.children.length) {
    const allChildrenIds = setDownTree(row.children, node => {
      node.isChecked = value
    }).map(item => item.id)
    permissionIds.push(...allChildrenIds)
    console.log(allChildrenIds, '---allChildren')
  }
  console.log(permissionIds, '---permissionIds')
}
onMounted(() => {
  nextTick(() => {
    const checkedKeys = getCheckedKeys()
    treeRef.value.setCheckedKeys(checkedKeys)
  })
})
defineExpose({ fetchPermission })
</script>

<style lang="scss" scoped>
.permission-wrap {
  display: flex;
  height: calc(100% - 54px);
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
  //display: flex;
  //flex-direction: column;
  flex: 1;
  height: 100%;
}
.scrollbar {
  height: calc(100% - 44px);
}
.tree {
  margin-top: 10px;
}
.table-wrap {
  height: calc(100% - 44px);
  margin-left: -1px;
  margin-top: -1px;
  //.table {
  //  height: 100%;
  //}
}
.tag {
  cursor: pointer;
  :deep(.el-tag__content) {
    display: flex;
    align-items: center;
  }
  .filter-icon {
    margin-left: 4px;
  }
}
</style>
