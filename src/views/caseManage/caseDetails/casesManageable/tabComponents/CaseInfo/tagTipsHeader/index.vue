<script setup>
import { toRefs, computed } from 'vue'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  }
})

const { messageData } = toRefs(props)

//计算是否有提示标签存在
const activeStyle = computed(() => {
  return messageData.value.isHistoryComplaint === 1 ||
    (messageData.value.caseTagAlertUserList && messageData.value.caseTagAlertUserList.length > 0) ||
    (messageData.value.caseUserComplaintPhoneInfoList && messageData.value.caseUserComplaintPhoneInfoList.length > 0)
    ? 'exist_tips'
    : 'absent_tips'
})
</script>

<template>
  <div :class="activeStyle">
    <div v-if="messageData.isHistoryComplaint === 1" class="complaint-history tip-text">
      <el-icon><Opportunity /></el-icon>
      <span>有投诉历史</span>
    </div>
    <div v-if="messageData.caseTagAlertUserList && messageData.caseTagAlertUserList.length > 0" class="tag-wrap">
      <div v-for="(item, index) in messageData.caseTagAlertUserList" :key="index" class="tag-item">
        <div class="tip-text tag-history">
          <SvgIcon name="tag" />
          <span>{{ item.tagAlertName }}</span>
        </div>
        <div>标记次数X{{ item.markCount }}</div>
      </div>
    </div>
    <div v-if="messageData.caseUserComplaintPhoneInfoList && messageData.caseUserComplaintPhoneInfoList.length > 0">
      <el-popover trigger="click" placement="bottom" width="320">
        <div style="margin-top: 10px">
          <div v-for="(item, index) in messageData.caseUserComplaintPhoneInfoList" :key="index" style="margin-bottom: 30px">
            <div class="sensitive-item">
              <div class="item-title">关联敏感号码:</div>
              <div>{{ item.complaintPhone }}</div>
            </div>
            <div class="sensitive-item">
              <div class="item-title">是否为停拨号码:</div>
              <div>{{ item.isPause === 0 ? '是' : '否' }}</div>
            </div>
            <div class="sensitive-item">
              <div class="item-title">是否关联投诉工单:</div>
              <div>{{ item.relateComplaintCount > 0 ? '是' : '否' }}</div>
            </div>
            <div class="sensitive-item">
              <div class="item-title">责任等级:</div>
              <div>{{ item.badGradeText }}</div>
            </div>
            <div class="sensitive-item">
              <div class="item-title">关联投诉工单数:</div>
              <div>{{ item.relateComplaintCount }}</div>
            </div>
          </div>
        </div>
        <template #reference>
          <div class="sensitive-wrap">
            <div class="sensitive-history tip-text">
              <SvgIcon name="sensitive" />
              <span>关联敏感号码数：{{ messageData.caseUserComplaintPhoneInfoList.length }}</span>
            </div>
            <span>查看</span>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<style scoped lang="scss">
.absent_tips {
  display: flex;
}
.exist_tips {
  display: flex;
  margin: 20px 0;
}
.complaint-history {
  background: #ff9921;
  margin-right: 30px;
}
.tips_history {
  width: 112px;
  margin-bottom: 20px;
  margin-right: 30px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  background: #ff9921;
}
.tag-wrap {
  display: flex;
  border-left: 1px solid #eee;
  .tag-item {
    display: flex;
    align-items: center;
    color: #f77896;
    margin: 0 8px;
    font-size: 14px;
  }
}
.tip-text {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}
.sensitive-wrap {
  display: flex;
  border-left: 1px solid #eee;
  align-items: center;
  color: #f77896;
  font-size: 14px;
  cursor: pointer;
  .sensitive-history {
    margin-left: 30px;
    background: #f77896;
    margin-right: 8px;
  }
}
.sensitive-item {
  display: flex;
  align-items: center;
  margin: 0 20px 10px;
  .item-title {
    width: 128px;
  }
}
.tag-history {
  background: #f77896;
  margin-right: 6px;
}
</style>
