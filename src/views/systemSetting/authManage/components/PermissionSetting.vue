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
          node-key="permissionId"
          default-expand-all
          highlight-current
          :props="defaultProps"
          @node-click="nodeClick"
          @check="onCheck"
        />
      </el-scrollbar>
    </div>
    <div class="flex-container">
      <div class="title">操作/数据权限</div>
      <div class="table-wrap">
        <el-table :data="dataPermission" default-expand-all border row-key="permissionId">
          <el-table-column type="selection" width="55" reserve-selection align="center" />
          <el-table-column prop="menuName" label="操作" width="220" />
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
import DataRangeDrawer from './DataRangeDrawer.vue'
import Apis from '@/api/modules/systemSetting'
import menuData from '@/store/menu.json'
import cloneDeep from 'lodash/cloneDeep'
import { Filter } from '@element-plus/icons-vue'

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
  label: 'menuName',
  value: 'permissionId'
}
const treeRef = ref()
const menuList = ref(formatMenuData(menuData))
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
const nodeClick = data => {
  dataPermission.value = data.data
}
let prevCheckedKeys = []
const onCheck = (data, node) => {
  console.log(data, node, prevCheckedKeys, '---onCheck')
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
const fetchPermission = async () => {
  const apiConfigFn = {
    dept: Apis.findPermissionDeptPermit,
    role: Apis.findPermissionRolePermit,
    employee: Apis.fetchPermissionEmployeePermit
  }
  const { code, data } = await apiConfigFn[props.permissionType](permissionParams.value)
  console.log(code, data)
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

const onSetDataRange = data => {
  drawerVisible.value = true
  console.log(data, '--data')
}
onMounted(() => {
  nextTick(() => {
    const checkedKeys = getCheckedKeys()
    treeRef.value.setCheckedKeys(checkedKeys)
    console.log(checkedKeys, '--checkedKeys')
  })
})
defineExpose({ fetchPermission })
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
  //height: 300px;
  height: calc(100% - 100px);
}
.tree {
  margin-top: 10px;
}
.table-wrap {
  margin-left: -1px;
  margin-top: -1px;
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
