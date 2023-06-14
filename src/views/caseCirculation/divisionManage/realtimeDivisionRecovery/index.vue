<script setup>
import { ref, reactive } from 'vue'
import Dialog from './component/dialog.vue'
import Apis from '@/api/modules/realtimeDivision'
import { ElMessage } from 'element-plus'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'
import labelList from './config/labelList.js'

const state = reactive({
  tableData: [],
  pageTotal: 4,
  labelData: {},
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

//获取CPE机构列表
const getOrgData = async () => {
  const data = await Apis.getOrgList()
  state.depData = data.data
}

getOrderListAgain()
getOrgData()

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
const dialogForm = ref(null)

state.tableData = [{ orderNo: 'test' }, { orderNo: '111' }, { orderNo: 'te222st' }, { orderNo: 't3333est' }]

const selectChange = obj => {
  state.currSelectArr = obj
}

//实时分案
const handleCase = () => {
  if (state.currSelectArr.length < 1) {
    ElMessage({ message: '请选择操作对象.', type: 'warning' })
    return
  }
  dialogVisible.value = true
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
    <LabelClass style="margin-top: -20px" :label-data="labelList" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <el-button type="primary" plain @click="handleCase">
            <svg-icon name="cloud-upload-fill" />
            &nbsp;实时收回
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
        @select-change="selectChange"
      />
    </div>
    <!--实时收回-->
    <Dialog ref="dialogForm" v-model:dialog-visible="dialogVisible" :label-data="state.labelData" />
  </div>
</template>

<style scoped lang="scss">
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
