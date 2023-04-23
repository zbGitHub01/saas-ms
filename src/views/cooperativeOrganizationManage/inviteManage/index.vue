<template>
  <div class="card-wrap padding-none">
    <h4 class="pl20 mb20">合作准入邀请</h4>
    <div class="invite-wrap pl40 pt40 pr40">
      <div v-if="inviteData.length === 0" class="empty-text">暂无合作邀请</div>
      <div v-for="(item, index) in inviteData" :key="index" class="flx-justify-between pb40 mb40">
        <div>
          <div v-if="item.time1" class="tip-text">
            <span class="mr12">{{ item.time1 }}</span>
            收到
          </div>
          <div v-if="item.time2" class="tip-text">
            <div class="mr40">准入邀请时间：{{ item.time2 }}</div>
            <div>准入提交时间：{{ item.time3 }}</div>
          </div>
          <div
            class="org-text mt8 mb8"
            :class="{ 'color-999': item.status === 5 }"
          >{{ item.orgName }}</div>
          <div v-if="item.time1" class="tip-text">的合作邀请，点击进入该公司的合作准入流程</div>
        </div>
        <div class="flx-align-center">
          <div>
            <div
              class="status-text"
              :style="{ color: statusData(item.status, 'color') }"
            >{{ statusData(item.status, 'text') }}</div>
            <div
              class="tip-text"
              :style="{ color: statusData(item.status, 'color') }"
            >{{ item.tip }}</div>
          </div>
          <div class="tip-text ml4" style="font-size: 24px" v-if="[1, 3, 4].includes(item.status)">
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
const inviteData = ref<any[]>([])
const data = [
  {
    time1: '2021-12-30 13:43:38',
    orgName: '江苏西岸企业管理咨询有限公司 ',
    status: 1,
    tip: ''
  },
  {
    time2: '2021-12-30 13:43:38',
    time3: '2021-12-04 13:43:38',
    orgName: '江苏西岸企业管理咨询有限公司 ',
    status: 2,
    tip: '准入通过时间：2021-11-12 23:23:30'
  },
  {
    time2: '2021-12-30 13:43:38',
    time3: '2021-12-30 13:43:38',
    orgName: '江苏西岸企业管理咨询有限公司 ',
    status: 3,
    tip: '准入资料提交成功，请等待审核结果'
  },
  {
    time2: '2021-12-30 13:43:38',
    time3: '2021-12-30 13:43:38',
    orgName: '江苏西岸企业管理咨询有限公司 ',
    status: 4,
    tip: '准入拒绝时间：2021-09-10 23:23:30'
  },
  {
    time1: '2021-12-30 13:43:38',
    orgName: '江苏西岸企业管理咨询有限公司 ',
    status: 5,
    tip: '超时未提供准入资料'
  },
  {
    time2: '2021-12-30 13:43:38',
    time3: '2021-12-30 13:43:38',
    orgName: '江苏西岸企业管理咨询有限公司 ',
    status: 5,
    tip: '审批超时'
  }
]
const statusData = computed(() => {
  return (val: number, type: string) => {
    const statusMap = new Map([
      [1, { text: '填写准入资料', color: '#1c9979' }],
      [2, { text: '合作中', color: '#5488f9' }],
      [3, { text: '审核中', color: '#ff9921' }],
      [4, { text: '审核未通过', color: '#ff4f0a' }],
      [5, { text: '已失效', color: '#999' }]
    ])
    const temObj = statusMap.get(val)
    return temObj[type]
  }
})
const getTableData = async () => {
  // const { code, data } = await otherRegisterApproveAllList({ ...params, ...queryParams })
  // if (code !== 200) return
  inviteData.value = data
  // state.total = data.total
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
