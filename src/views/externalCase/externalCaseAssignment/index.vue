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
        <!-- <el-table-column
          label="还款入账金额"
          prop="totalRefundAmount"
          align="center"
          min-width="150"
        ></el-table-column>
        <el-table-column
          label="减免金额"
          prop="totalReductionAmount"
          align="center"
          min-width="150"
        ></el-table-column>
        <el-table-column
          label="剩余待还金额"
          prop="residueAmount"
          align="center"
          min-width="150"
        ></el-table-column> -->
        <el-table-column label="临时标签" prop="tagTempName" align="left" min-width="180" :show-overflow-tooltip="true">
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
        <!-- 无 -->
        <el-table-column label="所属分库" prop="storeName" align="center" min-width="150"></el-table-column>
        <!-- 无 -->
        <el-table-column label="分库时间" prop="allotTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="处置机构" prop="orgTitle" align="center" min-width="150"></el-table-column>
        <el-table-column label="委案时间" prop="entrustTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="委案金额" prop="entrustAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="CPE" prop="cpeName" align="center" min-width="150"></el-table-column>
        <el-table-column label="分案时间" prop="allotTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="案件状态" prop="caseStatusText" align="center" min-width="150" fixed="right"></el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <CaseAssignmentDialog
      ref="caseAssignmentDialog"
      :taskId="state.taskId"
      :selectData="selectData"
      :timeData="state.timeData"
      @get-table-data="getTableData"
      @fetchTimingSearch="fetchTimingSearch"
      @toggleSelection="toggleSelection"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import CaseAssignmentDialog from './components/CaseAssignmentDialog.vue'
