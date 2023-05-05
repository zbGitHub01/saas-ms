<template>
  <div>
    <el-drawer
      v-model="drawer"
      size="88%"
      :direction="direction"
      :before-close="handleClose"
      append-to-body
    >
      <template #header>
        <h4>机构详情</h4>
      </template>
      <template #default>
        <div class="flx-align-center pb10">
          <div class="w33">
            <span class="color-999">机构名：</span>
            {{ detailData.companyName }}
          </div>
          <div class="w33">
            <span class="color-999">注册人姓名：</span>
            {{ detailData.username }}
          </div>
          <div class="w33">
            <span class="color-999">注册手机号：</span>
            {{ detailData.phone }}
          </div>
        </div>
        <div class="flx-align-center">
          <h3>基础合作信息</h3>
          <el-divider content-position="right" style="flex: 1">
            <el-button type="primary" plain round @click="onBasicInfo">编辑</el-button>
          </el-divider>
        </div>
        <div class="flx-align-center pb10">
          <div class="w33">
            <span class="color-999">机构分类：</span>
            {{ detailData.orgCategoryName }}
          </div>
          <div class="w33">
            <span class="color-999">委外经理：</span>
            {{ detailData.entrustStaffName }}
          </div>
          <div class="w33">
            <span class="color-999">对接邮箱：</span>
            {{ detailData.mail }}
          </div>
        </div>
        <div class="flx-align-center pb10">
          <div class="w33">
            <span class="color-999">作业模式：</span>
            {{ detailData.orgModelName }}
          </div>
          <div class="w33">
            <span class="color-999">备注：</span>
            {{ detailData.remark }}
          </div>
          <div class="w33">
            <span class="color-999">限制IP地址：</span>
            {{ detailData.whiteIp ? detailData.whiteIp : '暂未限制IP' }}
          </div>
        </div>
        <div class="flx-align-center">
          <h3>准入资料</h3>
          <el-divider content-position="right" style="flex: 1">
            <el-button type="primary" plain round @click="onHistoryEdition">查看历史准入版本</el-button>
          </el-divider>
        </div>
        <div class="flx-align-center pb10">
          <div class="w25">
            <span class="color-999">评定标签：</span>
            {{ detailData.tagName }}
          </div>
          <div class="w25">
            <span class="color-999">准入时间：</span>
            {{ detailData.accessTime }}
          </div>
          <div class="w25">
            <span class="color-999">合规审批人：</span>
            {{ detailData.complianceHandlerName }}
          </div>
          <div class="w25">
            <span class="color-999">终审人：</span>
            {{ detailData.lastHandlerName }}
          </div>
        </div>
        <div style="height: calc(100% - 220px)">
          <access-data
            :scrollTop="420"
            accessId="org-personal-info"
            :accessDetail="detailData"
            ref="accessDataRef"
          ></access-data>
        </div>
      </template>
    </el-drawer>
    <basic-info-dialog ref="basicInfoDialogRef" @get-org-detail="getOrgDetail"></basic-info-dialog>
    <history-edition ref="historyEditionRef"></history-edition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import basicInfoDialog from './basicInfoDialog.vue'
import historyEdition from './historyEdition.vue'
import accessData from './../../components/accessData/index.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const drawer = ref(false)
const direction = ref('rtl')
const orgTenantId = ref()
const detailData = ref({})
const accessDataRef = ref()
const hitList = ref([])
const handleClose = () => {
  drawer.value = false
}
const open = (relationTenantId: number) => {
  orgTenantId.value = relationTenantId
  getOrgDetail()
  drawer.value = true
}

const getOrgDetail = async () => {
  const { code, data } = await Apis.clientOrgDetail({
    relationTenantId: orgTenantId.value
  })
  if (code !== 200) return
  detailData.value = data
  accessDataRef.value.handleData(detailData.value, hitList.value)
}
const basicInfoDialogRef = ref()
const onBasicInfo = () => {
  const { entrustStaffId, isWhiteIp, orgCategoryId, orgModelId, companyName, remark, whiteIp, mail } = detailData.value
  const params = {
    entrustStaffId,
    isWhiteIp,
    orgCategoryId,
    orgModelId,
    orgTitle: companyName,
    relationTenantId: orgTenantId,
    remark,
    whiteIp,
    mail
  }
  basicInfoDialogRef.value.open(params)
}
const historyEditionRef = ref()
const onHistoryEdition = () => {
  historyEditionRef.value.open(orgTenantId.value)
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.color-999 {
  color: #999;
}
.w33 {
  width: 33%;
}
.w25 {
  width: 25%;
}
</style>
