<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive" @tab-change="changTab">
      <el-tab-pane v-for="item in state.tabList" :key="item.itemId" :label="item.itemText" :name="item.itemId"></el-tab-pane>
    </el-tabs>
    <DynamoSearchForm ref="dynamoSearchFormRef" code="MNG_CASE_SEARCH_FIELD" @search="getTableData" />
    <div class="spacing"></div>
    <LabelClass :labelData="state.CaseStatistics" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <div v-for="(item, index) in operationList" :key="index">
            <el-button
              v-if="item.type === 1 || (item.type === 2 && tabActive === 1) || (item.type === 3 && tabActive !== 1)"
              type="primary"
              :icon="item.icon"
              plain
              class="mr10"
              @click="handleClick(item.title)"
              v-auth="item.code"
            >
              {{ item.title }}
            </el-button>
          </div>
        </template>
      </OperationBar>
      <el-table
        ref="multipleTable"
        :data="state.tableData"
        border
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" fixed align="center" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column label="案件ID" prop="caseNo" align="center" min-width="150" fixed="left">
          <template #default="scope">
            <status :row="scope.row" page-type="disposalCasemessage" />
          </template>
        </el-table-column>
        <el-table-column label="产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="姓名" prop="userName" align="center" min-width="150"></el-table-column>
        <el-table-column label="证件号" prop="idno" align="center" min-width="180"></el-table-column>
        <el-table-column label="手机号" prop="userPhone" align="center" min-width="150"></el-table-column>
        <el-table-column label="处置金额" prop="handleAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="还款入账金额" prop="totalRefundAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="减免金额" prop="totalReductionAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="剩余待还金额" prop="residueAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="临时标签" prop="tagTempList" align="left" min-width="180" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.tagTempList" :key="index">
              <span>{{ index === scope.row.tagTempList.length - 1 ? item.tagName : item.tagName + ',' }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="预警标签" prop="tagAlterName" align="left" min-width="180" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.tagAlterList" :key="index">
              <span :style="{ color: item.isShare === 1 ? 'red' : '' }">
                {{ index === scope.row.tagAlterList.length - 1 ? item.tagAlertName : item.tagAlertName + ',' }}
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="入库批次号" prop="batchNo" align="center" min-width="250"></el-table-column>
        <el-table-column label="债权方" prop="creditorName" align="center" min-width="180"></el-table-column>
        <el-table-column label="所属分库" prop="storeName" align="center" min-width="150"></el-table-column>
        <el-table-column label="分库时间" prop="distTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="处置机构" prop="orgTitle" align="center" min-width="150"></el-table-column>
        <el-table-column label="委案时间" prop="entrustTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="委案金额" prop="entrustAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="CPE" prop="cpeName" align="center" min-width="150"></el-table-column>
        <el-table-column label="分案时间" prop="allotTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="案件状态" prop="caseStatusText" align="center" min-width="150" fixed="right"></el-table-column>
      </el-table>
      <pagination v-model:page="query.page" v-model:page-size="query.pageSize" :total="state.total" @pagination="getTableData" />
    </div>
    <TemporaryLabel ref="temporaryLabel" @get-table-data="getTableData" />
    <CaseBankDialog
      ref="caseBankDialog"
      :distInfo="state.distInfo"
      :taskId="state.taskId"
      :sourceStoreId="tabActive"
      :resouerdistList="state.tabListSub"
      @get-table-data="getTableData"
      @toggleSelection="toggleSelection"
      @fetchCaseDistSelect="fetchCaseDistSelect"
    />
    <CaseRecoveryDialog
      ref="caseRecoveryDialog"
      :taskId="state.taskId"
      :caseInfo="state.distInfo"
      @get-table-data="getTableData"
      @toggleSelection="toggleSelection"
      @fetchCaseDistSelect="fetchCaseDistSelect"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import CaseBankDialog from './components/CaseBankDialog.vue'
import CaseRecoveryDialog from './components/CaseRecoveryDialog.vue'
import { CirclePlus, Delete, Folder } from '@element-plus/icons-vue'
import Apis from '@/api/modules/caseManage'
import Apis2 from '@/api/modules/common'
import CaseStatistics from '@/constants/CaseStatistics' //统计数据
import CaseLabelData1 from '@/constants/CaseLabelData1' //分库查询数据
import CaseLabelData2 from '@/constants/CaseLabelData2' //收回查询数据
import DynamoSearchForm from '@/components/DynamoSearchForm/index.vue'
const multipleTable = ref(null)
const dynamoSearchFormRef = ref()
const tabActive = ref(1)
const temporaryLabel = ref()
const caseBankDialog = ref()
const caseRecoveryDialog = ref()
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0,
  CaseStatistics: [], //统计数据
  selectData: [], //选中项
  handleparams: {}, //操作的参数
  tabList: [], //分库列表
  tabListSub: [], //剔除目标分库的分库列表
  distInfo: {}, //委案数据
  taskId: null //对选中数据操作的唯一标记id
})
const operation = ref(1)
const operationList = reactive([
  {
    title: '添加临时标签',
    icon: 'CirclePlus',
    code: 'CASE_BANK_ADD_TEMPORARY_LABEL',
    type: 1
  },
  {
    title: '删除临时标签',
    icon: 'Delete',
    code: 'CASE_BANK_DELETE_TEMPORARY_LABEL',
    type: 1
  },
  {
    title: '案件分库',
    icon: 'Folder',
    code: 'CASE_BANK_BANK',
    type: 2
  },
  {
    title: '案件收回',
    icon: 'Folder',
    code: 'CASE_BANK_RECOVERY',
    type: 3
  }
])
onMounted(() => {
  getTabList()
  getTableData()
})
// 获取表格数据
const getTableData = async () => {
  // 请求得到数据
  const params = { ...dynamoSearchFormRef.value.getParams(), ...query, storeId: tabActive.value }
  // 待分配库和已分配库分开的接口
  const { data } = tabActive.value === 1 ? await Apis.waitDistCaseList(params) : await Apis.doneDistCaseList(params)
  state.tableData = data.data
  // state.tableData = [
  //   {
  //     allotLogId: 0,
  //     allotState: 0,
  //     distTime: '2022-12-02 09:50:43',
  //     allotTime: '2022-12-02 09:50:43',
  //     orgTitle: '所属机构',
  //     arbitrationStatus: 1,
  //     arbitrationTime: '2023-03-31 14:49:46',
  //     batchId: 117,
  //     batchNo: '丽水邦恩-邦恩佰仟20201118',
  //     caseId: 1,
  //     caseNo: 'BE-BQ-0001003',
  //     caseStatus: 1,
  //     caseStatusChild: 0,
  //     caseStatusRemark: '',
  //     caseStatusText: '正常',
  //     caseUserId: 1001,
  //     color: 100,
  //     cpeId: 0,
  //     cpeName: '钱龙',
  //     creditorId: 8,
  //     creditorName: '测试债权方1',
  //     debtResidueAmount: 127493.92,
  //     distLogId: 0,
  //     distState: 0,
  //     entrustAmount: 0,
  //     entrustContactResultId: 187,
  //     entrustFollowTimes: 125,
  //     entrustLastFollowTime: '2023-02-27 10:27:30',
  //     entrustLock: 0,
  //     entrustLogId: 0,
  //     entrustState: 0,
  //     entrustTime: '2022-12-01 15:41:40',
  //     entrustType: 368,
  //     followStatusId: 201,
  //     followStatusText: '后续再跟进',
  //     handleAmount: 7266.75,
  //     idno: '1411811987******12',
  //     investorName: '中信信托有限责任公司',
  //     isOutsidePhone: 1,
  //     isSendLawyer: 0,
  //     mediateStatusText: '',
  //     orgId: 0,
  //     orgTagTempList: [],
  //     pauseCaseType: [],
  //     productId: 20,
  //     productName: '邦恩佰仟',
  //     regAddrArea: '孝义市',
  //     regAddrCity: '吕梁市',
  //     regAddrProvince: '山西省',
  //     repairStatus: 'RPS001',
  //     residueAmount: 7266.75,
  //     retainId: 0,
  //     robotTag: '机器人评语',
  //     stagingPlan: { stagingPlanUuid: 'e20a60db43fd43f190ea2e8c919d62c5', historyRetainCount: 0, debtSignStatus: 0 },
  //     storeId: 1,
  //     storeName: '待分配库',
  //     tagAlterList: [
  //       //预警标签
  //       {
  //         id: 11,
  //         idno: '330124199408180716',
  //         isShare: 1,
  //         markCount: 0,
  //         tagAlertId: 13,
  //         tagAlertName: '新闻媒体'
  //       },
  //       {
  //         id: 9,
  //         idno: '330124199408180716',
  //         isShare: 0,
  //         markCount: 1,
  //         tagAlertId: 190,
  //         tagAlertName: '思想那1'
  //       }
  //     ],
  //     tagTempList: [
  //       //临时标签
  //       {
  //         caseId: 3,
  //         caseTagId: 1096075,
  //         tagName: '2132'
  //       },
  //       {
  //         caseId: 3,
  //         caseTagId: 1097866,
  //         tagName: 'tmp1'
  //       }
  //     ],
  //     totalCouponAmount: 0,
  //     totalIntegralAmount: 0,
  //     totalReductionAmount: 0,
  //     totalRefundAmount: 0,
  //     transAmount: 4844.5,
  //     userName: '马海山',
  //     userPhone: '18435838528'
  //   },
  //   {
  //     allotLogId: 0,
  //     allotState: 0,
  //     distTime: '2022-12-02 09:50:43',
  //     allotTime: '2022-12-02 09:50:43',
  //     orgTitle: '所属机构',
  //     arbitrationStatus: 1,
  //     arbitrationTime: '2023-03-31 14:49:46',
  //     batchId: 117,
  //     batchNo: '丽水邦恩-邦恩佰仟20201118',
  //     caseId: 3,
  //     caseNo: 'BE-BQ-0001001',
  //     caseStatus: 1,
  //     caseStatusChild: 0,
  //     caseStatusRemark: '',
  //     caseStatusText: '正常',
  //     caseUserId: 1001,
  //     color: 100,
  //     cpeId: 0,
  //     cpeName: '钱龙',
  //     creditorId: 8,
  //     creditorName: '测试债权方1',
  //     debtResidueAmount: 127493.92,
  //     distLogId: 0,
  //     distState: 0,
  //     entrustAmount: 0,
  //     entrustContactResultId: 187,
  //     entrustFollowTimes: 125,
  //     entrustLastFollowTime: '2023-02-27 10:27:30',
  //     entrustLock: 0,
  //     entrustLogId: 0,
  //     entrustState: 0,
  //     entrustTime: '2022-12-01 15:41:40',
  //     entrustType: 368,
  //     followStatusId: 201,
  //     followStatusText: '后续再跟进',
  //     handleAmount: 7266.75,
  //     idno: '1411811987******12',
  //     investorName: '中信信托有限责任公司',
  //     isOutsidePhone: 1,
  //     isSendLawyer: 0,
  //     mediateStatusText: '',
  //     orgId: 0,
  //     orgTagTempList: [],
  //     pauseCaseType: [],
  //     productId: 20,
  //     productName: '邦恩佰仟',
  //     regAddrArea: '孝义市',
  //     regAddrCity: '吕梁市',
  //     regAddrProvince: '山西省',
  //     repairStatus: 'RPS001',
  //     residueAmount: 7266.75,
  //     retainId: 0,
  //     robotTag: '机器人评语',
  //     stagingPlan: { stagingPlanUuid: 'e20a60db43fd43f190ea2e8c919d62c5', historyRetainCount: 0, debtSignStatus: 0 },
  //     storeId: 1,
  //     storeName: '待分配库',
  //     tagAlterList: [],
  //     tagTempList: [{ caseId: 1, caseTagId: 3371889, tagName: '888' }],
  //     totalCouponAmount: 0,
  //     totalIntegralAmount: 0,
  //     totalReductionAmount: 0,
  //     totalRefundAmount: 0,
  //     transAmount: 4844.5,
  //     userName: '马海山',
  //     userPhone: '18435838528'
  //   }
  // ]
  state.total = data.total
  // 得到labelData数据
  const { data: data1 } =
    tabActive.value === 1 ? await Apis.waitDistCaseListStats(params) : await Apis.doneDistCaseListStats(params)
  // const labelData2 = data1
  // const labelData2 = {
  //   totalCase: 23,
  //   caseUserCount: 239278,
  //   sumHandleAmount: 4889285788.62,
  //   sumRefundAmount: 184079143.85,
  //   sumResidueAmount: 4711200212.03
  // }
  CaseStatistics.forEach(item => {
    item.value = data1[item.key]
  })
  state.CaseStatistics = CaseStatistics
}
// 获取分库数据
const getTabList = async () => {
  // 请求得到数据
  const { data } = await Apis2.findItemList({ codes: 'DIST_LIST' })
  state.tabList = data.DIST_LIST
  //去掉待分库配这个选项
  state.tabListSub = state.tabList.filter(item => {
    if (item.itemText !== '待分配库') {
      return true
    }
  })
}
//表格选择
const handleSelectionChange = val => {
  let arr = []
  val.map(item => {
    arr.push(item.caseId)
  })
  state.selectData = arr
  operation.value = 1
  state.handleparams = {
    caseIdList: state.selectData,
    operateType: 1
  }
  console.log(state.selectData, state.handleparams, operation.value)
}
//取消选择
const toggleSelection = () => {
  state.selectData = []
  multipleTable.value.clearSelection()
  console.log(state.selectData)
}
//跨页选择
const getRowKeys = row => {
  return row.caseId
}
//通过此函数整体过滤事件
const handleClick = item => {
  if (state.selectData.length === 0 && operation.value === 1) {
    ElMessage.warning('请先选择操作对象!')
  } else {
    switch (item) {
      case '添加临时标签':
        open(1)
        break
      case '删除临时标签':
        open(2)
        break
      case '案件分库':
        caseBank()
        break
      case '案件收回':
        caseRecover()
        break
      default:
        break
    }
  }
}
// 1添加临时标签/2删除临时标签
const open = type => {
  let params =
    operation.value === 1
      ? Object.assign({}, state.handleparams)
      : { operateType: 2, caseSearchParam: Object.assign({}, dynamoSearchFormRef.value.getParams()) }
  temporaryLabel.value.open(type, params)
}
// 案件分库
const caseBank = () => {
  // 获取委案数据
  fetchCaseDistSelect(1)
  caseBankDialog.value.open()
}
// 案件收回
const caseRecover = () => {
  fetchCaseDistSelect(2)
  caseRecoveryDialog.value.open()
}
// 获取委案数据 1分库2收回
const fetchCaseDistSelect = async (type, isWithProductPublicDebt = true) => {
  // 处理入参
  let params =
    operation.value === 1
      ? Object.assign({}, state.handleparams)
      : { operateType: 2, caseSearchParam: Object.assign({}, dynamoSearchFormRef.value.getParams()) }
  params['storeId'] = tabActive.value //当前tab分库的id
  params.isWithProductPublicDebt = isWithProductPublicDebt
  if (type === 2) {
    params['recoverType'] = 1
  }
  console.log('委案数据参数：', params)
  // 请求得到数据
  const { data } = type === 1 ? await Apis.caseDistSelect(params) : await Apis.recoverNowSelect(params)
  state.taskId = data.taskId
  // state.taskId = 2323
  state.distInfo = data
  // state.distInfo = {
  //   caseNum: 1,
  //   personNum: 1,
  //   taskId: 2313,
  //   totalAmount: 7266.75
  // }
  // 区分分库和收回时的label不一样
  const labelData = type === 1 ? CaseLabelData1 : CaseLabelData2
  labelData.forEach(item => {
    item.value = state.distInfo[item.key]
  })
  state.distInfo = labelData
}
// 切换分库
const changTab = () => {
  query.page = 1
  query.pageSize = 10
  dynamoSearchFormRef.value.onReset()
  toggleSelection()
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  margin-bottom: 0;
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
