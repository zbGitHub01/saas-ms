<template>
  <div>
    <OperationBar>
      <template #default>
        <el-button type="primary" icon="Plus" @click="addOrEdit(undefined, 1)" v-auth="'ASSET_DISPOSE_PRODUCT_LIST_ADD'">
          新增
        </el-button>
      </template>
    </OperationBar>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="序" type="index" align="center" width="50" />
        <el-table-column label="产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="债权方" prop="creditorName" align="center" min-width="200"></el-table-column>
        <el-table-column label="SPV公司" prop="spvCompanyName" align="center" min-width="200"></el-table-column>
        <el-table-column label="官方咨询电话" prop="contactPhone" align="center" min-width="150"></el-table-column>
        <el-table-column label="产品资料" prop="dataUrl" align="center" min-width="150">
          <template #default="scope">
            <el-button link type="primary" @click="lookAgreement(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" prop="productStatus" align="center" min-width="150">
          <template #default="scope">
            <el-switch v-model="scope.row.productStatus" @change="changSwitch(scope.row)" :disabled="scope.row.isProxy === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <div v-if="scope.row.isProxy === 0">
              <el-button link type="primary" @click="addOrEdit(scope.row, 2)" v-auth="'ASSET_DISPOSE_PRODUCT_LIST_EDIT'">
                编辑
              </el-button>
              <el-button link type="danger" @click="toDelete(scope.row)" v-auth="'ASSET_DISPOSE_PRODUCT_LIST_DELETE'">
                删除
              </el-button>
            </div>
            <div v-if="scope.row.isProxy === 1" style="background-color: #67c23a">委托方产品</div>
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
import Apis, { productDel } from '@/api/modules/caseManage'
// 接收props数据
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
  const { data } = await Apis.productPage({ ...query })
  state.tableData = data.data
  // state.tableData = [
  //   {
  //     productName: '“360”借条',
  //     productId: 1,
  //     creditorName: '丽水海树信用管理有限公司',
  //     creditorId: 1,
  //     spvCompanyName: '丽水海树信用管理有限公司',
  //     contactPhone: '12345678',
  //     dataUrl: '//asfile.donganzichan.cn/bb99ad393bc74e9c83a031f9288bb58b.xlsx',
  //     productStatus: 1,
  //     isProxy: 1
  //   },
  //   {
  //     productName: '我来带',
  //     productId: 2,
  //     creditorName: '丽水海树信用管理有限公司',
  //     creditorId: 2,
  //     spvCompanyName: '丽水海树信用管理有限公司',
  //     contactPhone: '12345678',
  //     dataUrl: '//asfile.donganzichan.cn/bb99ad393bc74e9c83a031f9288bb58b.xlsx',
  //     productStatus: 0,
  //     isProxy: 0
  //   }
  // ]
  state.tableData.forEach(item => {
    item.productStatus = !!item.productStatus
  })
  state.total = data.total
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
    async () => {
      await productDel(row.productId)
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
  window.open(row.dataUrl)
}
// 是否启用
const changSwitch = async row => {
  const params = { ...row }
  params.productStatus = Number(params.productStatus)
  await Apis.productEdit(params)
  ElMessage.success('保存成功！')
  getTableData()
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>
