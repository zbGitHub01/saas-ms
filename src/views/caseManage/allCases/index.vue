<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive">
      <el-tab-pane label="可管理案件" name="1"></el-tab-pane>
      <el-tab-pane label="已委托案件" name="2"></el-tab-pane>
      <el-tab-pane label="委派处置案件" name="3"></el-tab-pane>
    </el-tabs>
    <ManageableCases v-show="tabActive === '1'" />
    <EntrustedCases v-show="tabActive === '2'" />
    <DelegatedCases v-show="tabActive === '3'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ManageableCases from './ManageableCases/index.vue'
import EntrustedCases from './EntrustedCases/index.vue'
import DelegatedCases from './DelegatedCases/index.vue'
const tabActive = ref('1')
</script>

<style lang="scss" scoped>
</style>
