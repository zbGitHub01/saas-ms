<template>
  <div class="card-wrap">
    <h1>hello businessInfo</h1>
    <el-input v-model="text"></el-input>
    <el-button type="primary">大小</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const text = ref('')
</script>

<style lang="scss" scoped>

</style>
