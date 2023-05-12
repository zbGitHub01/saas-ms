<template>
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <div style="font-size: 15px" class="mb10">请选择导出内容</div>
    {{ state.exportField }}
    <div v-if="typeSub === 0">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange(0)">全选</el-checkbox>
      <el-checkbox-group v-model="state.exportField" @change="checked(0)">
        <el-divider content-position="left">基本信息</el-divider>
        <el-checkbox v-for="(item, index) in state.exportData.baseInfo" :label="index" :key="index" style="width: 12%">
          {{ item }}
        </el-checkbox>
        <el-divider content-position="left">金额/时间</el-divider>
        <el-checkbox v-for="(item, index) in state.exportData.amountTime" :label="index" :key="index" style="width: 12%">
          {{ item }}
        </el-checkbox>
        <el-divider content-position="left">处置相关</el-divider>
        <el-checkbox v-for="(item, index) in state.exportData.handleRelevant" :label="index" :key="index" style="width: 12%">
          {{ item }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <template v-if="typeSub === 1">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange(1)">全选</el-checkbox>
      <el-checkbox-group v-model="state.exportField" @change="checked(1)">
        <el-divider content-position="left">附件资料</el-divider>
        <el-checkbox v-for="(item, index) in state.exportData.followFile" :label="index" :key="index" style="width: 12%">
          {{ item }}
        </el-checkbox>
      </el-checkbox-group>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
const typeSub = ref(0)
const isIndeterminate = ref(false)
const checkAll = ref(false)
const state = reactive({
  exportData: [] as any,
  exportField: [] as any //选中项
})
// 打开弹窗
const dialogVisible = ref(false)
const open = (data, type) => {
  state.exportData = data
  typeSub.value = type
  dialogVisible.value = true
}
defineExpose({
  open
})
// 确认
const submitForm = () => {
    
}
// 取消
const cancelSubmit = () => {
  checkAll.value = false
  isIndeterminate.value = false
  state.exportField = []
  dialogVisible.value = false
}
// 全选
const handleCheckAllChange = type => {
  state.exportField = []
  isIndeterminate.value = false
  if (type === 0 && checkAll.value) {
    Object.keys(state.exportData.baseInfo).forEach(key => {
      state.exportField.push(key)
    })
    Object.keys(state.exportData.amountTime).forEach(key => {
      state.exportField.push(key)
    })
    Object.keys(state.exportData.handleRelevant).forEach(key => {
      state.exportField.push(key)
    })
  } else if (type === 1 && checkAll.value) {
    Object.keys(state.exportData.followFile).forEach(key => {
      state.exportField.push(key)
    })
  }
}
// 选择事件
const checked = type => {
  if (type === 0) {
    var length =
      Object.keys(state.exportData.baseInfo).length +
      Object.keys(state.exportData.amountTime).length +
      Object.keys(state.exportData.handleRelevant).length
  } else if (type === 1) {
    var length = Object.keys(state.exportData.followFile).length
  }
  console.log(length, state.exportField.length)
  if (state.exportField.length !== length && state.exportField.length !== 0) {
    isIndeterminate.value = true
  } else {
    isIndeterminate.value = false
    checkAll.value = state.exportField.length === 0 ? false : true
  }
}
</script>
    
<style lang="scss" scoped>
</style>  