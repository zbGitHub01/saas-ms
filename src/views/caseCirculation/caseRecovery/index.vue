<template>
  <div class="card-wrap">
    <FormWrap @search="getTableData" @reset="reset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="案件ID">
            <el-input v-model="form.caseId" placeholder="请输入案件ID" clearable></el-input>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <LabelData :labelData="state.labelData" />
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
        <el-table-column label="案件ID" prop="caseId" align="center" min-width="150" fixed="left" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="产品" prop="productName" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="姓名" prop="name" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="证件号" prop="caseNo" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="手机号" prop="phone" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="处置金额" prop="money1" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="还款入账金额" prop="money2" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="减免金额" prop="money3" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="剩余待还金额" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="临时标签" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="预警标签" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="入库批次号" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="债权方" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="所属分库" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="分库时间" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="处置机构" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="委案时间" prop="money4" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="委案金额" prop="picihao" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="CPE" prop="zhaiquanfang" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="分案时间" prop="shoutuofang" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="案件状态" prop="status" align="center" min-width="150" fixed="right"></el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <CaseRecoveryDialog ref="caseRecoveryDialog" :taskId="state.taskId" :caseInfo="state.caseInfo" @get-table-data="getTableData" @fetchRecoverNowSelect="fetchRecoverNowSelect"/>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import CaseRecoveryDialog from './components/CaseRecoveryDialog.vue'
const multipleTable = ref(null)
const form: any = reactive({
  caseId: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
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
  taskId: null,  //对选中数据操作的唯一标记id
  caseInfo: {} as any //委案数据
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
  console.log('案件收回', form)
  // 请求得到数据
  // const { code, data, msg } = await xx(form)
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
  const tableDataSub = [
    {
      caseId: 'WTD-SJD-0000002',
      productName: '“360”借条',
      name: '王亚瑞',
      caseNo: '450332198908202719',
      phone: '1234567',
      money1: 11,
      money2: 22,
      money3: 33,
      money4: 44,
      picihao: '万腾浩达资产-手机贷20190326',
      zhaiquanfang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      status: '正常'
    },
    {
      caseId: 'GJ-WLD-0132768',
      productName: '“360”借条',
      name: '王亚瑞',
      caseNo: '450332198908202719',
      phone: '1234567',
      money1: 11,
      money2: 22,
      money3: 33,
      money4: 44,
      picihao: '万腾浩达资产-手机贷20190326',
      zhaiquanfang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      status: '暂停 | 投诉'
    }
  ]
  state.tableData = tableDataSub
  query.page = 1
  state.total = 12
  state.labelData.money = 444
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
  fetchRecoverNowSelect()
  caseRecoveryDialog.value.open()
}
// 获取委案数据
const fetchRecoverNowSelect = (isWithProductPublicDebt = true) => {
  // 处理入参
  let params = (operation.value === 1?Object.assign({}, state.handleparams):{ operateType: 2, ...form })
  params['recoverType'] = 2
  params.storeId = 2
  params.isWithProductPublicDebt = isWithProductPublicDebt
  console.log('委案数据参数：', params)
  // 请求得到数据
  // const { code, data, msg } = await xx(params)
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
  // state.taskId = data.taskId
  // state.caseInfo = data
  state.taskId = 1
  state.caseInfo = {
    caseNum: 730330,
    personNum: 350085,
    taskId: 2210,
    totalAmount: 1815372575.82,
  }
}
</script>

<style lang="scss" scoped>
</style>
