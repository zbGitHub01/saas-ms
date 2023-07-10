<script setup>
import { ref, toRefs, onMounted } from 'vue'
import PayInfo from './component/PayInfo.vue'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['tabChange'])

const { messageData } = toRefs(props)

/* state.messageData.caseTransferInfoVOList = [
  {
    loanPlatformUserId: 'BE-BQ-00fafafafa01017',
    loanPactNo: 'dsadaf',
    loanPactAmount: 'xxxx',
    loanArrivalAmount: 'fafafa',
    receiptBank: '2020-11-18',
    receiptBankCode: 'xxx邦恩-邦恩佰仟20201118',
    refundBank: '	fafaf',
    refundBankCode: '啦啦啦',
    loanTime: '啦啦啦',
    loanStartTime: '公司名称T79',
    loanEndTime: '2023-04-10 16:54:59',
    loanExpireTime: '	默认',
    loanPeriodType: '花园宝宝',
    loanPeriodNum: '2023-1-1',
    loanPeriodDuration: '无',
    loanPeriodRepay: 'A',
    loanProduct: 30,
    loanProductPrice: 30,
    loanFirstAmount: 30,
    loanBorrRate: 30,
    loanPeriod: 30,
    loanServeRate: 30,
    transBeforeRefundAmount: 30,
    transBeforeRefundPrincipal: 30,
    transBeforeRefundFee: 30,
    transAmount: 30,
    transPrincipal: 30,
    transFee: 30,
    transOther: 30,
    transAfterLprFee: 30,
    creditAmount: 30,
    loanIsPeriod: 1
  },
  {
    loanPlatformUserId: 'BE-BQ-0001017',
    loanPactNo: '邦恩佰仟',
    loanPactAmount: '哇哈哈',
    loanArrivalAmount: '测试债权方1',
    receiptBank: '2020-11-18',
    receiptBankCode: '	丽水邦恩-邦恩佰仟20201118',
    refundBank: '	正常',
    refundBankCode: '啦啦啦',
    loanTime: '啦啦啦',
    loanStartTime: '公司名称T79',
    loanEndTime: '2023-04-10 16:54:59',
    loanExpireTime: '	默认',
    loanPeriodType: '花园宝宝',
    loanPeriodNum: '2023-1-1',
    loanPeriodDuration: '无',
    loanPeriodRepay: 'A',
    loanProduct: 30,
    loanProductPrice: 30,
    loanFirstAmount: 30,
    loanBorrRate: 30,
    loanPeriod: 30,
    loanServeRate: 30,
    transBeforeRefundAmount: 30,
    transBeforeRefundPrincipal: 30,
    transBeforeRefundFee: 30,
    transAmount: 30,
    transPrincipal: 30,
    transFee: 30,
    transOther: 30,
    transAfterLprFee: 30,
    creditAmount: 30,
    loanIsPeriod: 2
  }
] */

const tabActive = ref('')

onMounted(() => {
  if (Object.keys(messageData.value).length < 1) return
  tabActive.value = messageData.value.debtCaseIdNoList[0]['caseId']
})

const tabClick = () => {
  emit('tabChange', tabActive.value)
}
</script>

<template>
  <div>
    <el-tabs v-model="tabActive" class="mb20" @tab-click="tabClick">
      <el-tab-pane v-for="item in messageData.debtCaseIdNoList" :key="item.caseId" :label="item.caseNo" :name="item.caseId">
        <PayInfo ref="payInfo" :message-data="item" :active-name="item.loanIsPeriod" @get-detail="getDetail" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-descriptions__label) {
  width: 180px !important;
}
:deep(.el-descriptions__content) {
  width: 350px !important;
}
</style>
