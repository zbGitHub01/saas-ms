<template>
  <div>
    <el-button type="primary" icon="CirclePlus" @click="addOrEdit(undefined, 1)">新增</el-button>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="序" type="index" align="center" width="50" />
        <el-table-column label="批次号" prop="picihao" align="center" min-width="150"></el-table-column>
        <el-table-column label="关联产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="购入日期" prop="date" align="center" min-width="150"></el-table-column>
        <el-table-column label="资产包类型" prop="packageType" align="center" min-width="150"></el-table-column>
        <el-table-column label="备注" prop="note" align="center" min-width="150"></el-table-column>
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

<script lang="ts" setup>
import { CirclePlus } from '@element-plus/icons-vue'
import AddOrEditDialog from './components/AddOrEditDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
// 接收props数据
const props = defineProps<{
  selectData: {
    productList: any[]
    packageList: any[]
  }
}>()
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
  console.log('入库批次')
  // 请求得到数据
  // const { code, data, msg } = await xx(form)
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
  const tableDataSub = [
    {
      productName: '“360”借条',
      productId: 1,
      picihao: '丽水海量-时光分期-202010',
      date: '2019-03-26',
      packageType: '消费金融资产包',
      packageId: 1,
      note: '逾期天数＜300天'
    },
    {
      productName: '我来带',
      productId: 2,
      picihao: '丽水海量-时光分期-202010',
      date: '2019-03-25',
      packageType: '现金贷资产包',
      packageId: 2,
      note: '逾期天数＜300天'
    }
  ]
  state.tableData = tableDataSub
  query.page = 1
  state.total = 12
}

// 新增/编辑
const addOrEdit = (row: any, type: Number) => {
  addOrEditDialog.value.open(row, type)
}

// 删除
const toDelete = (row: any) => {
  ElMessageBox.confirm('是否确认删除该入库批次?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    () => {
      // 请求
      // const { code, msg } = await xx(params)
      // if(code !== 200){
      //   return ElMessage.error(msg)
      // }
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
</style>