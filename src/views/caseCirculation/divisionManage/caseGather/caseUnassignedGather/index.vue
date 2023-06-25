<script setup>
import { reactive } from 'vue'
import Apis from '@/api/modules/caseGather'

const state = reactive({
  tableData: [],
  pageTotal: 4,
  page: 1,
  pageSize: 10
})

const caseUnassignedGatherList = async () => {
  const data = await Apis.getOrgUnAllotStats()
  state.tableData = data.data
  console.log(data.data)
}

caseUnassignedGatherList()
</script>

<template>
  <div class="card-wrap">
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="entrustTypeText" label="委案类型" width="150" align="center" />

      <template v-if="state.tableData.length !== 0">
        <el-table-column
          v-for="(item, index) in state.tableData[0].products"
          :key="index"
          :label="item.productName"
          align="center"
        >
          <el-table-column label="金额" align="center" prop="amount" sortable>
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
    <pagination
      v-model:page="state.page"
      v-model:page-size="state.pageSize"
      :total="state.total"
      @pagination="caseUnassignedGatherList"
    />
  </div>
</template>

<style scoped lang="scss">
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
