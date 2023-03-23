<template>
  <div class="form-wrapper">
    <div class="pd20">
      <div v-show="isOperation" class="operation-wrap">
        <slot name="operation" />
      </div>
      <div class="form-box">
        <div class="form">
          <slot />
        </div>
        <div class="search-operation">
          <el-button type="primary" :icon="Search" @click="onSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="onReset">重置</el-button>
          <el-button v-if="packUp" type="text" class="search-isOpen" @click="onSwitch">
            {{ isOpen ? '合并' : '展开' }}
            <el-icon>
              <ArrowUp v-if="props.isOpen" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </div>
    </div>
    <div class="spacing"></div>
  </div>
</template>
<script setup>
import { ref, useSlots } from 'vue'
import { ArrowDown, ArrowUp, Search, Refresh } from '@element-plus/icons-vue'
const props = defineProps({
  packUp: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['search', 'reset', 'update:isOpen'])

const slot = useSlots()

const isOperation = ref(!!slot.operation)

const onSearch = () => {
  emit('search')
}
const onReset = () => {
  emit('reset')
}
const onSwitch = () => {
  emit('update:isOpen', !props.isOpen)
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  background-color: white;
  margin: 0 -20px 20px;
  border-radius: 4px;
  .pd20 {
    padding: 0 20px;
  }
  .operation-wrap {
    margin-bottom: 20px;
  }
  .form-box {
    display: flex;
  }
  .form {
    max-width: 100%;
  }
  .search-operation {
    margin-left: 20px;
    white-space: nowrap;
    .search-isOpen {
      margin-left: 20px;
    }
  }
}
.spacing {
  height: 10px;
  background-color: var(--color-main-bg);
}
</style>
