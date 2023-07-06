<template>
  <div>
    <DynamoSearchForm ref="dynamoSearchFormRef" code="MNG_CASE_SEARCH_FIELD" @search="getTableData" />
    <div class="spacing"></div>
    <LabelClass :labelData="state.CaseStatistics" />
    <div class="spacing"></div>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="案件ID" prop="caseNo" align="center" min-width="150" fixed="left">
          <template #default="scope">
            <status :row="scope.row" pageType="disposalCasemessage" />
          </template>
        </el-table-column>
        <el-table-column label="产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="姓名" prop="userName" align="center" min-width="150"></el-table-column>
        <el-table-column label="证件号" prop="idno" align="center" min-width="180"></el-table-column>
        <el-table-column label="手机号" prop="userPhone" align="center" min-width="150"></el-table-column>
        <el-table-column label="处置金额" prop="handleAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="还款入账金额" prop="totalRefundAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="减免金额" prop="totalReductionAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="剩余待还金额" prop="residueAmount" align="center" min-width="150"></el-table-column>
        <el-table-column label="入库批次号" prop="batchNo" align="center" min-width="250"></el-table-column>
        <el-table-column label="债权方" prop="creditorName" align="center" min-width="200"></el-table-column>
        <el-table-column label="受托方" prop="trusteeName" align="center" min-width="200"></el-table-column>
        <el-table-column label="案件状态" prop="caseStatusText" align="center" min-width="150"></el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import CaseStatistics from '@/constants/CaseStatistics' //统计数据
import Apis from '@/api/modules/caseManage'
import DynamoSearchForm from '@/components/DynamoSearchForm/index.vue'
const dynamoSearchFormRef = ref()
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0,
  CaseStatistics: [] //统计数据
})
onMounted(() => {
  getTableData()
})
const getTableData = async () => {
  console.log('已委托案件搜索')
  // 请求得到数据
  const params = {
    ...dynamoSearchFormRef.value.getParams(),
    ...query,
    queryType: 'PROXYED' //案件查询类型：PROXYED-已委托案件
  }
  const { data } = await Apis.caseList(params)
  state.tableData = data.data
  state.tableData = [
    {
      caseId: 1,
      caseNo: 'BE-BQ-0001003',
      productName: '“360”借条',
      userName: '王亚瑞',
      idno: '4503321989082027',
      userPhone: '1234567',
      handleAmount: 11,
      totalRefundAmount: 22,
      totalReductionAmount: 33,
      residueAmount: 44,
      batchNo: '万腾浩达资产-手机贷20190326',
      creditorName: '丽水海树信用管理有限公司',
      trusteeName: '丽水海树信用管理有限公司',
      caseStatusText: '正常'
    },
    {
      caseId: 3,
      caseNo: 'BE-BQ-0001001',
      productName: '“360”借条',
      userName: '王亚瑞',
      idno: '4503321989082027',
      userPhone: '1234567',
      handleAmount: 11,
      totalRefundAmount: 22,
      totalReductionAmount: 33,
      residueAmount: 44,
      batchNo: '万腾浩达资产-手机贷20190326',
      creditorName: '丽水海树信用管理有限公司',
      trusteeName: '丽水海树信用管理有限公司',
      caseStatusText: '暂停 | 投诉'
    }
  ]
  state.total = data.total
  const { data: data1 } = await Apis.caseListStats(params)
  // const labelData2 = {
  //   totalCase: 23,
  //   caseUserCount: 239278,
  //   sumHandleAmount: 4889285788.62,
  //   sumRefundAmount: 184079143.85,
  //   sumResidueAmount: 4711200212.03
  // }
  CaseStatistics.forEach(item => {
    item.value = data1[item.key]
  })
  state.CaseStatistics = CaseStatistics
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  margin-bottom: 0;
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
