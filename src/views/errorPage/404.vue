<template>
  <div class="not-container">
    <img src="@/assets/images/404.png" class="not-img" alt="404" />
    <div class="not-detail">
      <h2>404</h2>
      <h4>抱歉，您访问的页面不存在~</h4>
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
