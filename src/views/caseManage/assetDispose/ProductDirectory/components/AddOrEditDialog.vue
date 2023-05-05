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
        <el-form-item label="产品：" prop="productId">
          <el-select v-model="form.productId" placeholder="请选择产品" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.productList"
              :key="index"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债权方：" prop="zhaiquanfangId">
          <el-select v-model="form.zhaiquanfangId" placeholder="请选择债权方" clearable filterable>
            <el-option v-for="(item, index) in selectData.orgList" :key="index" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPV公司：" prop="SPV">
          <el-input v-model="form.SPV" placeholder="请输入SPV公司" clearable></el-input>
        </el-form-item>
        <el-form-item label="官方咨询电话：" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入官方咨询电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="产品资料：" prop="ziliao">
          <el-input v-model="form.ziliao" placeholder="请填写产品说明资料的链接" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用：" prop="isUse">
          <el-radio-group v-model="form.isUse">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
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
  
<script lang="ts" setup>
// 表单验证规则的类型
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
const form: any = reactive({
  productId: null,
  zhaiquanfangId: null,
  SPV: '',
  phone: '',
  ziliao: '',
  isUse: null
})
const title = ref<String>('')
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
  zhaiquanfangId: [{ required: true, trigger: 'change', message: '债权方不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (row: any, type: number) => {
  if (type === 1) {
    title.value = '添加'
  } else if (type === 2) {
    title.value = '编辑'
    form.productId = row.productId
    form.zhaiquanfangId = row.zhaiquanfangId
    form.SPV = row.SPV
    form.phone = row.phone
    form.ziliao = row.ziliao
    form.isUse = row.isUse
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
// 添加/编辑
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(form)
      // 请求得到数据
      // await xx(form)
      ElMessage.success('保存成功！')
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
.center {
  text-align: center;
  font-size: 18px;
}
</style>
  