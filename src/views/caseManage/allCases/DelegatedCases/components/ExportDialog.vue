<template>
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    title="请选择导出内容"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange(0)">全选</el-checkbox>
      <el-checkbox-group v-model="state.exportField" @change="checked(0)">
        <el-divider content-position="left">基本信息</el-divider>
        <el-checkbox v-for="(item, index) in state.exportData.baseInfo" :label="index" :key="index" style="width: 12%">
          {{ item }}
        </el-checkbox>
        <!-- <el-divider content-position="left">金额/时间</el-divider>
        <el-checkbox v-for="(item, index) in state.exportData.amountTime" :label="index" :key="index" style="width: 12%">
          {{ item }}
        </el-checkbox>
        <el-divider content-position="left">处置相关</el-divider>
        <el-checkbox v-for="(item, index) in state.exportData.handleRelevant" :label="index" :key="index" style="width: 12%">
          {{ item }}
        </el-checkbox> -->
      </el-checkbox-group>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
const isIndeterminate = ref(false)
const checkAll = ref(false)
const disposalRecord = ref(false)
const emits = defineEmits(['submitExport'])
const state = reactive({
  exportData: [],
  exportField: [], //选中项
  date: [] //记录提交时间
})
// 打开弹窗
const dialogVisible = ref(false)
const open = data => {
  state.exportData = data
  dialogVisible.value = true
}
defineExpose({
  open
})
// 确认
const submitForm = () => {
  const params = {}
  params['exportField'] = state.exportField
  params['exportType'] = 0
  emits('submitExport', params)
  cancelSubmit()
}
// 取消
const cancelSubmit = () => {
  checkAll.value = false
  isIndeterminate.value = false
  state.exportField = []
  disposalRecord.value = false
  state.date = []
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
    // Object.keys(state.exportData.amountTime).forEach(key => {
    //   state.exportField.push(key)
    // })
    // Object.keys(state.exportData.handleRelevant).forEach(key => {
    //   state.exportField.push(key)
    // })
  } else if (type === 1 && checkAll.value) {
    Object.keys(state.exportData.followFile).forEach(key => {
      state.exportField.push(key)
    })
  }
}
// 选择事件
const checked = type => {
  if (type === 0) {
    var length = Object.keys(state.exportData.baseInfo).length
    // Object.keys(state.exportData.amountTime).length +
    // Object.keys(state.exportData.handleRelevant).length
  } else if (type === 1) {
    var length = Object.keys(state.exportData.followFile).length
  }
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