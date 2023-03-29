<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增委托"
    width="550px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="right" label-width="120px">
        <el-form-item label="委托产品：" prop="productId">
          <el-select v-model="form.productId" placeholder="请选择委托产品" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.productList"
              :key="index"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债权方：" prop="zhaiquanfangId">
          <el-select v-model="form.zhaiquanfangId" placeholder="请选择债权方" clearable filterable :disabled="true">
            <el-option v-for="(item, index) in selectData.orgList" :key="index" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方：" prop="weituofangId">
          {{ form.weituofangId }}
        </el-form-item>
        <el-form-item label="受托方：" prop="shoutuofangId">
          <el-select v-model="form.shoutuofangId" placeholder="请选择受托方" clearable filterable>
            <el-option v-for="(item, index) in selectData.orgList" :key="index" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托时效：" prop="deadline">
          <el-radio-group v-model="form.deadline">
            <el-radio :label="'永久'">永久</el-radio>
            <el-radio :label="time">截止时间</el-radio>
          </el-radio-group>
          <el-date-picker
            v-model="time"
            type="date"
            placeholder="请选择截止时间"
            @change="changeDate"
            value-format="YYYY-MM-DD"
            class="ml10"
          />
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
import { reactive, ref } from 'vue'
const form: any = reactive({
  producId: null,
  zhaiquanfangId: null,
  weituofangId: null,
  shoutuofangId: null,
  deadline: '',
  xieyi: '' //协议
})
const time = ref<String>('') 
const isAdded = ref<boolean>(false)
// 接收props数据
const props = defineProps<{
  selectData: {
    productList: any[]
    orgList: any[]
  }
}>()
// 校验规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  productId: [{ required: true, trigger: 'change', message: '委托产品不能为空' }],
  zhaiquanfangId: [{ required: true, trigger: 'change', message: '债权方不能为空' }],
  shoutuofangId: [{ required: true, trigger: 'change', message: '受托方不能为空' }],
  deadline: [{ required: true, trigger: 'blur', message: '委托时效不能为空' }],
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (row: any, type: Number) => {
  if (type === 1) {
    isAdded.value = false
  } else if (type === 2) {
    form.name = row.employeeName
    form.phone = row.phone
    form.caseId = row.caseId
    form.sex = row.sex
    form.roleList = row.roleList
    form.picture1 = row.picture1
    form.picture2 = row.picture2
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
// 添加/编辑账号
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(form)
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
const changeDate = (val: any) => {
  form.deadline = val
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
  