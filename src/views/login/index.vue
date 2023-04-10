<template>
  <div class="login-container">
    <img class="logo" :src="logoUrl" alt="logo" />
    <div class="login-left">
      <div class="login-bg-box">
        <img class="login-bg" :src="loginBg" alt="login-bg" />
      </div>
    </div>
    <div class="login-right">
      <h1 class="title">{{ loginTitle[loginType] }}</h1>
      <LoginForm v-if="loginType === 0" @success="successLogin" />
      <SelectBusiness v-if="loginType === 1" />
      <SetPassword v-if="loginType === 2" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import logoUrl from '@/assets/images/logo-black.png'
import loginBg from '@/assets/images/login-bg1.png'
import LoginForm from './components/LoginForm.vue'
import SelectBusiness from './components/SelectBusiness.vue'
import SetPassword from './components/SetPassword.vue'
import { useGlobalStore } from '@/store'

const globalStore = useGlobalStore()
const loginType = ref(0)
const loginTitle = ref(['Hi，您好，请登录！', '请选择您的企业！', '请设置密码！'])

const successLogin = () => {
  nextTick(() => {
    loginType.value = 1
  })
}
if (globalStore.token) {
  successLogin()
}
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
  .title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 80px;
  }
  :deep(.el-input__wrapper) {
    width: 400px;
    height: 46px;
    box-shadow: none;
    border: 1px solid #ced2d9;
  }
  .input-box {
    border: 1px solid #ced2d9;
    background-color: white;
    :deep(.el-input__wrapper) {
      border: none;
    }
    .append-btn {
      width: 320px;
    }
  }
  .btn {
    width: 100%;
    height: 46px;
    box-shadow: 0px 10px 20px 0px rgba(49, 120, 255, 0.35);
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
