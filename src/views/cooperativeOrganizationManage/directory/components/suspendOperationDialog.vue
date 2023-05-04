<template>
  <el-dialog
    v-model="dialogVisible"
    :title="jobType === 'suspend' ? '暂停作业' : '恢复作业'"
    width="450px"
    :before-close="handleClose"
  >
    <div style="margin: 0 40px">
      <div class="text-wrap" :style="{ color: jobType === 'suspend' ? '#f00' : '#ff9921' }">
        {{
        jobType === 'suspend'
        ? '请确定暂停该机构的处置作业，暂停后所有机构端账号无法访问案件管理所有相关页面'
        : '请确认恢复该机构的处置作业，恢复后该机构下的所有账号即可正常访问相关页面'
        }}
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

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
const dialogVisible = ref(false)
const stopRelationTenantId = ref<number>()
const jobType = ref<string>()

const emits = defineEmits(['getTableData'])
const open = (relationTenantId: number, type: string) => {
  stopRelationTenantId.value = relationTenantId
  jobType.value = type
  dialogVisible.value = true
}
const doSave = async () => {
  const params = {
    relationTenantId: stopRelationTenantId.value,
    isStopJob: jobType.value === 'suspend' ? 1 : 0 //0:作业中 1:暂停作业
  }
  const { code } = await Apis.clientOrgSetStopJob(params)
  if (code !== 200) return
  const msg = jobType.value === 'suspend' ? '暂停作业成功' : '恢复作业成功'
  ElMessage.success(msg)
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
.text-wrap {
  font-weight: bold;
  text-align: center;
  color: #f00;
}
</style>
