<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="right" label-width="120px">
        <el-form-item label="分库名称：" prop="itemText">
          <el-input v-model="form.itemText" placeholder="请输入分库名称" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="form.status" :disabled="operateStatus === 1">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
const form = reactive({
  itemId: null,
  itemText: '',
  status: null
})
const operateStatus = ref(0)
const title = ref('')
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  itemText: [{ required: true, trigger: 'blur', message: '分库名称不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (row, type) => {
  if (type === 1) {
    title.value = '添加分库'
    operateStatus.value = 0
  } else if (type === 2) {
    title.value = '编辑分库'
    form.itemId = row.itemId
    form.itemText = row.itemText
    form.status = row.status
    operateStatus.value = row.operateStatus
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
// 添加/编辑
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(form)
      // await xx(form)
      ElMessage.success('操作成功！')
      emits('getTableData')
      formEl.resetFields()
      dialogVisible.value = false
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
</script>
  
<style lang="scss" scoped>
</style>
  