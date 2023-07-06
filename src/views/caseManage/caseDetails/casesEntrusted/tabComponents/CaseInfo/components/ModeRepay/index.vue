<script setup>
import { reactive, toRefs, ref } from 'vue'
import Repayment from './components/repayment.vue'
import Bank from './components/bank.vue'
import APay from './components/aPay.vue'

const props = defineProps({
  caseInfo: {
    type: Object,
    default: () => {}
  }
})

const { caseInfo } = toRefs(props)

const state = reactive({})

const activeName2 = ref('second')
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
