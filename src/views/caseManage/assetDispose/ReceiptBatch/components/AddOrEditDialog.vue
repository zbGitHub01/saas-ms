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
        <el-form-item label="批次号：" prop="batchNo">
          <el-input v-model="form.batchNo" placeholder="请输入批次号" clearable></el-input>
        </el-form-item>
        <el-form-item label="关联产品：" prop="productId">
          <el-select v-model="form.productId" placeholder="请选择关联产品" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.productAndCreList"
              :key="index"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产包类型：" prop="packageTypeId">
          <el-select v-model="form.packageTypeId" placeholder="请选择资产包类型" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.packageList"
              :key="index"
              :label="item.packageTypeName"
              :value="item.packageTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购入日期：" prop="buyTime">
          <el-date-picker v-model="form.buyTime" type="date" placeholder="请选择购入日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="交割日期：" prop="deliveryDay">
          <el-date-picker v-model="form.deliveryDay" type="date" placeholder="请选择购入日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="form.remark"
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
  
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import Apis from '@/api/modules/caseManage'
const form = reactive({
  productId: null,
  batchNo: '',
  batchId: null,
  buyTime: '',
  deliveryDay: '',
  packageTypeId: null,
  remark: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
const title = ref('')
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  batchNo: [{ required: true, trigger: 'blur', message: '批次号不能为空' }],
  productId: [{ required: true, trigger: 'change', message: '关联产品不能为空' }],
  buyTime: [{ required: true, trigger: 'change', message: '购入日期不能为空' }],
  deliveryDay: [{ required: true, trigger: 'change', message: '交割日期不能为空' }],
  packageTypeId: [{ required: true, trigger: 'change', message: '资产包类型不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (row, type) => {
  Object.assign(form, originFormData)
  if (type === 1) {
    title.value = '添加'
  } else if (type === 2) {
    title.value = '编辑'
    form.productId = row.productId
    form.buyTime = row.buyTime
    form.batchNo = row.batchNo
    form.batchId = row.batchId
    form.packageTypeId = row.packageTypeId
    form.remark = row.remark
    form.deliveryDay = row.deliveryDay
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
// 添加/编辑
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      // 请求得到数据
      const params = { ...form }
      if (title.value === '添加') {
        await Apis.batchAdd(params)
      } else if ((title.value = '编辑')) {
        await Apis.batchEdit(params)
      }
      ElMessage.success('保存成功！')
      emits('getTableData')
      cancelSubmit()
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
  