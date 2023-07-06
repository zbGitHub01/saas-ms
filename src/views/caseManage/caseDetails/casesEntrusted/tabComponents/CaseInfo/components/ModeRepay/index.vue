<script setup>
import { reactive, toRefs, ref } from 'vue'
import Api from '@/api/modules/casesEntrusted'
import useCaseStore from '@/store/modules/caseInfo.js'
import Repayment from './components/repayment.vue'
import Bank from './components/bank.vue'
import APay from './components/aPay.vue'

const props = defineProps({
  caseInfo: {
    type: Object,
    default: () => {}
  }
})

const caseInfoStore = useCaseStore()

const { caseInfo } = toRefs(props)

const state = reactive({
  btnDisabled: false,
  repayPrice: 0,
  accountInfoIdList: [],
  accountInfoId: null,
  virtualAccountData: [], // 虚拟账户数据
  bankCardAccountData: [], // 银行卡账户数据
  alPayAccountData: [] // 支付宝账户数据
})

const activeName2 = ref('second')

const { repayDataList, accountInfoIdList, alPayAccountData, virtualAccountData, bankCardAccountData } = toRefs(state)

//获取还款信息
const getRepayInfo = async () => {
  const params = {
    caseId: caseInfoStore?.caseId,
    typeList: [1, 2, 3]
  }
  const { data } = await Api.repayInfo(params)
  console.log(data)
  //假数据
  const obj = [
    {
      accountType: 2,
      accountTypeText: '支付宝账户',
      repayHelpVOList: [
        {
          accountInfoId: 15,
          accountName: 'non',
          accountNum: 'bangenqiye@163.com',
          accountType: {
            type: 2,
            desc: '支付宝账户'
          },
          bankOfDeposit: 'non',
          bankProcessorText: null,
          creditorName: '丽水邦恩企业管理合伙企业(有限合伙)',
          isEnable: true,
          repayNote: '马海山\t260112',
          repayPrice: 7266.75
        }
      ]
    },
    {
      accountType: 1,
      accountTypeText: '银行卡账户',
      repayHelpVOList: [
        {
          accountInfoId: 35,
          accountName: '丽水邦恩企业管理合伙企业（有限合伙）',
          accountNum: '18230000000089639',
          accountType: {
            type: 1,
            desc: '银行卡账户'
          },
          bankOfDeposit: '华夏银行丽水分行（联行号：304343021081）',
          bankProcessorText: '华夏银行',
          creditorName: '丽水邦恩企业管理合伙企业(有限合伙)',
          isEnable: true,
          repayNote: '马海山\t260112',
          repayPrice: 7266.75
        }
      ]
    }
  ]
  obj.map(item => {
    if (item.accountType === 1) state.bankCardAccountData = item.repayHelpVOList
    if (item.accountType === 2) state.alPayAccountData = item.repayHelpVOList
    if (item.accountType === 3) {
      state.virtualAccountData = item.repayHelpVOList
      state.accountInfoId = state.virtualAccountData[0].accountInfoId
      state.accountInfoIdList = JSON.parse(JSON.stringify(state.virtualAccountData))
      state.virtualAccountData = [state.accountInfoIdList[0]]
    }
  })
  console.log(repayDataList)
  activeName2.value = state.virtualAccountData.length ? 'third' : 'second'
}

getRepayInfo()
</script>

<template>
  <div>
    <el-tabs v-model="activeName2">
      <el-tab-pane v-if="virtualAccountData.length && !!virtualAccountData[0].isEnable" label="专属还款账户" name="third">
        <div style="margin-left: 20px">
          <el-radio-group v-model="state.accountInfoId" @input="onRadio">
            <el-radio v-for="(item, index) in accountInfoIdList" :key="index" :label="item.accountInfoId">
              {{ item.bankProcessorText }}
            </el-radio>
          </el-radio-group>
        </div>
        <Repayment
          v-if="virtualAccountData.length && virtualAccountData[0].accountNum"
          ref="repayment"
          :a-pay-data="virtualAccountData"
          :message-data="caseInfo"
        ></Repayment>
        <div v-else class="repaymentContent">
          <div>
            <el-icon><Warning /></el-icon>
            <span>当前欠款人尚未开通专属还款账户</span>
          </div>
          <p>点击下方按钮申请开通</p>
          <el-button type="primary" :disabled="btnDisabled" @click="handleCreateVirtualAccount(virtualAccountData[0])">
            开通专属还款账户
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="bankCardAccountData.length && bankCardAccountData[0].accountNum" label="银行转账" name="second">
        <Bank ref="bank" :a-pay-data="bankCardAccountData"></Bank>
      </el-tab-pane>
      <el-tab-pane v-if="alPayAccountData.length && alPayAccountData[0].accountNum" label="支付宝" name="first">
        <div v-for="(item, index) in alPayAccountData" :key="index">
          <APay ref="aPay" :a-pay-data="item"></APay>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped lang="scss"></style>
