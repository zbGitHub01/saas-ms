<script setup>
import { ref, toRefs, reactive } from 'vue'
import More from './component/more.vue'
import MoreDialog from './component/moreDialog.vue'
import StopInfoDialog from './component/stopInfoDialog.vue'
import descriptionList from './config/descriptionList.js'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  }
})

const state = reactive({
  type: 1,
  title: '',
  key: ''
})

const { messageData } = toRefs(props)

const dialogMoreVisible = ref(false)
const dialogVisible = ref(false)

const onStopCase = () => (dialogVisible.value = true)

const open = () => {
  // getCaseRecordList()
  state.title = '案件评语'
  state.key = '案件评语'
  dialogMoreVisible.value = true
}
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
        <!--更多-->
        <More v-if="item.more" ref="more" :type="item.moreType" @open="open" />
      </el-descriptions-item>
    </el-descriptions>
    <!--查看历史记录-->
    <MoreDialog
      ref="moreDialog"
      v-model:dialog-visible="dialogMoreVisible"
      :title="state.title"
      :message-data="messageData"
      :type="state.type"
      @update-case-info="updateCaseInfo"
    />
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
