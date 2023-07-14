<template>
  <el-image-viewer v-if="visible" :url-list="props.urlList" :initial-index="props.zIndex" @close="onClose" />
</template>

<script setup>
import { ref } from 'vue'
import { ElImageViewer } from 'element-plus'
const props = defineProps({
  urlList: {
    type: Array,
    default: () => []
  },
  remove: {
    type: Function,
    default: () => {}
  },
  zIndex: {
    type: Number,
    default: 0
  }
})

const visible = ref(true)
const onClose = () => {
  visible.value = false
  props.remove()
}
defineExpose({ visible })
</script>

<style lang="scss" scoped></style>
