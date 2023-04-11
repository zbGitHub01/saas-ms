<template>
  <el-form ref="formRef" class="form" :model="form" :rules="rules" hide-required-asterisk size="large">
    <el-form-item prop="username">
      <el-input v-model="form.username" placeholder="请输入手机号码">
        <template #prefix>
          <el-icon class="input-icon"><Iphone /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="!grantType" prop="code">
      <div class="input-box">
        <el-input v-model="form.code" class="append-btn" placeholder="请输入验证码" @keyup.enter="onSubmit">
          <template #prefix>
            <el-icon class="input-icon"><Lock /></el-icon>
          </template>
        </el-input>
        <el-button class="code-btn mr10" type="primary" link :disabled="gapTime !== 61" @click="sendSMS">
          {{ verifyContent }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item v-else prop="password">
      <el-input v-model="form.password" show-password placeholder="请输入密码" @keyup.enter="onSubmit">
        <template #prefix>
          <el-icon class="input-icon"><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="btn" type="primary" @click="onSubmit">登 录</el-button>
    </el-form-item>
    <div class="foot-btn">
      <el-button type="primary" link @click="switchLogin">{{ grantType === 0 ? '密码登录' : '验证码登录' }}</el-button>
    </div>
  </el-form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useGlobalStore } from '@/store'
import { phoneReg } from '@/utils/validate'
import { aesEncrypt } from '@/utils'
import { sendSmsCode } from '@/api/modules/user'

const emit = defineEmits(['success'])

const globalStore = useGlobalStore()
const formRef = ref()
const form = reactive({
  username: '15869164852',
  password: '',
  code: ''
})
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号码'))
  }
  if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  }
  callback(undefined)
}
const rules = reactive({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
const grantType = ref(0)
const switchLogin = () => {
  grantType.value = grantType.value === 0 ? 1 : 0
}
const gapTime = ref(61)
const verifyContent = computed(() => (gapTime.value < 61 && gapTime.value > 0 ? `${gapTime.value}秒后重新获取` : '获取验证码'))

const sendSMS = async () => {
  if (gapTime.value < 61 && gapTime.value > 0) {
    return
  }
  const isValidate = await formRef.value?.validateField('username').catch(() => false)
  if (!isValidate) return
  const result = await fetchSendSmsCode()
  if (result) {
    gapTime.value -= 1
    cutDownTime()
  }
}
const cutDownTime = () => {
  const timer = window.setInterval(() => {
    gapTime.value -= 1
    if (gapTime.value <= 0) {
      clearInterval(timer)
      gapTime.value = 61
    }
  }, 1000)
}
const fetchSendSmsCode = async () => {
  const { code } = await sendSmsCode(form.username)
  return code === 200
}
const onSubmit = async () => {
  const isValidate = await formRef.value?.validate().catch(() => false)
  if (!isValidate) return
  const postData = { grant_type: grantType.value ? 'password' : 'SMS' }
  if (grantType.value === 1) {
    postData.username = form.username
    postData.password = aesEncrypt(form.password)
  } else {
    postData.mobile = `SMS@${form.username}`
    postData.code = form.code
  }
  const result = await globalStore.login(postData)
  if (result) {
    emit('success')
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 400px;
  :deep(.el-input__wrapper) {
    //width: 400px;
    height: 46px;
    box-shadow: none;
    border: 1px solid #ced2d9;
  }
  .input-box {
    border: 1px solid #ced2d9;
    border-radius: 4px;
    background-color: white;
    box-sizing: border-box;
    :deep(.el-input__wrapper) {
      border: none;
      width: 312px;
      height: 44px;
    }
  }
}
.append-btn {
  width: 268px;
}
.code-btn {
  display: inline-block;
  width: 120px;
  text-align: right;
}
.btn {
  width: 100%;
  height: 46px;
  box-shadow: 0 10px 20px 0 rgba(49, 120, 255, 0.35);
}
.foot-btn {
  text-align: center;
  margin-top: 10px;
}
</style>
