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
        <el-form-item label="批次号：" prop="picihao">
          <el-input v-model="form.picihao" placeholder="请输入批次号" clearable></el-input>
        </el-form-item>
        <el-form-item label="关联产品：" prop="productId">
          <el-select v-model="form.productId" placeholder="请选择关联产品" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.productList"
              :key="index"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产包类型：" prop="packageId">
          <el-select v-model="form.packageId" placeholder="请选择资产包类型" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.packageList"
              :key="index"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购入日期：" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="请选择购入日期" value-format="YYYY-MM-DD"/>
        </el-form-item>
        <el-form-item label="交割日期：" prop="date2">
          <el-date-picker v-model="form.date2" type="date" placeholder="请选择购入日期" value-format="YYYY-MM-DD"/>
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input
            v-model="form.note"
            placeholder="请输入备注"
            clearable
            style="width: 300px"
            :rows="3"
            type="textarea"
          ></el-input>
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
  picihao: '',
  date: '',
  date2: '',
  packageId: null,
  note: ''
})
const title = ref<String>('')
// 接收props数据
const props = defineProps<{
  selectData: {
    productList: any[]
    packageList: any[]
  }
}>()
// 校验规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  picihao: [{ required: true, trigger: 'blur', message: '批次号不能为空' }],
  productId: [{ required: true, trigger: 'change', message: '关联产品不能为空' }],
  date: [{ required: true, trigger: 'change', message: '购入日期不能为空' }],
  date2: [{ required: true, trigger: 'change', message: '交割日期不能为空' }],
  packageId: [{ required: true, trigger: 'change', message: '资产包类型不能为空' }],
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
    form.date = row.date
    form.picihao = row.picihao
    form.packageId = row.packageId
    form.note = row.note
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
      // const { data } = await xx(form)
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
.center {
  text-align: center;
  font-size: 18px;
}
</style>
  