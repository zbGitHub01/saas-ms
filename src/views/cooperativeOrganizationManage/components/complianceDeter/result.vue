<template>
  <div style="height: 100%">
    <div class="mt12">
      <span>处置经验判断：</span>
      <span style="font-weight: bold">{{ complianceInfo.companyTypeName }}</span>
    </div>
    <div class="form-wrap" v-if="approveLogData.score > 0">
      <div class="form-list">
        <div
          v-for="(headItem, headIndex) in formHead"
          :key="headIndex"
          style="font-size: 14px"
          :style="{ width: headItem.width }"
        >{{ headItem.name }}</div>
      </div>
      <div>
        <div
          v-for="(scoreItem, scoreIndex) in approveLogData.approveJson"
          :key="scoreIndex"
          class="form-list"
        >
          <div :style="{ width: formHead[0].width }">
            <div class="score-name">{{ scoreItem.name }}</div>
          </div>
          <div :style="{ width: formHead[1].width }">
            <div style="width: 130px">{{ scoreItem.score }}</div>
          </div>
          <div :style="{ width: formHead[2].width }" style="display: inherit">
            <el-tooltip placement="top">
              <template #content>
                <div
                  v-for="(jsonItem, jsonIndex) in scoreItem.json"
                  :key="jsonIndex"
                  class="json-list"
                >
                  <div style="width: 80px">{{ jsonItem.scoreCriteria }}</div>
                  <div style="width: 80px">{{ jsonItem.scoreValue }}</div>
                </div>
              </template>
              <el-icon class="score-icon">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
          <div :style="{ width: formHead[3].width }">
            <div class="score-name" style="font-weight: inherit">{{ scoreItem.remark || '--' }}</div>
          </div>
        </div>
      </div>
      <div class="form-list" style="flex-direction: column; align-items: flex-start">
        <div style="display: flex">
          <div style="font-weight: bold; margin-top: 8px">综合得分：</div>
          <div class="total-score">{{ approveLogData.score }}</div>
        </div>
        <div class="tag-list" style="display: flex">
          <div style="font-weight: bold">判定标签：</div>
          <div style="flex: 1; font-weight: bold; font-size: 16px">{{ approveLogData.tagName }}</div>
        </div>
      </div>
      <div class="result-wrap">
        <div style="display: flex">
          <div style="font-weight: bold; margin-top: 6px">准入结论：</div>
          <div>
            <div
              class="score-standard actived-standard no-allow"
              v-if="approveLogData.accessType === 1"
            >拒绝准入</div>
            <div class="score-standard" v-if="approveLogData.accessType === 0">予以准入</div>
          </div>
        </div>
        <div class="mt18" v-if="approveLogData.accessType === 0">
          <div style="display: flex; line-height: 20px">
            <div style="font-weight: bold; width: 122px">拒绝原因总结：</div>
            <div style="flex: 1; font-weight: bold; font-size: 16px">{{ approveLogData.reason }}</div>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px; display: flex; line-height: 20px" v-if="approveLogData.remark">
        <div style="font-weight: bold; width: 50px">备注：</div>
        <div style="flex: 1">{{ approveLogData.remark }}</div>
      </div>
    </div>
    <div v-else style="margin: 150px 0 0 200px">暂未合规审批</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import Apis from '@/api/modules/cooperativeOrganization'
const approveLogData = ref({})
const emits = defineEmits(['handleClose'])
const props = defineProps({
  isBlackListHit: {
    type: Boolean
  }
})
const complianceInfo = ref({})
const formHead = [
  {
    name: '打分项',
    width: '150px'
  },
  {
    name: '评分',
    width: '140px'
  },
  {
    name: '评分标准',
    width: '90px'
  },
  {
    name: '备注',
    width: '150px'
  }
]
// 合规审批详情
const registerApproveLog = async () => {
  const { code, data } = await Apis.registerAuditComplianceApproveLog({ logId: complianceInfo.value.logId })
  if (code !== 200) return
  approveLogData.value = data ?? {}
  approveLogData.value.approveJson = JSON.parse(data.approveJson)
}
const handleData = (val: any) => {
  complianceInfo.value = val
  registerApproveLog()
}
defineExpose({
  handleData
})
</script>

<style lang="scss" scoped>
.form-wrap {
  height: calc(100% - 36px);
  overflow-y: auto;
  .form-list {
    display: flex;
    margin-top: 18px;
    border-bottom: 1px solid #eee;
    padding-bottom: 18px;
    align-items: center;
  }
  .score-name {
    width: 130px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
  }
  .total-score {
    font-weight: bold;
    font-size: 28px;
    color: #f00;
    margin-left: 80px;
    width: 80px;
  }
  .score-icon {
    width: 20px;
    font-size: 20px;
    margin-left: 22px;
    cursor: pointer;
    color: #999;
  }
  .tag-list {
    margin-top: 12px;
    flex: 1;
  }
  .result-wrap {
    margin-top: 18px;
  }
  .score-standard {
    width: 90px;
    text-align: center;
    height: 36px;
    line-height: 34px;
    margin: 0px 16px 0 0;
    border-radius: 4px;
    font-weight: bold;
    color: #fff;
    font-size: 16px;
    background: #11a144;
    border: 1px solid #11a144;
  }
  .no-allow {
    background: #f00 !important;
    border: 1px solid #f00 !important;
  }
}
.json-list {
  display: flex;
  height: 36px;
  line-height: 36px;
  div {
    width: 80px;
    text-align: center;
    border: 1px solid #fff;
    margin-left: -1px;
    margin-top: -1px;
  }
}
</style>
