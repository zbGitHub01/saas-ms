<template>
  <el-dialog
    v-model="dialogVisible"
    title="案件分库"
    width="700px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <LabelClass :labelData="props.labelList" :label-obj="props.labelObjData" :isSpaceAround="true" :isBkgColor="false" />
      <el-divider></el-divider>
      <el-form :model="form" ref="ruleFormRef">
        <el-form-item label="操作维度" prop="isWithProductPublicDebt">
          <el-radio-group v-model="form.isWithProductPublicDebt" @change="radioChange">
            <el-radio :label="1">案人</el-radio>
            <el-radio :label="0">案件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标案件库">
          <el-select clearable v-model="form.targetStoreId" placeholder="请选择目标案件库">
            <el-option
              v-for="item in props.resouerdistList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import Apis from '@/api/modules/caseManage'
const form = reactive({
  isWithProductPublicDebt: 1,
  targetStoreId: null
})
const originFormData = JSON.parse(JSON.stringify(form))
const props = defineProps({
  labelList: {
    type: Object,
    default: () => ([])
  },
  labelObjData: {
    type: Object,
    default: ()=>{{}}
  },
  resouerdistList: {
    type: Array,
    default: () => []
  },
  sourceStoreId: {
    type: Number,
    default: null
  },
  taskId: {
    type: Number,
    default: null
  }
})
const emits = defineEmits(['getTableData', 'fetchCaseDistSelect', 'toggleSelection'])
// 打开弹窗
const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
  Object.assign(form, originFormData)
}
defineExpose({
  open
})
// 确认委派
const submitForm = async () => {
  let params = {
    taskId: props.taskId,
    sourceStoreId: props.sourceStoreId, //当前所在库的id
    targetStoreId: form.targetStoreId
  }
  await Apis.caseDistSave(params)
  ElMessage.success('分库成功！')
  emits('toggleSelection')
  emits('getTableData')
  dialogVisible.value = false
}
// 取消
const cancelSubmit = () => {
  dialogVisible.value = false
}
const radioChange = val => {
  emits('fetchCaseDistSelect', 1, !!val)
}
</script>
  
<style lang="scss" scoped>
</style>
  