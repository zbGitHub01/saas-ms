<script setup>
import { ref, toRefs, reactive } from 'vue'
import CurrentCase from './component/currentCase.vue'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  }
})

const { messageData } = toRefs(props)

const state = reactive({
  repayDataList: [[], [], []]
})

const { repayDataList } = toRefs(state)

const activeName1 = ref(0)
</script>

<template>
  <div class="content">
    <div class="first_body">
      <div class="table_warp_title">处置金额</div>
      <el-tabs v-model="activeName1">
        <el-tab-pane label="共债合计" :name="0">
          <current-case
            ref="jointDebt"
            :message-data="messageData.debtCaseAmountInfo"
            :type="2"
            @get-detail="getDetail"
          ></current-case>
        </el-tab-pane>
        <el-tab-pane label="当前案件" :name="1">
          <current-case
            ref="currentCase"
            :message-data="messageData.currentCaseAmountInfo"
            :type="1"
            @get-detail="getDetail"
          ></current-case>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="second_body">
      <div class="table_warp_title">还款方式</div>
      <other-pay v-if="[22, 25].includes(messageData.productId)" :payment-url="paymentUrl"></other-pay>
      <el-tabs v-else v-model="activeName2">
        <el-tab-pane v-if="repayDataList[2].length && !!repayDataList[2][0].isEnable" label="专属还款账户" name="third">
          <div style="margin-left: 20px">
            <el-radio-group v-model="accountInfoId" @input="onRadio">
              <el-radio v-for="(item, index) in accountInfoIdList" :key="index" :label="item.accountInfoId">
                {{ item.bankProcessorText }}
              </el-radio>
            </el-radio-group>
          </div>
          <repayment
            v-if="repayDataList[2].length && repayDataList[2][0].accountNum"
            ref="repayment"
            :a-pay-data="repayDataList[2]"
            :message-data="messageData"
          ></repayment>
          <div v-else class="repaymentContent">
            <div>
              <el-icon><Warning /></el-icon>
              <span>当前欠款人尚未开通专属还款账户</span>
            </div>
            <p>点击下方按钮申请开通</p>
            <el-button type="primary" :disabled="btnDisabled" @click="HandleCreateVirtualAccount(repayDataList[2][0])">
              开通专属还款账户
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="repayDataList[0].length && repayDataList[0][0].accountNum" label="银行转账" name="second">
          <bank ref="bank" :a-pay-data="repayDataList[0]"></bank>
        </el-tab-pane>
        <el-tab-pane v-if="repayDataList[1].length && repayDataList[1][0].accountNum" label="支付宝" name="first">
          <div v-for="(item, index) in repayDataList[1]" :key="index">
            <aPay ref="aPay" :a-pay-data="item"></aPay>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style scoped lang="scss">
.content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .first_body,
  .second_body {
    width: 49%;
  }
}
.table_warp_title {
  margin-bottom: 4px;
}
</style>
