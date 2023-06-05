<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'
import Apis from '@/api/modules/caseGather'

const state = reactive({
  tableData: [],
  pageTotal: 4,
  page: 1,
  pageSize: 10,
  orgName: ''
})

const tabStore = useTabsStore()
const router = useRouter()
const route = useRoute()
state.orgName = route.query.orgName

const getCPEList = async (pageSize, pageNum) => {
  const pageInfo = {
    ...state.queryNewData,
    pageNum,
    pageSize
  }
  console.log(pageInfo)
  const data = await Apis.getCPEList()
  state.tableData = data.data
  console.log(data.data)
}

//返回后退按钮
const handleBack = () => {
  tabStore.removeTabs('/caseCirculation/divisionManage/divisionStrategy/divisionSituation')
  router.replace({ name: 'divisionStrategy' })
}

getCPEList()
</script>

<template>
  <div class="card-wrap">
    <div class="table_head">
      <div>
        <el-icon :size="30" @click="handleBack"><ArrowLeft /></el-icon>
        <span>{{ state.orgName }}</span>
      </div>
      <el-button type="primary" plain="">导出</el-button>
    </div>
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="CPEName" label="CPE姓名" width="150" align="center" />
      <el-table-column prop="apartment" label="所属部门" width="150" align="center" />
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
    <pagination v-model:page="state.page" v-model:page-size="state.pageSize" :total="state.total" @pagination="getCPEList" />
  </div>
</template>

<style scoped lang="scss">
.table_head {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 50px;
  div {
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      font-weight: bold;
    }
    svg {
      cursor: pointer;
    }
  }
}
</style>
