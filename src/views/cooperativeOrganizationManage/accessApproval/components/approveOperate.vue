<template>
  <el-dialog
    v-model="dialogVisible"
    :title="infoData.type === 0 ? '审批通过' : '审批拒绝'"
    width="450px"
    :before-close="onClose"
  >
    <div style="margin: 0 50px">
      <div class="dialog-text">{{ infoData.type === 0 ? '确定审核通过吗？' : '确定审核拒绝吗？' }}</div>
      <div v-if="infoData.type === 0 && isBlacklistHit" class="tips">主要人员命中黑名单，确定通过吗？</div>
      <div v-if="infoData.type === 0 && isSensitiveOrgHit" class="tips">该机构命中敏感机构信息，确认予以通过吗？</div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button v-if="infoData.type === 0" type="primary" @click="submitForm">审批通过</el-button>
        <el-button v-else type="danger" @click="submitForm">审批拒绝</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
const emits = defineEmits(['handleClose', 'getList'])
const dialogVisible = ref(false)
const isSensitiveOrgHit = ref(false)
const isBlacklistHit = ref(false)
const infoData = reactive({
  registerId: '',
  logId: '',
  type: 0
})

const open = (type, data, hitList) => {
  infoData.registerId = data.registerId
  infoData.logId = data.logId
  infoData.type = type
  isBlacklistHit.value = !!hitList.length
  // fetchSensitiveOrgHit()
  dialogVisible.value = true
}
// 审批
const registerAuditApproveCommon = async () => {
  const params = {
    accessType: infoData.type,
    logId: infoData.logId
  }
  const { code } = await Apis.registerAuditApprove(params)
  if (code !== 200) return
  emits('handleClose')
  emits('getList')
  ElMessage.success('操作成功')
  onClose()
}
// 查询是否命中敏感库
const fetchSensitiveOrgHit = async () => {
  // const { code, data } = await Apis.findSensitiveOrgHit({ registerId: infoData.registerId })
  // isSensitiveOrgHit.value = !!(code == 200 && data.length)
}
const onClose = () => {
  dialogVisible.value = false
}
const submitForm = async () => {
  await registerAuditApproveCommon()
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.w300 {
  width: 300px !important;
}
.dialog-text {
  text-align: center;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.tips {
  color: #f56c6c;
  line-height: 22px;
  font-size: 12px;
  text-align: center;
  margin-bottom: 8px;
}
</style>
