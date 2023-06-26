<template>
  <div class="number-range">
    <el-input-number v-model="props.modelValue[0]" :placeholder="startPlaceholder" :controls="false" @change="onChange" />
    <span class="range-separator">{{ rangeSeparator }}</span>
    <el-input-number v-model="props.modelValue[1]" :placeholder="endPlaceholder" :controls="false" @change="onChange" />
  </div>
</template>

<script setup>
const props = defineProps({
  rangeSeparator: {
    type: String,
    default: '-'
  },
  startPlaceholder: {
    type: String,
    default: '最小值'
  },
  endPlaceholder: {
    type: String,
    default: '最大值'
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])

const onChange = () => {
  emit('update:modelValue', props.modelValue)
}
</script>

<style lang="scss" scoped>
.number-range {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  .range-separator {
    padding: 0 8px;
  }
  :deep(.el-input__wrapper) {
    box-shadow: none;
  }
  :deep(.el-input-number) {
    width: 173px;
  }
}
</style>
