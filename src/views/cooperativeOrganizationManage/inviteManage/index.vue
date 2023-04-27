<template>
  <div class="card-wrap padding-none">
    <h4 class="pl20 mb20">合作准入邀请</h4>
    <div class="invite-wrap pl40 pt40 pr40">
      <div v-if="inviteData.length === 0" class="empty-text">暂无合作邀请</div>
      <div v-for="(item, index) in inviteData" :key="index" class="flx-justify-between pb40 mb40">
        <div>
          <div class="tip-text" v-if="item.submitDate">
            <div class="mr40" v-if="item.inviteDate">准入邀请时间：{{ item.inviteDate }}</div>
            <div v-if="item.submitDate">准入提交时间：{{ item.submitDate }}</div>
          </div>
          <div v-else class="tip-text">
            <span class="mr12">{{ item.inviteDate }}</span>
            收到
          </div>
          <div
            class="org-text mt8 mb8"
            :class="{ 'color-999': item.inviteStatus === 7 }"
          >{{ item.orgName }}</div>
          <div v-if="!item.submitDate" class="tip-text">的合作邀请，点击进入该公司的合作准入流程</div>
        </div>
        <div class="flx-align-center" @click="jump(item)">
          <div>
            <div
              class="status-text"
              :style="{ color: statusData(item.inviteStatus, 'color') }"
            >{{ statusData(item.inviteStatus, 'text') }}</div>
            <div
              class="tip-text"
              v-if="item.inviteStatus === 5"
              :style="{ color: statusData(item.inviteStatus, 'color') }"
            >准入通过时间：{{ item.accessTime }}</div>
            <div
              class="tip-text"
              v-if="item.inviteStatus === 6"
              :style="{ color: statusData(item.inviteStatus, 'color') }"
            >准入拒绝时间：{{ item.approveRejectTime }}</div>
            <div
              v-if="item.inviteStatus === 7"
              class="tip-text"
              :style="{ color: statusData(item.inviteStatus, 'color') }"
            >{{ item.failureReason }}</div>
            <div
              v-if="[1,2,3,4].includes(item.inviteStatus)"
              class="tip-text"
              :style="{ color: statusData(item.inviteStatus, 'color') }"
            >{{ statusData(item.inviteStatus, 'tip') }}</div>
          </div>
          <div class="tip-text ml4" style="font-size: 24px" v-if="item.inviteStatus === 1">
            <el-icon>
              <ArrowRightBold />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowRightBold } from '@element-plus/icons-vue'
import Apis from '@/api/modules/cooperativeOrganization'
const inviteData = ref([])
const jump = item => {
  if (item.inviteStatus === 1) {
    window.open(item.url, '_blank')
  }
}
const statusData = computed(() => {
  return (val: number, type: string) => {
    const statusMap = new Map([
      [1, { text: '待提交准入资料', color: '#1FD881' }],
      [2, { text: '审核中-待邀请人审核', color: '#FFBE29', tip: '准入资料提交成功，请等待审核结果' }],
      [3, { text: '审核中-待合规审核', color: '#FFBE29', tip: '准入资料提交成功，请等待审核结果' }],
      [4, { text: '审核中-待最终审核', color: '#FFBE29', tip: '准入资料提交成功，请等待审核结果' }],
      [5, { text: '审核通过', color: '#247FFF' }],
      [6, { text: '审核未通过', color: '#F03B3B' }],
      [7, { text: '已失效', color: '#666666' }]
    ])
    const temObj = statusMap.get(val)
    return temObj[type]
  }
})
const getTableData = async () => {
  const { code, data } = await Apis.registerInviteList()
  if (code !== 200) return
  inviteData.value = data
}
onMounted(async () => {
  getTableData()
})
</script>

<style lang="scss" scoped>
.color-999 {
  color: #999;
}
.padding-none {
  padding: 20px 0 !important;
}
.invite-wrap {
  border-top: 1px solid #efefef;
  .tip-text {
    color: #999;
    font-size: 14px;
    display: flex;
  }
  .org-text {
    font-size: 20px;
    font-weight: bold;
  }
  .status-text {
    font-size: 18px;
    font-weight: bold;
    text-align: right;
  }
}
.empty-text {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 100px;
}
</style>
