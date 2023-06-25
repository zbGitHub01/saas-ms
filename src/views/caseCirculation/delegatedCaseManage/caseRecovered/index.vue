<script setup>
import { reactive, ref } from 'vue'
import moment from 'moment'
import Apis from '@/api/modules/caseRecovered'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'

const state = reactive({
  tableData: [],
  pageTotal: 10,
  page: 1,
  pageSize: 10,
  queryNewData: {},
  gridData: []
})

const getList = async (page, pageSize) => {
  const pageInfo = {
    ...state.queryNewData,
    recoverType: '2',
    page: page ? page : state.page,
    pageSize: pageSize ? pageSize : state.pageSize
  }
  const data = await Apis.getCaseRecoveredList(pageInfo)
  state.tableData = data.data.data
  state.pageTotal = data.total
}

//formClass实例
const formClass = ref()

//搜索操作
const handleSearch = () => {
  state.queryNewData = {
    ...formClass.value.getEntity(),
    recoverEndTime: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
  }
  getList()
}
//重置操作
const handleReset = () => {
  formClass.value.handleReset()
  state.queryNewData = {}
  getList()
}

const popoverTableVisible = ref(false)
const currPopover = ref(null)
//实际收回案量点击展示卡
const handleViewPopoverTable = async val => {
  const { recoverId } = val
  currPopover.value = val
  const data = await Apis.getCaseRecoveredInfo({ recoverId })
  state.gridData = data.data
  popoverTableVisible.value = true
}

//下载失败数据
const handleDownload = (index, row) => {
  let win = window.open(row.errorDataUrl)
  win.opener = null
  win.location = row.failData
  win.target = '_blank'
}

getList()
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
        :page="state.page"
        :page-size="state.pageSize"
        @query="getList"
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
      <div class="dialogForm">
        <el-row>
          <el-col :span="24">
            <span>处置机构</span>
            <span>{{ currPopover.orgName }}</span>
          </el-col>
        </el-row>
      </div>
      <el-table :data="state.gridData">
        <el-table-column width="180" property="productName" label="产品" />
        <el-table-column width="160" property="caseNum" label="实际收回案量" />
        <el-table-column width="160" property="userNum" label="实际收回户数" />
        <el-table-column width="160" property="recoverAmount" label="实际收回金额" />
        <el-table-column width="180" property="isRecoverStr" label="留案案件" />
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
