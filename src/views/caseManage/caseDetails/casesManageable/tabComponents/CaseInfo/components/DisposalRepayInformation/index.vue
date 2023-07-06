<script setup>
import { toRefs, reactive, ref } from 'vue'
import useCaseStore from '@/store/modules/caseInfo.js'
import Api from '@/api/modules/casesManageable'
import CurrentCase from './component/currentCase.vue'
import OtherPay from './component/otherPay.vue'
import Repayment from './component/repayment.vue'
import Bank from './component/bank.vue'
import APay from './component/aPay.vue'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  }
})

const { messageData } = toRefs(props)

const caseInfoStore = useCaseStore()

const state = reactive({
  btnDisabled: false,
  repayPrice: 0,
  accountInfoIdList: [],
  accountInfoId: null,
  virtualAccountData: [], // 虚拟账户数据
  bankCardAccountData: [], // 银行卡账户数据
  alPayAccountData: [] // 支付宝账户数据
})

const { repayDataList, accountInfoIdList, alPayAccountData, virtualAccountData, bankCardAccountData } = toRefs(state)
const activeName1 = ref('first')
const activeName2 = ref('second')
const createDialogVisible = ref(false)

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
const onRadio = id => {
  state.virtualAccountData = state.accountInfoIdList.filter(item => item.accountInfoId === id)
}

//开通专属虚拟账户
const handleCreateVirtualAccount = repayData => {
  state.repayPrice = repayData.repayPrice
  createDialogVisible.value = true
}

const confirmHandle = () => {
  // const { caseId } = messageData
  // const params = {
  //   caseId,
  //   accountInfoId: state.accountInfoId
  // }
  // getVirtualAccount(params).then(res => {
  //   if (res.code === 200) {
  //     this.$message.success('操作成功，请稍后刷新页面查看')
  //     this.createDialogVisible = false
  //     this.btnDisabled = true
  //     setTimeout(() => {
  //       this.fetchRepayData()
  //     }, 5000)
  //   }
  // })
}

getRepayInfo()
</script>

<template>
  <div class="content">
    <div class="first_body">
      <div class="table_warp_title">处置金额</div>
      <el-tabs v-model="activeName1">
        <el-tab-pane label="共债合计" name="first">
          <CurrentCase
            ref="jointDebt"
            :message-data="messageData.debtCaseAmountInfo"
            :type="2"
            @get-detail="getDetail"
          ></CurrentCase>
        </el-tab-pane>
        <el-tab-pane label="当前案件" name="two">
          <CurrentCase
            ref="currentCase"
            :message-data="messageData.currentCaseAmountInfo"
            :type="1"
            @get-detail="getDetail"
          ></CurrentCase>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="second_body">
      <div class="table_warp_title" style="margin-bottom: 4px">还款方式</div>
      <OtherPay v-if="[22, 25].includes(messageData.productId)" :payment-url="paymentUrl"></OtherPay>
      <el-tabs v-else v-model="activeName2">
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
            :message-data="messageData"
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
    <!--开通虚拟账户-->
    <el-dialog v-model:visible="createDialogVisible" title="提示" width="25%" :before-close="handleClose">
      <div class="createDialogContent">
        <div>
          <el-icon><Warning /></el-icon>
          <span v-if="state.repayPrice > 0">是否确认开通专属还款账户？</span>
          <span v-else>当前案人关联债务已全部结清！</span>
        </div>
        <p v-if="!state.repayPrice > 0">是否确认继续开通专属还款账户？</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmHandle">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
  font-size: 18px;
  font-weight: 500;
}
:deep(.el-tabs__header) {
  margin-bottom: 20px !important;
}
.el-icon-question {
  color: #ccc;
}
.detail_newTable th {
  width: 12%;
  height: 20px;
  background-color: #f6f8ff;
}
.detail_newTable td {
  width: 21.4%;
  height: 20px;
}
.table_warp_title {
  margin-bottom: 4px;
}
</style>
