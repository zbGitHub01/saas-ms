<template>
  <div>
    <slot></slot>
    <pagination v-model:page-size="pageSize" v-model:page="page" :total="total" @pagination="onPagination" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Pagination from '@/components/Pagination/index.vue'

const props = defineProps({
  getData: {
    type: Function,
    default: () => {}
  }
})

const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const onPagination = () => {
  props.getData(page.value, pageSize.value)
}
const refreshPage = () => {
  onPagination()
}
defineExpose({ refreshPage })
</script>

<style lang="scss" scoped></style>
