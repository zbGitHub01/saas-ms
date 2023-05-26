<script setup>
import { ref, reactive } from 'vue'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'
import labelList from './config/labelList.js'

// const tabActive = ref('1')

const state = reactive({
  tableData: [],
  pageTotal: 4,
  queryNewData: {}
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

const handleEdit = (va, val) => {
  console.log(va, val)
}
const handleDel = (va, val) => {
  console.log(va, val)
}
const operation = ref(1)
</script>

<template>
  <div class="card-wrap">
    <div>
      <FormWrap @search="handleSearch" @reset="handleReset">
        <template #default>
          <FormClass ref="formClass" label-width="102px" :fields="queryList" />
        </template>
      </FormWrap>
    </div>
    <LabelClass style="margin-top: -20px" :label-data="labelList" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <el-button type="primary" plain>
            <svg-icon name="cloud-upload-fill" />
            &nbsp;导出账单
          </el-button>
          <el-button type="primary" icon="CircleCloseFilled" plain>撤销账单</el-button>
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
              <el-button type="danger" size="small" link @click="handleEdit(scope.$index, scope.row)">撤销账单</el-button>
              <el-button type="primary" size="small" link @click="handleDel(scope.$index, scope.row)">更新账单</el-button>
            </template>
          </el-table-column>
        </template>
      </TableClass>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
