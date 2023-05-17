<template>
  <div>
    <OperationBar>
      <template #default>
        <el-button type="primary" icon="Plus" @click="addOrEdit(undefined, 1)">新增</el-button>
      </template>
    </OperationBar>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="序" type="index" align="center" width="50" />
        <el-table-column label="债权方" prop="creditorName" align="center" min-width="150"></el-table-column>
        <!-- 校验当租户自建的债权方可编辑删除 -->
        <el-table-column label="是否启用" prop="creditorStatus" align="center" min-width="150">
          <template #default="scope">
            <el-checkbox v-model="scope.row.creditorStatus" @change="changeCheckbox(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <!-- 校验当租户自建的债权方可编辑删除 -->
            <el-button link type="primary" @click="addOrEdit(scope.row, 2)">编辑</el-button>
            <el-button link type="danger" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddOrEditDialog ref="addOrEditDialog" @getTableData="getTableData" />
  </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import AddOrEditDialog from './components/AddOrEditDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
const form: any = reactive({})
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [] as any[],
  total: 0
})
const addOrEditDialog = ref()
onMounted(() => {
  getTableData()
})
const getTableData = async () => {
  console.log('债权方')
  // 请求得到数据
  let params = { ...query }
  // const { data } = await xx(params)
  state.tableData = [
    {
      creditorName: '“360”借条',
      creditorId: 1,
      creditorStatus: 1
    },
    {
      creditorName: '我来带',
      creditorId: 2,
      creditorStatus: 0
    }
  ]
  state.tableData.forEach(item => {
    item.creditorStatus = item.creditorStatus === 1 ? true : false
  })
  query.page = 1
  state.total = 12
}

// 新增/编辑
const addOrEdit = (row: any, type: Number) => {
  addOrEditDialog.value.open(row, type)
}

// 删除
const toDelete = (row: any) => {
  ElMessageBox.confirm('是否确认删除该债权方?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    () => {
      // 请求
      // await xx(params)
      ElMessage.success('删除成功！')
      getTableData()
    },
    res => {
      ElMessage.info('已取消')
      console.log(res)
    }
  )
}
// 是否启用
const changeCheckbox = (row: any) => {
  let params = {
    creditorName: row.creditorName,
    creditorId: row.creditorId,
    creditorStatus: Number(row.creditorStatus)
  }
  console.log(params)
  // 请求
  // await xx(params)
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>