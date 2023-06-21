<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/caseRecord'
import { downArrayBufferFile } from '@/api/arrayBuffer'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'

const state = reactive({
  tableData: [],
  pageTotal: 10,
  page: 1,
  pageSize: 10,
  gridData: [], //实际委案量
  currViewRow: {}, // 当前点击查看的row
  queryNewData: {},
  currSelectArr: [],
  entrustRecordList: []
})

//获取列表数据
const getEntrustRecordList = async (page, pageSize) => {
  try {
    const pageInfo = {
      ...state.queryNewData,
      page: page ? page : state.page,
      pageSize: pageSize ? pageSize : state.pageSize
    }
    const { data } = await Apis.getList(pageInfo)
    state.tableData = data.data
    state.pageTotal = data.total
    state.page = data.page
    state.pageSize = data.pageSize
  } catch (error) {
    console.log(error)
  }
}

getEntrustRecordList()

//formClass实例
const formClass = ref()

//批量操作类型： operateType 1-选中 2-查询
const operationType = ref(1)

//搜索操作
const handleSearch = () => {
  state.queryNewData = formClass.value.getEntity()
  getEntrustRecordList()
}
//重置操作
const handleReset = () => {
  formClass.value.handleReset()
  state.queryNewData = {}
  getEntrustRecordList()
}

const dialogVisible = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedEntrustRecord = ref([])

//导出委案记录
const handleExport = async () => {
  if (state.currSelectArr.length < 1 && Number(operationType.value) === 1) {
    ElMessage({ message: '请选择操作对象.', type: 'warning' })
    return
  }
  let data = {}
  if (Number(operationType.value) === 1) {
    data['operateType'] = 1
    data['entrustNoList'] = state.currSelectArr.map(item => item.entrustNo)
  } else {
    data = { ...formClass.value.getEntity() }
    data['operateType'] = 2
  }
  try {
    //下载文件流
    downArrayBufferFile('/api/caseCenter/case/entrust/entrustRecordExport', data)
    ElMessage.success('导出成功')
    // state.entrustRecordList = data
    // console.log(state.entrustRecordList)
    // dialogVisible.value = true
  } catch (error) {
    console.log(error)
  }
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

const handleViewPopoverTable = async rowObj => {
  try {
    const data = await Apis.getEntrustAmount({ entrustId: rowObj?.entrustId })
    state.currViewRow = rowObj
    state.gridData = data.data
  } catch (error) {
    console.log(error)
  }
  popoverTableVisible.value = true
}

const handleDownload = (va, val) => {
  if (!val.errorDataUrl) return
  window.open(val.errorDataUrl)
  console.log(va, val)
}

//table多选操作
const selectChange = obj => {
  state.currSelectArr = obj
}
</script>

<template>
  <div class="card-wrap">
    <FormWrap @search="handleSearch" @reset="handleReset">
      <template #default>
        <FormClass ref="formClass" label-width="102px" :fields="queryList" />
      </template>
    </FormWrap>
    <div class="mt20">
      <OperationBar v-model:active="operationType">
        <template #default>
          <el-button type="primary" plain @click="handleExport">
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
        :page="state.page"
        :page-size="state.pageSize"
        @select-change="selectChange"
        @query="getEntrustRecordList"
        @popover-table="handleViewPopoverTable"
      >
        <template #operation>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <el-button
                v-if="scope.row.errorDataUrl"
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
    <el-dialog v-model="popoverTableVisible" title="实际委案量" width="40%">
      <div class="dialogForm">
        <el-row>
          <el-col :span="24">
            <span>委案批次</span>
            <span>{{ state.currViewRow.entrustNo }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span>委外分库</span>
            <span>{{ state.currViewRow.storeName }}</span>
          </el-col>
          <el-col :span="12">
            <span>处置机构</span>
            <span>{{ state.currViewRow.orgName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span>委案类型</span>
            <span>{{ state.currViewRow.entrustTypeName }}</span>
          </el-col>
        </el-row>
      </div>
      <el-table :data="state.gridData">
        <el-table-column width="200" property="productName" label="产品" />
        <el-table-column width="160" property="entrustCaseNum" label="委案量" />
        <el-table-column width="160" property="entrustActualUserNum" label="委案户数" />
        <el-table-column width="180" property="entrustActualAmount" label="委案金额" />
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
