<template>
  <div class="card-wrap">
    <DynamoSearchForm ref="dynamoSearchFormRef" code="MNG_CASE_SEARCH_FIELD" @search="getTableData" />
    <div class="spacing"></div>
    <LabelClass :labelData="state.CaseStatistics" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <div v-for="(item, index) in operationList" :key="index" class="mr10">
            <el-button v-if="item.isShow" type="primary" :icon="item.icon" @click="handleClick(item.title)" plain>
              {{ item.title }}
            </el-button>
          </div>
        </template>
      </OperationBar>
      <!-- <div class="mb10">
        <span>选中项：{{ state.selectData.length }}</span>
        <el-button link type="primary" size="large" @click="toggleSelection" class="ml20">取消</el-button>
      </div> -->
      <el-table
        :data="state.tableData"
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" fixed align="center" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column label="案件ID" prop="caseNo" align="center" min-width="150" fixed="left">
          <template #default="scope">
            <status :row="scope.row" pageType="disposalCasemessage" />
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
        <el-table-column label="预警标签" prop="tagAlterList" align="left" min-width="180" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.tagAlterList" :key="index">
              <span :style="{ color: item.isShare === 1 ? 'red' : '' }">
                {{ index === scope.row.tagAlterList.length - 1 ? item.tagAlertName : item.tagAlertName + ',' }}
              </span>
            </span>
          </template>
        </el-table-column>
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
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <CaseRecoveryDialog ref="caseRecoveryDialog" @get-table-data="getTableData" @toggleSelection="toggleSelection" />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import CaseRecoveryDialog from './components/CaseRecoveryDialog.vue'
import CaseStatistics from '@/constants/CaseStatistics' //统计数据
import CaseLabelData4 from '@/constants/CaseLabelData4' //收回查询数据
import DynamoSearchForm from '@/components/DynamoSearchForm/index.vue'
import Apis from '@/api/modules/caseManage'
const multipleTable = ref(null)
const dynamoSearchFormRef = ref()
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
  handleparams: {} //操作的参数
})
const operation = ref(1)
const caseRecoveryDialog = ref()
const operationList = reactive([
  {
    title: '实时收回',
    icon: 'Folder',
    isShow: true
    // isShow: this.hasPerm("disposal_case_close"),
  }
])
onMounted(() => {
  getTableData()
})
const getTableData = async () => {
  // 请求得到数据
  const params = { ...dynamoSearchFormRef.value.getParams(), ...query, recoverType: 2 }
  const { data } = await Apis.recoverCaseList(params)
  state.tableData = data.data
  // state.tableData = [
  //   {
  //     allotLogId: 0,
  //     allotState: 0,
  //     allotTime: '2022-12-02 09:50:43',
  //     arbitrationStatus: 1,
  //     arbitrationTime: '2023-03-31 14:49:46',
  //     batchId: 117,
  //     batchNo: '丽水邦恩-邦恩佰仟20201118',
  //     caseId: 3,
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
  //     allotTime: '2022-12-02 09:50:43',
  //     arbitrationStatus: 1,
  //     arbitrationTime: '2023-03-31 14:49:46',
  //     batchId: 117,
  //     batchNo: '丽水邦恩-邦恩佰仟20201118',
  //     caseId: 1,
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
  const { data: data1 } = await Apis.recoverCaseListStats(params)
  // const labelData2 = {
  //   totalCase: 33,
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
      case '实时收回':
        caseRecovery()
        break
      default:
        break
    }
  }
}
// 实时收回
const caseRecovery = () => {
  let params =
    operation.value === 1
      ? Object.assign({}, state.handleparams)
      : { operateType: 2, caseSearchParam: Object.assign({}, dynamoSearchFormRef.value.getParams()) }
  caseRecoveryDialog.value.open(params)
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