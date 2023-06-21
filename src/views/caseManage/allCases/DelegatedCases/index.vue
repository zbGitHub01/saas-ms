<template>
  <div>
    <DynamoSearchForm ref="dynamoSearchFormRef" code="MNG_CASE_SEARCH_FIELD" @search="getTableData" />
    <div class="spacing"></div>
    <LabelClass :labelData="state.CaseStatisticsEntrust" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <div v-for="(item, index) in operationList" :key="index" class="mr10">
            <el-button v-if="item.isShow && !item.dropdown" plain type="primary" :icon="item.icon" @click="handleClick(item)">
              {{ item.title }}
            </el-button>
            <el-dropdown v-if="item.isShow && item.dropdown">
              <el-button type="primary" plain :icon="item.icon">
                {{ item.title }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item2 in item.dropdown" :key="item2.title" @click="handleClick(item2)">
                    {{ item2.title }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
        @sort-change="handlesort"
        ref="multipleTable"
        :row-class-name="tableRowClassName"
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
        <el-table-column label="委案金额" prop="entrustAmount" align="center" min-width="150" sortable="custom"></el-table-column>
        <el-table-column label="还款入账金额" prop="totalRefundAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="减免金额" prop="totalReductionAmount" align="center" min-width="150"></el-table-column>
        <el-table-column
          label="剩余待还金额"
          prop="residueAmount"
          align="center"
          min-width="150"
          sortable="custom"
        ></el-table-column>
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
        <el-table-column
          label="IVR标签"
          prop="ivrTag"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="委案方" prop="entrustTenantName" align="center" min-width="200"></el-table-column>
        <el-table-column label="CPE" prop="cpeName" align="center" min-width="150"></el-table-column>
        <el-table-column label="分案时间" prop="allotTime" align="center" min-width="180"></el-table-column>
        <el-table-column
          label="跟进结果"
          prop="entrustContactResultText"
          align="center"
          min-width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="处置状态" prop="followStatusText" align="center" min-width="150"></el-table-column>
        <el-table-column label="跟进次数" prop="entrustFollowTimes" align="center" min-width="150"></el-table-column>
        <el-table-column label="最近更进时间" prop="entrustLastFollowTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="案件状态" prop="caseStatusText" align="center" min-width="150" fixed="right"></el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <TemporaryLabel ref="temporaryLabel" @get-table-data="getTableData" />
    <EditStatusDialog ref="editStatusDialog" @getTableData="getTableData" />
    <ExportDialog ref="exportDialog" @submitExport="submitExport" />
    <ColorShowDialog ref="colorShowDialog" @getTableData="getTableData" />
    <!-- <CreatBatchDialog ref="creatBatchDialog" @submitForm="submitBatchForm" /> -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted, computed } from 'vue'
import { Close, VideoPause, VideoPlay, CirclePlus, Delete, Download, Document } from '@element-plus/icons-vue'
import EditStatusDialog from './components/EditStatusDialog.vue'
import ExportDialog from './components/ExportDialog.vue'
import ColorShowDialog from './components/ColorShowDialog.vue'
import CreatBatchDialog from './components/CreatBatchDialog.vue'
import CaseStatisticsEntrust from '@/constants/CaseStatisticsEntrust' //统计数据
import Apis from '@/api/modules/caseManage'
import DynamoSearchForm from '@/components/DynamoSearchForm/index.vue'
const multipleTable = ref(null)
const dynamoSearchFormRef = ref()
const temporaryLabel = ref()
const editStatusDialog = ref()
const exportDialog = ref()
const colorShowDialog = ref()
const creatBatchDialog = ref()
const entrustResidueAmountSort = ref() //剩余待还金额排序：0-正序，1-倒序
const entrustAmountSort = ref() //委案金额排序 0-正序，1-倒序
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0,
  CaseStatisticsEntrust: [], //统计数据
  selectData: [], //选中项
  handleparams: {
    caseIdList: [],
    operateType: 1
  }, //操作的参数
  exportData: {} //导出项列表
})
const operation = ref(1)
const operationList = reactive([
  {
    title: '导出案件1',
    icon: 'Download',
    isShow: true
    // isShow: this.hasPerm("disposal_case_close"),
  },
  {
    title: '导出案件2',
    icon: 'Download',
    isShow: true
    // isShow: this.hasPerm("disposal_case_stop"),
  },
  {
    title: '案件标色',
    icon: 'BrushFilled',
    isShow: true
    // isShow: this.hasPerm("disposal_case_ref"),
  },
  {
    title: '修改处置状态',
    icon: 'EditPen',
    isShow: true
    // isShow: this.hasPerm("disposal_case_addlabel"),
  },
  {
    title: '添加临时标签',
    icon: 'CirclePlus',
    isShow: true,
    // isShow: this.hasPerm("disposal_case_dellabel"),
    dropdown: [
      //按钮下拉
      {
        title: '添加临时标签'
      },
      {
        title: '导入批量添加标签',
        notCheck: true //是否需要跳过校验选中项
      }
    ]
  },
  {
    title: '删除临时标签',
    icon: 'Delete',
    isShow: true
    // isShow: this.hasPerm("disposal_case_dellabel"),
  }
  // {
  //   title: '创建诉讼批次',
  //   icon: 'CirclePlus',
  //   isShow: true,
  //   // isShow: this.hasPerm("disposal_case_excase"),
  //   dropdown: [
  //     {
  //       title: '以案件筛选结果创建诉讼批次',
  //       notCheck: true
  //     },
  //     {
  //       title: '表格上传案件创建诉讼批次',
  //       notCheck: true
  //     }
  //   ]
  // },
  // {
  //   title: '创建单保全批次',
  //   icon: 'CirclePlus',
  //   isShow: true,
  //   // isShow: this.hasPerm("disposal_case_exrecord"),
  //   dropdown: [
  //     {
  //       title: '以案件筛选结果创建单保全批次',
  //       notCheck: true
  //     },
  //     {
  //       title: '表格上传案件创建单保全批次',
  //       notCheck: true
  //     }
  //   ]
  // }
])
onMounted(() => {
  getTableData()
})
const getTableData = async paramsSub => {
  console.log('可管理案件搜索')
  // 请求得到数据
  const params = {
    ...dynamoSearchFormRef.value.getParams(),
    ...query,
    queryType: 'ENTRUSTED', //案件查询类型：ENTRUSTED-委派处置案件
    entrustAmountSort: entrustAmountSort.value,
    entrustResidueAmountSort: entrustResidueAmountSort.value
  }
  const { data } = await Apis.caseList(params)
  state.tableData = data.data
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
      orgTitle: '公司名称T79',
      caseUserId: 1001,
      color: 97,
      cpeId: 0,
      cpeName: '钱龙',
      creditorId: 8,
      creditorName: '测试债权方1',
      debtResidueAmount: 127493.92,
      distLogId: 0,
      distState: 0,
      entrustAmount: 1,
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
      lawsuitStatus: '内部已执行',
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
      color: 98,
      cpeId: 0,
      orgTitle: '公司名称T79',
      cpeName: '钱龙',
      creditorId: 8,
      creditorName: '测试债权方1',
      debtResidueAmount: 127493.92,
      distLogId: 0,
      distState: 0,
      entrustAmount: 2,
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
      lawsuitStatus: '内部已执行',
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
  state.total = data.total
  const { data: data1 } = await Apis.caseListStats(params)
  CaseStatisticsEntrust.forEach(item => {
    item.value = data1[item.key]
  })
  state.CaseStatisticsEntrust = CaseStatisticsEntrust
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
  if (state.selectData.length === 0 && operation.value === 1 && !item.notCheck) {
    ElMessage.warning('请先选择操作对象!')
  } else {
    switch (item.title) {
      case '导出案件1':
        exportModel('EXPORT_CASE_FIELD', 0)
        break
      case '导出案件2':
        exportModel('EXPORT_CASE_FIELD', 0)
        break
      case '导出处置记录':
        // this.form.caseStatus = 25;
        exportModel('EXPORT_FOLLOW_FIELD', 1)
        break
      case '案件标色':
        colorShow()
        break
      case '修改处置状态':
        editStatus()
        break
      case '添加临时标签':
        handleTag(1)
        break
      case '导入批量添加标签':
        handleTag(3)
        break
      case '删除临时标签':
        handleTag(2)
        break
      // case '以案件筛选结果创建诉讼批次':
      //   createBatch(0, 1)
      //   break
      // case '表格上传案件创建诉讼批次':
      //   createBatch(0, 2)
      //   break
      // case '以案件筛选结果创建单保全批次':
      //   createBatch(1, 1)
      //   break
      // case '表格上传案件创建单保全批次':
      //   createBatch(1, 2)
      //   break
      default:
        break
    }
  }
}
// 1添加临时标签/2删除临时标签/3批量导入临时标签
const handleTag = type => {
  temporaryLabel.value.open(type, getParams(), true) //true表示是机构端的标签操作
}
//排序
const handlesort = val => {
  if (val.order) {
    if (val.prop === 'entrustAmount') {
      entrustResidueAmountSort.value = null
      entrustAmountSort.value = val.order === 'ascending' ? 0 : 1
    } else if (val.prop === 'residueAmount') {
      entrustAmountSort.value = null
      entrustResidueAmountSort.value = val.order === 'ascending' ? 0 : 1
    }
  } else {
    entrustAmountSort.value = null
    entrustResidueAmountSort.value = null
  }
  getTableData()
}
// 修改处置状态
const editStatus = () => {
  editStatusDialog.value.open(getParams())
}
// 0导出案件1和导出案件2， 1导出处置记录
const exportModel = async (code, type) => {
  let params = {
    codes: code
  }
  // const { data } = await xx(params)
  // state.exportData = data[code]
  state.exportData = {
    amountTime: {
      loanPactAmount: '合同金额',
      loanArrivalAmount: '到账金额',
      loanBorrRate: '借款费率',
      loanServeRate: '服务费率',
      loanPeriod: '借款周期',
      transBeforeRefundAmount: '转让前已还金额',
      transAmount: '转让金额',
      transPrincipal: '转让本金',
      transFee: '转让利息',
      loanTime: '借款时间',
      loanStartTime: '借款起算时间',
      loanEndTime: '借款到期时间',
      loanExpireTime: '最后还款日',
      transTime: '转让日期',
      creditAmount: '征信金额'
    },
    baseInfo: {
      caseNo: '案件ID',
      productName: '产品',
      batchNo: '入库批次号',
      creditorName: '债权方',
      loanPactNo: '订单合同号',
      loanPlatformUserId: '平台用户ID',
      originCreditor: '原债权公司',
      userName: '姓名',
      idno: '证件号',
      userPhone: '手机号',
      sosPhone: '紧急联系人',
      sex: '性别',
      marital: '婚姻状况',
      qq: 'QQ',
      mail: '邮箱',
      regAddrRange: '户籍区域',
      regAddr: '户籍地址',
      homeAddr: '家庭地址',
      homePhone: '家庭电话',
      companyName: '单位名称',
      companyAddr: '单位地址',
      companyPhone: '单位电话',
      investorName: '出资方',
      receiptBank: '收款银行',
      receiptBankCode: '收款银行卡号',
      refundBank: '还款银行',
      refundBankCode: '还款银行卡号',
      caseStatusRemark: '特殊备注',
      ethnicity: '民族'
    },
    handleRelevant: {
      storeName: '所属分库',
      orgTitle: '处置机构',
      cpeName: 'CPE',
      handleAmount: '处置金额',
      totalRefundAmount: '还款入账金额',
      totalReductionAmount: '减免金额',
      residueAmount: '剩余待还金额',
      intermediateCourtName: '中级法院',
      grassRootCourtName: '基层法院',
      caseStatusText: '案件状态',
      entrustTypeText: '委案类型'
    },
    followFile: {
      callRecording: '通话录音',
      letter: '信函',
      smsRecord: '短信联系记录',
      wechatRecord: '微信联系记录',
      qqRecord: 'QQ联系记录'
    }
  }
  exportDialog.value.open(state.exportData, type)
}
// 确认导出案件1和导出案件2/导出处置记录
const submitExport = async (paramsSub, type) => {
  let params = getParams()
  Object.assign(params, paramsSub)
  //此处做判断是为了判断是否是委外库
  // 再处理 原代码里的store没传，
  // if (this.store && params.operateType === 2) {
  //   params.companyCaseSearchParam['storeId'] = this.store
  // }
  // 发送处理案件接口
  console.log('导出：', params)
  if (type === 0) {
    // const { data } = await caseexport(params)
    // data.isAsync === 0 ? exportDownload(data.data.fileUrl) : ElMessage.success('数据量较大请稍后')
    console.log(type)
  } else if (type === 1) {
    // const { data } = await followexport(params)
    // data.isAsync === 0 ? exportDownload(data.data.fileUrl) : ElMessage.success('数据量较大请稍后')
    console.log(type)
  }
  ElMessage.success('操作成功！')
  toggleSelection()
}
//导出下载
const exportDownload = item => {
  ElMessage.success('导出成功！')
  exportMethod(item)
}
const exportMethod = (data, target = '_self') => {
  if (data === null || data === '') {
    ElMessage.error('下载链接异常！')
  } else {
    let url = data
    let a = document.createElement('a')
    a.href = url
    a.target = target || '_self'
    a.click()
  }
}
// 案件标色
const colorShow = () => {
  colorShowDialog.value.open(getParams())
}
// 设置表格行颜色
const tableRowClassName = ({ row, rowIndex }) => {
  if (row.color === 96) {
    return 'info-row'
  } else if (row.color === 97) {
    return 'positive-row'
  } else if (row.color === 98) {
    return 'warm-row'
  } else if (row.color === 99) {
    return 'else-row'
  } else if (row.color === 292) {
    return 'green-row'
  } else if (row.color === 293) {
    return 'grey-row'
  } else if (row.color === 294) {
    return 'purple-row'
  } else {
    return 'ref-row'
  }
}
// // 创建批次 typType:0诉讼 1保全 OpeType:1筛选结果 2表格上传
// const createBatch = async (typType, opeType) => {
//   if (opeType === 1) {
//     if (!dynamoSearchFormRef.value.getParams().investorName) {
//       return ElMessage.warning('请先查询出资方!')
//     }
//     if (!dynamoSearchFormRef.value.getParams().productIdList) { //到底是productId还是productIdList
//       return ElMessage.warning('请先查询产品!')
//     }
//     if (state.selectData.length === 0 && operation.value === 1) {
//       return ElMessage.warning('请先选择操作对象!')
//     }
//     const params = {
//       operateType: operation.value,
//       companyCaseSearchParam: Object.assign({}, dynamoSearchFormRef.value.getParams()),
//       caseIdList: state.selectData,
//       type: typType
//     }
//     // 获取批次数量信息
//     // const {data } = await xx(params)
//     // const numInfo = data
//     const numInfo = {
//       createCaseNum: 9,
//       createCaseUserNum: 7,
//       filterCaseUserNum: 7,
//       orgList: ['公司名称T79'],
//       filterCaseNum: 9,
//       productList: ['“360”借条']
//     }
//     console.log('操作类型1', numInfo)
//     creatBatchDialog.value.open(typType, opeType, numInfo)
//   } else if (opeType === 2) {
//     creatBatchDialog.value.open(typType, opeType, {})
//   }
// }
// // 确认创建批次
// const submitBatchForm = paramsSub => {
//   const params = {
//     operateType: operation.value,
//     companyCaseSearchParam: Object.assign({}, dynamoSearchFormRef.value.getParams()),
//     caseIdList: state.selectData
//   }
//   Object.assign(params, paramsSub)
//   console.log('创建批次：', params)
//   ElMessage.success('创建诉讼批次成功!')
// }
// 处理基础入参
const getParams = () => {
  let params =
    operation.value === 1
      ? Object.assign({}, state.handleparams)
      : { operateType: 2, caseSearchParam: Object.assign({}, dynamoSearchFormRef.value.getParams()) }
  return params
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
