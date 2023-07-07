<script setup>
import { ref, reactive, computed, toRefs } from 'vue'
import useCaseStore from '@/store/modules/caseInfo.js'
import Api from '@/api/modules/casesEntrusted'
import componentsObj from './components/index.js'
import ModeRepay from './components/ModeRepay/index.vue'
import OtherPay from './components/ModeRepay/index.vue'

const caseInfoStore = useCaseStore()

const state = reactive({
  caseInfo: {},
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
  state.caseInfo = data
}
const getExtInfoData = async caseId => {
  const { data } = await Api.getExtInfo({ caseId: caseId ? caseId : caseInfoStore?.caseId })
  // state.caseInfo = data
}
getCaseInfoData()
getExtInfoData()

//判断组件传值是否为空 解决异步传值组件渲染取不到props值的问题
const isEmpty = computed(() => Object.keys(state.caseInfo).length > 0)

const activeNames = ref(['1', '2', '3', '4', '5'])
const caseType = ref('0')

const handleChange = val => {
  console.log(val)
}

const tabChange = val => {
  getExtInfoData(val)
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
          :message-data="caseInfo"
          @get-case-info="getCaseInfoData"
        ></component>
      </el-collapse-item>
      <!--tabs切换-->
      <el-tabs v-model="caseType" class="tabs">
        <el-tab-pane name="0">
          <template #label>
            <span>
              本机构处置案件
              <strong class="strong">{{ caseInfo.debtCaseIdNoList ? caseInfo.debtCaseIdNoList.length : '' }}</strong>
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
                  <template v-if="isEmpty">
                    <OtherPay v-if="[22, 25].includes(caseInfo.productId)" :payment-url="state.paymentUrl"></OtherPay>
                    <ModeRepay v-else :case-info="caseInfo" />
                  </template>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <!--基础信息-->
          <el-collapse-item title="基础信息" name="3">
            <component :is="componentsObj['BasicInformation']" v-if="isEmpty" :message-data="caseInfo"></component>
          </el-collapse-item>
          <!--借款/转让信息-->
          <el-collapse-item title="借款/转让信息" name="4">
            <component
              :is="componentsObj['LoanTransferInformation']"
              v-if="isEmpty"
              :message-data="caseInfo"
              @tab-change="tabChange"
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
