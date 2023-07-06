<script setup>
import { reactive, computed } from 'vue'
import Apis from '@/api/modules/caseGather'

const state = reactive({
  tableData: [],
  pageTotal: 0,
  page: 1,
  pageSize: 10
})

const caseUnassignedGatherList = async () => {
  const data = await Apis.getOrgUnAllotStats()
  state.tableData = data.data
  state.pageTotal = state.tableData[0].products.length
}

const productsDataArr = computed(() => state.tableData[0].products.slice(0, state.pageSize))

//升序
const descClick = index => {
  if (state.tableData.length < 1) return
  state.tableData = state.tableData.sort((a, b) => a['products'][index]['amount'] - b['products'][index]['amount'])
  console.log(index)
}

//降序
const ascClick = index => {
  if (state.tableData.length < 1) return
  state.tableData = state.tableData.sort((a, b) => b['products'][index]['amount'] - a['products'][index]['amount'])
}

caseUnassignedGatherList()
</script>

<template>
  <div class="card-wrap">
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="entrustTypeText" label="委案类型" width="150" align="center" />

      <template v-if="state.tableData.length !== 0">
        <el-table-column v-for="(item, index) in productsDataArr" :key="index" :label="item.productName" align="center">
          <el-table-column align="center" prop="amount">
            <template #header>
              金额
              <span class="sort_icon">
                <el-icon @click="descClick(index)"><CaretTop /></el-icon>
                <el-icon @click="ascClick(index)"><CaretBottom /></el-icon>
              </span>
            </template>
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
    <pagination v-model:page="state.page" v-model:page-size="state.pageSize" layout="total, sizes" :total="state.pageTotal" />
  </div>
</template>

<style scoped lang="scss">
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
.sort_icon {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  height: 14px;
  width: 24px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
  &:last-child {
    top: -8px;
  }
}
</style>
