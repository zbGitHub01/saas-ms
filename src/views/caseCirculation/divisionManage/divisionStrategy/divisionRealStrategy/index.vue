<script setup>
import { reactive, ref, computed } from 'vue'
import { useGlobalStore } from '@/store'
import { ElMessage } from 'element-plus'
import Apis, { strategyImport } from '@/api/modules/realtimeDivision'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'
import { downArrayBufferFile } from '@/api/arrayBuffer'
// import BatchModifyDialog from './component/BatchModifyDialog.vue'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'

const globalState = useGlobalStore()

const formFieldsList = [
  {
    type: 'upload',
    label: '分案文件',
    prop: 'excelDTOList',
    limit: 1,
    headers: { Authorization: globalState.token },
    accept: '.xls,.xlsx,.csv',
    // uploadTips: 'jpg/png files with a size less than 500KB.',
    action: import.meta.env.VITE_BASE_URL + 'upms/client/sys-file/upload'
  }
]

const state = reactive({
  tableData: [],
  currOrgInfo: {},
  queryNewData: {},
  orgName: '',
  sumAllotAmount: 0, //分案金额合计
  progressData: [0, 0],
  fileList: [] //上传的文件
})

//formClass实例
const formClass = ref()
const dialogFormVisible = ref(false)
// const visible = ref(false)
const tabStore = useTabsStore()
const router = useRouter()
const route = useRoute()
state.orgName = route?.query?.orgName

const getDetail = async params => {
  try {
    const dataObj = params ? { ...params } : {}
    dataObj['orgId'] = route?.query?.orgId
    const { data } = await Apis.getDetailInfo(dataObj)
    state.currOrgInfo = data
    //假数据
    state.tableData = [
      {
        allotAmount: 1600000, //分案金额
        cpeId: 11, //CPE ID
        cpeLevel: 'A', //CPE分案等级
        cpeName: '栾合金', // CPE 姓名
        curCpeCaseAmount: 4800000, //当前CPE已经分派金额 持案概况 / 前面的值
        curMonthRepayRate: 0,
        defaultAllotAmount: 3333333,
        isSubtract: 0,
        lastMonthRepayRate: 0.671, // 上月回款率
        referAmount: 8500000 //参考金额。持案概况 / 后面的值
      },
      {
        allotAmount: 500000, //分案金额
        cpeId: 13, //CPE ID
        cpeLevel: 'C', //CPE分案等级
        cpeName: '周志全', // CPE 姓名
        curCpeCaseAmount: 4800000, //当前CPE已经分派金额 持案概况 / 前面的值
        curMonthRepayRate: 0,
        defaultAllotAmount: 111111111,
        isSubtract: 0,
        lastMonthRepayRate: 0.671, // 上月回款率
        referAmount: 3500000 //参考金额。持案概况 / 后面的值
      }
    ]
    // state.tableData = data.allotInfoList
  } catch (error) {
    console.log(error)
  }
}
getDetail()

//上传文件保存
const fileListSave = file => {
  state.fileList = file
}

//搜索操作
const handleSearch = () => {
  state.queryNewData = formClass.value.getEntity()
  getDetail(state.queryNewData)
}
//重置操作
const handleReset = () => {
  formClass.value.handleReset()
  state.queryNewData = {}
  getDetail()
}

//清空操作
const handleClear = () => {
  if (state.tableData.length < 1) return
  state.tableData.forEach(item => (item.allotAmount = 0))
}

