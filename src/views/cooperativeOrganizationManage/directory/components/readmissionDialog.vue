<template>
  <el-dialog v-model="dialogVisible" title="重新准入" width="450px" :before-close="handleClose">
    <div style="margin: 0 40px">
      <div v-if="dialogType === 1">
        <div v-if="orgDetail.registerTime">
          <div class="text-wrap">
            该合作机构
            <span class="color-f00">{{ orgDetail.registerTime }}</span>
            前处在合作准入冷却期，确定强制重新准入吗？
          </div>
        </div>
        <div v-else>
          <div class="text-wrap">确定重新准入吗？</div>
        </div>
      </div>
      <div v-if="dialogType === 2">
        <div>
          请告知对方,
          <span class="color-f00">{{ tenantInfo.tenantName }}</span>
          的准入邀请已准备完成，对方可通过以下方式完成准入：
        </div>
        <div class="mt20">1、打开以下链接，以注册手机号{{ orgDetail.phone }}登录后即可进入准入流程</div>
        <div class="mt8 mb10" style="color: #3178ff; word-break: break-all">{{ linkUrl }}</div>
        <el-button v-copy="linkUrl" type="primary" plain>复制准入链接地址</el-button>
        <div class="mt20">2、登录作业系统后进入“合作机构管理”-“上游合作邀请管理” 页面，完成准入</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <template v-if="dialogType === 1">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="doSave">确认</el-button>
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import { ElMessage } from 'element-plus'
import { useGlobalStore } from '@/store/index'
const GlobalStore = useGlobalStore()
const dialogVisible = ref(false)
const dialogType = ref(1)
const linkUrl = ref('')
const orgDetail = reactive({
  registerTime: '',
  registerId: '',
  phone: ''
})
const emits = defineEmits(['getTableData'])
const open = row => {
  Object.assign(orgDetail, row)
  dialogType.value = 1
  dialogVisible.value = true
}
const doSave = async () => {
  const params = {
    registerId: orgDetail.registerId,
    url: import.meta.env.VITE_APP_BASE_institutionsH5Url
  }
  const { code, data } = await Apis.clientRegisterRestart(params)
  if (code !== 200) return
  ElMessage.success('重新准入成功')
  linkUrl.value = data
  linkUrl.value =
    'https://console-test.dongancloud.com/ins/#/register?uuid=c4d8362562094a558c06e94c42221170&employeeId=5&phone=15068752222&isNeedAccessApprove=true&tenantId=1&orgId=21&time=1683256180919'
  dialogType.value = 2
}
const handleClose = () => {
  emits('getTableData')
  dialogVisible.value = false
}
const tenantInfo = computed(() => GlobalStore.tenantInfo)
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
}
.color-f00 {
  color: #f00;
}
</style>
