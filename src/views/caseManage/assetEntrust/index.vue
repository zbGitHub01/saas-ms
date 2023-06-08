<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive" @tab-change="handleClick">
      <el-tab-pane label="当前委托" name="1"></el-tab-pane>
      <el-tab-pane label="委托历史" name="2"></el-tab-pane>
    </el-tabs>
    <OperationBar>
      <template #default>
        <el-button type="primary" icon="Plus" @click="addEntrust" v-if="tabActive === '1'">新增委托</el-button>
      </template>
    </OperationBar>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="序" type="index" align="center" width="50" />
        <el-table-column label="产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="债权方" prop="creditorName" align="center" min-width="200"></el-table-column>
        <el-table-column label="委托方" prop="tenantName" align="center" min-width="200"></el-table-column>
        <el-table-column label="受托方" prop="trusteeName" align="center" min-width="200"></el-table-column>
        <el-table-column label="委托起始时间" prop="proxyStartTime" align="center" min-width="200"></el-table-column>
        <el-table-column
          label="协议终止时间"
          prop="proxyEndTime"
          align="center"
          min-width="200"
          v-if="tabActive === '2'"
        ></el-table-column>
        <el-table-column
          label="委托截止时间"
          prop="proxyEndTime"
          align="center"
          min-width="200"
          v-if="tabActive === '1'"
        ></el-table-column>
        <el-table-column label="委托协议" prop="proxyAgreement" align="center" min-width="150">
          <template #default="scope">
            <el-button link type="primary" @click="lookAgreement(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="委托创建人" prop="createName" align="center" min-width="150"></el-table-column>
        <el-table-column label="委托创建时间" prop="createTime" align="center" min-width="200"></el-table-column>
        <el-table-column
          label="实际终止时间"
          prop="actualEndTime"
          align="center"
          min-width="200"
          v-if="tabActive === '2'"
        ></el-table-column>
        <el-table-column
          label="终止操作人"
          prop="operatorName"
          align="center"
          min-width="150"
          v-if="tabActive === '2'"
        ></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right" v-if="tabActive === '1'">
          <template #default="scope">
            <el-button link type="danger" @click="toStop(scope.row)">终止合作</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddEntrustDialog ref="addEntrustDialog" @getTableData="getTableData" :selectData="selectData" />
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import AddEntrustDialog from './components/AddEntrustDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import Apis, { proxyStop } from '@/api/modules/caseManage'
const form = reactive({
  state: null //null当前委托 4历史委托
})
const selectData = reactive({
  productAndCreList: [], //产品列表
  orgList: [] //机构列表
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
const addEntrustDialog = ref()
const tabActive = ref('1')
onMounted(() => {
  getTableData()
  getSelecData()
})
const getTableData = async () => {
  // 请求得到数据
  const params = {
    ...query,
    ...form
  }
  console.log('查询', params)
  const { data } = await Apis.proxyPage(params)
  // state.tableData = data.data
  state.tableData = [
    {
      productName: '“360”借条',
      tenantName: '委托方',
      creditorName: '丽水海树信用管理有限公司',
      weituofang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      proxyAgreement: '//asfile.donganzichan.cn/bb99ad393bc74e9c83a031f9288bb58b.xlsx',
      createName: '赵光明',
      proxyStartTime: '2020-03-05 22:22:22',
      proxyEndTime: '2020-03-04 22:22:22',
      createTime: '2020-03-04 22:22:22',
      actualEndTime: '2020-03-04 22:22:22',
      operatorName: 'zzzz',
      trusteeName: '受托方',
      proxyId: 1
    },
    {
      productName: '万达贷',
      tenantName: '委托方',
      creditorName: '丽水海树信用管理有限公司',
      weituofang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      proxyAgreement: '//asfile.donganzichan.cn/bb99ad393bc74e9c83a031f9288bb58b.xlsx',
      createName: '赵光明',
      proxyStartTime: '2020-03-05 22:22:22',
      proxyEndTime: '永久',
      createTime: '2020-03-04 22:22:22',
      actualEndTime: '2020-03-04 22:22:22',
      operatorName: 'zzzz',
      trusteeName: '受托方',
      proxyId: 2
    }
  ]
  // state.total = data.total
}
const getSelecData = async () => {
  // 请求得到数据
  const { data } = await Apis.productList({ isProxy: 0 })
  selectData.productAndCreList = data
  selectData.productAndCreList = [
    {
      creditorId: 1,
      creditorName: '债权方1',
      productId: 1,
      productName: '产品1'
    },
    {
      creditorId: 2,
      creditorName: '债权方2',
      productId: 2,
      productName: '产品2'
    },
    {
      creditorId: 3,
      creditorName: '债权方3',
      productId: 3,
      productName: '产品3'
    },
    {
      creditorId: 4,
      creditorName: '债权方4',
      productId: 4,
      productName: '产品4'
    }
  ]
  selectData.orgList = [
    {
      id: 1,
      text: '小丽水海树信用管理有限公司花袋'
    },
    {
      id: 2,
      text: '浙江东岸科技有限公司'
    }
  ]
}

// 切换tab
const handleClick = tab => {
  // 整理form参数
  tab === '1' ? (form.state = null) : (form.state = 4)
  query.page = 1
  query.pageSize = 10
  getTableData()
}

// 新增委托
const addEntrust = () => {
  addEntrustDialog.value.open()
}

// 终止合作
const toStop = row => {
  ElMessageBox.confirm('是否确认终止合作?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    async () => {
      // 请求
      await proxyStop(row.proxyId)
      ElMessage.success('终止合作成功！')
      getTableData()
    },
    res => {
      ElMessage.info('已取消')
      console.log(res)
    }
  )
}
// 查看下载协议
const lookAgreement = row => {
  window.open(row.proxyAgreement)
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>
