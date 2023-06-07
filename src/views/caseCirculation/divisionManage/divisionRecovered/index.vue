<script setup>
import { reactive, ref, onBeforeMount, onMounted } from 'vue'
import Apis from '@/api/modules/divisionRecovered'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'

const state = reactive({
  tableData: [],
  pageTotal: 0,
  queryNewData: {},
  gridData: []
})

const getOrderListAgain = async (pageSize, pageNum) => {
  const pageInfo = {
    ...state.queryNewData,
    pageNum: pageNum ? pageNum : 1,
    pageSize: pageSize ? pageSize : 10
  }
  const data = await Apis.getDivisionRecoveredList(pageInfo)
  state.tableData = data.data
  state.pageTotal = data.total
}

//formClass实例
const formClass = ref()

//搜索操作
const handleSearch = () => {
  const queryData = formClass.value.getEntity()
  state.queryNewData = Object.keys(queryData).includes('dateArray')
    ? {
        ...queryData,
        submitStartDate: queryData.dateArray[0],
        submitEndDate: queryData.dateArray[1]
      }
    : queryData
  delete state.queryNewData.dateArray
  getOrderListAgain()
  console.log('aa', queryData)
}
//重置操作
const handleReset = () => {
  formClass.value.handleReset()
  state.queryNewData = {}
  getOrderListAgain()
}

const popoverTableVisible = ref(false)
const currPopover = ref(null)
//实际收回案量点击展示卡
const handleViewPopoverTable = async val => {
  currPopover.value = val
  const data = await Apis.getDivisionRecoveredInfo()
  state.gridData = data.data
  popoverTableVisible.value = true
  console.log(state.gridData)
}

//下载失败数据
const handleDownload = (index, row) => {
  let win = window.open()
  win.opener = null
  win.location = row.failData
  win.target = '_blank'
}

getOrderListAgain()

onBeforeMount(() => {})
onMounted(() => {})
</script>

<template>
  <div class="card-wrap">
    <FormWrap @search="handleSearch" @reset="handleReset">
      <template #default>
        <FormClass ref="formClass" label-width="102px" :fields="queryList" />
      </template>
    </FormWrap>
    <div class="mt20">
      <TableClass
        :table-data="state.tableData"
        :column-list="tableColumnList"
        :total="state.pageTotal"
        @query="getOrderListAgain"
        @popover-table="handleViewPopoverTable"
      >
        <template #operation>
          <el-table-column align="center" fixed="right" label="失败数据" width="100">
            <template #default="scope">
              <el-button
                v-if="!!scope.row.failData"
                type="primary"
                size="small"
                link
                @click="handleDownload(scope.$index, scope.row)"
              >
                下载
              </el-button>
            </template>
          </el-table-column>
        </template>
      </TableClass>
    </div>
    <!--实际委案量查看-->
    <el-dialog v-model="popoverTableVisible" title="实际收回量" width="45%">
      <el-table :data="state.gridData">
        <el-table-column width="180" property="CPE" label="CPE" />
        <el-table-column width="180" property="productName" label="产品" />
        <el-table-column width="160" property="recoverNum" label="实际收回案量" />
        <el-table-column width="160" property="recoverNumber" label="实际收回户数" />
        <el-table-column width="160" property="recoverAmount" label="实际收回金额" />
      </el-table>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.dialogForm {
  .el-row {
    margin-bottom: 10px;
    .el-col > span:nth-child(1) {
      margin-right: 10px;
      font-weight: bold;
    }
  }
}
</style>
