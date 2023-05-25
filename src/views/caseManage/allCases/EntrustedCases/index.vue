<template>
  <div>
    <FormWrap @search="getTableData" @reset="reset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="案件ID">
            <el-input v-model="form.caseId" placeholder="请输入案件ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="产品">
            <el-select v-model="form.productId" placeholder="请选择产品" clearable filterable>
              <el-option
                v-for="(item, index) in selectData.productList"
                :key="index"
                :label="item.text"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入库批次号">
            <el-select v-model="form.picihao" placeholder="请选择入库批次号" clearable filterable>
              <el-option
                v-for="(item, index) in selectData.picihaoList"
                :key="index"
                :label="item.text"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="债权方">
            <el-select v-model="form.zhaiquanfangId" placeholder="请选择债权方" clearable filterable>
              <el-option v-for="(item, index) in selectData.orgList" :key="index" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="受托方">
            <el-select v-model="form.shoutuofangId" placeholder="请选择受托方" clearable filterable>
              <el-option v-for="(item, index) in selectData.orgList" :key="index" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <!-- <LabelData :labelData="state.labelData" /> -->
    <LabelClass :labelData="state.labelData" />
    <div class="spacing"></div>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="案件ID" prop="caseId" align="center" min-width="150">
          <template #default="scope">
            <status :row="scope.row" pageType="disposalCasemessage" />
          </template>
        </el-table-column>
        <el-table-column label="产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="姓名" prop="name" align="center" min-width="150"></el-table-column>
        <el-table-column label="证件号" prop="caseNo" align="center" min-width="150"></el-table-column>
        <el-table-column label="手机号" prop="phone" align="center" min-width="150"></el-table-column>
        <el-table-column label="处置金额" prop="money1" align="center" min-width="150"></el-table-column>
        <el-table-column label="还款入账金额" prop="money2" align="center" min-width="150"></el-table-column>
        <el-table-column label="减免金额" prop="money3" align="center" min-width="150"></el-table-column>
        <el-table-column label="剩余待还金额" prop="money4" align="center" min-width="150"></el-table-column>
        <el-table-column label="入库批次号" prop="picihao" align="center" min-width="150"></el-table-column>
        <el-table-column label="债权方" prop="zhaiquanfang" align="center" min-width="150"></el-table-column>
        <el-table-column label="受托方" prop="shoutuofang" align="center" min-width="150"></el-table-column>
        <el-table-column label="案件状态" prop="status" align="center" min-width="150"></el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
const form: any = reactive({
  caseId: '',
  productId: null,
  picihao: null,
  zhaiquanfangId: null,
  shoutuofangId: null
})
const originFormData = JSON.parse(JSON.stringify(form))
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [] as any[],
  total: 0,
  labelData: [] as any
})
const selectData = reactive({
  productList: [] as any[], //产品列表
  orgList: [] as any[], //机构列表
  picihaoList: [] as any[] //批次号类型
})
onMounted(() => {
  getTableData()
  getSelecData()
})
const getTableData = async () => {
  console.log('已委托案件搜索', form)
  // 请求得到数据
  // const { data } = await xx(form)
  const tableDataSub = [
    {
      caseId: 'WTD-SJD-0000002',
      productName: '“360”借条',
      name: '王亚瑞',
      caseNo: '450332198908202719',
      phone: '1234567',
      money1: 11,
      money2: 22,
      money3: 33,
      money4: 44,
      picihao: '万腾浩达资产-手机贷20190326',
      zhaiquanfang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      status: '正常'
    },
    {
      caseId: 'GJ-WLD-0132768',
      productName: '“360”借条',
      name: '王亚瑞',
      caseNo: '450332198908202719',
      phone: '1234567',
      money1: 11,
      money2: 22,
      money3: 33,
      money4: 44,
      picihao: '万腾浩达资产-手机贷20190326',
      zhaiquanfang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      status: '暂停 | 投诉'
    }
  ]
  state.tableData = tableDataSub
  query.page = 1
  state.total = 12
  // 得到label数据
  state.labelData = [
    {
      customizeIcon: '',
      eplusIcon: 'Memo',
      labelTitle: '案件数量',
      isHaveRmbSign: false,
      value: null, //total
      key: 'total'
    },
    {
      customizeIcon: '',
      eplusIcon: 'UserFilled',
      labelTitle: '案人人数',
      isHaveRmbSign: false,
      value: null,
      key: 'caseUserCount'
    },
    {
      customizeIcon: '',
      eplusIcon: 'Money',
      labelTitle: '处置金额',
      isHaveRmbSign: false,
      value: null,
      key: 'sumHandleAmount'
    },
    {
      customizeIcon: '',
      eplusIcon: 'Money',
      labelTitle: '已还金额',
      isHaveRmbSign: false,
      value: null,
      key: 'sumRefundAmount'
    },
    {
      customizeIcon: '',
      eplusIcon: 'Money',
      labelTitle: '待还金额',
      isHaveRmbSign: false,
      value: null,
      key: 'sumResidueAmount'
    }
  ]
  const labelData2 = {
    caseUserCount: 239278,
    sumHandleAmount: 4889285788.62,
    sumRefundAmount: 184079143.85,
    sumResidueAmount: 4711200212.03
  }
  state.labelData.forEach(item => {
    item.value = labelData2[item.key]
  })
}
const getSelecData = async () => {
  // 请求得到数据
  // const { data} = await xx(params)
  selectData.productList = [
    {
      id: 1,
      text: '小花袋'
    },
    {
      id: 2,
      text: '“360”借条'
    },
    {
      id: 3,
      text: '中腾信'
    },
    {
      id: 4,
      text: '万达袋'
    }
  ]
  selectData.orgList = [
    {
      id: 1,
      text: '小丽水海树信用管理有限公司花袋'
    },
    {
      id: 2,
      text: '浙江东岸科技有限公司'
    }
  ]
  selectData.picihaoList = [
    {
      id: 1,
      text: '批次号1'
    },
    {
      id: 2,
      text: '批次号2'
    },
    {
      id: 3,
      text: '批次号3'
    }
  ]
}
// 重置
const reset = () => {
  console.log('重置')
  Object.assign(form, originFormData)
  getTableData()
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
