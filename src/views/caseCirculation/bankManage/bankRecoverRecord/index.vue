<template>
  <div class="card-wrap">
    <FormWrap @search="getTableData" @reset="reset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="收回时间" prop="date">
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
                :key="item.itemId"
                :label="item.itemText"
                :value="item.itemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原分库" prop="operStoreId">
            <el-select v-model="form.operStoreId" placeholder="请选择原分库" filterable clearable>
              <el-option
                v-for="item in selectData.bankList"
                :key="item.itemId"
                :label="item.itemText"
                :value="item.itemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收回批次号" prop="recoverNo">
            <el-input v-model="form.recoverNo" placeholder="请输入收回批次号" clearable></el-input>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
        <el-table-column label="收回批次号" prop="recoverNo" align="center" min-width="250"></el-table-column>
        <el-table-column label="收回时间" prop="recoverTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="操作人" prop="operatorName" align="center" min-width="150"></el-table-column>
        <el-table-column label="原分库" prop="oldStoreName" align="center" min-width="150"></el-table-column>
        <el-table-column label="目标分库" prop="targetStoreName" align="center" min-width="150"></el-table-column>
        <el-table-column label="收回案件数" prop="recoverCaseNum" align="center" min-width="150">
          <template #default="scope">
            <span>{{ scope.row.actualRecoverCaseNum }}/{{ scope.row.recoverCaseNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收回案人数" prop="recoverUserNum" align="center" min-width="150">
          <template #default="scope">
            <span>{{ scope.row.actualRecoverUserNum }}/{{ scope.row.recoverUserNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收回金额" prop="recoverAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="完成时间" prop="completeTime" align="center" min-width="180"></el-table-column>
        <el-table-column label="收回进度" prop="recoverStateStr" align="center" min-width="150"></el-table-column>
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

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, computed } from 'vue'
import { beformonth } from '@/utils/formatedate'
import Apis from '@/api/modules/caseManage'
import Apis2 from '@/api/modules/common'
import { useGlobalStore } from '@/store/index'
const globalStore = useGlobalStore()
const tenantInfo = computed(() => globalStore.tenantInfo)
const selectData = reactive({
  peopleList: [], //人员列表
  bankList: [] //分库列表
})
const form = reactive({
  recoverStartTime: null,
  recoverEndTime: null,
  operUserId: null,
  operStoreId: null,
  recoverNo: ''
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
  const params = {
    recoverType: 1,
    ...form,
    ...query
  }
  const { data } = await Apis.recoverRecordList(params)
  state.tableData = data.data
  // state.tableData = [
  //   {
  //     distId: 1,
  //     caseId: 'WTD-SJD-0000002',
  //     productName: '“360”借条',
  //     name: '王亚瑞',
  //     caseNo: '450332198908202719',
  //     distCaseNum: 22,
  //     distTotalCaseNum: 33,
  //     distuserNum: 11,
  //     distTotalUserNum: 22,
  //     money2: 22,
  //     money3: 33,
  //     money4: 44,
  //     picihao: '万腾浩达资产-手机贷20190326',
  //     zhaiquanfang: '丽水海树信用管理有限公司',
  //     shoutuofang: '丽水海树信用管理有限公司',
  //     status: '正常',
  //     isFailed: 1 //是否失败
  //   },
  //   {
  //     distId: 2,
  //     caseId: 'GJ-WLD-0132768',
  //     productName: '“360”借条',
  //     name: '王亚瑞',
  //     caseNo: '450332198908202719',
  //     distCaseNum: 44,
  //     distTotalCaseNum: 55,
  //     distuserNum: 11,
  //     distTotalUserNum: 33,
  //     money2: 22,
  //     money3: 33,
  //     money4: 44,
  //     picihao: '万腾浩达资产-手机贷20190326',
  //     zhaiquanfang: '丽水海树信用管理有限公司',
  //     shoutuofang: '丽水海树信用管理有限公司',
  //     status: '暂停 | 投诉',
  //     isFailed: 0
  //   }
  // ]
  state.total = data.total
}
const getSelecData = async () => {
  const { data } = await Apis.empolyeeList({
    tenantId: tenantInfo.value.tenantId,
    deptId: tenantInfo.value.deptId
  })
  selectData.peopleList = data
  const { data: data2 } = await Apis2.findItemList({ codes: 'DIST_LIST' })
  selectData.bankList = data2.DIST_LIST
}
// 重置
const reset = () => {
  date.value = []
  Object.assign(form, originFormData)
  getTableData()
}
const changeDate = val => {
  if (val) {
    form.recoverStartTime = val[0] + ' 00:00:00'
    form.recoverEndTime = val[1] + ' 23:59:59'
  } else {
    form.recoverStartTime = null
    form.recoverEndTime = null
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
  form.recoverStartTime = beformonth()[0] + ' 00:00:00'
  form.recoverEndTime = beformonth()[1] + ' 23:59:59'
}
</script>

<style lang="scss" scoped>
</style>