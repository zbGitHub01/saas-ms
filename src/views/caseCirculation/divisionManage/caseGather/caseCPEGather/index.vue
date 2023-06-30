<script setup>
import { reactive, ref, computed } from 'vue'
import { useCommonStore } from '@/store/modules/common'
import Apis from '@/api/modules/caseGather'
import queryList from './config/queryList.js'

const commonStore = useCommonStore()

const state = reactive({
  tableData: [],
  cpeList: [],
  queryNewData: {},
  pageTotal: 4,
  page: 1,
  pageSize: 10
})

const getList = async () => {
  const data = await Apis.getList({ ...state.queryNewData })
  state.tableData = data.data
  // state.pageTotal = state.tableData[0].products.length
}

//获取cpe下拉
const getCPEList = async () => {
  const { data } = await Apis.getCPEList()
  state.cpeList = data
}

//formClass实例
const formClass = ref()

const queryNewList = computed(() => {
  queryList.forEach(item => {
    if (item.property === 'deptId') item.options = commonStore.dropdownList.DEPT_LIST
    if (item.property === 'cpeId') item.options = state.cpeList
  })
  return queryList
})

//搜索操作
const handleSearch = () => {
  state.queryNewData = formClass.value.getEntity()
  getList()
}
//重置操作
const handleReset = () => {
  formClass.value.handleReset()
  state.queryNewData = {}
  getList()
}

getList()
getCPEList()
</script>

<template>
  <div class="card-wrap">
    <FormWrap @search="handleSearch" @reset="handleReset">
      <template #default>
        <FormClass ref="formClass" label-width="102px" :fields="queryNewList" />
      </template>
    </FormWrap>
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="cpeName" label="CPE姓名" width="150" align="center" />
      <el-table-column prop="deptName" label="所属部门" width="150" align="center" />

      <template v-if="state.tableData.length !== 0">
        <el-table-column
          v-for="(item, index) in state.tableData[0].products"
          :key="index"
          :label="item.productName"
          align="center"
        >
          <el-table-column label="金额" align="center" prop="amount">
            <template #default="{ row }">
              <span>{{ row['products'][index]['amount'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="户数" align="center" prop="caseUserNum">
            <template #default="{ row }">
              <span>{{ row['products'][index]['caseUserNum'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="户均" align="center">
            <template #default="{ row }">
              <span>{{ row['products'][index]['caseUserAverage'] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
    </el-table>
    <pagination v-model:page="state.page" v-model:page-size="state.pageSize" :total="state.total" @pagination="getList" />
  </div>
</template>

<style scoped lang="scss">
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
