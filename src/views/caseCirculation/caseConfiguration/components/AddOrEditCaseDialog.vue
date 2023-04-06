<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
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
          <el-radio-group v-model="form.status" :disabled="operateStatus === 1">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script lang="ts" setup>
// 表单验证规则的类型
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
const form: any = reactive({
  itemId: null,
  itemText: '',
  status: null,
  caseLevel: []
})
const state = reactive({
  caseLevelList: [] as any[]
})
const title = ref<String>('')
const operateStatus = ref(0)
onMounted(() => {
  fetchCaseLevel()
})
// 校验规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  itemText: [{ required: true, trigger: 'blur', message: '委案类型不能为空' }],
  caseLevel: [{ required: true, trigger: 'change', message: '委案等级不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (row: any, type: number) => {
  if (type === 1) {
    title.value = '添加委案类型'
    operateStatus.value = 0
  } else if (type === 2) {
    title.value = '编辑委案类型'
    form.itemId = row.itemId
    form.itemText = row.itemText
    form.status = row.status
    operateStatus.value = row.operateStatus
    form.caseLevel = JSON.parse(row.itemValue).caseLevel
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
const fetchCaseLevel = () => {
  // 请求得到数据
  // const { code, data, msg } = await xx({ codes: 'ENTRUST_TYPE_ALL' })
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
  state.caseLevelList = ['A', 'B', 'C', 'D', 'E', '其他']
}
// 添加/编辑
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      // 处理参数
      console.log(form)
      // const params = {
      //   ...form,
      //   itemValue: { form.caseLevel }
      // }
      // 请求得到数据
      // const { code, data, msg } = await xx(form)
      // if(code !== 200){
      //   return ElMessage.error(msg)
      // }
      ElMessage.success('操作成功！')
      emits('getTableData')
      formEl.resetFields()
      dialogVisible.value = false
    }
  })
}
// 取消
const cancelSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
}
</script>
  
<style lang="scss" scoped>
.center {
  text-align: center;
  font-size: 18px;
}
</style>
  