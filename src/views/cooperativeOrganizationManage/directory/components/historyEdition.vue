<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="历史准入版本"
      width="800px"
      :before-close="handleClose"
      append-to-body
    >
      <el-table :data="state.tableData">
        <el-table-column label="更新时间" prop="updateTime" min-width="300" align="center"></el-table-column>
        <el-table-column label="操作人" prop="createName" min-width="250" align="center"></el-table-column>
        <el-table-column label="操作" prop="name" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="onDetail(scope.row.logId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="state.total"
        v-model:page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        @pagination="getTableData"
      />
    </el-dialog>
    <history-org-detail ref="historyOrgDetailRef"></history-org-detail>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import historyOrgDetail from './historyOrgDetail.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const dialogVisible = ref(false)
const tenantId = ref()
const queryParams = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  total: 0,
  tableData: []
})
const getTableData = async relationTenantId => {
  const params = { ...queryParams, relationTenantId }
  const { code, data } = await Apis.clientOrgHistoryList(params)
  if (code !== 200) return
  state.tableData = data
  state.total = data.total
}
const open = (relationTenantId: any) => {
  tenantId.value = relationTenantId
  getTableData(relationTenantId)
  dialogVisible.value = true
}
const historyOrgDetailRef = ref()
const onDetail = (logId: any) => {
  const params = {
    logId,
    relationTenantId: tenantId
  }
  historyOrgDetailRef.value.open(params)
}
const handleClose = () => {
  dialogVisible.value = false
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
