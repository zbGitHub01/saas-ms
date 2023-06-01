<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="25%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-form-item v-if="typeSub === 1" label="临时标签：" prop="tempTagName">
          <el-input clearable v-model="form.tempTagName" type="text" placeholder="请输入临时标签" />
        </el-form-item>
        <el-form-item v-if="typeSub === 2" label="临时标签:" prop="tempTagName">
          <el-select v-model="form.tempTagName" filterable clearable placeholder="请选择临时标签">
            <el-option v-for="item in selectData.tagList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="typeSub === 2" label="从所有案件中删除此标签：" prop="isDeleteAllRelationTag">
          <el-switch v-model="form.isDeleteAllRelationTag"></el-switch>
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
import { reactive, ref } from 'vue'
const form = reactive({
  tempTagName: null, //临时标签
  isDeleteAllRelationTag: false //是否操作所有案件中删除
})
const originFormData = JSON.parse(JSON.stringify(form))
const typeSub = ref(1)
const title = ref('')
const selectData = reactive({
  tagList: [] //临时标签列表
})
const emits = defineEmits(['submitForm'])
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  tempTagName: [{ required: true, message: '请选择临时标签', trigger: 'blur' }],
  isDeleteAllRelationTag: [{ required: true, message: '请选择状态', trigger: 'change' }]
})
// 打开弹窗
const dialogVisible = ref(false)
const open = type => {
  if (type === 1) {
    title.value = '添加临时标签'
  } else if (type === 2) {
    title.value = '删除临时标签'
    getSelecData()
  }
  typeSub.value = type
  Object.assign(form, originFormData)
  dialogVisible.value = true
}
defineExpose({
  open
})
// 确认
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (typeSub.value === 1) {
        emits('submitForm', form.tempTagName, 1)
      } else if (typeSub.value === 2) {
        emits('submitForm', form.tempTagName, 2, form.isDeleteAllRelationTag)
      }
      dialogVisible.value = false
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
const getSelecData = async () => {
  // 请求得到数据
  // const { data } = await xx(params)
  selectData.tagList = ['111', '116', 'test1', 'test', '99', 'jjj', '测试']
}
</script>
  
<style lang="scss" scoped>
</style>
  