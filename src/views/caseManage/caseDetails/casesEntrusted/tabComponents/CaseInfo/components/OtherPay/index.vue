<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  paymentUrl: {
    type: String,
    default: null
  }
})

const { paymentUrl } = toRefs(props)
</script>

<template>
  <div class="other-pay">
    <p>请复制下方还款帮助链接，发送给客户；</p>
    <p>您也可以访问下方链接查看还款方式，指导客户还款；</p>
    <div class="pay-container">
      <span>{{ paymentUrl }}</span>
      <el-button v-copy="paymentUrl" class="copy-btn" type="primary" size="default">复制链接</el-button>
      <div class="tips">
        <div style="font-weight: bold">特别注意：</div>
        <div>每个客户拥有唯一对应还款帮助链接，请勿随意发送！</div>
        <div>由此导致客户因还错账户造成的损失，将由您个人承担！</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.other-pay {
  font-size: 14px;
  color: #aaaaaa;
}
.pay-container {
  // width: 100%;
  background-color: #f2f2f2;
  width: 464px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #333;
    word-break: break-word;
  }
  .copy-btn {
    margin: 20px auto;
    // margin-left: 150px;
  }
  .tips {
    width: 438px;
    padding: 5px 10px;
    border: 1px solid #d9001b;
    background-color: #f9d4d8;
    color: #d9001b;
    padding: 10px;
    line-height: 18px;
    span {
      font-weight: bold;
    }
  }
}
</style>
