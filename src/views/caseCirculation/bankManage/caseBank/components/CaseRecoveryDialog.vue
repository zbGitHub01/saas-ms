<template>
  <el-dialog
    v-model="dialogVisible"
    title="实时收回"
    width="700px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <LabelClass :labelData="props.caseInfo" :isSpaceAround="true" :isBkgColor="false" />
      <el-form ref="ruleFormRef" class="backform" label-position="top" label-width="90px">
        <el-form-item label="操作维度">
          <el-radio-group v-model="isWithProductPublicDebt" @change="radioChange">
            <el-radio :label="1">案人</el-radio>
            <el-radio :label="0">案件</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="warning_warp">
          <div>
            <el-icon style="font-size: 40px"><InfoFilled /></el-icon>
          </div>
          <div>
            {{
              isWithProductPublicDebt === 1
                ? '与已选待收回案件关联的同案人案件将会被同时被收回'
                : '关联同一分期还款计划中的案件会被强制共同收回'
            }}
            <br />
            请明确留案案件、未失效留案分期还款关联案件、未失效普通分期还款关联案件的收回策略。
          </div>
        </div>
        <el-form-item label="普通留案案件">
          <el-radio-group v-model="isRecoverRetain">
            <el-radio :label="0">不收回</el-radio>
            <el-radio :label="1">强制收回</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="留案分期还款计划关联案件" class="radio">
          <el-radio-group v-model="retainStagingPlan">
            <el-radio :label="0">不收回留案分期还款案件</el-radio>
            <el-radio :label="1">只收回未签署协议的分期还款案件</el-radio>
            <el-radio :label="3">强制收回全部留案分期还款案件</el-radio>
          </el-radio-group>
          <div class="isShow-warp" v-if="retainStagingPlan === 1 || retainStagingPlan === 3">
            <el-radio-group v-model="radio">
              <el-radio :label="0">收回后保留分期还款计划</el-radio>
              <el-radio :label="1">收回后将分期还款计划置为失效</el-radio>
              <el-radio v-if="retainStagingPlan === 3" :label="2">收回后将未签署分期协议的分期还款计划置为失效</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="普通分期还款计划案件">
          <el-radio-group v-model="stagingPlan">
            <el-radio :label="0">不收回关联案件</el-radio>
            <el-radio :label="1">强制收回关联案件</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import Apis from '@/api/modules/caseManage'
const isWithProductPublicDebt = ref(1)
const isRecoverRetain = ref(0)
// const stagingPlan = ref(0)
// const retainStagingPlan = ref(0)
// const radio = ref(0)
// 接收props数据
const props = defineProps({
  caseInfo: {
    type: Object,
    default: () => ({})
  },
  taskId: {
    type: Number,
    default: null
  }
})
const emits = defineEmits(['getTableData', 'fetchCaseDistSelect', 'toggleSelection'])
// 打开弹窗
const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
}
defineExpose({
  open
})
//确认回收
const submitForm = () => {
  ElMessageBox.confirm('是否确认本次操作?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    async () => {
      const params = {
        isRecoverRetain: isRecoverRetain.value,
        taskId: props.taskId,
        // stagingPlan: stagingPlan.value,
        // retainStagingPlan: retainStagingPlan.value === 0 ? retainStagingPlan.value : parseInt(retainStagingPlan.value) + parseInt(radio.value),
        recoverType: 1
      }
      console.log(params)
      await Apis.recoverNowSave(params)
      ElMessage.success('操作成功！')
      emits('getTableData')
      emits('toggleSelection')
      cancelSubmit()
    },
    res => {
      ElMessage.info('已取消')
      console.log(res)
    }
  )
}
// 取消
const cancelSubmit = () => {
  isRecoverRetain.value = 0
  isWithProductPublicDebt.value = 1
  // stagingPlan.value = 0
  // retainStagingPlan.value = 0
  // radio.value = 0
  dialogVisible.value = false
}
const radioChange = val => {
  emits('fetchCaseDistSelect', 2, !!val)
}
</script>
  
<style lang="scss" scoped>
// .allTab {
//   height: 40px;
//   margin-bottom: 40px;
//   .tab {
//     width: 33%;
//     height: 40px;
//     border-radius: 2px;
//     padding: 5px;
//     justify-content: flex-start;
//     .icon {
//       font-size: 35px;
//       margin-right: 4px;
//     }
//     .title {
//       color: #cccccc;
//     }
//     .money {
//       font-weight: 500;
//     }
//   }
// }
.warning_warp {
  margin: -12px 0 14px 0;
  padding: 10px;
  border: 1px solid #ff9921;
  border-radius: 6px;
  background-color: #fffcdc;
  color: #ff9921;
  display: flex;
  div:first-child {
    padding: 0 10px;
  }
  div:nth-child(2) {
    line-height: 20px;
    margin-right: 10px;
  }
}
.backform {
  :deep(.el-form-item__label) {
    padding: 0;
  }
  :deep(.el-form-item__content) {
    margin-left: 30px;
  }
}
.radio {
  .isShow-warp {
    border-radius: 6px;
    background-color: #f2f2f2;
    padding: 15px 20px;
    margin: 5px;
    width: 460px;
  }
  :deep(.el-radio-group) {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }
}
</style>