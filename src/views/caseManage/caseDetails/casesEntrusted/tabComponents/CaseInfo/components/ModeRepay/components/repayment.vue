<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  },
  aPayData: {
    type: Array,
    default: () => []
  }
})
const { messageData, aPayData } = toRefs(props)
</script>

<template>
  <div>
    <p class="tableTip">
      注意：该账户仅限于
      <span>{{ messageData.productName }}</span>
      /
      <span>{{ messageData.userName }}</span>
      的回款收款使用，请勿透露给他人或用于其他产品回款！还款转账时无需填写备注。
    </p>
    <table v-for="item in aPayData" :key="item.accountNum" style="width: 100%" class="detail_newTable">
      <tr>
        <th>开户行</th>
        <td>{{ item.bankOfDeposit }}</td>
      </tr>
      <tr>
        <th>开户名</th>
        <td>{{ item.accountName }}</td>
      </tr>
      <tr>
        <th>账户</th>
        <td style="white-space: pre-wrap">{{ item.accountNum }}</td>
      </tr>
      <tr>
        <th>结清金额</th>
        <td>{{ item.repayPrice }}</td>
      </tr>
    </table>
  </div>
</template>
<style scoped lang="scss">
.tableTip {
  font-size: 14px;
  color: #d9001b;
  span {
    font-weight: 700;
  }
}
</style>
