<script setup>
import { ref, reactive } from 'vue'
import Dialog from './component/dialog.vue'
import Apis from '@/api/modules/realtimeDivisionRecovery'
import { ElMessage } from 'element-plus'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'
import labelList from './config/labelList.js'

const state = reactive({
  tableData: [],
  pageTotal: 10,
  page: 1,
  pageSize: 10,
  labelObjData: {},
  labelList,
  taskId: '',
  queryNewData: {},
  currSelectArr: [],
  labelDialogData: {}
})

//formClass实例
const formClass = ref()

//获取列表数据
const getRecoverList = async (page, pageSize) => {
  try {
    const pageInfo = {
      ...state.queryNewData,
      recoverType: 3,
      page: page ? page : state.page,
      pageSize: pageSize ? pageSize : state.pageSize
    }
    const { data } = await Apis.recoverRecordList(pageInfo)
    getLabelList()
    state.tableData = data.data
    state.pageTotal = data.total
    state.page = data.page
    state.pageSize = data.pageSize
  } catch (error) {
    console.log(error)
  }
}

//获取label显示数据
const getLabelList = async () => {
  const { data } = await Apis.getLabelStats({ ...formClass.value.getEntity(), recoverType: 3 })
  state.labelObjData = { ...data, pageTotal: state.pageTotal }
}

//获取CPE机构列表
// const getOrgData = async () => {
//   const data = await Apis.getOrgList()
//   state.depData = data.data
// }

getRecoverList()
// getOrgData()

//搜索操作
const handleSearch = () => {
  const queryData = formClass.value.getEntity()
  // getRecoverList()
  console.log('aa', queryData)
}
//重置操作
const handleReset = () => {
  formClass.value.handleReset()
  state.queryNewData = {}
  getRecoverList()
}

const dialogVisible = ref(false)
const dialogForm = ref(null)

const selectChange = obj => {
  state.currSelectArr = obj
}

//实时分案
const handleCase = async () => {
  if (state.currSelectArr.length < 1 && Number(operationType.value) === 1) {
    ElMessage({ message: '请选择操作对象.', type: 'warning' })
    return
  }
  state.caseIdList = state.currSelectArr.map(item => item.caseId)
  let dataParams = {}
  if (Number(operationType.value) === 1) {
    dataParams = {
      operateType: operationType.value,
      caseIdList: state.caseIdList,
      recoverType: 3
    }
  } else {
    dataParams = {
      ...formClass.value.getEntity(),
      operateType: operationType.value,
      recoverType: 3
    }
  }
  try {
    const { data } = await Apis.recoverNowSelect(dataParams)
    state.labelDialogData = data
    state.taskId = data.taskId
    dialogVisible.value = true
  } catch (error) {
    console.log(error)
  }
}

//收回保存发布
const handleSubmit = async obj => {
  let params = {}
  if (Number(operationType.value) === 1)
    params = {
      caseIdList: state.caseIdList,
      operateType: operationType.value,
      taskId: state.taskId,
      ...obj
    }
  else
    params = {
      caseIdList: state.caseIdList,
      operateType: operationType.value,
      taskId: state.taskId,
      ...formClass.value.getEntity(),
      ...obj
    }
  try {
    await Apis.recoverNowSave(params)
    ElMessage.success('操作成功')
    dialogVisible.value = false
    getRecoverList()
  } catch (error) {
    console.log(error)
  }
}

//批量操作类型： operateType 1-选中 2-查询
const operationType = ref(1)
</script>

<template>
  <div class="card-wrap">
    <FormWrap @search="handleSearch" @reset="handleReset">
      <template #default>
        <FormClass ref="formClass" label-width="102px" :fields="queryList" />
      </template>
    </FormWrap>
    <LabelClass style="margin-top: -20px" :label-obj="state.labelObjData" :label-data="state.labelList" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operationType">
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
        :page="state.page"
        :page-size="state.pageSize"
        :stripe="true"
        :is-selection="true"
        @query="getRecoverList"
        @select-change="selectChange"
      />
    </div>
    <!--实时收回-->
    <Dialog
      v-if="dialogVisible"
      ref="dialogForm"
      v-model:dialog-visible="dialogVisible"
      title="实时收回"
      :label-data="state.labelDialogData"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