//合计方法
const summaryMethod = param => {
  const { columns, data } = param
  if (columns.length < 1) return
  let sum = 0
  data.map(item => (sum += item.allotAmount))
  state.sumAllotAmount = sum
  //添加未分派金额（无法解析jsx语法）
  const tbodyElement = document
    .getElementsByClassName('el-table__footer-wrapper')[0]
    .getElementsByClassName('el-table__footer')[0]
    .getElementsByTagName('tbody')[0]
  const sumElement = tbodyElement.getElementsByTagName('tr')[0]
  const clonedNode = sumElement.cloneNode(true)
  //只有取到克隆合计节点 且未分派金额值存在 且克隆的父节点只有一个合计节点元素
  if (clonedNode.childNodes.length > 0 && !!unassignedAmount.value && tbodyElement.childNodes.length < 2) {
    clonedNode.getElementsByTagName('td')[4].getElementsByTagName('div')[0].innerHTML = '未分派金额'
    clonedNode.getElementsByTagName('td')[5].getElementsByTagName('div')[0].innerHTML = unassignedAmount.value
    document
      .getElementsByClassName('el-table__footer-wrapper')[0]
      .getElementsByClassName('el-table__footer')[0]
      .getElementsByTagName('tbody')[0]
      .appendChild(clonedNode)
  }
  //更改未分派金额（当未分派金额节点插入后才更新）
  if (tbodyElement.getElementsByTagName('tr').length > 1)
    tbodyElement.getElementsByTagName('tr')[1].getElementsByTagName('td')[5].getElementsByTagName('div')[0].innerHTML =
      unassignedAmount.value

  return ['', '', '', '', '合计', sum]
}

//计算未分派金额合计
const unassignedAmount = computed(() => {
  return state.currOrgInfo.unAllotAmount - state.sumAllotAmount
})

//返回后退按钮
const handleBack = () => {
  tabStore.removeTabs('/caseCirculation/divisionManage/divisionStrategy/divisionRealStrategy')
  router.replace({ name: 'divisionStrategy' })
}

//计算table持案概况百分比
const computedRate = (numerator, denominator) => {
  return (numerator / denominator).toFixed(4) * 100
}

//导入分案策略
const handleImport = () => {
  dialogFormVisible.value = true
}

//下载CPE分案等级表
const handleDownload = async () => {
  const data = {
    orgId: route?.query?.orgId,
    ...formClass.value.getEntity()
  }
  //下载文件流
  downArrayBufferFile('post', '/api/caseCenter/case/allot/strategy/export', data)
}

//自动分配金额
const handleAutomatic = () => {
  if (state.tableData.length < 1) return
  state.tableData.forEach(item => (item.allotAmount = item.defaultAllotAmount))
}

//执行分案
const handleExecute = async () => {
  const data = {
    ...formClass.value.getEntity(),
    allotList: state.tableData,
    orgId: route?.query?.orgId
  }
  try {
    await Apis.strategyExecute(data)
    ElMessage.success('操作成功')
  } catch (error) {
    console.log(error)
  }
}

//批量修改
// const handleBatchModify = () => {
//   visible.value = true
// }

//自定义上传
const handleHttpRequest = async options => {
  const formData = new FormData()
  formData.append('file', options.file)
  try {
    await strategyImport(route?.query?.orgId, formData)
  } catch (error) {
    console.log(error)
  }
}

// eslint-disable-next-line no-unused-vars
const handleSubmit = async (data, form1) => {
  form1.resetFields()
  dialogFormVisible.value = false
}

const handleClose = () => {
  dialogFormVisible.value = false
}
</script>

