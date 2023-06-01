<script setup>
import { ref } from 'vue'
import CaseCPEGather from './caseCPEGather/index.vue'
import CaseUnassignedGather from './caseUnassignedGather/index.vue'

const tabClick = () => {
  console.log(1)
}
const tabActive = ref('1')
</script>

<template>
  <div class="card-wrap">
    <el-tabs v-model="tabActive" class="mb20" @tab-click="tabClick">
      <el-tab-pane label="CPE持案汇总" name="1">
        <CaseCPEGather />
      </el-tab-pane>
      <el-tab-pane label="未分派案件汇总" name="2">
        <CaseUnassignedGather />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss"></style>
