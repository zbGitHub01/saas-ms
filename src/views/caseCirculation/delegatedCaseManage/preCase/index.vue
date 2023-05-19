<script setup>
import { ref } from 'vue'
import ImportCase from './importCase/index.vue'
import ModelCase from './modelCase/index.vue'
import ProductCase from './productCase/index.vue'

const tabClick = () => {
  console.log(1)
}
const tabActive = ref('1')
</script>

<template>
  <div class="card-wrap">
    <el-tabs v-model="tabActive" class="mb20" @tab-click="tabClick">
      <el-tab-pane label="导入委案" name="1">
        <ImportCase />
      </el-tab-pane>
      <el-tab-pane label="模型委案" name="2">
        <ModelCase />
      </el-tab-pane>
      <el-tab-pane label="产品委案" name="3">
        <ProductCase />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss"></style>
