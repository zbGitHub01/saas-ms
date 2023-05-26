<template>
  <div>
    <FormWrap @search="getTableData" @reset="reset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="案件ID">
            <el-input v-model="form.caseId" placeholder="请输入案件ID" clearable></el-input>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <!-- <LabelData :labelData="state.labelData" /> -->
    <LabelClass :labelData="state.labelData" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <div v-for="(item, index) in operationList" :key="index" class="mr10">
            <el-button v-if="item.isShow" plain type="primary" :icon="item.icon" @click="handleClick(item.title)">
              {{ item.title }}
            </el-button>
          </div>
        </template>
      </OperationBar>
      <div class="mb10">
        <span>选中项：{{ state.selectData.length }}</span>
        <el-button link type="primary" size="large" @click="toggleSelection" class="ml20">取消</el-button>
      </div>
      <el-table :data="state.tableData" border @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
        <el-table-column label="案件ID" prop="caseNo" align="center" min-width="150" fixed="left" :show-overflow-tooltip="true">
          <template #default="scope">
            <status :row="scope.row" pageType="disposalCasemessage" />
          </template>
        </el-table-column>
        <el-table-column
          label="产品"
          prop="productName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="姓名"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="证件号"
          prop="idno"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="userPhone"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="处置金额"
          prop="handleAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="还款入账金额"
          prop="totalRefundAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="减免金额"
          prop="totalReductionAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="剩余待还金额"
          prop="residueAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
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
        <el-table-column
          label="IVR标签"
          prop="ivrTag"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="机器人外呼标签"
          prop="robotTag"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="入库批次号"
          prop="batchNo"
          align="center"
          min-width="250"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="债权方"
          prop="creditorName"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="所属分库"
          prop="storeName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="分库时间"
          prop="distTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="处置机构"
          prop="orgTitle"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="委案时间"
          prop="entrustTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="委案金额"
          prop="entrustAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="CPE"
          prop="cpeName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="分案时间"
          prop="allotTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="特殊原因备注"
          prop="caseStatusRemark"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="法诉状态标签"
          prop="lawsuitStatus"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="案件状态" prop="caseStatusText" align="center" min-width="150" fixed="right"></el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddOrRemoveTagDialog ref="addOrRemoveTagDialog" @submitForm="submitTagForm" />
    <HandleCaseDialog ref="handleCaseDialog" @submitForm="submitCaseForm" />
    <ExportDialog ref="exportDialog" @submitExport="submitExport" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Close, VideoPause, VideoPlay, CirclePlus, Delete, Download, Document } from '@element-plus/icons-vue'