<template>
  <div class="card-wrap">
    <div class="table_head">
      <div>
        <el-icon :size="30" @click="handleBack"><ArrowLeft /></el-icon>
        <span>{{ state.orgName }}</span>
      </div>
    </div>
    <div class="spacing"></div>
    <div style="margin-top: 20px">
      <FormWrap :query-list="queryList" @search="handleSearch" @reset="handleReset">
        <template #default>
          <FormClass ref="formClass" label-width="102px" :fields="queryList" />
        </template>
      </FormWrap>
    </div>
    <!--label-->
    <div class="activity_wrap">
      <div class="text_wrap">
        <div>产品金额</div>
        <div>
          <div>
            <span>已分派</span>
            <span class="num">{{ state.currOrgInfo.existAllotAmount }}</span>
          </div>
          <div>
            <span>未分派</span>
            <span class="num">{{ state.currOrgInfo.unAllotAmount }}</span>
          </div>
        </div>
      </div>
      <div class="text_wrap">
        <div>产品户数</div>
        <div>
          <div>
            <span>已分派</span>
            <span class="num">{{ state.currOrgInfo.existAllotUserNum }}</span>
          </div>
          <div>
            <span>未分派</span>
            <span class="num">{{ state.currOrgInfo.unAllotUserNum }}</span>
          </div>
        </div>
      </div>
      <div class="text_wrap time">
        <div>当前分案进程</div>
        <div class="progress">
          <span v-if="progress === null">当前未执行分案</span>

          <div v-else>
            <div style="text-align: right">
              <span>{{ state.progressData[0] }}</span>
              /
              <span>{{ state.progressData[1] }}</span>
            </div>
            <el-progress :show-text="false" :stroke-width="15" style="width: 100%" :percentage="parseInt(progress)"></el-progress>
          </div>
        </div>
      </div>
    </div>
    <!--table-->
    <div class="spacing"></div>
    <div class="body_style">
      <OperationBar>
        <template #tool>
          <el-button type="primary" plain @click="handleClear">清空设置</el-button>
          <el-button type="primary" plain @click="handleAutomatic">自动分配金额</el-button>
          <el-button type="primary" plain @click="handleDownload">下载CPE分案等级表</el-button>
          <el-button type="primary" @click="handleImport">导入分案策略</el-button>
          <!-- <el-button type="primary" @click="handleBatchModify">批量修改</el-button> -->
          <el-button type="danger" @click="handleExecute">执行分案</el-button>
        </template>
      </OperationBar>
      <TableClass
        :table-data="state.tableData"
        :column-list="tableColumnList"
        :pagination="false"
        :show-summary="true"
        :summary-method="summaryMethod"
        @edit-save="handleEditSave"
        @change-status="handleChange"
      >
        <template #customColumn="{ row }">
          <div>
            <div :style="computedRate(row.curCpeCaseAmount, row.referAmount) > 100 ? 'color:red' : null">
              {{ row.curCpeCaseAmount + `&nbsp;/&nbsp;` + row.referAmount }}
            </div>
            <div>({{ computedRate(row.curCpeCaseAmount, row.referAmount) }}%)</div>
          </div>
        </template>
      </TableClass>
    </div>
    <!--导入分案策略-->
    <DialogForm
      v-model:dialogFormVisible="dialogFormVisible"
      title="导入分案策略"
      width="30%"
      :form-fields="formFieldsList"
      :http-request="handleHttpRequest"
      @file-list="fileListSave"
      @submit="handleSubmit"
      @close="handleClose"
    />
    <!--批量修改弹窗-->
    <!-- <BatchModifyDialog v-model:visible="visible" /> -->
  </div>
</template>

<style scoped lang="scss">
.table_head {
  width: 100%;
  height: 50px;
  div {
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      font-weight: bold;
    }
    svg {
      cursor: pointer;
    }
  }
}
.activity_wrap {
  width: 100%;
  margin-top: -20px;
  background: #f5f7fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 6%);
  .text_wrap {
    width: 30%;
    padding: 20px 0;
    height: 120px;
    background: #fff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-weight: bold;
    font-size: 16px;
    > div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      > div {
        display: flex;
        // flex-direction: column;
        width: 50%;
        .num {
          margin-top: -2px;
          margin-left: 10px;
          color: #4d7cfe;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    &:not(:first-child) {
      margin-left: 20px;
      padding-left: 20px;
    }
  }
  .time {
    width: 40%;
    > div {
      > div {
        width: 100%;
      }
    }
    .progress {
      justify-content: center;
      align-items: center;
      flex: 1;
      color: #999999;
      font-weight: 400;
    }
  }
}
.body_style {
  padding-top: 20px;
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
