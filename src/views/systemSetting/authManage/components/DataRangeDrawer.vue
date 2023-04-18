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
      <el-table :data="rangeData" max-height="500">
        <el-table-column label="附加过滤规则">
          <el-table-column label="过滤要素" width="220">
            <template #default="scope">
              <el-select class="small-select" v-model="scope.row.filterElement" clearable placeholder="请选择过滤要素">
                <el-option v-for="item in filterList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="过滤规则">
            <template #default="scope">
              <el-select v-model="scope.row.filterRule" clearable placeholder="请选择过滤规则">
                <el-option v-for="item in filterRuleList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
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
import { Plus } from '@element-plus/icons-vue'
const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:drawerVisible'])

const loading = ref(false)
const rangeData = ref([])
const filterList = ref([
  { label: '案件', value: 1 },
  { label: '用户', value: 2 },
  { label: '债权方', value: 3 },
  { label: '还款账号', value: 4 }
])
const filterRuleList = ref([
  { label: '案件', value: 1 },
  { label: '用户', value: 2 },
  { label: '债权方', value: 3 },
  { label: '还款账号', value: 4 }
])
const handleOpen = () => {}
const beforeClose = () => {
  emit('update:drawerVisible', false)
}
const addRow = () => {
  rangeData.value.push({
    filterElement: null,
    filterRule: null
  })
}
const delRow = index => {
  console.log(index)
  rangeData.value.splice(index, 1)
}

const onSubmit = () => {}
</script>

<style lang="scss" scoped>
.small-select {
  :deep(.el-input__wrapper) {
    width: 175px;
  }
}
</style>
