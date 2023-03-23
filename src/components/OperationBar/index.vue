<template>
  <div class="style-container">
    <el-dropdown class="dropdown" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ dropdownList[props.active - 1] }}
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :command="1">对选中项操作</el-dropdown-item>
          <el-dropdown-item :command="2">对查询结果操作</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <template>
      <slot />
    </template>
    <div class="checked-box">选中项：{{ props.selectTotal }}</div>
    <el-button size="medium" style="margin-left: 10px;" type="text" @click="clearChecked">取消</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  active: {
    type: Number,
    default: 1
  },
  selectTotal: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['clearChecked', 'update:active'])
const dropdownList = ref(['对选中项操作', '对查询结果操作'])
const handleCommand = val => {
  console.log(val, '----val')
  emit('clearChecked')
  emit('update:active', val)
}
const clearChecked = () => {
  emit('clearChecked')
}
</script>
<style lang="scss" scoped>
.el-dropdown-link {
  color: var(--el-color-primary);
  cursor: pointer;
}
.style-container {
  display: flex;
  align-items: center;
}
.checked-box {
  font-size: 14px;
  margin-left: 20px;
}
.dropdown {
  margin-right: 10px;
}
</style>
