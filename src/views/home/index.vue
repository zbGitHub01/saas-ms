<template>
  <div>
    <h1>hello home</h1>
    <h2>{{ test }}{{ device }}</h2>
    <el-icon color="pink">
      <svg-icon name="case-accept-icon"></svg-icon>
    </el-icon>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const test = 'test'
const device = 'device'
</script>

<style lang="scss" scoped></style>
