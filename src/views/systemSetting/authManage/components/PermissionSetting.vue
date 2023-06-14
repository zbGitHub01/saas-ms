<template>
  <div class="permission-wrap">
    <div class="flex-block br1">
      <div class="title">权限选项</div>
      <el-scrollbar class="scrollbar">
        <el-tree
          ref="treeRef"
          class="tree"
          show-checkbox
          :data="menuTree"
          node-key="id"
          :expand-on-click-node="false"
          default-expand-all
          highlight-current
          :props="treeProps"
          @node-click="nodeClick"
          @check="onMenuCheck"
        />
      </el-scrollbar>
    </div>
    <div class="flex-container">
      <div class="title">操作/数据权限</div>
      <div class="table-wrap">
        <el-table ref="tableRef" class="table" :data="dataPermission.data" height="100%" default-expand-all border row-key="id">
          <el-table-column type="index" width="55" align="center">
            <template #header>
              <el-checkbox
                v-model="allCheck"
                :indeterminate="isIndeterminate"
                :disabled="!dataPermission.data?.length"
                @change="allCheckboxChange"
              ></el-checkbox>
            </template>
            <template #default="scope">
              <el-checkbox v-model="scope.row.isChecked" @change="checkboxChange($event, scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="220" />
          <el-table-column label="数据范围">
            <template #default="scope">
              <template v-if="scope.row.allDataScope">
                <el-tag v-if="!scope.row.dataScope.length" class="tag" @click="onSetDataRange(scope.row)">
                  <span>不限</span>
                  <el-icon class="filter-icon"><Filter /></el-icon>
                </el-tag>
                <el-tag v-else class="tag" @click="onSetDataRange(scope.row)">
                  <span @click="onSetDataRange(scope.row)">{{ formatScopeText(scope.row) }}</span>
                  <el-icon class="filter-icon"><Filter /></el-icon>
                </el-tag>
              </template>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <DataRangeDrawer
      v-model:drawer-visible="drawerVisible"
      :api-config="permissionConfig"
      :data="currDataPermission"
      @change="fetchPermission"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { Filter } from '@element-plus/icons-vue'
import DataRangeDrawer from './DataRangeDrawer/index.vue'
import { useCommonStore } from '@/store/modules/common'
import Apis from '@/api/modules/systemSetting'
// import menuData from './permissionData.json'
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
const treeProps = {
  label: 'name',
  value: 'id  '
}
const commonStore = useCommonStore()
const treeRef = ref()
const tableRef = ref()
const menuTree = ref([])
const allCheck = ref(false)
const isIndeterminate = ref(false)
// 权限配置数据
const dataPermission = ref({
  data: []
})
const currDataPermission = ref({})
const drawerVisible = ref(false)
// 查询、添加、删除接口权限参数配置
const permissionConfig = computed(() => {
  const paramsConfig = {
    dept: {
      params: { deptId: props.currNode.id },
      permissionListApiFn: Apis.findPermissionDeptPermit,
      addPermission: Apis.addPermissionDeptPermit,
      removePermission: Apis.removePermissionDeptPermit,
      updatePermissionScope: Apis.updatePermissionDeptScope
    },
    role: {
      params: { roleId: props.currNode.id },
      permissionListApiFn: Apis.findPermissionRolePermit,
      addPermission: Apis.addPermissionRolePermit,
      removePermission: Apis.removePermissionRolePermit,
      updatePermissionScope: Apis.updatePermissionRoleScope
    },
    employee: {
      params: { employeeId: props.currNode.id },
      permissionListApiFn: Apis.fetchPermissionEmployeePermit,
      addPermission: Apis.addPermissionEmployeePermit,
      removePermission: Apis.removePermissionEmployeePermit,
      updatePermissionScope: Apis.updatePermissionEmployeeScope
    }
  }
  return paramsConfig[props.permissionType]
})
let prevCheckedKeys = [] // 存储菜单权限选中ids
const fetchPermission = async (isRefresh = false) => {
  const { data } = await permissionConfig.value.permissionListApiFn(permissionConfig.value.params)
  menuTree.value = formatMenuData(cloneDeep(data))
  // 选择部门|角色|员工,清空操作数据权限数据
  if (isRefresh) {
    dataPermission.value = { data: [] }
    await nextTick(() => {
      const checkedKeys = getCheckedKeys(menuTree.value)
      prevCheckedKeys = checkedKeys
      treeRef.value.setCheckedKeys(checkedKeys)
    })
  } else {
    await nextTick(() => {
      treeRef.value.setCurrentKey(dataPermission.value.id)
      const currentNode = treeRef.value.getCurrentNode()
      if (currentNode) {
        dataPermission.value = currentNode
      }
    })
  }
}
// 格式化深层数据范围文字
const formatScopeText = row => {
  const valueTextList = row.dataScope.map(item => {
    const filterCodeItem = row.allDataScope.find(field => field.filterCode === item.filterCode)
    const compareList = filterCodeItem.fields.find(field => field.field === item.field)
    const compareData = compareList.compareValues.find(field => field.compare === item.compare)
    const value = findValueName(compareData, item.value)
    return `${compareList.fieldName} ${compareData.compareName} ${value}`
  })
  return valueTextList.join(' 且 ')
}
// 通过id查找各个列表的name
const findValueName = (compareData, value) => {
  if (compareData.valueInputType === 'text') {
    return value
  }
  if (compareData.valueInputType.includes('dropdown')) {
    let items = compareData.valueDropdownList
    if (compareData.valueDropdownCode) {
      const listConfig = {
        ROLE: () => {
          return commonStore.dropdownList[compareData.valueDropdownCode].map(item => {
            return {
              name: item.itemText,
              value: item.itemId
            }
          })
        }
      }
      items = listConfig[compareData.valueDropdownCode]()
    }
    if (compareData.valueInputType === 'dropdown-single') {
      return items.find(item => item.value === value).name
    }
    if (compareData.valueInputType === 'dropdown-multi') {
      return JSON.parse(value)
        .map(val => {
          return items.find(item => item.value === val).name
        })
        .join(',')
    }
  }
}
const addPermission = async permissionIds => {
  const postData = {
    ...permissionConfig.value.params,
    permissionIds
  }
  const { code } = await permissionConfig.value.addPermission(postData)
  if (code !== 200) {
    await fetchPermission()
  }
}
const removePermission = async permissionIds => {
  const postData = {
    ...permissionConfig.value.params,
    permissionIds
  }
  const { code } = await permissionConfig.value.removePermission(postData)
  if (code !== 200) {
    await fetchPermission()
  }
}
// 菜单权限操作
const nodeClick = data => {
  dataPermission.value = data
  setAllCheckbox()
}

