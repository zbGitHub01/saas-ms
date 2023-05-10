<template>
  <div class="not-container">
    <img src="@/assets/images/500.png" class="not-img" alt="500" />
    <div class="not-detail">
      <h2>500</h2>
      <h4>抱歉，您的网络不见了~️</h4>
      <el-button type="primary" @click="goBack()">返回</el-button>
      <el-button class="home-icon" link type="primary" @click="goHome()">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
const goHome = () => {
  router.replace({ path: '/home/index' })
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
