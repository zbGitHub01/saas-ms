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
<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import Apis from '@/api/modules/caseManage'
import Apis1 from '@/api/modules/common'
const form = reactive({
  followStatusId: null, //处置状态
  isSyncDebt: true //是否同步至同产品共债案件
})
const state = reactive({
  paramsSub: {}
})
const ruleFormRef = ref()
const originFormData = JSON.parse(JSON.stringify(form))
const selectData = reactive({
  statusList: [] //处置状态列表
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = paramsSub => {
  state.paramsSub = { ...paramsSub }
  getSelecData()
  Object.assign(form, originFormData)
  dialogVisible.value = true
}
defineExpose({
  open
})

// 确认
const submitForm = async () => {
  const params = {
    isSyncDebt: form.isSyncDebt === true ? 1 : 0,
    followStatusId: form.followStatusId,
    ...state.paramsSub
  }
  await Apis.updateFollowStatus(params)
  ElMessage.success('修改成功！')
  emits('getTableData')
  cancelSubmit()
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
const getSelecData = async () => {
  // 请求得到数据
  const { data } = await Apis1.findItemList({ codes: 'DISPOSAL_STATUS'})
  selectData.statusList = data.DISPOSAL_STATUS
}
</script>
  
<style lang="scss" scoped>
</style>