<script setup>
import { reactive, toRefs, computed } from 'vue'
import useCaseStore from '@/store/modules/caseInfo.js'

const props = defineProps({
  otherCaseCount: {
    type: Number,
    default: 0
  }
})

const caseInfoStore = useCaseStore()
const state = reactive({
  tableData: []
})

const caseId = computed(() => caseInfoStore?.caseId)

//同产品共债案件
const debtList = async () => {
  // const { code, data } = await debtList({ caseId: this.caseId, debtType: 2 })
  // if (code === 200) {
  //   this.tableData = data
  //   this.$emit('update:otherCaseCount', data.length)
  // }
}

debtList()
</script>

<template>
  <div class="style-container">
    <el-table style="width: 100%; margin-top: 20px" border :data="state.tableData">
      <el-table-column prop="caseNo" fixed align="center" label="案件ID" width="230">
        <template #default="scope">
          <status :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="产品" prop="productName" />
      <el-table-column label="姓名" prop="userName" />
      <el-table-column label="证件号" prop="idno" width="200" />
      <el-table-column label="手机号" prop="userPhone" width="150" />
      <el-table-column label="处置金额" prop="handleAmount" />
      <el-table-column label="还款入账金额" prop="totalRefundAmount" />
      <el-table-column label="减免金额" prop="totalReductionAmount" />
      <el-table-column label="剩余待还金额" prop="residueAmount" />
      <el-table-column label="是否处置" prop="productName">
        <template #default="scope">
          <span style="color: #f56c6c">{{ scope.row.orgId && scope.row.orgId > 0 ? '其他机构处置中' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案件状态" prop="caseStatusText" width="120" />
    </el-table>
  </div>
</template>
<style scoped lang="scss">
.style-container {
  margin: 0;
  border: none;
  display: block;
  box-shadow: none;
}
</style>
