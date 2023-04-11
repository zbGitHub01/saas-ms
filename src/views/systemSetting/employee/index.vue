<template>
  <div class="card-wrap">
    <el-tabs v-model="tabActive">
      <el-tab-pane label="所有员工" name="1">
        <AllEmployees />
      </el-tab-pane>
      <el-tab-pane label="机构部门" name="2">
        <OrgDepartment />
      </el-tab-pane>
      <el-tab-pane label="机构职位" name="3">
        <OrgPosition />
      </el-tab-pane>
      <el-tab-pane label="机构角色" name="4"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AllEmployees from './AllEmployees/index.vue'
import OrgDepartment from './OrgDepartment/index.vue'
import OrgPosition from './OrgPosition/index.vue'

const tabActive = ref('1')
</script>

<style lang="scss" scoped></style>
