<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive" @tab-click="changTab">
      <el-tab-pane v-for="item in state.tabList" :key="item.itemId" :label="item.itemText" :name="item.itemId"></el-tab-pane>
    </el-tabs>
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
          <div v-for="(item, index) in operationList" :key="index">
            <el-button
              v-if="
                item.isShow && (item.type === 1 || (item.type === 2 && tabActive === 1) || (item.type === 3 && tabActive !== 1))
              "
              type="primary"
              :icon="item.icon"
              @click="handleClick(item.title)"
              plain
              class="mr10"
            >
              {{ item.title }}
            </el-button>
          </div>
        </template>
      </OperationBar>
      <div class="mb10">
        <span>选中项：{{ state.selectData.length }}</span>
        <el-button link type="primary" size="large" @click="toggleSelection" class="ml20">取消</el-button>
      </div>
      <el-table
        :data="state.tableData"
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" fixed align="center" width="55" :reserve-selection="true"></el-table-column>
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
        <!-- 无 -->
        <el-table-column
          label="所属分库"
          prop="storeName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- 无 -->
        <el-table-column
          label="分库时间"
          prop="allotTime"
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
        <el-table-column label="案件状态" prop="distState" align="center" min-width="150" fixed="right">
          <template #default="scope">
            <span>{{ scope.row.distState === 0 ? '待分库' : '分库中' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddOrRemoveTagDialog ref="addOrRemoveTagDialog" @submitForm="submitForm" />
    <CaseBankDialog
      ref="caseBankDialog"
      :distInfo="state.distInfo"
      :sourceStoreId="tabActive"
      @get-table-data="getTableData"
      @toggleSelection="toggleSelection"
      :resouerdist-list="state.tabListSub"
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

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import AddOrRemoveTagDialog from './components/AddOrRemoveTagDialog.vue'
import CaseBankDialog from './components/CaseBankDialog.vue'
import CaseRecoveryDialog from './components/CaseRecoveryDialog.vue'
import { CirclePlus, Delete, Folder } from '@element-plus/icons-vue'
const multipleTable = ref(null)
const tabActive = ref(1)
const form: any = reactive({
  caseId: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
const addOrRemoveTagDialog = ref()
const caseBankDialog = ref()
const caseRecoveryDialog = ref()
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [] as any[],
  total: 0,
  labelData: {} as any, //标签数据
  selectData: [] as any[], //选中项
  handleparams: {} as any, //操作的参数
  tabList: [] as any[], //分库列表
  tabListSub: [] as any[], //剔除目标分库的分库列表
  distInfo: {} as any, //委案数据
  taskId: null //对选中数据操作的唯一标记id
})
const operation = ref(1)
const operationList = reactive([
  {
    title: '添加临时标签',
    icon: 'CirclePlus',
    isShow: true, //权限
    // isShow: this.hasPerm("disposal_case_addlabel"),
    type: 1
  },
  {
    title: '删除临时标签',
    icon: 'Delete',
    isShow: true,
    // isShow: this.hasPerm("disposal_case_dellabel"),
    type: 1
  },
  {
    title: '案件分库',
    icon: 'Folder',
    isShow: true,
    // isShow: this.hasPerm("disposal_case_qing"),
    type: 2
  },
  {
    title: '案件收回',
    icon: 'Folder',
    isShow: true,
    // isShow: this.hasPerm("disposal_case_qing"),
    type: 3
  }
])
onMounted(() => {
  getTableData()
  getTabList()
})
// 获取表格数据
const getTableData = async () => {
  // 请求得到数据
  const params = { ...form, ...query, storeId: tabActive.value }
  // const { data } = await xx(params) //表格
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
// 获取分库数据
const getTabList = () => {
  // 请求得到数据
  // const { data } = await xx(form)
  state.tabList = [
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
  state.tabListSub = state.tabList.slice(1) //去掉待分库配这个选项
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
//跨页选择
const getRowKeys = row => {
  return row.caseNo
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
  addOrRemoveTagDialog.value.open(type)
}
// 确认添加/删除临时标签
const submitForm = (tempTagName, type, isDeleteAllRelationTag) => {
  // 处理入参
  let params =
    operation.value === 1 ? Object.assign({}, state.handleparams) : { operateType: 2, caseSearchParam: Object.assign({}, form) }
  params.tempTagName = tempTagName
  if (type === 2) {
    params['isDeleteAllRelationTag'] = isDeleteAllRelationTag === true ? 1 : 0
  }
  console.log(params)
  // 请求得到数据
  // await xx(form)
  ElMessage.success('操作成功！')
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
const fetchCaseDistSelect = (type, isWithProductPublicDebt = true) => {
  // 处理入参
  let params =
    operation.value === 1 ? Object.assign({}, state.handleparams) : { operateType: 2, caseSearchParam: Object.assign({}, form) }
  params['storeId'] = tabActive.value //当前tab分库的id
  params.isWithProductPublicDebt = isWithProductPublicDebt
  if (type === 2) {
    params['recoverType'] = 1
  }
  console.log('委案数据参数：', params)
  // 请求得到数据
  // const { data } = await caseDistSelect(params)
  state.taskId = 1 //案件回收需要
  state.distInfo = {
    caseNum: 1,
    personNum: 1,
    taskId: 2313,
    totalAmount: 7266.75
  }
  const label = [
    {
      customizeIcon: 'caselist',
      eplusIcon: '',
      labelTitle: '选中案件数',
      isHaveRmbSign: false,
      value: null, //total
      key: 'caseNum'
    },
    {
      customizeIcon: 'caselist',
      eplusIcon: '',
      labelTitle: '选中案件人数',
      isHaveRmbSign: false,
      value: null,
      key: 'personNum'
    },
    {
      customizeIcon: 'caselist',
      eplusIcon: '',
      labelTitle: '预计分库金额',
      isHaveRmbSign: false,
      value: null,
      key: 'totalAmount'
    }
  ]
  label.forEach(item => {
    item.value = state.distInfo[item.key]
  })
  state.distInfo = label
}
// 切换分库
const changTab = val => {
  reset()
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
