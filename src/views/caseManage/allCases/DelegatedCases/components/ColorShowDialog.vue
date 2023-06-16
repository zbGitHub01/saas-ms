<template>
  <el-dialog
    v-model="dialogVisible"
    title="案件标色"
    width="440px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <ColorShow ref="colorShow" />
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
import { reactive, ref } from 'vue'
import Apis from '@/api/modules/caseManage'
import { ElMessage, ElMessageBox } from 'element-plus'
const colorShow = ref()
const state = reactive({
  paramsSub: {}
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = paramsSub => {
  state.paramsSub = { ...paramsSub }
  dialogVisible.value = true
}
defineExpose({
  open
})
// 确认
const submitForm = async () => {
  const params = {
    color: colorShow.value.radio,
    ...state.paramsSub
  }
  console.log('案件标色：', params)
  await Apis.updateColor(params)
  ElMessage.success('标色成功！')
  emits('getTableData')
  cancelSubmit()
}
// 取消
const cancelSubmit = () => {
  colorShow.value.radio = 100
  dialogVisible.value = false
}
</script>
    
<style lang="scss" scoped>
</style>