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
        <el-table-column label="产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="债权方" prop="zhaiquanfang" align="center" min-width="200"></el-table-column>
        <el-table-column label="SPV公司" prop="SPV" align="center" min-width="200"></el-table-column>
        <el-table-column label="官方咨询电话" prop="phone" align="center" min-width="150"></el-table-column>
        <el-table-column label="产品资料" prop="ziliao" align="center" min-width="150">
          <template #default="scope">
            <el-button link type="primary" @click="lookAgreement(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" prop="isUse" align="center" min-width="150">
          <template #default="scope">
            <el-switch v-model="scope.row.isUse" @change="changSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="addOrEdit(scope.row, 2)">编辑</el-button>
            <el-button link type="danger" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddOrEditDialog ref="addOrEditDialog" @getTableData="getTableData" :selectData="selectData" />
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import AddOrEditDialog from './components/AddOrEditDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
// 接收props数据
// const props = defineProps<{
//   selectData: {
//     productList: any[]
//     orgList: any[]
//   }
// }>()
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
const form = reactive({})
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
  console.log('产品名录')
  // 请求得到数据
  // const { data } = await xx(form)
  const tableDataSub = [
    {
      productName: '“360”借条',
      productId: 1,
      zhaiquanfang: '丽水海树信用管理有限公司',
      zhaiquanfangId: 1,
      SPV: '丽水海树信用管理有限公司',
      phone: '12345678',
      ziliao: '',
      isUse: true
    },
    {
      productName: '我来带',
      productId: 2,
      zhaiquanfang: '丽水海树信用管理有限公司',
      zhaiquanfangId: 2,
      SPV: '丽水海树信用管理有限公司',
      phone: '12345678',
      ziliao: '',
      isUse: false
    }
  ]
  state.tableData = tableDataSub
  query.page = 1
  state.total = 12
}

// 新增/编辑
const addOrEdit = (row, type) => {
  addOrEditDialog.value.open(row, type)
}

// 删除
const toDelete = row => {
  ElMessageBox.confirm('是否确认删除该产品?', '温馨提示', {
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
// 查看产品资料
const lookAgreement = row => {
  window.open(row.url)
}
// 是否启用
const changSwitch = row => {
  console.log(row.isUse)
  // 请求
  // await xx(form)
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>
