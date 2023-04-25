<template>
  <el-dialog v-model="dialogVisible" title="风险信息命中详情" width="600px" :before-close="handleClose">
    <el-table :data="tableData" border>
      <el-table-column label="命中风险信息字段" prop="typeName" align="center"></el-table-column>
      <el-table-column label="命中风险信息" prop="name" align="center"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
const dialogVisible = ref(false)
const tableData = ref([])
const handleClose = () => {
  dialogVisible.value = false
}
const open = (applyId: number, type: string) => {
  getTableData(applyId, type)
  dialogVisible.value = true
}

const getTableData = async (applyId: number, type: string) => {
  // let data = ''
  // if (type === 'compliance') {
  //   data = await Apis.registerAuditComplianceApproveProgress({ applyId })
  // } else if (type === 'all') {
  //   data = await Apis.registerAuditAllApproveProgress({ applyId })
  // } else {
  //   data = await Apis.registerAuditApproveProgress({ applyId })
  // }
  // if (data.code !== 200) return
  // tableData.value = data.data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
