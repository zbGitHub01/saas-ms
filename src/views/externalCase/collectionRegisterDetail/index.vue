<template>
  <div class="card-wrap">
    <FormWrap @search="getTableData" @reset="reset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="导入时间" prop="date">
            <el-date-picker
              v-model="form.date"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择导入时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="关联产品" prop="productName">
            <el-input v-model="form.productName" placeholder="请输入关联产品" clearable></el-input>
          </el-form-item>
          <el-form-item label="关联案件" prop="case">
            <el-input v-model="form.case" placeholder="请输入关联案件" clearable></el-input>
          </el-form-item>
          <el-form-item label="关联批次" prop="batchId">
            <el-input v-model="form.batchId" placeholder="请输入关联批次" clearable></el-input>
          </el-form-item>
          <el-form-item label="导入人" prop="operUserId">
            <el-select v-model="form.operUserId" placeholder="请选择导入人" filterable clearable>
              <el-option
                v-for="item in selectData.peopleList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款债权方" prop="creditId">
            <el-select v-model="form.creditId" placeholder="请选择收款债权方" filterable clearable>
              <el-option
                v-for="item in selectData.peopleList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导入机构" prop="orgId">
            <el-select v-model="form.orgId" placeholder="请选择导入机构" filterable clearable>
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
          label="产品"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="姓名"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="证件号"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="批次号"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="入账案件编号"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="还款金额"
          prop="entrustAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="到账时间"
          prop="allotTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="账单id"
          prop="entrustAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="收款债权方"
          prop="userName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="导入人"
          prop="creditorName"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="导入机构"
          prop="entrustAmount"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="导入时间"
          prop="allotTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="deleteDetail(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
const multipleTable = ref()
const route = useRoute()
const form = reactive({
  name: '',
  date: null,
  productName: '',
  case: '',
  batchId: '',
  operUserId: null,
  creditId: null,
  orgId: null,
  batchNo: '' //批次号id
})
const originFormData = JSON.parse(JSON.stringify(form))
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
const operationList = reactive([
  // {
  //   title: '上传回款登记表',
  //   icon: 'Folder',
  //   isShow: true,
  //   // isShow: this.hasPerm("disposal_case_close"),
  //   notCheck: true
  // },
  // {
  //   title: '下载回款登记表模板',
  //   icon: 'Folder',
  //   isShow: true,
  //   // isShow: this.hasPerm("disposal_case_close"),
  //   notCheck: true
  // },
  {
    title: '导出',
    icon: 'Folder',
    isShow: true
    // isShow: this.hasPerm("disposal_case_close"),
  }
])
onMounted(() => {
  // 获取路由传来的批次号
  const { batchNO } = route.query
  form.batchNO = batchNO
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
      creditorName: '测试债权方2',
      entrustAmount: 0,
      userName: '马海山',
      id: 1
    },
    {
      allotTime: '2022-12-02 09:50:43',
      creditorName: '测试债权方1',
      entrustAmount: 0,
      userName: '马海山',
      id: 2
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
  Object.assign(form, originFormData)
  getTableData()
}
//表格选择
const handleSelectionChange = val => {
  let arr = []
  val.map(item => {
    arr.push(item.id)
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
  return row.id
}
//通过此函数整体过滤事件
const handleClick = item => {
  if (state.selectedData.length === 0 && operation.value === 1 && !item.notCheck) {
    ElMessage.warning('请先选择操作对象!')
  } else {
    switch (item.title) {
      // case '上传回款登记表':
      //   uploadCollection()
      //   break
      // case '下载回款登记表模板':
      //   downloadCollection()
      //   break
      case '导出':
        exportFile()
        break
      default:
        break
    }
  }
}

// 删除
const deleteDetail = row => {
  ElMessageBox.confirm('是否确认本次操作?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    () => {
      const params = {
        id: row.id
      }
      console.log('删除', params)
      //  const {data} =  await xx({ key: 'xx' })
      ElMessage.success('操作成功！')
      getTableData()
    },
    res => {
      ElMessage.info('已取消')
      console.log(res)
    }
  )
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
</script>

<style lang="scss" scoped>
</style>