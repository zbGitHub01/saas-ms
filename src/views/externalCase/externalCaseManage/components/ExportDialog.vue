<template>
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    title="请选择导出内容"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <!-- <div style="font-size: 15px" class="mb10">请选择导出内容</div> -->
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
      <el-divider content-position="left">处置记录</el-divider>
      <el-checkbox v-model="disposalRecord">处置记录表</el-checkbox>
      <el-divider content-position="left">记录筛选</el-divider>
      <label style="fontweight: 500" class="mr5">记录提交时间:</label>
      <el-date-picker
        v-model="state.date"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </template>
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
const typeSub = ref(0)
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
  const params = {}
  params['exportField'] = state.exportField
  params['exportType'] = 0
  if (typeSub.value === 1) {
    params['createTimeStart'] = state.date[0]
    params['createTimeEnd'] = state.date[1]
    params['isExportExcel'] = disposalRecord.value
  }
  emits('submitExport', params, typeSub.value)
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