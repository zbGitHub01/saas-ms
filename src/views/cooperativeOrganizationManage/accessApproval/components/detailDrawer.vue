<template>
  <div>
    <el-drawer
      v-model="drawer"
      size="1120"
      :direction="direction"
      :before-close="handleClose"
      append-to-body
      class="compliance-detail-drawer"
    >
      <template #default>
        <div style="height: 100%">
          <div style="height: calc(100% - 50px)">
            <h4>准入报告审批</h4>
            <div
              v-if="props.approveType !== '0' && props.approveType !== '4'"
              class="approval-type"
            >
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
                ref="accessDataRef"
                :scroll-top="260"
                access-id="compliance-personal-info"
                :access-detail="detailData"
              ></access-data>
            </div>
          </div>
          <div v-if="props.approveType === '0'" class="operate-btn">
            <el-button type="danger" plain @click="onApproval(1)">审批拒绝</el-button>
            <el-button type="primary" plain @click="onApproval(0)">审批通过</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
    <approve-operate ref="approveOperateRef" @get-List="getList" @handle-close="handleClose"></approve-operate>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import accessData from './../../components/accessData/index.vue'
import approveOperate from './approveOperate.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const emits = defineEmits(['getTableData'])
const props = defineProps({
  approveType: {
    type: String,
    default: ''
  }
})
const drawer = ref(false)
const direction = ref('rtl')
const logId = ref()
const detailData = ref({})
const accessDataRef = ref()
const approveOperateRef = ref()
const hitList = ref([])
const handleClose = () => {
  drawer.value = false
}
const onApproval = type => {
  const temData = {
    pageHandlerResult: detailData.value.handlerResult,
    registerId: detailData.value.registerId,
    logId: detailData.value.logId
  }
  approveOperateRef.value.open(type, temData, hitList.value)
}
const open = id => {
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
  const { code, data } = await Apis.registerAuditDetail({
    logId: logId.value
  })
  if (code !== 200) return
  detailData.value = data
  accessDataRef.value.handleData(detailData.value, hitList.value)
}
const fetchOrgBlacklistHit = id => {
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
  .operate-btn {
    position: absolute;
    bottom: 20px;
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
