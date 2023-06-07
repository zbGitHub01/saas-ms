<script setup>
import { reactive, ref, computed } from 'vue'
import componentsObj from './components/index.js'
const state = reactive({})

const messageData = {
  isHistoryComplaint: 1,
  caseTagAlertUserList: [
    { tagAlertName: 'test1', markCount: 2 },
    { tagAlertName: 'test2', markCount: 3 }
  ],
  caseUserComplaintPhoneInfoList: [
    {
      complaintPhone: '13732451480',
      isPause: 1,
      relateComplaintCount: 333,
      badGradeText: '重大'
    }
  ]
}

const activeNames = ref(['1', '2', '3', '4', '5'])

//计算是否有提示标签存在
const activeStyle = computed(() => {
  return messageData.isHistoryComplaint === 1 ||
    (messageData.caseTagAlertUserList && messageData.caseTagAlertUserList.length > 0) ||
    (messageData.caseUserComplaintPhoneInfoList && messageData.caseUserComplaintPhoneInfoList.length > 0)
    ? 'exist_tips'
    : 'absent_tips'
})

const handleChange = val => {
  console.log(val)
}
</script>

<template>
  <div>
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
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="基础信息" name="1">
        <component :is="componentsObj['BasicInformation']"></component>
      </el-collapse-item>
      <el-collapse-item title="案人资料" name="2">
        <component :is="componentsObj['BasicInformation']"></component>
      </el-collapse-item>
      <el-collapse-item title="联系方式" name="3"></el-collapse-item>
      <el-collapse-item title="借款/转让信息" name="4"></el-collapse-item>
      <el-collapse-item title="处置金额/还款方式" name="5"></el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
  &::before {
    content: '';
    height: 30px;
    width: 10px;
    border-left: 3px solid #02a7f0;
  }
}
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
