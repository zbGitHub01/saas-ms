<script setup>
import { ref, toRefs } from 'vue'
import StopInfoDialog from './component/stopInfoDialog.vue'
import descriptionList from './config/descriptionList.js'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  }
})

const { messageData } = toRefs(props)

// const messageData = {
//   caseNo: 'BE-BQ-0001017',
//   productName: '邦恩佰仟',
//   originCreditor: '哇哈哈',
//   creditorName: '测试债权方1',
//   transTime: '2020-11-18',
//   batchNo: '	丽水邦恩-邦恩佰仟20201118',
//   caseStatusText: '	正常',
//   ivrTag: '啦啦啦',
//   robotTag: '啦啦啦',
//   orgTitle: '公司名称T79',
//   entrustTime: '2023-04-10 16:54:59',
//   entrustTypeText: '	默认',
//   cpeName: '花园宝宝',
//   allotTime: '2023-1-1',
//   remark: '无',
//   caseLevel: 'A',
//   caseStatus: 30
// }
const dialogVisible = ref(false)

const onStopCase = () => (dialogVisible.value = true)
</script>

<template>
  <div>
    <el-descriptions class="margin-top" :column="3" size="default" border>
      <el-descriptions-item v-for="(item, index) in descriptionList" :key="index" align="center">
        <template #label>
          <div class="cell-item">{{ item.label }}</div>
        </template>
        {{ messageData[item.prop] }}
        <!--按键状态查看明细按钮-->
        <span
          v-if="item.prop === 'caseStatusText' && messageData.caseStatus === 30"
          style="color: #ff9921; margin-left: 8px; cursor: pointer"
          @click="onStopCase"
        >
          查看明细
        </span>
        <el-popover v-if="['ivrTag', 'robotTag'].includes(item.prop)" placement="bottom" width="250" trigger="hover">
          <div>A - 本人接通，且承诺还款</div>
          <div>B - 本人接通，但拒绝还款</div>
          <div>C - 本人可联，未接通</div>
          <div>D - 本人失联，紧急联系人可联</div>
          <div>E - 本人和紧急联系人都失联</div>
          <template #reference>
            <el-icon><QuestionFilled /></el-icon>
          </template>
        </el-popover>
      </el-descriptions-item>
    </el-descriptions>
    <!--查看明细弹窗-->
    <StopInfoDialog v-model:dialog-visible="dialogVisible" />
  </div>
</template>
<style scoped lang="scss">
:deep(.el-descriptions__label) {
  width: 180px !important;
}
:deep(.el-descriptions__content) {
  width: 350px !important;
}
</style>
