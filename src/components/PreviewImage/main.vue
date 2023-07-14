<template>
  <el-image-viewer v-if="props.visible" :url-list="props.urlList" :initial-index="props.zIndex" @close="onClose" />
</template>

<script setup>
import { ElImageViewer } from 'element-plus'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
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
const emit = defineEmits(['update:visible'])

const onClose = () => {
  emit('update:visible', false)
  props.remove()
}
</script>

<style lang="scss" scoped></style>
