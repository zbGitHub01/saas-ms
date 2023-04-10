<template>
  <div class="login-container">
    <img class="logo" :src="logoUrl" alt="logo" />
    <div class="login-left">
      <div class="login-bg-box">
        <img class="login-bg" :src="loginBg" alt="login-bg" />
      </div>
    </div>
    <div class="login-right">
      <h1 class="title">张兮兮，你好！</h1>
      <h2>丽水海量企业管理合伙企业(有限合伙)邀请您加入公司！</h2>
      <div class="cell">
        <div class="label">任职部门：</div>
        <div class="value">财务中心-清算部</div>
      </div>
      <div class="cell">
        <div class="label">担任职位：</div>
        <div class="value">清算专员</div>
      </div>
      <el-form ref="formRef" class="form" :model="form" :rules="rules" hide-required-asterisk size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入手机号码">
            <template #prefix>
              <el-icon class="input-icon"><Iphone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div class="input-box">
            <el-input v-model="form.code" class="append-btn" placeholder="请输入验证码">
              <template #prefix>
                <el-icon class="input-icon"><Lock /></el-icon>
              </template>
            </el-input>
            <el-button class="code-btn mr10" type="primary" link :disabled="gapTime !== 61" @click="sendSMS">
              {{ verifyContent }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" @click="onSubmit">登 录</el-button>
        </el-form-item>
        <div class="tips">
          <span>完成登录即代表成功加入企业</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import logoUrl from '@/assets/images/logo-black.png'
import loginBg from '@/assets/images/login-bg2.png'
import { phoneReg } from '@/utils/validate'
import { sendSmsCode } from '@/api/modules/user'

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
const onSubmit = async () => {}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 100%;
  min-height: 550px;
  background-image: url('@/assets/images/login-bg.png');
  background-position: left bottom;
  background-repeat: no-repeat;
}
.input-icon {
  color: #3178ff;
  font-size: 18px;
}
.logo {
  position: absolute;
  left: 80px;
  top: 40px;
  width: 242px;
  height: 55px;
}
.login-left {
  width: 900px;
  margin-left: 80px;
  .login-bg-box {
    .login-bg {
      width: 100%;
      height: 100%;
    }
  }
}
.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 700px;
  height: 100%;
  background-color: #eaf3ff;
  h1, h2, .cell {
    width: 400px;
    text-align: left;
  }
  .title {
    font-size: 36px;
    font-weight: bold;
    color: var(--el-color-primary);
    margin-bottom: 10px;
  }
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .cell {
    display: flex;
    font-size: 18px;
    .value {
      font-weight: bold;
    }
  }
  :deep(.el-input__wrapper) {
    width: 400px;
    height: 46px;
    box-shadow: none;
    border: 1px solid #ced2d9;
  }
  .form {
    width: 400px;
    margin-top: 60px;
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
    .append-btn {
      width: 268px;
    }
    .code-btn {
      display: inline-block;
      width: 120px;
      text-align: right;
    }
  }
  .btn {
    width: 100%;
    height: 46px;
    box-shadow: 0px 10px 20px 0px rgba(49, 120, 255, 0.35);
  }
  .tips {
    position: relative;
    margin-top: 36px;
    font-size: 12px;
    color: #666;
    line-height: 26px;
    text-align: center;
    &:after {
      position: absolute;
      left: 40px;
      right: 40px;
      top: 14px;
      z-index: 0;
      content: '';
      height: 1px;
      background-color: #ccc;
    }
    span {
      position: relative;
      padding: 0 10px;
      z-index: 2;
      background-color: #eaf3ff;
    }
  }
}
@media screen and (max-width: 1100px) {
  .login-left {
    display: none;
  }
  .logo {
    display: none;
  }
  .login-right {
    width: 100% !important;
  }
}
</style>
