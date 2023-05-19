<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改处置状态"
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
  <script lang="ts" setup>
import { reactive, ref } from 'vue'
const colorShow = ref()
const emits = defineEmits(['submitForm'])
// 打开弹窗
const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
}
defineExpose({
  open
})
// 确认
const submitForm = () => {
  const params = {
    color: colorShow.value.radio
  }
  emits('submitForm', params)
  cancelSubmit()
}
// 取消
const cancelSubmit = () => {
  colorShow.value.radio = '100'
  dialogVisible.value = false
}
</script>
    
  <style lang="scss" scoped>
</style>