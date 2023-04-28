<template>
  <el-dialog
    v-model="dialogVisible"
    title="机构详情"
    width="900px"
    append-to-body
    :before-close="handleClose"
    top="5vh"
  >
    <div style="height: 670px">
      <div class="flx-align-center pb10">
        <div class="pr40">
          <span class="color-999">机构名：</span>
          {{ detailData.companyName }}
        </div>
        <div class="pr40">
          <span class="color-999">注册人姓名：</span>
          {{ detailData.username }}
        </div>
        <div class="pr40">
          <span class="color-999">对接邮箱：</span>
          {{ detailData.mail }}
        </div>
      </div>
      <div style="height: calc(100% - 20px)">
        <access-data
          :scrollTop="220"
          accessId="history-personal-info"
          :accessDetail="detailData"
          ref="accessDataRef"
        ></access-data>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import accessData from './../../components/accessData/index.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const dialogVisible = ref(false)
const detailData = ref({})
const accessDataRef = ref()
const hitList = ref([])

const open = (data: any) => {
  getOrgHistoryDetail(data)
  dialogVisible.value = true
}
const getOrgHistoryDetail = async params => {
  const { code, data } = await Apis.clientOrgHistoryDetail(params)
  if (code !== 200) return
  detailData.value = data
  accessDataRef.value.handleData(detailData.value, hitList.value)
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
.color-999 {
  color: #999;
}
</style>
