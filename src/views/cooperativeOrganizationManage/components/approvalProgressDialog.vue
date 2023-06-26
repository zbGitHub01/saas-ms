<template>
  <el-dialog v-model="dialogVisible" title="审批进度" width="800px" :before-close="handleClose">
    <el-table :data="tableData" border>
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column label="操作时间" prop="checkTime" align="center" width="180"></el-table-column>
      <el-table-column label="操作人" prop="handlerName" align="center" width="140"></el-table-column>
      <el-table-column label="审批事件" prop="handlerResult" align="center" width="180"></el-table-column>
      <el-table-column label="审批备注" prop="remark" align="center" width="200" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
const dialogVisible = ref(false)
const tableData = ref([])
const handleClose = () => {
  dialogVisible.value = false
}
const open = (applyId, type) => {
  getTableData(applyId, type)
  dialogVisible.value = true
}

const getTableData = async (applyId, type) => {
  let data = ''
  if (type === 'compliance') {
    data = await Apis.registerAuditComplianceApproveProgress({ applyId })
  } else if (type === 'all') {
    data = await Apis.registerAuditAllApproveProgress({ applyId })
  } else {
    data = await Apis.registerAuditApproveProgress({ applyId })
  }
  if (data.code !== 200) return
  tableData.value = data.data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
