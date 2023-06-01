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
        <el-form-item label="产品：" prop="productName">
          <!-- <el-select v-model="form.productId" placeholder="请选择产品" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.productList"
              :key="index"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select> -->
          <el-input v-model="form.productName" placeholder="请输入产品" clearable></el-input>
        </el-form-item>
        <el-form-item label="官方咨询电话：" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入官方咨询电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="债权方：" prop="creditorId">
          <el-select v-model="form.creditorId" placeholder="请选择债权方" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.orgList"
              :key="index"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用：" prop="productStatus">
          <el-radio-group v-model="form.productStatus">
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
import { reactive, ref } from 'vue'
const form = reactive({
  productId: null,
  productName: '',
  creditorId: null,
  contactPhone: '',
  productStatus: null
})
const originFormData = JSON.parse(JSON.stringify(form))
const title = ref('')
// 接收props数据
// const props = defineProps<{
//   selectData: {
//     productList: any[]
//     orgList: any[]
//   }
// }>()
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  productName: [{ required: true, trigger: 'blur', message: '请填写产品名称!' }],
  creditorId: [{ required: true, trigger: 'change', message: '债权方不能为空' }]
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
    form.productName = row.productName
    form.creditorId = row.creditorId
    form.contactPhone = row.contactPhone
    form.productStatus = Number(row.productStatus)
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
// watch??再处理
// watch: {
//     $route: {
//       handler: function (route) {
//         this.redirect = route.query && route.query.redirect;
//       },
//       immediate: true,
//     },
//   },
// 添加/编辑
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log('保存', form)
      // 请求得到数据
      // await xx(form)
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
  