const onMenuCheck = (data, node) => {
  const allChecked = [...node.checkedKeys, ...node.halfCheckedKeys]
  const isChecked = prevCheckedKeys.length < allChecked.length
  let permissionIds = []
  if (isChecked) {
    permissionIds = allChecked.filter(item => !prevCheckedKeys.includes(item))
    addPermission(permissionIds)
  } else {
    permissionIds = prevCheckedKeys.filter(item => !allChecked.includes(item))
    removePermission(permissionIds)
  }
  prevCheckedKeys = allChecked
}
// 获取菜单权限选中id
const getCheckedKeys = tree => {
  const checkedKeys = []
  function getIds(data) {
    data.forEach(item => {
      if (item.isChecked) {
        if (item.children && item.children.length) {
          getIds(item.children)
          const isAllChildChecked = item.children.find(child => !child.isChecked)
          if (!isAllChildChecked) {
            checkedKeys.push(item.id)
          } else {
            item.isChecked = false
          }
        } else {
          checkedKeys.push(item.id)
        }
      }
    })
  }
  getIds(tree)
  return checkedKeys
}
// 过滤出权限类型是菜单权限的children
function formatMenuData(data) {
  function formatMenu(data) {
    data.forEach(item => {
      item.isChecked = !!item.isChecked
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
  currDataPermission.value = data
  drawerVisible.value = true
}
const allCheckboxChange = value => {
  const allChildrenIds = setDownTree(dataPermission.value.data, node => {
    node.isChecked = value
  }).map(item => item.id)
  if (value) {
    addPermission(allChildrenIds)
  } else {
    removePermission(allChildrenIds)
  }
}
const setAllCheckbox = () => {
  if (!dataPermission.value.data) {
    allCheck.value = false
    isIndeterminate.value = false
    return
  }
  let check = true
  let indeterminate = false
  function traverse(data) {
    data.forEach(item => {
      if (!item.isChecked) {
        check = false
      } else {
        indeterminate = true
      }
      if (item.children && item.children.children) {
        traverse(item.children)
      }
    })
  }
  traverse(dataPermission.value.data)
  if (check) {
    indeterminate = false
  }
  allCheck.value = check
  isIndeterminate.value = indeterminate
}
// 页面按钮权限操作
const checkboxChange = (value, row) => {
  allCheck.value = value
  const permissionIds = [row.id]
  if (value && row.parentId && row.parentId !== dataPermission.value.id) {
    const parentIds = setUpTree(dataPermission.value.data, row.parentId, node => {
      node.isChecked = value
    }).map(item => item.id)
    permissionIds.push(...parentIds)
  }
  if (row.children && row.children.length) {
    const allChildrenIds = setDownTree(row.children, node => {
      node.isChecked = value
    }).map(item => item.id)
    permissionIds.push(...allChildrenIds)
  }
  setAllCheckbox()
  if (value) {
    addPermission(permissionIds)
  } else {
    removePermission(permissionIds)
  }
}
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
.scope-text {
  cursor: pointer;
}
</style>
