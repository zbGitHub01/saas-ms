<template>
  <div>
    <DynamoSearchForm ref="dynamoSearchFormRef" code="MNG_CASE_SEARCH_FIELD" @search="getTableData" />
    <div class="spacing"></div>
    <LabelClass :labelData="state.CaseStatistics" :label-obj="state.labelObjData" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <div v-for="(item, index) in operationList" :key="index" class="mr10">
            <el-button v-auth="item.code" plain type="primary" :icon="item.icon" @click="handleClick(item.title)">
              {{ item.title }}
            </el-button>
          </div>
        </template>
      </OperationBar>
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
        <el-table-column
          label="IVR标签"
          prop="ivrTag"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="机器人外呼标签"
          prop="robotTag"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="入库批次号" prop="batchNo" align="center" min-width="250"></el-table-column>
        <el-table-column label="债权方" prop="creditorName" align="center" min-width="200"></el-table-column>
        <el-table-column label="所属分库" prop="storeName" align="center" min-width="150"></el-table-column>
        <el-table-column label="分库时间" prop="distTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="处置机构" prop="orgTitle" align="center" min-width="150"></el-table-column>
        <el-table-column label="委案时间" prop="entrustTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="委案金额" prop="entrustAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="CPE" prop="cpeName" align="center" min-width="150"></el-table-column>
        <el-table-column label="分案时间" prop="allotTime" align="center" min-width="180"></el-table-column>
        <el-table-column
          label="特殊原因备注"
          prop="caseStatusRemark"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="法诉状态标签"
          prop="lawsuitStatus"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="案件状态" prop="caseStatusText" align="center" min-width="150" fixed="right"></el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <TemporaryLabel ref="temporaryLabel" @get-table-data="getTableData" />
    <HandleCaseDialog ref="handleCaseDialog" @submitForm="submitCaseForm" />
    <ExportDialog ref="exportDialog" @submitExport="submitExport" />
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Close, VideoPause, VideoPlay, CirclePlus, Delete, Download, Document } from '@element-plus/icons-vue'
import DynamoSearchForm from '@/components/DynamoSearchForm/index.vue'
import HandleCaseDialog from './components/HandleCaseDialog.vue'
import ExportDialog from './components/ExportDialog.vue'
import Apis from '@/api/modules/caseManage'
import Apis2 from '@/api/modules/common'
import CaseStatistics from '@/constants/CaseStatistics' //统计数据
const dynamoSearchFormRef = ref()
const multipleTable = ref(null)
const temporaryLabel = ref()
const handleCaseDialog = ref()
const exportDialog = ref()
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0,
  CaseStatistics, //统计数据表头
  labelObjData: {}, //统计数据值
  selectData: [], //选中项
  handleparams: {}, //操作的参数
  exportData: {} //导出项参数
})
const operation = ref(1)
const operationList = reactive([
  {
    title: '关闭案件',
    icon: 'Close',
    code: 'CLOSE_CASE'
  },
  {
    title: '暂停案件',
    icon: 'VideoPause',
    code: 'SUSPEND_CASE'
  },
  {
    title: '恢复案件',
    icon: 'VideoPlay',
    code: 'REINSTATE_CASE'
  },
  {
    title: '添加临时标签',
    icon: 'CirclePlus',
    code: 'ADD_TEMPORARY_LABEL'
  },
  {
    title: '删除临时标签',
    icon: 'Delete',
    code: 'DELETE_TEMPORARY_LABEL'
  },
  {
    title: '导出案件',
    icon: 'Download',
    code: 'EXPORT_CASE'
  },
  {
    title: '导出处置记录',
    icon: 'Download',
    code: 'EXPORT_DISPOSE_RECORD'
  },
  {
    title: '生成结清证明',
    icon: 'Document',
    code: 'GENERAL_SETTLEMENT_CERTIFY'
  }
])
onMounted(() => {
  getTableData()
})
const getTableData = async () => {
  const params = {
    ...dynamoSearchFormRef.value.getParams(),
    ...query,
    queryType: 'MANAGEABLE' //案件查询类型：MANAGEABLE-可管理案件
  }
  const { data } = await Apis.caseList(params)
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
  //     orgTitle: '公司名称T79',
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
  //     lawsuitStatus: '内部已执行',
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
  //     orgTitle: '公司名称T79',
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
  //     lawsuitStatus: '内部已执行',
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
  const { data: data1 } = await Apis.caseListStats(params)
  state.labelObjData = { ...data1, pageTotal: state.total }
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
      case '关闭案件':
        handleCase(1)
        break
      case '暂停案件':
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
  temporaryLabel.value.open(type, getParams())
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
  await Apis.caseStatusUpdate(params)
  ElMessage.success('操作成功！')
  toggleSelection()
  getTableData()
}
// 0导出案件/1导出处置记录
const exportModel = async (code, type) => {
  const codes = type === 0 ? 'EXPORT_CASE_FIELD' : 'EXPORT_FOLLOW_FIELD'
  let params = {
    codes
  }
  const { data } = await Apis2.findSingleInfo(params)
  state.exportData = data[codes]
  exportDialog.value.open(state.exportData, type)
}
// 确认导出案件/导出处置记录
const submitExport = async (paramsSub, type) => {
  let params = getParams()
  Object.assign(params, paramsSub)
  //此处做判断是为了判断是否是委外库
  // 平台端原代码里的store就没传，暂不处理
  // if (this.store && params.operateType === 2) {
  //   params.caseSearchParam['storeId'] = this.store
  // }
  if (type === 0) {
    const { data } = await Apis.caseExport(params)
    data.isAsync === 0 ? exportDownload(data.data.fileUrl) : ElMessage.success('数据量较大请稍后')
  } else if (type === 1) {
    const { data } = await Apis.followExport(params)
    data.isAsync === 0 ? exportDownload(data.data.fileUrl) : ElMessage.success('数据量较大请稍后')
  }
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
// 生成结清证明
const certificate = async () => {
  ElMessageBox.confirm('是否确认本次操作?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    async () => {
      let params = getParams()
      await Apis.generateCertificate(params)
      ElMessage.success('操作成功！')
      getTableData()
      toggleSelection()
    },
    res => {
      ElMessage.info('已取消')
    }
  )
}
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
