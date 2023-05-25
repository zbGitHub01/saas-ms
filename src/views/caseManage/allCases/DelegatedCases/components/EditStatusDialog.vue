<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改处置状态"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" ref="ruleFormRef" label-width="100px" label-position="right">
        <el-form-item label="处置状态:" prop="followStatusId">
          <el-select clearable v-model="form.followStatusId" placeholder="请选择处置状态">
            <el-option v-for="(item, index) in selectData.statusList" :key="index" :label="item.itemText" :value="item.itemId" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="form.isSyncDebt">同步至同产品共债案件</el-checkbox>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
const form: any = reactive({
  followStatusId: null, //处置状态
  isSyncDebt: true //是否同步至同产品共债案件
})
const ruleFormRef = ref()
const originFormData = JSON.parse(JSON.stringify(form))
const selectData = reactive({
  statusList: [] as any[] //处置状态列表
})
const emits = defineEmits(['submitForm'])
// 打开弹窗
const dialogVisible = ref(false)
const open = () => {
  getSelecData()
  Object.assign(form, originFormData)
  dialogVisible.value = true
}
defineExpose({
  open
})

// 确认
const submitForm = () => {
  const params = {
    isSyncDebt: form.isSyncDebt === true ? 1 : 0,
    followStatusId: form.followStatusId
  }
  emits('submitForm', params)
  cancelSubmit()
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
const getSelecData = async () => {
  // 请求得到数据
  // const { data } = await xx()
  selectData.statusList = [
    {
      itemId: 201,
      itemText: '后续再跟进'
    },
    {
      itemId: 202,
      itemText: '初步沟通，后续再跟进'
    },
    {
      itemId: 203,
      itemText: '约定承诺还款'
    }
  ]
}
</script>
  
<style lang="scss" scoped>
</style>