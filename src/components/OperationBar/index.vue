<template>
  <div class="operation-bar">
    <div class="operation-bar-left">
      <el-dropdown v-if="active" class="dropdown" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ dropdownList[props.active - 1] }}
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="1">对选中项操作</el-dropdown-item>
            <el-dropdown-item :command="2">对查询结果操作</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <slot />
    </div>
    <div class="operation-bar-right">
      <slot name="tool"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  active: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['update:active'])
const dropdownList = ref(['对选中项操作', '对查询结果操作'])
const handleCommand = val => {
  emit('update:active', val)
}
</script>
<style lang="scss" scoped>
.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.operation-bar-left {
  display: flex;
  align-items: center;
}
.dropdown {
  margin-right: 10px;
}
.el-dropdown-link {
  cursor: pointer;
}
.checked-box {
  font-size: 14px;
  margin-left: 20px;
}
:deep(.el-dropdown){
  color: var(--el-color-primary);
}
</style>
