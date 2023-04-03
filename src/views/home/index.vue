<template>
  <div>
    <h1>hello home</h1>
    <h2>{{ test }}{{ device }}</h2>
    <el-icon color="pink">
      <svg-icon name="case-accept-icon"></svg-icon>
    </el-icon>
    <el-select v-model="testValue">
      <el-option label="测试1" value="1"></el-option>
      <el-option label="测试2" value="2"></el-option>
      <el-option label="测试3" value="3"></el-option>
      <el-option label="测试4" value="4"></el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const testValue = ref('1')
const test = 'test'
const device = 'device'
</script>

<style lang="scss" scoped></style>
