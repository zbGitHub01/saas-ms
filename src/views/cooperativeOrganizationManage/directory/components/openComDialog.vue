<template>
  <el-dialog v-model="dialogVisible" title="开启合作" width="450px" :before-close="handleClose">
    <div style="margin: 0 40px">
      <div class="ft-align text-weight mb12">确定开启合作吗？</div>
      <div v-if="orgData.reasonContent || orgData.remark" class="ft-align mb30">上次终止合作的原因为：</div>
      <div class="ft-align">
        <div style="color: #f00; font-size: 20px" class="mb12">{{ orgData.reasonContent }}</div>
        <div>{{ orgData.remark }}</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="doSave()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
const dialogVisible = ref(false)
const orgData = ref({})

const emits = defineEmits(['getTableData'])
const open = row => {
  orgData.value = row
  dialogVisible.value = true
}
const doSave = async () => {
  const params = {
    relationTenantId: orgData.value.relationTenantId
  }
  const { code } = await Apis.clientOrgOpenCooperation(params)
  if (code !== 200) return
  ElMessage.success('开启合作成功')
  emits('getTableData')
  handleClose()
}
const handleClose = () => {
  dialogVisible.value = false
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.ft-align {
  font-size: 16px;
  text-align: center;
}
.text-weight {
  font-weight: bold;
}
</style>
