<template>
  <div class="flx-justify-between configuration">
    <div class="left">
      <div class="flx-justify-between">
        <div>分库名称</div>
        <el-button type="primary" plain icon="Plus" @click="addOrEditBank(undefined, 1)" v-auth="'BANK_SET_NAME_ADD'">
          添加分库
        </el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="state.tableDataBank" border>
        <el-table-column label="是否启用" prop="status" align="center" min-width="100">
          <template #default="scope">
            <!-- operateStatus 操作状态 返回的是 2或者3 则可编辑 -->
            <el-switch
              v-model="scope.row.status"
              @change="changeStatusBank(scope.row)"
              :disabled="scope.row.operateStatus !== 2 && scope.row.operateStatus !== 3"
            />
          </template>
        </el-table-column>
        <el-table-column label="分库名称" prop="itemText" align="center" min-width="150"></el-table-column>
        <el-table-column label="操作" min-width="140" align="center">
          <template #default="scope">
            <!-- operateStatus 操作状态 返回的是 2或者3 则可编辑 -->
            <el-button
              link
              type="primary"
              @click="addOrEditBank(scope.row, 2)"
              v-auth="'BANK_SET_NAME_EDIT'"
              :disabled="scope.row.operateStatus !== 2 && scope.row.operateStatus !== 3"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddOrEditBankDialog ref="addOrEditBankDialog" @getTableData="getTableDataBank" />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import AddOrEditBankDialog from './components/AddOrEditBankDialog.vue'
import Apis from '@/api/modules/common'
const addOrEditBankDialog = ref()
const state = reactive({
  tableDataBank: []
})
onMounted(() => {
  getTableDataBank()
})
const getTableDataBank = async () => {
  // 请求得到数
  const { data } = await Apis.dictManageList({ codes: 'DIST_LIST' })
  state.tableDataBank = data.DIST_LIST
}

// 新增/编辑分库
const addOrEditBank = (row, type) => {
  addOrEditBankDialog.value.open(row, type)
}
// 编辑是否启用分库
const changeStatusBank = async row => {
  const params = {
    id: row.id,
    dictCode: 'DIST_LIST',
    itemText: row.itemText,
    operateStatus: row.operateStatus,
    status: row.status ? 1 : 0
  }
  // 请求
  await Apis.dictManageSave(params)
  ElMessage.success('操作成功！')
  getTableDataBank()
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