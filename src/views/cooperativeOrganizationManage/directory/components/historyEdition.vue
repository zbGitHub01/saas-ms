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
        <el-table-column label="更新时间" prop="createTime" min-width="300" align="center"></el-table-column>
        <el-table-column label="操作人" prop="createName" min-width="250" align="center"></el-table-column>
        <el-table-column label="操作" prop="name" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="onDetail(scope.row)">查看</el-button>
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
import { reactive, ref, onMounted } from 'vue'
import historyOrgDetail from './historyOrgDetail.vue'
// import { otherRegisterLog } from '@/api/orgmanage'
const dialogVisible = ref(false)
const orgData = ref<any>()
interface stateParams {
  [key: string]: any
  total: number
  tableData: any[]
}
const queryParams = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive<stateParams>({
  total: 0,
  tableData: []
})
const getTableData = async () => {
  const params = { ...queryParams }
  // const { code, data } = await otherRegisterLog(params)
  // if (code !== 200) return
  // state.tableData = data
  // state.total = data.total
  state.tableData = [
    {
      createName: '石晶',
      createTime: '2023-04-10 19:37:39',
      logId: 628
    },
    {
      createName: '石晶',
      createTime: '2023-04-10 19:36:52',
      logId: 627
    },
    {
      createName: '石晶',
      createTime: '2023-04-10 19:36:46',
      logId: 626
    },
    {
      createName: '石晶',
      createTime: '2023-04-10 19:36:37',
      logId: 625
    },
    {
      createName: '石晶',
      createTime: '2023-04-10 19:36:27',
      logId: 624
    },
    {
      createName: '石晶',
      createTime: '2023-04-10 19:22:34',
      logId: 623
    },
    {
      createName: '王峥',
      createTime: '2023-03-16 17:00:57',
      logId: 598
    },
    {
      createName: '王峥',
      createTime: '2023-03-14 14:33:28',
      logId: 597
    },
    {
      createName: '王峥',
      createTime: '2023-03-10 18:36:37',
      logId: 595
    },
    {
      createName: '王峥',
      createTime: '2023-03-10 17:04:13',
      logId: 592
    }
  ]
}
const open = (data: any) => {
  orgData.value = data
  getTableData()
  dialogVisible.value = true
}
const historyOrgDetailRef = ref()
const onDetail = (row: any) => {
  historyOrgDetailRef.value.open(row)
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
