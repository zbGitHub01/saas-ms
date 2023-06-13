<template>
  <div class="card-wrap">
    <FormWrap @search="getTableData" @reset="reset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="分库时间" prop="date">
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
          <el-form-item label="操作人" prop="operUserId">
            <el-select v-model="form.operUserId" placeholder="请选择操作人" filterable clearable>
              <el-option
                v-for="item in selectData.peopleList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标分库" prop="targetStoreId">
            <el-select v-model="form.targetStoreId" placeholder="请选择目标分库" filterable clearable>
              <el-option
                v-for="item in selectData.bankList"
                :key="item.itemId"
                :label="item.itemText"
                :value="item.itemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分库批次号" prop="distBatchNo">
            <el-input v-model="form.distBatchNo" placeholder="请输入分库批次号" clearable></el-input>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
        <el-table-column
          label="分库批次号"
          prop="distBatchNo"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="分库时间"
          prop="distTimeStr"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="操作人"
          prop="operName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="原分库"
          prop="sourceStoreName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="目标分库"
          prop="targetStoreName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="分库案件数" prop="distCaseNum" align="center" min-width="150" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ scope.row.distCaseNum }}/{{ scope.row.distTotalCaseNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分库案人数" prop="distuserNum" align="center" min-width="150" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ scope.row.distuserNum }}/{{ scope.row.distTotalUserNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分库金额"
          prop="distAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="完成时间"
          prop="finishTimeStr"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="分库进度"
          prop="distStateStr"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- 失败数据下载 -->
        <el-table-column label="失败数据" prop="errorDataUrl" align="center" min-width="150">
          <template #default="scope">
            <el-button link type="primary" @click="download(scope.row)" v-if="scope.row.isFailed === 1">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { beformonth } from '@/utils/formatedate'
import Apis from '@/api/modules/caseManage'
import Apis2 from '@/api/modules/common'
const selectData = reactive({
  peopleList: [], //人员列表
  bankList: [] //分库列表
})
const form = reactive({
  // operDateDuration: null, //时间，开始和结束用～拼接
  operUserId: null,
  targetStoreId: null,
  distBatchNo: '',
  startDistTime: null,
  endDistTime: null,
})
const originFormData = JSON.parse(JSON.stringify(form))
const date = ref()
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0
})
onMounted(() => {
  getTableData()
  getSelecData()
  setDefault()
})
// 获取表格数据
const getTableData = async () => {
  console.log('案件分库', form)
  // 请求得到数据
  const { data } = await Apis.distRecordList({ ...form, ...query})
  state.tableData = data.data
  // state.tableData = [
  //   {
  //     distId: 1,
  //     distBatchNo: 'WTD-SJD-0000002',
  //     distTimeStr: '“360”借条',
  //     operName: '王亚瑞',
  //     sourceStoreName: '原分库1',
  //     targetStoreName: '目标分库1',
  //     distCaseNum: 22,
  //     distTotalCaseNum: 33,
  //     distuserNum: 11,
  //     distTotalUserNum: 22,
  //     distAmount: 22,
  //     finishTimeStr: '2023-02-02 21:21:21',
  //     distStateStr: '已完成',
  //     isFailed: 1, //是否失败
  //     errorDataUrl: 'https://asfile.donganzichan.cn/assets/tmpl/案件导入模板.xlsx'
  //   },
  //   {
  //     distId: 2,
  //     distBatchNo: 'GJ-WLD-0132768',
  //     distTimeStr: '“360”借条',
  //     operName: '王亚瑞',
  //     sourceStoreName: '原分库2',
  //     targetStoreName: '目标分库2',
  //     distCaseNum: 44,
  //     distTotalCaseNum: 55,
  //     distuserNum: 11,
  //     distTotalUserNum: 33,
  //     distAmount: 22,
  //     finishTimeStr: '2023-02-02 21:21:21',
  //     distStateStr: '进行中',
  //     isFailed: 0
  //   }
  // ]
  state.total = data.total
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
  // const { data } = await Apis2.findItemList({ codes: 'DIST_LIST' })
  // state.bankList = data.DIST_LIST
  state.bankList = [
    {
      itemText: '待分库案件',
      itemId: 0
    },
    {
      itemText: '委外处置库',
      itemId: 1
    },
    {
      itemText: '智能处置库',
      itemId: 2
    },
    {
      itemText: '勾销处置库',
      itemId: 3
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
  if (val) {
    // form.operDateDuration = val[0] + '~' + val[1]
    form.startDistTime = val[0]
    form.endDistTime = val[1]
  } else {
    // form.operDateDuration = null
    form.startDistTime = val[0]
    form.endDistTime = val[1]
  }
}
//下载
const download = async row => {
  // const params = {
  //   distId: row.distId
  // }
  // const { data } = await xx(params)
  // let urls =  data.url.replace(/^http:/, "https:");
  // let urls = 'https://asfile.donganzichan.cn/assets/tmpl/案件导入模板.xlsx'
  let a = document.createElement('a')
  a.href = row.errorDataUrl
  a.download = '失败记录'
  a.click()
}
const setDefault = () => {
  date.value = beformonth()
  // form.operDateDuration = beformonth().join('~')
  form.startDistTime = beformonth()[0]
  form.endDistTime = beformonth()[1]
}
</script>

<style lang="scss" scoped>
</style>