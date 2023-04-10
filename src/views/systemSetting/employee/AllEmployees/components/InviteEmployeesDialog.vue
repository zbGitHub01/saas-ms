<template>
  <el-dialog
    title="邀请员工"
    :model-value="props.dialogVisible"
    width="450px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    @open="handleOpen"
  >
    <template #default>
      <el-form ref="formRef" class="form" :model="form" :rules="rules" label-width="100">
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="员工手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入员工手机"></el-input>
        </el-form-item>
        <el-form-item label="入职部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择入职部门">
            <el-option label="部门1" value="1"></el-option>
            <el-option label="部门2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任职职位" prop="position">
          <el-select v-model="form.position" placeholder="请选择任职职位">
            <el-option label="职位1" value="1"></el-option>
            <el-option label="职位2" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading">生成邀请链接</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { phoneReg } from '@/utils/validate'
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:dialogVisible'])

const formRef = ref()
const form = reactive({
  name: '',
  phone: '',
  department: null,
  position: null
})
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入员工手机'))
  }
  if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  }
  if (!findPhone()) {
    callback(new Error('该手机号已被注册'))
  }
  callback()
}
const rules = reactive({
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  department: [{ required: true, message: '请选择入职部门', trigger: 'change' }],
  position: [{ required: true, message: '请选择任职职位', trigger: 'change' }]
})

const findPhone = () => {
  return false
}
const loading = ref(false)
const handleOpen = () => {
  emit('update:dialogVisible', true)
}
const beforeClose = () => {
  emit('update:dialogVisible', false)
}
const onSubmit = async () => {
  const isValidate = await formRef.value.validate().catch(() => {})
  if (!isValidate) return
}
</script>

<style lang="scss" scoped>
.form {
  margin-left: 30px;
}
.el-input {
  width: 210px;
}
</style>
