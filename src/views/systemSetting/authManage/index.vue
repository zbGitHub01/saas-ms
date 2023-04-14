<template>
  <div class="card-wrap">
    <el-tabs v-model="tabActive">
      <el-tab-pane label="部门权限" name="1">
        <DeptAuth />
      </el-tab-pane>
      <el-tab-pane label="角色权限" name="2"></el-tab-pane>
      <el-tab-pane label="员工最终权限" name="3"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DeptAuth from './DeptAuth/index.vue'

const tabActive = ref('1')
</script>

<style lang="scss" scoped></style>
