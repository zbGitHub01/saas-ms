<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'
import { downArrayBufferFile } from '@/api/arrayBuffer'
import Apis from '@/api/modules/divisionStrategy'
// import tableColumn from './config/tableColumn.js'

const state = reactive({
  tableData: [],
  // pageTotal: 0,
  // page: 1,
  // pageSize: 3,
  orgName: ''
})

const tabStore = useTabsStore()
const router = useRouter()
const route = useRoute()
state.orgName = route.query.orgName

const getCPEList = async () => {
  const data = await Apis.getCPEList({ orgId: route?.query?.orgId })
  state.tableData = data.data
  // state.pageTotal = state.tableData[0].products.length
}

//返回后退按钮
const handleBack = () => {
  tabStore.removeTabs('/caseCirculation/divisionManage/divisionStrategy/divisionSituation')
  router.replace({ name: 'divisionStrategy' })
}

const handleExport = () => {
  //下载文件流
  downArrayBufferFile('get', `/caseCenter/case/allot/stats/export?orgId=${route?.query?.orgId}`)
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
      <el-button type="primary" plain="" @click="handleExport">导出</el-button>
    </div>
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="cpeLevel" label="CPE分案等级" width="150" align="center" />
      <el-table-column prop="cpeId" label="CPE_ID" width="150" align="center" />
      <el-table-column prop="cpeName" label="CPE姓名" width="150" align="center" />

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
    <!-- <pagination
      v-model:page="state.page"
      v-model:page-size="state.pageSize"
      :page-sizes="[3, 6, 9]"
      :total="state.pageTotal"
      @pagination="getCPEList"
    /> -->
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
