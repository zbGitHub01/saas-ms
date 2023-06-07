<script setup>
import { reactive } from 'vue'
import Apis from '@/api/modules/caseGather'

const state = reactive({
  tableData: [],
  pageTotal: 4,
  page: 1,
  pageSize: 10
})

const caseUnassignedGatherList = async (pageSize, pageNum) => {
  const pageInfo = {
    ...state.queryNewData,
    pageNum,
    pageSize
  }
  console.log(pageInfo)
  const data = await Apis.caseUnassignedGatherList()
  state.tableData = data.data
  console.log(data.data)
}

caseUnassignedGatherList()
</script>

<template>
  <div class="card-wrap">
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="caseType" label="委案类型" width="220" align="center" />
      <el-table-column label="全部" prop="all" align="center">
        <el-table-column prop="amount" label="金额" width="120" align="center" sortable>
          <template #default="{ row }">
            {{ row['all']['amount'] }}
          </template>
        </el-table-column>
        <el-table-column prop="households" label="户数" width="120" align="center">
          <template #default="{ row }">
            {{ row['all']['households'] }}
          </template>
        </el-table-column>
        <el-table-column prop="perHouseholds" label="户均" width="120" align="center">
          <template #default="{ row }">
            {{ row['all']['perHouseholds'] }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="“360”借条" prop="loan" align="center">
        <el-table-column prop="amount" label="金额" width="120" align="center" sortable>
          <template #default="{ row }">
            {{ row['loan']['amount'] }}
          </template>
        </el-table-column>
        <el-table-column prop="households" label="户数" width="120" align="center">
          <template #default="{ row }">
            {{ row['loan']['households'] }}
          </template>
        </el-table-column>
        <el-table-column prop="perHouseholds" label="户均" width="120" align="center">
          <template #default="{ row }">
            {{ row['loan']['perHouseholds'] }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="古京我来贷" prop="my" align="center">
        <el-table-column prop="amount" label="金额" width="120" align="center" sortable>
          <template #default="{ row }">
            {{ row['my']['amount'] }}
          </template>
        </el-table-column>
        <el-table-column prop="households" label="户数" width="120" align="center">
          <template #default="{ row }">
            {{ row['my']['households'] }}
          </template>
        </el-table-column>
        <el-table-column prop="perHouseholds" label="户均" width="120" align="center">
          <template #default="{ row }">
            {{ row['my']['perHouseholds'] }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="捷信项目" prop="jieXin" align="center">
        <el-table-column prop="amount" label="金额" width="120" align="center" sortable>
          <template #default="{ row }">
            {{ row['jieXin']['amount'] }}
          </template>
        </el-table-column>
        <el-table-column prop="households" label="户数" width="120" align="center">
          <template #default="{ row }">
            {{ row['jieXin']['households'] }}
          </template>
        </el-table-column>
        <el-table-column prop="perHouseholds" label="户均" width="120" align="center">
          <template #default="{ row }">
            {{ row['jieXin']['perHouseholds'] }}
          </template>
        </el-table-column>
      </el-table-column>
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
