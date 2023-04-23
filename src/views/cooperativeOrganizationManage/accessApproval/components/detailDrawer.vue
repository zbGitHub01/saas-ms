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
            <div class="flx-align-center pt10 pb10">
              <div class="mr40">
                <span class="color-999">机构名：</span>
                {{ state.detail.orgName }}
              </div>
              <div class="mr40">
                <span class="color-999">注册人姓名：</span>
                {{ state.detail.userName }}
              </div>
              <div class="mr40">
                <span class="color-999">注册手机号：</span>
                {{ state.detail.phone }}
              </div>
            </div>
            <div style="height: calc(100% - 66px)">
              <access-data :scrollTop="260" accessId="compliance-personal-info"></access-data>
            </div>
          </div>
          <div class="operate-btn">
            <el-button @click="onApproval(1)" type="danger" plain>审批拒绝</el-button>
            <el-button @click="onApproval(0)" type="primary" plain>审批通过</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
    <approve-operate ref="approveOperateRef"></approve-operate>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import accessData from './../../components/accessData/index.vue'
import approveOperate from './approveOperate.vue'
const props = defineProps<{
  approveType: string
}>()
const drawer = ref(false)
const direction = ref('rtl')
const approveOperateRef = ref()
const hitList = ref([])
interface stateParams {
  [key: string]: any
  detail: any
}
const state = reactive<stateParams>({
  detail: {},
  value4: []
})
const handleClose = () => {
  drawer.value = false
}
const onApproval = (type: number) => {
  const temData = {
    pageHandlerResult: state.detail.handlerResult,
    registerId: state.detail.registerId
  }
  approveOperateRef.value.open(type, temData, hitList.value)
}
const open = (detail: any) => {
  state.detail = {
    approveType: 1
  }
  drawer.value = true
  // state.detail = detail
  // fetchOrgBlacklistHit(detail)
}
const fetchOrgBlacklistHit = async (detail: any) => {
  // const { code, data } = await findRegisterOrgBlacklistHit({ registerId: detail.registerId })
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
}
</style>
