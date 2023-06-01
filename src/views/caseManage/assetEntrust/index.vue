<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive" @tab-change="handleClick">
      <el-tab-pane label="当前委托" name="1"></el-tab-pane>
      <el-tab-pane label="委托历史" name="2"></el-tab-pane>
    </el-tabs>
    <OperationBar>
      <template #default>
        <el-button type="primary" icon="Plus" @click="addEntrust" v-if="tabActive === '1'">新增委托</el-button>
      </template>
    </OperationBar>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="序" type="index" align="center" width="50" />
        <el-table-column label="产品" prop="productName" align="center" min-width="150"></el-table-column>
        <el-table-column label="债权方" prop="zhaiquanfang" align="center" min-width="200"></el-table-column>
        <el-table-column label="委托方" prop="zhaiquanfang" align="center" min-width="200"></el-table-column>
        <el-table-column label="受托方" prop="shoutuofang" align="center" min-width="200"></el-table-column>
        <el-table-column label="委托起始时间" prop="startTime" align="center" min-width="200"></el-table-column>
        <el-table-column
          label="协议终止时间"
          prop="xieyiEndTime"
          align="center"
          min-width="200"
          v-if="tabActive === '2'"
        ></el-table-column>
        <el-table-column
          label="委托截止时间"
          prop="endTime"
          align="center"
          min-width="200"
          v-if="tabActive === '1'"
        ></el-table-column>
        <el-table-column label="委托协议" prop="xieyi" align="center" min-width="150">
          <template #default="scope">
            <el-button link type="primary" @click="lookAgreement(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="委托创建人" prop="people" align="center" min-width="150"></el-table-column>
        <el-table-column label="委托创建时间" prop="createTime" align="center" min-width="200"></el-table-column>
        <el-table-column
          label="实际终止时间"
          prop="realEndTime"
          align="center"
          min-width="200"
          v-if="tabActive === '2'"
        ></el-table-column>
        <el-table-column
          label="终止操作人"
          prop="endPeople"
          align="center"
          min-width="150"
          v-if="tabActive === '2'"
        ></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right" v-if="tabActive === '1'">
          <template #default="scope">
            <el-button link type="danger" @click="toStop(scope.row)">终止合作</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddEntrustDialog ref="addEntrustDialog" @getTableData="getTableData" :selectData="selectData" />
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import AddEntrustDialog from './components/AddEntrustDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
const form = reactive({
  positionStatus: 1 //1当前委托 2历史委托
})
const selectData = reactive({
  productList: [], //产品列表
  orgList: [] //机构列表
})
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0
})
const addEntrustDialog = ref()
const tabActive = ref('1')
onMounted(() => {
  getTableData()
  getSelecData()
})
const getTableData = async () => {
  console.log('查询', form)
  // 请求得到数据
  // const { data } = await xx(form)
  const tableDataSub = [
    {
      productName: '“360”借条',
      zhaiquanfang: '丽水海树信用管理有限公司',
      weituofang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      xieyi: '',
      people: '赵光明',
      startTime: '2020-03-05 22:22:22',
      endTime: '2020-03-04 22:22:22',
      createTime: '2020-03-04 22:22:22',
      xieyiEndTime: '2020-03-04 22:22:22',
      realEndTime: '2020-03-04 22:22:22',
      endPeople: 'zzzz'
    },
    {
      productName: '万达贷',
      zhaiquanfang: '丽水海树信用管理有限公司',
      weituofang: '丽水海树信用管理有限公司',
      shoutuofang: '丽水海树信用管理有限公司',
      xieyi: '',
      people: '赵光明',
      startTime: '2020-03-05 22:22:22',
      endTime: '永久',
      createTime: '2020-03-04 22:22:22',
      xieyiEndTime: '2020-03-04 22:22:22',
      realEndTime: '2020-03-04 22:22:22',
      endPeople: 'zzzz'
    }
  ]
  state.tableData = tableDataSub
  query.page = 1
  state.total = 12
}
const getSelecData = async () => {
  // 请求得到数据
  // const { data } = await xx(form)
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
}

// 切换tab
const handleClick = row => {
  // 整理form参数
  form.positionStatus = Number(row)
  getTableData()
}

// 新增委托
const addEntrust = () => {
  addEntrustDialog.value.open()
}

// 终止合作
const toStop = row => {
  ElMessageBox.confirm('是否确认终止合作?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    () => {
      // 请求
      // await xx(form)
      ElMessage.success('终止合作成功！')
      getTableData()
    },
    res => {
      ElMessage.info('已取消')
      console.log(res)
    }
  )
}
// 查看协议
const lookAgreement = row => {
  window.open(row.url)
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>
