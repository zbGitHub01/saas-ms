<script setup>
import { reactive, toRefs, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  caseInfo: {
    type: Object,
    default: () => {}
  },
  principalSettlementInfo: {
    type: Object,
    default: () => {}
  }
})

const { data, caseInfo, principalSettlementInfo } = toRefs(props)
const state = reactive({
  caseNo: null,
  loading: false
})

const handleReduction = async () => {
  ElMessageBox.confirm('是否确认申请本金减免?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      state.loading = true
      const postData = {
        caseId: caseInfo.value.caseId,
        caseUserId: caseInfo.value.caseUserId
      }
      // const { code, msg } = await reductionprincipal(postData)
      // this.loading = false
      // if (code === 200) {
      //   this.$message.success(msg)
      //   this.$emit('refresh')
      // }
      // ElMessage.success('操作成功')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

watch(
  () => data.value,
  // eslint-disable-next-line no-unused-vars
  (newVal, _) => {
    if (newVal.length) state.caseNo = newVal[0].caseNo
  }
)

const currItem = computed(() => {
  const item = data.value.find(item => item.caseNo === state.caseNo)
  return item ? item : {}
})
</script>

<template>
  <div class="disposal-amount">
    <div class="title">
      <span>处置金额</span>
      <el-select v-model="state.caseNo" size="small">
        <el-option v-for="item in data" :key="item.caseNo" :label="item.caseNo" :value="item.caseNo" />
      </el-select>
    </div>
    <div class="table-wrap">
      <div class="table-box">
        <table class="table">
          <tr><th :colspan="2">处置结清金额</th></tr>
          <tr>
            <th>委案金额（+）</th>
            <td class="red">{{ currItem.entrustAmount }}</td>
          </tr>
          <tr>
            <th>还款入账（-）</th>
            <td class="green">{{ currItem.totalRefundAmount }}</td>
          </tr>
          <tr>
            <th>平台减免（-）</th>
            <td class="green">{{ currItem.totalReductionAmount }}</td>
          </tr>
          <tr>
            <th>剩余待还金额</th>
            <td class="red">{{ currItem.residueAmount }}</td>
          </tr>
        </table>
        <div v-if="principalSettlementInfo.buttonStatus !== 0 && caseNo === '处置案件合计'" class="button">
          <el-button
            :disabled="principalSettlementInfo.buttonStatus !== 1"
            :type="principalSettlementInfo.buttonStatus === 1 ? 'primary' : 'info'"
            :loading="loading"
            @click="handleReduction"
          >
            {{
              principalSettlementInfo.buttonStatus === 1
                ? '申请本金结清'
                : `再还¥${principalSettlementInfo.diffAmount}，可本金结清`
            }}
          </el-button>
        </div>
      </div>
      <table class="table">
        <tr><th :colspan="2">账单参考金额</th></tr>
        <tr>
          <th>应还本金（+）</th>
          <td>{{ currItem.cleanTransPrincipal }}</td>
        </tr>
        <tr>
          <th>应还利息（+）</th>
          <td>{{ currItem.cleanTransFee }}</td>
        </tr>
        <tr>
          <th>还款入账（-）</th>
          <td>{{ currItem.billTotalRefundAmount }}</td>
        </tr>
        <tr v-if="caseNo === '处置案件合计'">
          <th>其他收入（-）</th>
          <td>{{ currItem.billTotalOtherAmount }}</td>
        </tr>
        <tr>
          <th>平台减免（-）</th>
          <td>{{ currItem.billTotalReductionAmount }}</td>
        </tr>
        <tr>
          <th>剩余待还本金</th>
          <td>{{ currItem.billResiduePrincipal }}</td>
        </tr>
        <tr>
          <th>剩余待还利息</th>
          <td>{{ currItem.billResidueFee }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<style scoped lang="scss">
.disposal-amount {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
}
.table-wrap {
  display: flex;
  .table {
    flex: 1;
    .red {
      color: #d9001b;
    }
    .green {
      color: rgb(2, 131, 15);
    }
  }
  .table-box {
    flex: 1;
    margin-right: 20px;
  }
}
.button {
  margin-top: 20px;
  text-align: center;
}
.table,
.table th,
.table td {
  border: 1px solid #ebeef5;
  border-collapse: collapse;
  text-align: left;
  color: #606268;
  padding: 0 10px;
  font-size: 14px;
}

.table {
  width: 100%;
  th {
    width: 180px;
    text-align: center;
    height: 48px;
    background: #f6f8ff;
    color: #909399;
    font-size: 14px;
  }
  td {
    min-width: 200px;
  }
}
</style>
