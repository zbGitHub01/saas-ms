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

const getOrderListAgain = (pageSize, pageNum) => {
  const pageInfo = {
    ...state.queryNewData,
    pageNum,
    pageSize
  }
  console.log(pageInfo)
  // getOrderList(pageInfo).then(res => {
  //   state.tableData = res.data.records
  //   state.pageTotal = res.data.total
  // })
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

// const total = ref(0)
// const page = ref(1)
// const pageSize = ref(10)
// state.tableData = Array(10).fill({ orderNo: 'test' })
state.tableData = [{ orderNo: 'test' }, { orderNo: '111' }, { orderNo: 'te222st' }, { orderNo: 't3333est' }]

const dialogVisible = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedEntrustRecord = ref([])

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

const handleDel = (va, val) => {
  console.log(va, val)
}
const operation = ref(1)
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
        :stripe="true"
        :is-selection="true"
        @query="getOrderListAgain"
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

<style scoped lang="scss"></style>