import AddOrRemoveTagDialog from './components/AddOrRemoveTagDialog.vue'
import HandleCaseDialog from './components/HandleCaseDialog.vue'
import ExportDialog from './components/ExportDialog.vue'
const multipleTable = ref(null)
const form: any = reactive({
  caseId: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
const addOrRemoveTagDialog = ref()
const handleCaseDialog = ref()
const exportDialog = ref()
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [] as any[],
  total: 0,
  labelData: [] as any, //标签数据
  selectData: [] as any[], //选中项
  handleparams: {} as any, //操作的参数
  exportData: {} //导出项参数
})
const operation = ref(1)
const operationList = reactive([
  {
    title: '关闭案件',
    icon: 'Close',
    isShow: true
    // isShow: this.hasPerm("disposal_case_close"),
  },
  {
    title: '暂停案件',
    icon: 'VideoPause',
    isShow: true
    // isShow: this.hasPerm("disposal_case_stop"),
  },
  {
    title: '恢复案件',
    icon: 'VideoPlay',
    isShow: true
    // isShow: this.hasPerm("disposal_case_ref"),
  },
  {
    title: '添加临时标签',
    icon: 'CirclePlus',
    isShow: true
    // isShow: this.hasPerm("disposal_case_addlabel"),
  },
  {
    title: '删除临时标签',
    icon: 'Delete',
    isShow: true
    // isShow: this.hasPerm("disposal_case_dellabel"),
  },
  {
    title: '导出案件',
    icon: 'Download',
    isShow: true
    // isShow: this.hasPerm("disposal_case_excase"),
  },
  {
    title: '导出处置记录',
    icon: 'Download',
    isShow: true
    // isShow: this.hasPerm("disposal_case_exrecord"),
  },
  {
    title: '生成结清证明',
    icon: 'Document',
    isShow: true
    // isShow: this.hasPerm("disposal_case_qing"),
  }
])
onMounted(() => {
  getTableData()
})
const getTableData = async () => {
  console.log('可管理案件搜索', form)
  // 请求得到数据
  // const { data } = await xx(form)
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
      color: 100,
      cpeId: 0,
      orgTitle: '公司名称T79',
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
  query.page = 1
  state.total = 12
  // 得到label数据
  state.labelData = [
    {
      customizeIcon: 'caselist',
      eplusIcon: '',
      labelTitle: '案件数量',
      isHaveRmbSign: false,
      value: null, //total
      key: 'total'
    },
    {
      customizeIcon: 'caselist',
      eplusIcon: '',
      labelTitle: '案人人数',
      isHaveRmbSign: false,
      value: null,
      key: 'caseUserCount'
    },
    {
      customizeIcon: 'caselist',
      eplusIcon: '',
      labelTitle: '处置金额',
      isHaveRmbSign: false,
      value: null,
      key: 'sumHandleAmount'
    },
    {
      customizeIcon: 'caselist',
      eplusIcon: '',
      labelTitle: '已还金额',
      isHaveRmbSign: false,
      value: null,
      key: 'sumRefundAmount'
    },
    {
      customizeIcon: 'caselist',
      eplusIcon: '',
      labelTitle: '待还金额',
      isHaveRmbSign: false,
      value: null,
      key: 'sumResidueAmount'
    }
  ]
  const labelData2 = {
    caseUserCount: 239278,
    sumHandleAmount: 4889285788.62,
    sumRefundAmount: 184079143.85,
    sumResidueAmount: 4711200212.03
  }
  state.labelData.forEach(item => {
    item.value = labelData2[item.key]
  })
}
// 重置
const reset = () => {
  console.log('重置')
  Object.assign(form, originFormData)
  getTableData()
}
//表格选择
const handleSelectionChange = (val: any) => {
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
//通过此函数整体过滤事件
const handleClick = item => {
  if (state.selectData.length === 0 && operation.value === 1) {
    ElMessage.warning('请先选择操作对象!')
  } else {
    switch (item) {
      case '关闭案件':
        handleCase(1)
        break
      case '暂停案件':
        // this.form.caseStatus = 25;
        handleCase(2)
        break
      case '恢复案件':
        handleCase(3)
        break
      case '添加临时标签':
        handleTag(1)
        break
      case '删除临时标签':
        handleTag(2)
        break
      case '导出案件':
        exportModel('EXPORT_CASE_FIELD', 0)
        break
      case '导出处置记录':
        exportModel('EXPORT_FOLLOW_FIELD', 1)
        break
      case '生成结清证明':
        certificate()
        break
      default:
        break
    }
  }
}
// 1添加临时标签/2删除临时标签
const handleTag = type => {
  addOrRemoveTagDialog.value.open(type)
}
// 确认添加/删除临时标签
const submitTagForm = (tempTagName, type, isDeleteAllRelationTag) => {
  // 处理入参
  let params = getParams()
  params.tempTagName = tempTagName
  if (type === 2) {
    params['isDeleteAllRelationTag'] = isDeleteAllRelationTag === true ? 1 : 0
  }
  console.log(params)
  // 请求得到数据
  // await xx(form)
  ElMessage.success('操作成功！')
  toggleSelection()
  getTableData()
}
// 1关闭案件/2暂停案件/3恢复案件
const handleCase = type => {
  if (type === 3) {
    ElMessageBox.confirm('是否确认本次操作?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(
      () => {
        let paramsSub = {
          caseStatus: 1
        }
        submitCaseForm(paramsSub)
      },
      res => {
        ElMessage.info('已取消')
      }
    )
  } else {
    handleCaseDialog.value.open(type)
  }
}
// 确认关闭/暂停/恢复案件
const submitCaseForm = async paramsSub => {
  let params = getParams()
  Object.assign(params, paramsSub)
  // 发送处理案件接口
  console.log('处理案件：', params)
  // await xx(params)
  ElMessage.success('操作成功！')
  toggleSelection()
  getTableData()
}
// 0导出案件/1导出处置记录
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
// 确认导出案件/导出处置记录
const submitExport = async (paramsSub, type) => {
  let params = getParams()
  Object.assign(params, paramsSub)
  //此处做判断是为了判断是否是委外库
  // 再处理 原代码里的store没传，
  // if (this.store && params.operateType === 2) {
  //   params.caseSearchParam['storeId'] = this.store
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
  ElMessage.success('导出成功')
  // exportMethod(item)
}
// 生成结清证明
const certificate = async () => {
  ElMessageBox.confirm('是否确认本次操作?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    () => {
      let params = getParams()
      console.log('结清证明', params)
      // await xx(params)
      toggleSelection()
      getTableData()
    },
    res => {
      ElMessage.info('已取消')
    }
  )
}
// 处理基础入参
const getParams = () => {
  let params =
    operation.value === 1 ? Object.assign({}, state.handleparams) : { operateType: 2, caseSearchParam: Object.assign({}, form) }
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
