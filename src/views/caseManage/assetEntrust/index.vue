<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive" @tab-change="handleClick">
      <el-tab-pane v-if="authStore.tabVisible('CURRENT_COMMITS')" label="当前委托" name="CURRENT_COMMITS"></el-tab-pane>
      <el-tab-pane v-if="authStore.tabVisible('ENTRUST_HISTORY')" label="委托历史" name="ENTRUST_HISTORY"></el-tab-pane>
    </el-tabs>
    <OperationBar>
      <template #default>
        <el-button type="primary" :icon="Plus" @click="addEntrust" v-if="tabActive === 'CURRENT_COMMITS'" v-auth="'NEW_ENTRUST'">
          新增委托
        </el-button>
      </template>
    </OperationBar>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="序" type="index" align="center" width="50" />
        <el-table-column label="产品" prop="productName" align="center" min-width="200"></el-table-column>
        <el-table-column label="债权方" prop="creditorName" align="center" min-width="300"></el-table-column>
        <el-table-column label="委托方" prop="tenantName" align="center" min-width="300"></el-table-column>
        <el-table-column label="受托方" prop="trusteeName" align="center" min-width="300"></el-table-column>
        <el-table-column label="委托起始时间" prop="proxyStartTime" align="center" min-width="200"></el-table-column>
        <el-table-column
          label="协议终止时间"
          prop="proxyEndTime"
          align="center"
          min-width="200"
          v-if="tabActive === 'ENTRUST_HISTORY'"
        ></el-table-column>
        <el-table-column
          label="委托截止时间"
          prop="proxyEndTime"
          align="center"
          min-width="200"
          v-if="tabActive === 'CURRENT_COMMITS'"
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
          v-if="tabActive === 'ENTRUST_HISTORY'"
        ></el-table-column>
        <el-table-column
          label="终止操作人"
          prop="operatorName"
          align="center"
          min-width="150"
          v-if="tabActive === 'ENTRUST_HISTORY'"
        ></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right" v-if="tabActive === 'CURRENT_COMMITS'">
          <template #default="scope">
            <el-button link type="danger" @click="toStop(scope.row)" v-auth="'TERM_IN_COOPER'">终止合作</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddEntrustDialog ref="addEntrustDialog" @getTableData="getTableData" :selectData="selectData" />
  </div>
</template>

<script setup>
import AddEntrustDialog from './components/AddEntrustDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import Apis, { proxyStop } from '@/api/modules/caseManage'
import Apis2 from '@/api/modules/common'
import { Plus } from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/modules/auth'
const authStore = useAuthStore()
const tabActive = ref(authStore.tabPage.tabActive || '')
const form = reactive({
  state: null //null当前委托 4历史委托
})
const selectData = reactive({
  productAndCreList: [], //产品列表
  trustList: [] //机构列表
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
onMounted(() => {
  getTableData()
  getSelecData()
})
const getTableData = async () => {
  const params = {
    ...query,
    ...form
  }
  const { data } = await Apis.proxyPage(params)
  state.tableData = data.data
  // state.tableData = [
  //   {
  //     productName: '“360”借条',
  //     tenantName: '委托方',
  //     creditorName: '丽水海树信用管理有限公司',
  //     weituofang: '丽水海树信用管理有限公司',
  //     shoutuofang: '丽水海树信用管理有限公司',
  //     proxyAgreement: '//asfile.donganzichan.cn/bb99ad393bc74e9c83a031f9288bb58b.xlsx',
  //     createName: '赵光明',
  //     proxyStartTime: '2020-03-05 22:22:22',
  //     proxyEndTime: '2020-03-04 22:22:22',
  //     createTime: '2020-03-04 22:22:22',
  //     actualEndTime: '2020-03-04 22:22:22',
  //     operatorName: 'zzzz',
  //     trusteeName: '受托方',
  //     proxyId: 1
  //   },
  //   {
  //     productName: '万达贷',
  //     tenantName: '委托方',
  //     creditorName: '丽水海树信用管理有限公司',
  //     weituofang: '丽水海树信用管理有限公司',
  //     shoutuofang: '丽水海树信用管理有限公司',
  //     proxyAgreement: '//asfile.donganzichan.cn/bb99ad393bc74e9c83a031f9288bb58b.xlsx',
  //     createName: '赵光明',
  //     proxyStartTime: '2020-03-05 22:22:22',
  //     proxyEndTime: '永久',
  //     createTime: '2020-03-04 22:22:22',
  //     actualEndTime: '2020-03-04 22:22:22',
  //     operatorName: 'zzzz',
  //     trusteeName: '受托方',
  //     proxyId: 2
  //   }
  // ]
  state.total = data.total
}
const getSelecData = async () => {
  const { data } = await Apis.productList({ isProxy: 0, productStatus: 1 })
  selectData.productAndCreList = data
  const { data: data1 } = await Apis2.findItemList({ codes: 'NORMAL_TENANT_LIST' })
  // selectData.trustList = [
  //   {
  //     id: 1,
  //     text: '小丽水海树信用管理有限公司花袋'
  //   },
  //   {
  //     id: 2,
  //     text: '浙江东岸科技有限公司'
  //   }
  // ]
  selectData.trustList = data1['NORMAL_TENANT_LIST']
}

// 切换tab
const handleClick = tab => {
  // 整理form参数
  tab === 'CURRENT_COMMITS' ? (form.state = null) : (form.state = 4)
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
      await proxyStop(row.proxyId)
      ElMessage.success('终止合作成功！')
      getTableData()
    },
    res => {
      ElMessage.info('已取消')
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
