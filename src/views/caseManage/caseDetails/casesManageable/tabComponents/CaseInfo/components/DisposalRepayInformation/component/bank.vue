<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  aPayData: {
    type: Array,
    default: () => []
  }
})

const { aPayData } = toRefs(props)
</script>

<template>
  <div>
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
        <td>{{ item.accountNum }}</td>
      </tr>
      <tr>
        <th>还款备注</th>
        <td>{{ item.repayNote }}</td>
      </tr>
      <tr>
        <th>结清金额</th>
        <td>{{ item.repayPrice }}</td>
      </tr>
    </table>
  </div>
</template>
<style scoped lang="scss">
.detail_newTable,
.detail_newTable th,
.detail_newTable td {
  border: 1px solid #ededed;
  border-collapse: collapse;
  min-height: 48px;
  text-align: left;
  color: #666666;
  padding: 14px 9px;
  font-size: 14px;
}
.detail_newTable th {
  text-align: center;
  background: #f5f7fa;
  min-height: 48px;
}
</style>
