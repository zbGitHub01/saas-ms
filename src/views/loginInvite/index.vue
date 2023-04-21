<template>
  <div class="login-container">
    <img class="logo" :src="logoUrl" alt="logo" />
    <div class="login-left">
      <div class="login-bg-box">
        <img class="login-bg" :src="loginBg" alt="login-bg" />
      </div>
    </div>
    <div class="login-right">
      <InviteForm v-if="isSetPassword" @change="setPasswordState" />
      <template v-else>
        <div class="title">请设置密码</div>
        <SetPassword />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import logoUrl from '@/assets/images/logo-black.png'
import loginBg from '@/assets/images/login-bg2.png'
import InviteForm from './InviteForm.vue'
import SetPassword from '../login/components/SetPassword.vue'

const isSetPassword = ref(1)

const setPasswordState = type => {
  isSetPassword.value = type
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
