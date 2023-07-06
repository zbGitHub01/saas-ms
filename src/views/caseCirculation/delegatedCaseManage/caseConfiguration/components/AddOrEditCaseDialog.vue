<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="right" label-width="120px">
        <el-form-item label="委案类型：" prop="itemText">
          <el-input v-model="form.itemText" placeholder="请输入委案类型" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="案件等级：" prop="caseLevel">
          <el-checkbox-group v-model="form.caseLevel">
            <el-checkbox v-for="level in state.caseLevelList" :key="level" :label="level"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import Apis from '@/api/modules/common'
const form = reactive({
  id: null,
  dictCode: 'ENTRUST_TYPE',
  itemText: '',
  operateStatus: 2,
  status: 1,
  caseLevel: []
})
const originFormData = JSON.parse(JSON.stringify(form))
const state = reactive({
  caseLevelList: []
})
const title = ref('')
onMounted(() => {
  fetchCaseLevel()
})
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  itemText: [{ required: true, trigger: 'blur', message: '委案类型不能为空' }],
  caseLevel: [{ required: true, trigger: 'change', message: '委案等级不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (row, type) => {
  Object.assign(form, originFormData)
  if (type === 1) {
    title.value = '添加委案类型'
  } else if (type === 2) {
    title.value = '编辑委案类型'
    form.id = row.id
    form.itemText = row.itemText
    form.status = row.status ? 1 : 0
    form.operateStatus = row.operateStatus
    form.caseLevel = [...row.itemValue.caseLevel]
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
const fetchCaseLevel = () => {
  // const { data } = await xx({ codes: 'ENTRUST_TYPE_ALL' })
  state.caseLevelList = ['A', 'B', 'C', 'D', 'E', '其他']
}
// 添加/编辑
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      // 处理参数
      const params = {
        ...form,
        itemValue: { caseLevel: [...form.caseLevel] }
      }
      delete params.caseLevel
      await Apis.dictManageSave(params)
      ElMessage.success('操作成功！')
      emits('getTableData')
      formEl.resetFields()
      dialogVisible.value = false
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
</script>
  
<style lang="scss" scoped>
</style>
  