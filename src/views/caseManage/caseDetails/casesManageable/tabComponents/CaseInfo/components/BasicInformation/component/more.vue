<script setup>
import { reactive } from 'vue'

const props = defineProps({
  type: {
    type: Number,
    default: null
  }
})

const state = reactive({
  command: 1,
  command1: 2
})

const emit = defineEmits(['open'])

const handleClick = type => {
  emit('open', type, props.type)
}
</script>

<template>
  <div class="more">
    <el-dropdown placement="bottom-start" @command="handleClick">
      <el-icon size="18px" style="outline: none"><MoreFilled /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <template v-if="type !== 10">
            <el-dropdown-item :command="state.command">
              <el-icon><Edit /></el-icon>
              更新资料
            </el-dropdown-item>
          </template>
          <el-dropdown-item :command="state.command1">
            <el-icon><ChatDotSquare /></el-icon>
            历史记录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<style scoped lang="scss">
.more {
  position: relative;
  top: 4px;
  display: inline-flex;
  transform: rotate(90deg);
}
</style>