import CaseStatistics from '@/constants/CaseStatistics' //统计数据
import CaseLabelData3 from '@/constants/CaseLabelData3' //查询数据
import DynamoSearchForm from '@/components/DynamoSearchForm/index.vue'
const multipleTable = ref(null)
const dynamoSearchFormRef = ref()
const selectData = reactive({
  caseTypeList: [], //委案类型列表
  orgList: [], //机构列表
  defalutType: null, //批次为普通批次的id
  bankList: [] //案件分库列表
})
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
  taskId: null, //对选中数据操作的唯一标记id
  timeData: {} //委案数据
})
const operation = ref(1)
const caseAssignmentDialog = ref()
const operationList = reactive([
  {
    title: '实时委案',
    icon: 'Folder',
    isShow: true
    // isShow: this.hasPerm("disposal_case_close"),
  }
])
onMounted(() => {
  getTableData()
  getSelecData()
})
const getTableData = async () => {
  const params = { ...dynamoSearchFormRef.value.getParams(), ...query, storeId: 2 }
  // 请求得到数据
  // const { data } = await xx(params)
  // const { data } = await xx(params) //label
  console.log(params)
  state.tableData = [
    {
      allotLogId: 0,
      allotState: 0,
      allotTime: '2022-12-02 09:50:43',
      arbitrationStatus: 1,
      arbitrationTime: '2023-03-31 14:49:46',
      batchId: 117,
      batchNo: '丽水邦恩-邦恩佰仟20201118',
      caseId: 3,
      caseNo: 'BE-BQ-0001003',
      caseStatus: 1,
      caseStatusChild: 0,
      caseStatusRemark: '',
      caseStatusText: '正常',
      caseUserId: 1001,
      color: 100,
      cpeId: 0,
      cpeName: '钱龙',
      creditorId: 8,
      creditorName: '测试债权方1',
      debtResidueAmount: 127493.92,
      distLogId: 0,
      distState: 0,
      entrustAmount: 0,
      entrustContactResultId: 187,
      entrustFollowTimes: 125,
      entrustLastFollowTime: '2023-02-27 10:27:30',
      entrustLock: 0,
      entrustLogId: 0,
      entrustState: 0,
      entrustTime: '2022-12-01 15:41:40',
      entrustType: 368,
      followStatusId: 201,
      followStatusText: '后续再跟进',
      handleAmount: 7266.75,
      idno: '1411811987******12',
      investorName: '中信信托有限责任公司',
      isOutsidePhone: 1,
      isSendLawyer: 0,
      mediateStatusText: '',
      orgId: 0,
      orgTagTempList: [],
      pauseCaseType: [],
      productId: 20,
      productName: '邦恩佰仟',
      regAddrArea: '孝义市',
      regAddrCity: '吕梁市',
      regAddrProvince: '山西省',
      repairStatus: 'RPS001',
      residueAmount: 7266.75,
      retainId: 0,
      robotTag: '机器人评语',
      stagingPlan: { stagingPlanUuid: 'e20a60db43fd43f190ea2e8c919d62c5', historyRetainCount: 0, debtSignStatus: 0 },
      storeId: 1,
      storeName: '待分配库',
      tagAlterList: [
        //预警标签
        {
          id: 11,
          idno: '330124199408180716',
          isShare: 1,
          markCount: 0,
          tagAlertId: 13,
          tagAlertName: '新闻媒体'
        },
        {
          id: 9,
          idno: '330124199408180716',
          isShare: 0,
          markCount: 1,
          tagAlertId: 190,
          tagAlertName: '思想那1'
        }
      ],
      tagTempList: [
        //临时标签
        {
          caseId: 3,
          caseTagId: 1096075,
          tagName: '2132'
        },
        {
          caseId: 3,
          caseTagId: 1097866,
          tagName: 'tmp1'
        }
      ],
      totalCouponAmount: 0,
      totalIntegralAmount: 0,
      totalReductionAmount: 0,
      totalRefundAmount: 0,
      transAmount: 4844.5,
      userName: '马海山',
      userPhone: '18435838528'
    },
    {
      allotLogId: 0,
      allotState: 0,
      allotTime: '2022-12-02 09:50:43',
      arbitrationStatus: 1,
      arbitrationTime: '2023-03-31 14:49:46',
      batchId: 117,
      batchNo: '丽水邦恩-邦恩佰仟20201118',
      caseId: 1,
      caseNo: 'BE-BQ-0001001',
      caseStatus: 1,
      caseStatusChild: 0,
      caseStatusRemark: '',
      caseStatusText: '正常',
      caseUserId: 1001,
      color: 100,
      cpeId: 0,
      cpeName: '钱龙',
      creditorId: 8,
      creditorName: '测试债权方1',
      debtResidueAmount: 127493.92,
      distLogId: 0,
      distState: 0,
      entrustAmount: 0,
      entrustContactResultId: 187,
      entrustFollowTimes: 125,
      entrustLastFollowTime: '2023-02-27 10:27:30',
      entrustLock: 0,
      entrustLogId: 0,
      entrustState: 0,
      entrustTime: '2022-12-01 15:41:40',
      entrustType: 368,
      followStatusId: 201,
      followStatusText: '后续再跟进',
      handleAmount: 7266.75,
      idno: '1411811987******12',
      investorName: '中信信托有限责任公司',
      isOutsidePhone: 1,
      isSendLawyer: 0,
      mediateStatusText: '',
      orgId: 0,
      orgTagTempList: [],
      pauseCaseType: [],
      productId: 20,
      productName: '邦恩佰仟',
      regAddrArea: '孝义市',
      regAddrCity: '吕梁市',
      regAddrProvince: '山西省',
      repairStatus: 'RPS001',
      residueAmount: 7266.75,
      retainId: 0,
      robotTag: '机器人评语',
      stagingPlan: { stagingPlanUuid: 'e20a60db43fd43f190ea2e8c919d62c5', historyRetainCount: 0, debtSignStatus: 0 },
      storeId: 1,
      storeName: '待分配库',
      tagAlterList: [],
      tagTempList: [{ caseId: 1, caseTagId: 3371889, tagName: '888' }],
      totalCouponAmount: 0,
      totalIntegralAmount: 0,
      totalReductionAmount: 0,
      totalRefundAmount: 0,
      transAmount: 4844.5,
      userName: '马海山',
      userPhone: '18435838528'
    }
  ]
  state.total = 12
  // 得到labelData数据
  const labelData2 = {
    totalCase: 33,
    caseUserCount: 239278,
    sumHandleAmount: 4889285788.62,
    sumRefundAmount: 184079143.85,
    sumResidueAmount: 4711200212.03
  }
  CaseStatistics.forEach(item => {
    item.value = labelData2[item.key]
  })
  state.CaseStatistics = CaseStatistics
}
const getSelecData = async () => {
  // 请求得到数据
  let params = {
    codes: 'IVR_TAG,ROBOT_TAG,PRODUCT_LIST,BATCH_LIST,CREDITOR_LIST,DUTY_ORG_LIST,CASE_BATCH_TYPE,ENTRUST_TYPE',
    orgCategoryId: 0
  }
  // const { code, data, msg } = await selectList(params)
  // selectData.orgList = data.DUTY_ORG_LIST
  // selectData.caseTypeList = data.ENTRUST_TYPE
  // selectData.defalutType = data.batchTypeList.map(item => {
  //   if (item.itemText === '普通批次') {
  //     selectData.defalutType = item.itemId
  //   }
  // })
  selectData.caseTypeList = [
    {
      id: 1,
      text: '默认'
    },
    {
      id: 2,
      text: '综合案件-温泽（2022年9月）'
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
  selectData.defalutType = 92
  selectData.bankList = [
    {
      itemText: '待分库案件',
      itemId: 1
    },
    {
      itemText: '委外处置库',
      itemId: 2
    },
    {
      itemText: '智能处置库',
      itemId: 3
    },
    {
      itemText: '勾销处置库',
      itemId: 4
    }
  ]
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
      case '实时委案':
        caseAssignment()
        break
      default:
        break
    }
  }
}
// 实时委案
const caseAssignment = () => {
  fetchTimingSearch()
  caseAssignmentDialog.value.open()
}
// 获取委案数据
const fetchTimingSearch = (entrustStrategy = 1) => {
  // 处理入参
  let params =
    operation.value === 1
      ? Object.assign({}, state.handleparams)
      : { operateType: 2, caseSearchParam: Object.assign({}, dynamoSearchFormRef.value.getParams()) }
  params.storeId = 2
  params.entrustStrategy = entrustStrategy
  console.log('委案数据参数：', params)
  // 请求得到数据
  // const { data } = await xx(params)
  // state.taskId = data.taskId
  // state.timeData = data
  if (entrustStrategy === 1) {
    state.taskId = 1
    state.timeData = {
      caseNum: 1,
      personNum: 1,
      taskId: 2210,
      totalAmount: 1
    }
  } else if (entrustStrategy === 2) {
    state.taskId = 2
    state.timeData = {
      caseNum: 2,
      personNum: 2,
      taskId: 2210,
      totalAmount: 2
    }
  } else {
    state.taskId = 3
    state.timeData = {
      caseNum: 3,
      personNum: 3,
      taskId: 2210,
      totalAmount: 4
    }
  }
  CaseLabelData3.forEach(item => {
    item.value = state.timeData[item.key]
  })
  state.timeData = CaseLabelData3
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
