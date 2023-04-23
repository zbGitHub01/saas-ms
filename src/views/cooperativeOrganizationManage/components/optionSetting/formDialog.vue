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
        <el-form-item :label="detailData.label" prop="name">
          <el-input
            clearable
            v-model="form.name"
            :placeholder="detailData.placeholder"
            class="w300"
          />
        </el-form-item>
        <el-form-item label="是否启用:" prop="isOpen">
          <el-radio-group v-model="form.isOpen">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
import type { FormInstance, FormRules } from 'element-plus'
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const detailData = reactive({
  name: '',
  label: '',
  placeholder: '',
  pageType: '',
  formType: ''
})
const emits = defineEmits(['updateSelect'])
const form = reactive({
  id: null,
  name: null,
  isOpen: 0
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
})
const open = (stateData: any, type: string, row?: any) => {
  const { name, label, placeholder } = stateData.detail
  detailData.name = name
  detailData.label = label
  detailData.placeholder = placeholder
  detailData.pageType = type
  detailData.formType = stateData.type
  dialogTitle.value = type === 'add' ? `添加${name}` : `编辑${name}`
  row?.id && Object.assign(form, row)
  dialogVisible.value = true
}
const doSave = () => {
  const params = {
    id: form.id,
    name: form.name,
    isOpen: form.isOpen,
    code: detailData.formType
  }
  const msg = detailData.pageType === 'edit' ? '修改成功' : '新增成功'
  emits('updateSelect', params, msg)
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
