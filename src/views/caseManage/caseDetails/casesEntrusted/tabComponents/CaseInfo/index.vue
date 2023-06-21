<script setup>
import { ref, reactive, computed, toRefs } from 'vue'
import useCaseStore from '@/store/modules/caseInfo.js'
import Api from '@/api/modules/casesManageable'
import componentsObj from './components/index.js'

const caseInfoStore = useCaseStore()

const state = reactive({
  messageData: {},
  caseInfo: {
    caseAmountInfo4OrgVoList: [
      {
        billResidueFee: 97233.05,
        billResiduePrincipal: 903687.76,
        billTotalOtherAmount: 0,
        billTotalReductionAmount: 0,
        billTotalRefundAmount: 0,
        caseNo: '处置案件合计',
        cleanTransFee: 97233.05,
        cleanTransPrincipal: 903687.76,
        entrustAmount: 5681.64,
        residueAmount: 5681.64,
        totalReductionAmount: 0,
        totalRefundAmount: 0
      },
      {
        billResidueFee: 3597.95,
        billResiduePrincipal: 3787.76,
        billTotalOtherAmount: null,
        billTotalReductionAmount: 0,
        billTotalRefundAmount: 0,
        caseNo: 'BE-BQ-0001040',
        cleanTransFee: 3597.95,
        cleanTransPrincipal: 3787.76,
        entrustAmount: 5681.64,
        residueAmount: 5681.64,
        totalReductionAmount: 0,
        totalRefundAmount: 0
      }
    ],
    debtCaseIdNoList: [
      {
        caseId: 40,
        caseNo: 'BE-BQ-0001040'
      },
      {
        caseId: 4650569,
        caseNo: 'MSD-JHKED-003'
      }
    ]
  },
  principalSettlementInfo: {
    buttonStatus: 0,
    diffAmount: 0
  },
  companyCaseExtInfo: {},
  calculationBasisInfo: {},
  paymentUrl: '' //捷信还款链接
})

const { caseInfo, principalSettlementInfo } = toRefs(state)

const getCaseInfoData = async () => {
  const { data } = await Api.getCaseInfoList({ caseId: caseInfoStore?.caseId })
  state.messageData = data
}
getCaseInfoData()

//判断组件传值是否为空 解决异步传值组件渲染取不到props值的问题
const isEmpty = computed(() => Object.keys(state.messageData).length > 0)

const activeNames = ref(['1', '2', '3', '4', '5'])
const caseType = ref('0')

const handleChange = val => {
  console.log(val)
}
</script>

<template>
  <div>
    <!--信息板块-->
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="案人资料" name="1">
        <component
          :is="componentsObj['CaseInformation']"
          v-if="isEmpty"
          :message-data="state.messageData"
          @get-case-info="getCaseInfoData"
        ></component>
      </el-collapse-item>
      <!--tabs切换-->
      <el-tabs v-model="caseType" class="tabs">
        <el-tab-pane name="0">
          <template #label>
            <span>
              本机构处置案件
              <strong class="strong">{{ caseInfo.debtCaseIdNoList.length }}</strong>
            </span>
          </template>
          <!--处置金额/还款方式-->
          <el-collapse-item title="处置金额/还款方式" name="2">
            <div class="disposal-case-wrap">
              <el-row :gutter="40">
                <el-col :span="12">
                  <component
                    :is="componentsObj['DisposalAmountInformation']"
                    v-if="isEmpty"
                    :data="caseInfo.caseAmountInfo4OrgVoList"
                    :case-info="caseInfo"
                    :principal-settlement-info="principalSettlementInfo"
                    @refresh="fetchPrincipalBtn"
                  ></component>
                </el-col>
                <el-col :span="12">
                  <div class="title">还款方式</div>
                  <!-- <other-pay v-if="[22, 25].includes(caseInfo.productId)" :payment-url="state.paymentUrl"></other-pay>
                <mode-repay v-else :case-info="caseInfo" /> -->
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <!--基础信息-->
          <el-collapse-item title="基础信息" name="3">
            <component :is="componentsObj['BasicInformation']" v-if="isEmpty" :message-data="state.messageData"></component>
          </el-collapse-item>
          <!--借款/转让信息-->
          <el-collapse-item title="借款/转让信息" name="4">
            <component
              :is="componentsObj['LoanTransferInformation']"
              v-if="isEmpty"
              :message-data="state.messageData"
            ></component>
          </el-collapse-item>
        </el-tab-pane>
        <el-tab-pane name="1">
          <template #label>
            <span>
              其他案件
              <strong class="strong">{{ otherCaseCount }}</strong>
            </span>
          </template>
          <debt-case v-model:other-case-count="otherCaseCount" />
        </el-tab-pane>
      </el-tabs>
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
.tabs {
  margin-top: 24px;
  ::v-deep .el-tabs__nav-wrap::after {
    content: none;
  }
  .strong {
    margin-left: 6px;
    font-size: 16px;
  }
}

.disposal-case-wrap {
  margin-top: 16px;
  .title {
    line-height: 32px;
    margin-bottom: 16px;
  }
}
.extend-inform {
  display: flex;
  margin-top: 24px;
}
</style>
