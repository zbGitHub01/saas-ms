<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }" key="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in matched" :key="item.path" :to="{ path: item.path }">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
const route = useRoute()
const matched = computed(() => route.matched.filter(item => item.meta && item.meta.title && item.meta.title !== '首页'))
</script>

<style lang="scss" scoped></style>
