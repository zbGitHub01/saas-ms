<template>
  <div>
    <OperationBar>
      <template #default>
        <el-button type="primary" icon="Plus" @click="addOrEdit(undefined, 1)" v-auth="'ASSET_DISPOSE_CREDITOR_ADD'">新增</el-button>
      </template>
    </OperationBar>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="公司ID" prop="tenantId" align="center" min-width="100"></el-table-column>
        <el-table-column label="公司名称" prop="tenantName" align="center" min-width="150"></el-table-column>
        <el-table-column label="是否启用" prop="status" align="center" min-width="150">
          <template #default="scope">
            <el-checkbox v-model="scope.row.status" @change="changeCheckbox(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <div v-if="scope.row.isEntrustParty === 0">
              <el-button link type="primary" @click="addOrEdit(scope.row, 2)" v-auth="'ASSET_DISPOSE_CREDITOR_EDIT'">编辑</el-button>
            <el-button link type="danger" @click="toDelete(scope.row)" v-auth="'ASSET_DISPOSE_CREDITOR_DELETE'">删除</el-button>
            </div>
            <div v-if="scope.row.isEntrustParty === 1" style="background-color: #67c23a">委托方</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddOrEditDialog ref="addOrEditDialog" @getTableData="getTableData" />
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import AddOrEditDialog from './components/AddOrEditDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted, computed } from 'vue'
import Apis from '@/api/modules/company'
import { useGlobalStore } from '@/store/index'
const globalStore = useGlobalStore()
const tenantId = computed(() => globalStore.tenantId)
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0
})
const addOrEditDialog = ref()
onMounted(() => {
  getTableData()
})
const getTableData = async () => {
  console.log('债权方')
  const { data } = await Apis.creditorPage({ ...query, tenantId: tenantId.value })
  state.tableData = data.data
  state.tableData.forEach(item => {
    item.status = !!item.status
  })
  state.total = data.total
}

// 新增/编辑
const addOrEdit = (row, type) => {
  addOrEditDialog.value.open(row, type)
}

// 删除
const toDelete = row => {
  ElMessageBox.confirm('是否确认删除该债权方?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    async () => {
      await Apis.creditorDelete({ id: row.id })
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
const changeCheckbox = async row => {
  const { data } = await Apis.creditorDetail({ id: row.id })
  const params = { ...data }
  params.status = Number(row.status)
  params.relationId = params.id
  delete params.tenantId
  delete params.id
  await Apis.creditorEdit(params)
  ElMessage.success('操作成功！')
  getTableData()
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>