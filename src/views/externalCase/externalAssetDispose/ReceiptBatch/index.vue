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
        <el-table-column label="批次号" prop="batchNo" align="center" min-width="150"></el-table-column>
        <el-table-column label="关联产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="购入日期" prop="buyTime" align="center" min-width="150"></el-table-column>
        <el-table-column label="资产包类型" prop="packageTypeName" align="center" min-width="150"></el-table-column>
        <el-table-column label="备注" prop="remark" align="center" min-width="150"></el-table-column>
        <el-table-column label="是否临时批次" prop="is" align="center" min-width="150">
          <template #default="scope">
            {{ scope.row.is === 1 ? '是' : '否' }}
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
//     packageList: any[]
//   }
// }>()
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
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
  console.log('入库批次')
  // 请求得到数据
  let params = { ...query }
  // const { data } = await xx(params)
  state.tableData = [
    {
      productName: '“360”借条',
      productId: 1,
      batchId: 70,
      batchNo: '丽水海量-时光分期-202010',
      buyTime: '2019-03-26',
      packageTypeName: '消费金融资产包',
      packageTypeId: 1,
      remark: '逾期天数＜300天',
      is: 1 //是否临时批次
    },
    {
      productName: '我来带',
      productId: 2,
      batchId: 60,
      batchNo: '丽水海量-时光分期-202010',
      buyTime: '2019-03-25',
      packageTypeName: '现金贷资产包',
      packageTypeId: 2,
      remark: '逾期天数＜300天',
      is: 0 //是否临时批次
    }
  ]
  query.page = 1
  state.total = 12
}

// 新增/编辑
const addOrEdit = (row, type) => {
  addOrEditDialog.value.open(row, type)
}

// 删除
const toDelete = row => {
  ElMessageBox.confirm('是否确认删除该入库批次?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    () => {
      let params = {
        batchId: row.batchId
      }
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
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>