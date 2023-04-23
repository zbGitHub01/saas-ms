<template>
  <el-form ref="formRef" class="form" :model="form" :rules="rules" hide-required-asterisk size="large">
    <el-form-item prop="password">
      <el-input v-model="form.password" type="password" placeholder="请输入密码最少8位，必须含有大写和小写及数字">
        <template #prefix>
          <el-icon class="input-icon"><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword">
      <el-input v-model="form.confirmPassword" type="password" placeholder="请输入确认密码">
        <template #prefix>
          <el-icon class="input-icon"><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="btn" type="primary" @click="onSubmit">确 定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { passwordReg } from '@/utils/validate'
import Apis from '@/api/modules/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref()
const form = reactive({
  password: '',
  confirmPassword: ''
})
const verifyPassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (!passwordReg.test(value)) {
    return callback(new Error('密码格式至少8位，必须含有大写和小写及数字'))
  }
  return callback()
}
const verifyConfirmPassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入确认密码'))
  }
  if (value !== form.password) {
    return callback(new Error('两次密码不一致'))
  }
  return callback()
}

const rules = reactive({
  password: [{ validator: verifyPassword, trigger: 'blur' }],
  confirmPassword: [{ validator: verifyConfirmPassword, trigger: 'blur' }]
})
const onSubmit = async () => {
  const isValidate = await formRef.value?.validate().catch(() => false)
  if (!isValidate) return
  const { code } = await Apis.setPassword({ password: form.password })
  if (code === 200) {
    await router.replace('/')
  }
}
</script>

<style lang="scss" scoped>
.btn {
  width: 100%;
  height: 46px;
  box-shadow: 0 10px 20px 0 rgba(49, 120, 255, 0.35);
}
</style>
