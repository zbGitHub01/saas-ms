<template>
  <div class="pb20" style="calc(height: 100% - 20px); overflow-y: auto; width: 1200px">
    <score ref="scoreRef" :option-ids="props.categoryId" />
    <standard ref="standardRef" :option-ids="props.categoryId" />
    <decisionTag ref="decisionTagRef" :option-ids="props.categoryId" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import score from './score.vue'
import decisionTag from './decisionTag.vue'
import standard from './standard.vue'
const props = defineProps({
  categoryId: {
    type: String,
    default: ''
  }
})
const scoreRef = ref()
const standardRef = ref()
const decisionTagRef = ref()
const getConfigList = async () => {
  standardRef.value.getTableData()
  decisionTagRef.value.getTableData()
  scoreRef.value.getTableData()
}
defineExpose({
  getConfigList
})
</script>

<style scoped lang="scss"></style>
