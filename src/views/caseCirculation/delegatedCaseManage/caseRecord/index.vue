<script setup>
import { ref, reactive } from 'vue'
import Apis from '@/api/modules/caseRecord'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'

const state = reactive({
  tableData: [],
  pageTotal: 4,
  queryNewData: {},
  entrustRecordList: []
})

//获取列表数据
const getOrderListAgain = async (pageSize, pageNum) => {
  const pageInfo = {
    ...state.queryNewData,
    pageNum: pageNum ? pageNum : 1,
    pageSize: pageSize ? pageSize : 10
  }
  const data = await Apis.getList(pageInfo)
  state.tableData = data.data
  state.pageTotal = data.total
}

getOrderListAgain()

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

const dialogVisible = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedEntrustRecord = ref([])

//导出委案记录
const handleExport = async () => {
  const { data } = await Apis.getExportList()
  state.entrustRecordList = data
  console.log(state.entrustRecordList)
  dialogVisible.value = true
}

const handleCheckAllChange = val => {
  checkedEntrustRecord.value = val ? state.entrustRecordList : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = value => {
  const checkedCount = value.length
  checkAll.value = checkedCount === state.entrustRecordList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < state.entrustRecordList.length
}

const popoverTableVisible = ref(false)
const handleViewPopoverTable = value => {
  popoverTableVisible.value = true
  console.log(value)
}

const handleDel = (va, val) => {
  console.log(va, val)
}
const operation = ref(1)

const selectChange = val => {
  console.log(val)
}

const gridData = [
  {
    date: '2016-05-02',
    name: 'Jack',
    address: 'New York City'
  },
  {
    date: '2016-05-04',
    name: 'Jack',
    address: 'New York City'
  },
  {
    date: '2016-05-01',
    name: 'Jack',
    address: 'New York City'
  },
  {
    date: '2016-05-03',
    name: 'Jack',
    address: 'New York City'
  }
]
</script>

<template>
  <div class="card-wrap">
    <FormWrap @search="handleSearch" @reset="handleReset">
      <template #default>
        <FormClass ref="formClass" label-width="102px" :fields="queryList" />
      </template>
    </FormWrap>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <el-button type="primary" @click="handleExport">
            <svg-icon name="cloud-upload-fill" />
            &nbsp;导出委案记录
          </el-button>
        </template>
      </OperationBar>
      <TableClass
        :table-data="state.tableData"
        :column-list="tableColumnList"
        :total="state.pageTotal"
        :is-order-number="true"
        :stripe="true"
        :is-selection="true"
        @select-change="selectChange"
        @query="getOrderListAgain"
        @popover-table="handleViewPopoverTable"
      >
        <template #operation>
          <el-table-column fixed="right" align="center" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" link @click="handleDel(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </TableClass>
    </div>
    <!--实际委案量查看-->
    <el-dialog v-model="popoverTableVisible" title="实际委案量" width="40%">
      <div class="dialogForm">
        <el-row>
          <el-col :span="24">
            <span>委案批次</span>
            <span>20230427_666_10203</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span>委外分库</span>
            <span>委外处置库</span>
          </el-col>
          <el-col :span="12">
            <span>处置机构</span>
            <span>江西正众企业管理有限公司</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span>委案类型</span>
            <span>激励案件23-内部-28（2023年4月）</span>
          </el-col>
        </el-row>
      </div>
      <el-table :data="gridData">
        <el-table-column width="200" property="date" label="产品" />
        <el-table-column width="160" property="name" label="委案量" />
        <el-table-column width="160" property="address" label="委案户数" />
        <el-table-column width="180" property="address" label="委案金额" />
      </el-table>
    </el-dialog>
    <!--委案记录导出-->
    <el-dialog v-model="dialogVisible" title="导出委案记录" width="30%">
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedEntrustRecord" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="item in state.entrustRecordList" :key="item" :label="item">{{ item }}</el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确认</el-button>
        </span>
      </template>
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
