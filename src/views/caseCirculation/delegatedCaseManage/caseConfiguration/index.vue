<template>
  <div class="flx-justify-between configuration">
    <div class="left">
      <div class="flx-justify-between">
        <div>委案类型</div>
        <el-button type="primary" plain icon="Plus" @click="addOrEditCase(undefined, 1)" v-auth="'CASE_TYPE_CONFIGURATION_ADD'">
          添加委案类型
        </el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="state.tableDataCase" border>
        <el-table-column label="是否启用" prop="status" align="center" min-width="85">
          <template #default="scope">
            <!-- operateStatus 操作状态 返回的是 2或者3 则可编辑 -->
            <el-switch
              v-model="scope.row.status"
              @change="changeStatusCase(scope.row)"
              :disabled="scope.row.operateStatus !== 2 && scope.row.operateStatus !== 3"
            />
          </template>
        </el-table-column>
        <el-table-column label="委案类型" prop="itemText" align="center" min-width="240"></el-table-column>
        <el-table-column label="案件等级" prop="caseLevelText" align="center" min-width="150"></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <!-- operateStatus 操作状态 返回的是 2或者3 则可编辑 -->
            <el-button
              link
              type="primary"
              @click="addOrEditCase(scope.row, 2)"
              v-auth="'CASE_TYPE_CONFIGURATION_EDIT'"
              :disabled="scope.row.operateStatus !== 2 && scope.row.operateStatus !== 3"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddOrEditCaseDialog ref="addOrEditCaseDialog" @getTableData="getTableDataCase" />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import AddOrEditCaseDialog from './components/AddOrEditCaseDialog.vue'
import Apis from '@/api/modules/common'
const addOrEditCaseDialog = ref()
const state = reactive({
  tableDataCase: []
})
onMounted(() => {
  getTableDataCase()
})
const getTableDataCase = async () => {
  // 请求得到数据
  const { data } = await Apis.dictManageList({ codes: 'ENTRUST_TYPE' })
  const tableDataSub = data.ENTRUST_TYPE
  state.tableDataCase = tableDataSub.map(item => {
    return {
      ...item,
      caseLevelText: item.itemValue.caseLevel.join('/')
    }
  })
}
// 新增/编辑委案类型
const addOrEditCase = (row, type) => {
  addOrEditCaseDialog.value.open(row, type)
}
// 编辑是否启用委案类型
const changeStatusCase = async row => {
  const params = {
    id: row.id,
    dictCode: 'ENTRUST_TYPE',
    itemText: row.itemText,
    operateStatus: row.operateStatus,
    status: row.status ? 1 : 0,
    itemValue: {
      caseLevel: [...row.itemValue.caseLevel]
    }
  }
  // 请求
  await Apis.dictManageSave(params)
  ElMessage.success('操作成功！')
  getTableDataCase()
}
</script>

<style lang="scss" scoped>
.configuration {
  height: 100%;
  align-items: flex-start;
}
.left,
.right {
  height: 100%;
  width: 49.5%;
  box-sizing: border-box;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-fill-color-blank);
  border-radius: 4px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
:deep(.el-divider--horizontal) {
  margin: 8px 0 15px 0;
}
</style>
