<template>
  <div class="card-wrap">
    <FormWrap @search="getTableData" @reset="reset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="上传批次号" prop="batchId">
            <el-input v-model="form.batchId" placeholder="请输入上传批次号" clearable></el-input>
          </el-form-item>
          <el-form-item label="上传时间" prop="date">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              format="MM-DD"
              @change="changeDate"
            />
          </el-form-item>
          <el-form-item label="上传人" prop="operUserId">
            <el-select v-model="form.operUserId" placeholder="请选择上传人" filterable clearable>
              <el-option
                v-for="item in selectData.peopleList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <div v-for="(item, index) in operationList" :key="index" class="mr10">
            <el-button v-if="item.isShow" type="primary" :icon="item.icon" @click="handleClick(item)" :plain="!item.notCheck">
              {{ item.title }}
            </el-button>
          </div>
        </template>
      </OperationBar>
      <!-- <div class="mb10">
        <span>选中项：{{ state.selectedData.length }}</span>
        <el-button link type="primary" size="large" @click="toggleSelection" class="ml20">取消</el-button>
      </div> -->
      <el-table
        :data="state.tableData"
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" fixed align="center" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column
          label="回款登记批次号"
          prop="batchNO"
          align="center"
          min-width="150"
          fixed="left"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <el-button link type="primary" @click="goToDetail(scope.row)">{{ scope.row.batchNO }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="上传时间"
          prop="allotTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="回款登记笔数"
          prop="entrustAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="回款总金额"
          prop="entrustAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="回款总案件数"
          prop="entrustAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="不予受理"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="上传机构"
          prop="creditorName"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="上传人"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="导入成功数"
          prop="entrustAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="downloadFailureRecord(scope.row)" :disabled="scope.row.disabled">
              下载失败记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <UploadCollectionDialog ref="uploadCollectionDialog" @get-table-data="getTableData" />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import UploadCollectionDialog from './components/UploadCollectionDialog.vue'
import { useRouter } from 'vue-router'
const multipleTable = ref()
const form = reactive({
  batchId: '',
  startTime: null,
  endTime: null,
  operUserId: null
})
const originFormData = JSON.parse(JSON.stringify(form))
const date = ref()
const router = useRouter()
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0,
  selectedData: [], //选中项
  handleparams: {} //操作的参数
})
const selectData = reactive({
  peopleList: [] //人员列表
})
const operation = ref(1)
const uploadCollectionDialog = ref()
const operationList = reactive([
  {
    title: '上传回款登记表',
    icon: 'Folder',
    isShow: true,
    // isShow: this.hasPerm("disposal_case_close"),
    notCheck: true
  },
  {
    title: '下载回款登记表模板',
    icon: 'Folder',
    isShow: true,
    // isShow: this.hasPerm("disposal_case_close"),
    notCheck: true
  },
  {
    title: '导出',
    icon: 'Folder',
    isShow: true
    // isShow: this.hasPerm("disposal_case_close"),
  }
])
onMounted(() => {
  getTableData()
  getSelecData()
})
const getTableData = async () => {
  // 请求得到数据
  const params = { ...form, ...query }
  console.log('搜索', params)
  // const { data } = await xx(params) //表格
  // const { data } = await xx(params) //label
  state.tableData = [
    {
      allotTime: '2022-12-02 09:50:43',
      batchNO: 'BE-BQ-0001002',
      creditorName: '测试债权方2',
      entrustAmount: 0,
      userName: '马海山',
      disabled: true
    },
    {
      allotTime: '2022-12-02 09:50:43',
      batchNO: 'BE-BQ-0001001',
      creditorName: '测试债权方1',
      entrustAmount: 0,
      userName: '马海山'
    }
  ]
  query.page = 1
  state.total = 12
}
const getSelecData = async () => {
  // 请求得到数据
  // const { data } = await xx(params)
  selectData.peopleList = [
    {
      userId: 1,
      username: '里斯'
    },
    {
      userId: 2,
      username: '啊三'
    }
  ]
}
// 重置
const reset = () => {
  console.log('重置')
  date.value = []
  Object.assign(form, originFormData)
  getTableData()
}
const changeDate = val => {
  console.log(val)
  if (val) {
    form.startTime = val[0]
    form.endTime = val[0]
  } else {
    form.startTime = null
    form.endTime = null
  }
}
//表格选择
const handleSelectionChange = val => {
  let arr = []
  val.map(item => {
    arr.push(item.caseId)
  })
  state.selectedData = arr
  operation.value = 1
  state.handleparams = {
    caseIdList: state.selectedData,
    operateType: 1
  }
  console.log(state.selectedData, state.handleparams, operation.value)
}
//取消选择
const toggleSelection = () => {
  state.selectedData = []
  multipleTable.value.clearSelection()
  console.log(state.selectedData)
}
//跨页选择
const getRowKeys = row => {
  return row.batchNO
}
//通过此函数整体过滤事件
const handleClick = item => {
  if (state.selectedData.length === 0 && operation.value === 1 && !item.notCheck) {
    ElMessage.warning('请先选择操作对象!')
  } else {
    switch (item.title) {
      case '上传回款登记表':
        uploadCollection()
        break
      case '下载回款登记表模板':
        downloadCollection()
        break
      case '导出':
        exportFile()
        break
      default:
        break
    }
  }
}
// 上传回款登记表
const uploadCollection = () => {
  uploadCollectionDialog.value.open()
}
// 下载回款登记表模板
const downloadCollection = () => {
  //  const {data} =  await xx({ key: 'xxxx' })
  //  exportMethod(data)
}
// 下载失败记录
const downloadFailureRecord = row => {
  //  const {data} =  await xx({ key: 'xx' })
  //  exportMethod(data)
}
// 导出
const exportFile = () => {
  const params =
    operation.value === 1
      ? Object.assign({}, state.handleparams)
      : { operateType: 2, companyCaseSearchParam: Object.assign({}, form) }
  console.log(params)
  //  const {data} =  await xx({ key: 'xx' })
  //  exportMethod(data)
}
// 跳转
const goToDetail = row => {
  router.push({ name: 'collectionRegisterDetail', query: { batchNO: row.batchNO } })
}
</script>

<style lang="scss" scoped>
</style>