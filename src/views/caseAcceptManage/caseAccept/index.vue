<template>
  <h1>hello caseAccept</h1>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(!!route.hash, '---route')
</script>

<style scoped></style>
