<template>
  <el-dialog v-model="dialogVisible" title="退出原因" width="450px" :before-close="handleClose">
    <div style="margin: 0 50px">
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        :size="formSize"
        label-width="94px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="退出原因：" prop="name">
          <el-input v-model="form.name" placeholder="请输入退出原因" class="w300" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
const formSize = ref('default')
const ruleFormRef = ref()
const dialogVisible = ref(false)
const emits = defineEmits(['getTableData'])
const form = reactive({
  id: null,
  name: '',
  optionId: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const rules = reactive({
  name: [{ required: true, message: '请输入退出原因', trigger: 'blur' }]
})
const open = (categoryId, item) => {
  item?.id ? Object.assign(form, item) : Object.assign(form, defaultForm)
  form.optionId = categoryId
  dialogVisible.value = true
}
const doSave = async () => {
  const params = {
    ...form,
    type: 4 // 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
  }
  let data
  if (form.id) {
    data = await Apis.configUpdate(params)
  } else {
    data = await Apis.configAdd(params)
  }
  if (data.code !== 200) return
  const msg = form.id ? '修改成功' : '新增成功'
  ElMessage.success(msg)
  emits('getTableData')
  handleClose()
}
const handleClose = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
const submitForm = async formEl => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      doSave()
    }
  })
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.w300 {
  width: 300px !important;
}
</style>
