<script setup>
import { ref } from 'vue'
import TagTipsHeader from './tagTipsHeader/index.vue'
import componentsObj from './components/index.js'

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

const handleChange = val => {
  console.log(val)
}
</script>

<template>
  <div>
    <!--标签提示块-->
    <TagTipsHeader :message-data="messageData" />
    <!--信息板块-->
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="基础信息" name="1">
        <component :is="componentsObj['BasicInformation']"></component>
      </el-collapse-item>
      <el-collapse-item title="案人资料" name="2">
        <component :is="componentsObj['CaseInformation']"></component>
      </el-collapse-item>
      <el-collapse-item title="联系方式" name="3">
        <component :is="componentsObj['ContactInformation']"></component>
      </el-collapse-item>
      <el-collapse-item title="借款/转让信息" name="4">
        <component :is="componentsObj['LoanTransferInformation']"></component>
      </el-collapse-item>
      <el-collapse-item title="处置金额/还款方式" name="5">
        <component :is="componentsObj['DisposalRepayInformation']"></component>
      </el-collapse-item>
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
</style>
