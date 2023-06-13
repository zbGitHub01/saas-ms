<template>
  <el-drawer
    class="drawer"
    title="数据范围设置"
    :model-value="props.drawerVisible"
    size="50%"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    @open="handleOpen"
  >
    <template #default>
      <el-table :data="rangeData" max-height="calc(100vh - 220px)">
        <el-table-column label="附加过滤规则">
          <el-table-column label="过滤要素" width="200">
            <template #default="scope">
              <el-select
                v-model="scope.row.filterCode"
                class="small-select"
                clearable
                placeholder="请选择过滤要素"
                @change="filterCodeChange($event, scope.row)"
              >
                <el-option
                  v-for="item in props.data.allDataScope || []"
                  :key="item.filterCode"
                  :label="item.filterName"
                  :value="item.filterCode"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="过滤规则">
            <template #default="scope">
              <el-select
                v-model="scope.row.field"
                class="small-select"
                clearable
                placeholder="请选择过滤规则"
                @change="fieldChange($event, scope.row)"
              >
                <el-option v-for="item in scope.row.fieldList" :key="item.field" :label="item.fieldName" :value="item.field" />
              </el-select>
              <el-select
                v-model="scope.row.compare"
                class="mini-select ml16 mr16"
                clearable
                placeholder="请选择"
                @change="compareChange($event, scope.row)"
              >
                <el-option
                  v-for="item in scope.row.compareList"
                  :key="item.compare"
                  :label="item.compareName"
                  :value="item.compare"
                />
              </el-select>
              <CompareForm v-if="scope.row.compareData" v-model="scope.row.value" :data="scope.row.compareData" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="scope">
              <el-button type="danger" link @click="delRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-button class="mt12" type="primary" :icon="Plus" @click="addRow">添加过滤条件</el-button>
    </template>
    <template #footer>
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">保 存</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useCommonStore } from '@/store/modules/common'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import CompareForm from './CompareForm.vue'

const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  apiConfig: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['update:drawerVisible', 'change'])
const commonStore = useCommonStore()

const loading = ref(false)
const rangeData = ref([])
const handleOpen = () => {
  if (props.data.dataScope) {
    // 数据回填，需要深层查找数据
    rangeData.value = props.data.dataScope.map(item => {
      const filterCodeItem = props.data.allDataScope.find(field => field.filterCode === item.filterCode)
      const compareList = filterCodeItem.fields.find(field => field.field === item.field)
      const compareData = compareList.compareValues.find(field => field.compare === item.compare)
      if (compareData.valueDropdownCode) {
        compareData.valueDropdownList = formatDropdownList(
          compareData.valueDropdownCode,
          commonStore.dropdownList[compareData.valueDropdownCode]
        )
      }
      let value = item.value
      if (compareData.valueInputType === 'dropdown-multi') {
        value = JSON.parse(item.value)
      }
      return {
        filterCode: item.filterCode,
        field: item.field,
        compare: item.compare,
        value,
        fieldList: filterCodeItem.fields,
        compareData,
        compareList: compareList.compareValues
      }
    })
  }
}
const beforeClose = () => {
  emit('update:drawerVisible', false)
}
const addRow = () => {
  rangeData.value.push({
    filterCode: null,
    field: null,
    compare: null,
    value: null,
    fieldList: [],
    compareData: null,
    compareList: []
  })
}
const delRow = index => {
  rangeData.value.splice(index, 1)
}
const filterCodeChange = (value, row) => {
  const findItem = props.data.allDataScope.find(item => item.filterCode === value)
  row.field = null
  row.compare = null
  row.value = null
  row.compareData = null
  row.compareList = []
  row.fieldList = findItem.fields
}
const fieldChange = (value, row) => {
  const findItem = row.fieldList.find(item => item.field === value)
  row.compare = null
  row.value = null
  row.compareData = null
  row.compareList = findItem.compareValues
}
const compareChange = (value, row) => {
  const findItem = row.compareList.find(item => item.compare === value)
  if (findItem.valueDropdownCode) {
    findItem.valueDropdownList = formatDropdownList(
      findItem.valueDropdownCode,
      commonStore.dropdownList[findItem.valueDropdownCode]
    )
  }
  row.compareData = findItem
}
const formatDropdownList = (code, list) => {
  const listConfig = {
    ROLE: () => {
      return list.map(item => {
        return {
          name: item.itemText,
          value: item.itemId
        }
      })
    }
  }
  return listConfig[code]()
}
const onSubmit = async () => {
  const scopes = rangeData.value.map(item => {
    const value = Array.isArray(item.value) ? JSON.stringify(item.value) : item.value
    return {
      compare: item.compare,
      field: item.field,
      filterCode: item.filterCode,
      value
    }
  })
  const postData = {
    permissionId: props.data.id,
    ...props.apiConfig.params,
    scopes
  }
  console.log(postData, '---postData')
  loading.value = true
  try {
    await props.apiConfig.updatePermissionScope(postData)
    ElMessage.success('保存成功')
    emit('change')
    beforeClose()
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.small-select {
  :deep(.el-input__wrapper) {
    width: 150px;
  }
}
.mini-select {
  :deep(.el-input__wrapper) {
    width: 100px;
  }
}
</style>
