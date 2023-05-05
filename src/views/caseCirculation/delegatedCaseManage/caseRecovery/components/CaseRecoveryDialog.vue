<template>
  <el-dialog
    v-model="dialogVisible"
    title="实时收回"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <span>
      <div class="flx-justify-between allTab">
        <div class="flx-justify-between tab">
          <el-icon class="icon"><Memo /></el-icon>
          <div>
            <div class="title">选中案件数</div>
            <div class="money">{{ props.caseInfo.caseNum }}</div>
          </div>
        </div>
        <div class="flx-justify-between tab">
          <el-icon class="icon"><UserFilled /></el-icon>
          <div>
            <div class="title">选中案人数</div>
            <div class="money">{{ props.caseInfo.personNum }}</div>
          </div>
        </div>
        <div class="flx-justify-between tab">
          <el-icon class="icon"><Money /></el-icon>
          <div>
            <div class="title">预计分库金额</div>
            <div class="money">{{ props.caseInfo.totalAmount }}</div>
          </div>
        </div>
      </div>
      <el-form ref="ruleFormRef" label-position="right" label-width="90px">
        <el-form-item label="操作维度：">
          <el-radio-group v-model="isWithProductPublicDebt" @change="radioChange">
            <el-radio :label="1">案人</el-radio>
            <el-radio :label="0">案件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="留案案件：">
          <el-radio-group v-model="radio">
            <el-radio :label="0">不收回</el-radio>
            <el-radio :label="1">强制收回</el-radio>
          </el-radio-group>
        </el-form-item>
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
  
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
const isWithProductPublicDebt = ref(1)
const radio = ref(0)
// 接收props数据
const props = defineProps<{
  caseInfo: any
  taskId: any
}>()
const emits = defineEmits(['getTableData', 'fetchRecoverNowSelect', 'toggleSelection'])
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
    () => {
      const params = {
        isRecoverRetain: radio.value,
        taskId: props.taskId
      }
      console.log(params)
      // 请求
      // const { code, msg } = await xx(params)
      // if(code !== 200){
      //   return ElMessage.error(msg)
      // }
      ElMessage.success('操作成功！')
      emits('getTableData')
      emits('toggleSelection')
      dialogVisible.value = false
    },
    res => {
      ElMessage.info('已取消')
      console.log(res)
    }
  )
}
// 取消
const cancelSubmit = () => {
  radio.value = 0
  isWithProductPublicDebt.value = 1
  dialogVisible.value = false
}
const radioChange = val => {
  emits('fetchRecoverNowSelect', !!val)
}
</script>
  
<style lang="scss" scoped>
.allTab {
  height: 40px;
  margin-bottom: 40px;
  .tab {
    width: 33%;
    height: 40px;
    border-radius: 2px;
    padding: 5px;
    justify-content: flex-start;
    .icon {
      font-size: 35px;
      margin-right: 4px;
      // color: blue;
    }
    .title {
      color: #cccccc;
    }
    .money {
      font-weight: 500;
    }
  }
}
</style>
  