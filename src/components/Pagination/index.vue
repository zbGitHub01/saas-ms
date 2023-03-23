<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  total: {
    type: Number,
    required: true,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default: () => [10, 50, 100, 200]
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  authScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:page', 'update:pageSize', 'pagination'])

const currentPage = computed({
  get: () => props.page,
  set: page => emit('update:page', page)
})
const pageSize = computed({
  get: () => props.pageSize,
  set: limit => emit('update:pageSize', limit)
})
const handleSizeChange = size => {
  emit('pagination', { page: currentPage.value, pageSize: size })
}
const handleCurrentChange = page => {
  emit('pagination', { page: page, pageSize: pageSize.value })
}
</script>

<style scoped>
.el-pagination {
  float: right;
}
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  display: block;
}
.pagination-container.hidden {
  display: none;
}
</style>
