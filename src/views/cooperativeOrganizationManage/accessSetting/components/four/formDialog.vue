<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="450px" :before-close="handleClose">
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
        <el-form-item label="标签名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" class="w300" />
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

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const emits = defineEmits(['getTableData'])
const form = reactive({
  id: null,
  name: '',
  optionId: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
})
const open = (categoryId: string, item?: any) => {
  dialogTitle.value = item?.id ? '编辑标签' : '添加标签'
  item?.id && Object.assign(form, item)
  form.optionId = categoryId
  dialogVisible.value = true
}
const doSave = async () => {
  const params = {
    ...form,
    type: 6 // 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
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
const submitForm = async (formEl: FormInstance | undefined) => {
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
