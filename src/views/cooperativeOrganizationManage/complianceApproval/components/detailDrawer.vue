<template>
  <el-drawer
    v-model="drawer"
    size="1280"
    :direction="direction"
    :before-close="handleClose"
    append-to-body
    class="compliance-detail-drawer"
  >
    <template #default>
      <div style="display: flex; height: 100%">
        <div style="width: 670px">
          <h4>机构详情</h4>
          <div class="approval-type" v-if="props.approveType !== '0'">
            <img
              :src="`/src/assets/images/approval-${Number(props.approveType)}.png`"
              alt="approveType"
            />
          </div>
          <div class="flx-align-center pt10 pb10">
            <div class="mr40">
              <span class="color-999">机构名：</span>
              {{ detailData.companyName }}
            </div>
            <div class="mr40">
              <span class="color-999">注册人姓名：</span>
              {{ detailData.username }}
            </div>
            <div class="mr40">
              <span class="color-999">注册手机号：</span>
              {{ detailData.phone }}
            </div>
          </div>
          <div style="height: calc(100% - 66px)">
            <access-data
              :scrollTop="260"
              accessId="compliance-personal-info"
              :accessDetail="detailData"
              ref="accessDataRef"
            ></access-data>
          </div>
        </div>
        <div class="pl30 pr10">
          <h4>合规判定</h4>
          <div style="height: calc(100% - 20px)">
            <compliance-info
              v-if="props.approveType === '0'"
              @get-List="getList"
              ref="complianceInfoRef"
              @handle-close="handleClose"
            ></compliance-info>
            <compliance-result v-else ref="complianceResultRef" @handle-close="handleClose"></compliance-result>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import accessData from './../../components/accessData/index.vue'
import complianceInfo from './../../components/complianceDeter/info.vue'
import complianceResult from './../../components/complianceDeter/result.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const emits = defineEmits(['getTableData'])
const props = defineProps<{
  approveType: string
}>()
const drawer = ref(false)
const direction = ref('rtl')
const logId = ref()
const detailData = ref({})
const complianceData = ref({})
const accessDataRef = ref()
const complianceInfoRef = ref()
const complianceResultRef = ref()
const hitList = ref([])
const handleClose = () => {
  drawer.value = false
}
const open = (id: any) => {
  logId.value = id
  drawer.value = true
  nextTick(() => {
    registerDetail()
    fetchOrgBlacklistHit(id)
  })
}
const getList = () => {
  emits('getTableData')
}
const registerDetail = async () => {
  const { code, data } = await Apis.registerAuditComplianceDetail({
    logId: logId.value
  })
  if (code !== 200) return
  detailData.value = data
  accessDataRef.value.handleData(detailData.value, hitList.value)
  approveJumpDetail(detailData.value.orgCategoryId)
}
const approveJumpDetail = async orgCategoryId => {
  const { code, data } = await Apis.registerAuditComplianceApproveJump({
    logId: logId.value
  })
  if (code !== 200) return
  complianceData.value = { ...data, orgCategoryId, logId: logId.value }
  props.approveType === '0'
    ? complianceInfoRef.value.handleData(complianceData.value)
    : complianceResultRef.value.handleData(complianceData.value)
}
const fetchOrgBlacklistHit = (id: number) => {
  // const { code, data } = Apis.findRegisterOrgBlacklistHit({ registerId: id })
  // if (code !== 200) return
  // hitList.value = data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.color-999 {
  color: #999;
}
</style>
<style lang="scss">
.compliance-detail-drawer {
  position: relative;
  .el-drawer__header {
    margin-bottom: 0;
  }
  .el-drawer__body {
    padding-top: 0;
  }
  .approval-type {
    position: absolute;
    width: 99px;
    height: 80px;
    left: 80px;
    top: 16px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
