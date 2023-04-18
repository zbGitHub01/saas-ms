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
    <el-date-picker v-model="value1" type="date" />
    <div class="calendar-wrap">
      <el-calendar v-model="newDate" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
// import DateTable from 'element-plus/es/components/date-picker/src/props/basic-date-table'

const newDate = ref(new Date())
const route = useRoute()
const testValue = ref('1')
const value1 = ref(new Date())
const test = 'test'
const device = 'device'
</script>

<style lang="scss" scoped>
.calendar-wrap {
  width: 340px;
  :deep(.el-calendar-table .el-calendar-day) {
    height: auto;
    text-align: center;
  }
  :deep(.el-calendar-table td) {
    border: none;
  }
}
</style>
