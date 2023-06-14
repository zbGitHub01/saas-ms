<script setup>
import { ref } from 'vue'
import ImportCase from './importCase/index.vue'
import ModelCase from './modelCase/index.vue'
import ProductCase from './productCase/index.vue'

const tabActive = ref('1')
</script>

<template>
  <div class="card-wrap">
    <el-tabs v-model="tabActive" class="mb20">
      <el-tab-pane label="导入委案" name="1">
        <ImportCase v-if="Number(tabActive) === 1" lazy />
      </el-tab-pane>
      <el-tab-pane label="模型委案" name="2">
        <ModelCase v-if="Number(tabActive) === 2" lazy />
      </el-tab-pane>
      <el-tab-pane label="产品委案" name="3">
        <ProductCase v-if="Number(tabActive) === 3" lazy />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss"></style>
