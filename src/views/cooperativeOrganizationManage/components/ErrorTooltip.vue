<template>
  <el-tooltip
    effect="light"
    popper-class="sensitivity-tooltip"
    :content="props.text"
    placement="right"
  >
    <el-icon class="icon">
      <WarningFilled />
    </el-icon>
  </el-tooltip>
</template>

<script setup>
import { WarningFilled } from '@element-plus/icons-vue'
const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.error-tips {
  color: #f56c6c;
  font-size: 12px;
  font-weight: normal;
  margin-left: 2px;
}
.icon {
  margin-left: 4px;
  color: #f56c6c;
  cursor: pointer;
  vertical-align: middle;
}
</style>
