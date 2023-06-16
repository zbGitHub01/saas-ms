<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  },
  type: {
    type: Number,
    default: 1
  }
})

const { messageData } = toRefs(props)

console.log(messageData)
</script>

<template>
  <div class="items">
    <table style="width: 49%" class="newTable">
      <tr>
        <th v-if="type === 1" colspan="2">结清金额</th>
        <th v-else colspan="2">结清金额合计</th>
      </tr>
      <tr>
        <th>处置金额（+）</th>
        <td class="red_color">
          {{ messageData.handleAmount }}
        </td>
      </tr>
      <tr>
        <th>还款入账（-）</th>
        <td class="green_color">{{ messageData.totalRefundAmount }}</td>
      </tr>
      <tr>
        <th>平台减免（-）</th>
        <td class="green_color">{{ messageData.totalReductionAmount }}</td>
      </tr>
      <tr>
        <th>红包减免（-）</th>
        <td class="green_color">{{ messageData.totalCouponAmount }}</td>
      </tr>
      <tr>
        <th>积分抵扣（-）</th>
        <td class="green_color">{{ messageData.totalIntegralAmount }}</td>
      </tr>
      <tr>
        <th>剩余待还金额</th>
        <td class="red_font">{{ messageData.residueAmount }}</td>
      </tr>
      <tr>
        <th>委案金额</th>
        <td>{{ messageData.entrustAmount }}</td>
      </tr>
    </table>
    <table style="width: 49%" class="newTable">
      <tr>
        <th v-if="type === 1" colspan="2">
          账单金额
          <span class="text">（仅供参考，非结清标准）</span>
        </th>
        <th v-else colspan="2">
          账单金额合计
          <span class="text">（仅供参考，非结清标准）</span>
        </th>
      </tr>
      <tr>
        <th>应还本金（+）</th>
        <td class="red_color">{{ messageData.cleanTransPrincipal }}</td>
      </tr>
      <tr>
        <th>应还利息（+）</th>
        <td class="red_color">{{ messageData.cleanTransFee }}</td>
      </tr>
      <tr>
        <th>还款入账（-）</th>
        <td class="green_color">{{ messageData.totalRefundAmount }}</td>
      </tr>
      <template v-if="type === 2">
        <tr>
          <th>其他收入（-）</th>
          <td class="green_color">{{ messageData.billTotalOtherAmount }}</td>
        </tr>
        <tr>
          <th>平台减免（-）</th>
          <td class="green_color">{{ messageData.totalReductionAmount }}</td>
        </tr>
        <tr>
          <th>红包减免（-）</th>
          <td class="green_color">{{ messageData.totalCouponAmount }}</td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <th>平台减免（-）</th>
          <td class="green_color">{{ messageData.totalReductionAmount }}</td>
        </tr>
        <tr>
          <th>红包减免（-）</th>
          <td class="green_color">{{ messageData.totalCouponAmount }}</td>
        </tr>
        <tr>
          <th>积分抵扣（-）</th>
          <td class="green_color">{{ messageData.totalIntegralAmount }}</td>
        </tr>
      </template>
      <template v-if="type === 2">
        <tr>
          <th>积分抵扣（-）</th>
          <td class="green_color">{{ messageData.totalIntegralAmount }}</td>
        </tr>
        <tr>
          <th>剩余待还金额</th>
          <td class="red_font">{{ messageData.billResidueAmount }}</td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <th>剩余待还金额</th>
          <td class="red_font">{{ messageData.billResidueAmount }}</td>
        </tr>
      </template>
    </table>
  </div>
</template>
<style scoped lang="scss">
.red_color {
  color: #d9001b;
}
.red_font {
  color: #d9001b;
  font-weight: 700;
}
.green_color {
  color: #02830f;
}
.items {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.text {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}

.newTable,
.newTable th,
.newTable td {
  border: 1px solid #ebeef5;
  border-collapse: collapse;
  height: 48px;
  line-height: 48px;
  color: #7f7f7f;
  padding: 5px;
  text-align: center;
  font-size: 14px;
}

.newTable th {
  background-color: #f6f8ff;
}
</style>
