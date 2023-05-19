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
        <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
        <el-table-column
          label="分库批次号"
          prop="caseId"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="分库时间"
          prop="productName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="操作人"
          prop="productName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="原分库"
          prop="name"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="目标分库"
          prop="caseNo"
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
          prop="money2"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="完成时间"
          prop="money3"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="分库进度"
          prop="money4"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- 失败数据下载 -->
        <el-table-column label="失败数据" prop="url" align="center" min-width="150">
          <template #default="scope">
            <el-button link type="primary" @click="download(scope.row)" v-if="scope.row.isFailed === 1">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { beformonth } from '@/utils/formatedate'
const selectData = reactive({
  peopleList: [] as any[], //人员列表
  bankList: [] as any[] //分库列表
})
const form: any = reactive({
  operDateDuration: null, //时间，开始和结束用～拼接
  operUserId: null,
  targetStoreId: null,
  distBatchNo: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
const date = ref()
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [] as any[],
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
  // const { data } = await xx(form)
  state.tableData = [
    {
      distId: 1,
      caseId: 'WTD-SJD-0000002',
      productName: '“360”借条',
      name: '王亚瑞',
      caseNo: '450332198908202719',
      distCaseNum: 22,
      distTotalCaseNum: 33,
      distuserNum: 11,
      distTotalUserNum: 22,
      money2: 22,
      money3: 33,
      money4: 44,
      picihao: '万腾浩达资产-手机贷20190326',
      zhaiquanfang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      status: '正常',
      isFailed: 1 //是否失败
    },
    {
      distId: 2,
      caseId: 'GJ-WLD-0132768',
      productName: '“360”借条',
      name: '王亚瑞',
      caseNo: '450332198908202719',
      distCaseNum: 44,
      distTotalCaseNum: 55,
      distuserNum: 11,
      distTotalUserNum: 33,
      money2: 22,
      money3: 33,
      money4: 44,
      picihao: '万腾浩达资产-手机贷20190326',
      zhaiquanfang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      status: '暂停 | 投诉',
      isFailed: 0
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
  selectData.bankList = [
    {
      itemId: 1,
      itemText: '分库1'
    },
    {
      itemId: 2,
      itemText: '分库2'
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
const changeDate = (val: any) => {
  console.log(val)
  if (val) {
    form.operDateDuration = val[0] + '~' + val[1]
  } else {
    form.operDateDuration = null
  }
}
//下载
// url可能需要发送接口获取，再处理
const download = async row => {
  const params = {
    distId: row.distId
  }
  // const { data } = await xx(params)
  // let urls =  data.url.replace(/^http:/, "https:");
  let urls = 'https://asfile.donganzichan.cn/assets/tmpl/案件导入模板.xlsx'
  let a = document.createElement('a')
  a.href = urls
  a.download = '失败记录'
  a.click()
}
const setDefault = () => {
  date.value = beformonth()
  form.operDateDuration = beformonth().join('~')
}
</script>

<style lang="scss" scoped>
</style>