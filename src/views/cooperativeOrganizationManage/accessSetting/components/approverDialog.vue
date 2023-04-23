<template>
  <el-dialog v-model="dialogVisible" title="审批人" width="450px" :before-close="handleClose">
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
        <el-form-item label="审批人：" prop="handlerId">
          <el-select clearable v-model="form.handlerId" filterable placeholder="请选择审批人">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
const emits = defineEmits(['updateItem'])
const userList = ref([])
const form = reactive({
  handlerId: ''
})
const rules = reactive<FormRules>({
  handlerId: [{ required: true, message: '请选择审批人', trigger: 'change' }]
})
const open = (item?: any) => {
  item?.id && Object.assign(form, item)
  employeeList()
  dialogVisible.value = true
}
const doSave = () => {
  const temData = userList.value.filter((item: any) => item.id === form.handlerId)[0]
  emits('updateItem', temData)
  handleClose()
}
const handleClose = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
const employeeList = async () => {
  const { code, data } = await Apis.clientEmployeeList()
  if (code !== 200) return
  userList.value = data
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
