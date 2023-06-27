<script setup>
import { ref, reactive } from 'vue'
import Dialog from './component/dialog.vue'
import Apis from '@/api/modules/realtimeDivision'
import { ElMessage } from 'element-plus'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'
import labelList from './config/labelList.js'

// const tabActive = ref('1')

const state = reactive({
  tableData: [],
  pageTotal: 0,
  page: 1,
  pageSize: 10,
  cpeData: [],
  depData: [],
  labelData: {},
  caseIdList: [],
  queryNewData: {},
  labelList: labelList,
  currSelectArr: [],
  templateUrl: '', //指定分案模板url
  taskId: '',
  labelDialogData: {}
})

//获取列表数据
const getRecordList = async (page, pageSize) => {
  try {
    const pageInfo = {
      ...state.queryNewData,
      recoverType: 3,
      page: page ? page : state.page,
      pageSize: pageSize ? pageSize : state.pageSize
    }
    const { data } = await Apis.recordList(pageInfo)
    getLabelList({ ...state.queryNewData, recoverType: 3 })
    state.tableData = data.data
    state.pageTotal = data.total
    state.page = data.page
    state.pageSize = data.pageSize
  } catch (error) {
    console.log(error)
  }
}

//获取label显示数据
const getLabelList = async datas => {
  const { data } = await Apis.getLabelStats(datas)
  state.labelData = { ...data, pageTotal: state.pageTotal }
  state.labelList.forEach(item => {
    if (state.pageTotal === 0) {
      if (item['labelTitle'] === '待分派案件数量') item['value'] = state.labelData['caseNum']
      if (item['labelTitle'] === '待分派案人数') item['value'] = state.labelData['personNum']
      if (item['labelTitle'] === '待分派金额') item['value'] = state.labelData['totalAmount']
    } else {
      if (item['labelTitle'] === '待分派案件数量') item['value'] = state.pageTotal
      if (item['labelTitle'] === '待分派案人数') item['value'] = state.labelData['caseUserCount']
      if (item['labelTitle'] === '待分派金额') item['value'] = state.labelData['sumResidueAmount']
    }
  })
}

//获取CPE机构列表
const getDepList = async () => {
  const { data } = await Apis.getUserTreeList({ codes: 'DEPT_TREE' })
  state.depData = data.DEPT_TREE
}
//获取员工不分页
const getUserList = async deptId => {
  const data = await Apis.getUserList({ deptId })
  state.cpeData = data.data
}

getRecordList()
getDepList()

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
  getRecordList()
}
//重置操作
const handleReset = () => {
  formClass.value.handleReset()
  state.queryNewData = {}
  getRecordList()
}

const caseUploadVisible = ref(false)
const dialogVisible = ref(false)
const dialogForm = ref(null)

const selectChange = obj => {
  state.currSelectArr = obj
}

//获取选取CPE相关信息
const caseAllotNext = async value => {
  const params = {
    cpeIdList: value,
    taskId: state.taskId
  }
  try {
    const { data } = await Apis.caseAllotNext(params)
    data.allotInfo = JSON.parse(data.allotInfo)
    state.labelDialogData = data
    dialogForm.value.setLast(true)
  } catch (error) {
    console.log(error)
  }
}

//调值
const caseAllotAdjust = async obj => {
  let params = {
    allotInfo: JSON.stringify(obj),
    taskId: state.taskId,
    adjustType: dialogForm.value.state.active
  }
  await Apis.caseAllotAdjust(params)
  obj.allotInfo = JSON.parse(obj.allotInfo)
  state.labelDialogData = obj
  dialogForm.value.setLast(true)
}

//重新分配
const caseAllotRefresh = async val => {
  let params = {
    adjustType: val,
    taskId: state.taskId
  }
  const { data } = await Apis.caseAllotRefresh(params)
  data.allotInfo = JSON.parse(data.allotInfo)
  state.labelDialogData = data
  dialogForm.value.setLast(true)
}

//实时分案保存
const caseAllotSave = async val => {
  let params = {
    allotInfo: JSON.stringify(val.allotInfo),
    taskId: state.taskId
  }
  await Apis.caseAllotSave(params)

  ElMessage.success('保存成功')
  dialogVisible.value = false
  getRecordList()
  // getDepList()
}

//导入分案
const handleUpload = async () => {
  const { data } = await Apis.getTemplateUrl()
  state.templateUrl = data.customAllotTemplateUrl
  caseUploadVisible.value = true
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
      caseIdList: state.caseIdList
    }
  } else {
    dataParams = {
      ...formClass.value.getEntity(),
      operateType: operationType.value
    }
  }
  try {
    const { data } = await Apis.caseAllotSelect(dataParams)
    state.taskId = data.taskId
    state.labelDialogData = data
    dialogVisible.value = true
  } catch (error) {
    console.log(error)
  }
}

//导入分案模板
const handleHttpRequest = async options => {
  const formData = new FormData()
  formData.append('file', options.file)
  try {
    await Apis.caseImportAllot(formData)
  } catch (error) {
    console.log(error)
  }
}

//下载导入分案模板
const downloadUrl = () => {
  window.open(state?.templateUrl)
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
    <LabelClass style="margin-top: -20px" :label-data="state.labelList" />
    <div class="spacing"></div>
    <div class="mt20">
      <OperationBar v-model:active="operationType">
        <template #default>
          <el-button type="primary" plain @click="handleCase">
            <svg-icon name="cloud-upload-fill" />
            &nbsp;实时分案
          </el-button>
          <el-button type="primary" icon="CircleCloseFilled" @click="handleUpload">导入分案</el-button>
        </template>
      </OperationBar>
      <TableClass
        :table-data="state.tableData"
        :column-list="tableColumnList"
        :total="state.pageTotal"
        :stripe="true"
        :is-selection="true"
        @query="getRecordList"
        @select-change="selectChange"
      >
        <template #customColumn="{ row }">
          <div>
            <status :row="row" />
          </div>
        </template>
      </TableClass>
    </div>
    <!--导入分案-->
    <el-dialog v-model="caseUploadVisible" title="导入分案" width="30%" :before-close="handleClose">
      <div style="display: -webkit-flex">
        <div style="padding-top: 5px">上传文件：</div>
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :http-request="handleHttpRequest"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :limit="1"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传excel文件</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" style="float: left" link @click="downloadUrl">下载导入分案模板</el-button>
          <el-button @click="caseUploadVisible = false">取消</el-button>
          <el-button type="primary" @click="caseUploadVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--案件分派-->
    <Dialog
      v-if="dialogVisible"
      ref="dialogForm"
      v-model:dialog-visible="dialogVisible"
      :dep-data="state.depData"
      :cpe-data="state.cpeData"
      :label-data="state.labelDialogData"
      @get-user-list="getUserList"
      @case-allot-save="caseAllotSave"
      @case-allot-next="caseAllotNext"
      @case-allot-adjust="caseAllotAdjust"
      @case-allot-refresh="caseAllotRefresh"
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
