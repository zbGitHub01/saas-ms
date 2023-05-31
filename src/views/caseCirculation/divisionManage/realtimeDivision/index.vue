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
  pageTotal: 4,
  depData: [],
  cpeData: [],
  labelData: {},
  queryNewData: {},
  currSelectArr: []
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
//获取员工不分页
const getUserList = async () => {
  const data = await Apis.getUserList()
  console.log(1111)
  state.cpeData = data.data
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

const caseUploadVisible = ref(false)
const dialogVisible = ref(false)
const dialogForm = ref(null)

state.tableData = [{ orderNo: 'test' }, { orderNo: '111' }, { orderNo: 'te222st' }, { orderNo: 't3333est' }]

const selectChange = obj => {
  state.currSelectArr = obj
}

//获取选取CPE相关信息
const caseAllotNext = async value => {
  const data = await Apis.caseAllotInfo()
  state.labelData = Object.assign({}, data.data)
  dialogForm.value.setLast(true)
  console.log(value)
}

//实时分案保存
const caseAllotSave = val => {
  console.log(val)
  dialogVisible.value = false
}

//导入分案
const handleUpload = () => {
  caseUploadVisible.value = true
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
        @query="getOrderListAgain"
        @select-change="selectChange"
      />
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
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :limit="1"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" style="float: left" link>下载导入分案模板</el-button>
          <el-button @click="caseUploadVisible = false">取消</el-button>
          <el-button type="primary" @click="caseUploadVisible = false">确认分案</el-button>
        </span>
      </template>
    </el-dialog>
    <!--案件分派-->
    <Dialog
      ref="dialogForm"
      v-model:dialog-visible="dialogVisible"
      :dep-data="state.depData"
      :cpe-data="state.cpeData"
      :label-data="state.labelData"
      @get-user-list="getUserList"
      @case-allot-save="caseAllotSave"
      @case-allot-next="caseAllotNext"
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
