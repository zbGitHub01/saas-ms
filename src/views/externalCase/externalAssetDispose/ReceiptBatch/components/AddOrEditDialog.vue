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
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="right" label-width="130px">
        <el-form-item label="批次号：" prop="batchNo">
          <el-input v-model="form.batchNo" placeholder="请输入批次号" clearable></el-input>
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
        <el-form-item label="购入日期：" prop="buyTime">
          <el-date-picker v-model="form.buyTime" type="date" placeholder="请选择购入日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="资产包类型：" prop="packageTypeId">
          <el-select v-model="form.packageTypeId" placeholder="请选择资产包类型" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.packageList"
              :key="index"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为临时库：" prop="is">
          <el-radio-group v-model="form.is">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
const form = reactive({
  productId: null,
  batchNo: '',
  buyTime: '',
  packageTypeId: null,
  remark: '',
  is: null //是否为临时库
})
const originFormData = JSON.parse(JSON.stringify(form))
const title = ref('')
// watch: {
//     $route: {
//       handler: function (route) {
//         this.redirect = route.query && route.query.redirect;
//       },
//       immediate: true,
//     },
//   },

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
  packageTypeId: [{ required: true, trigger: 'change', message: '资产包类型不能为空' }],
  is: [{ required: true, trigger: 'change', message: '是否为临时库不能为空' }]
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
    form.batchId = row.batchId
    form.batchNo = row.batchNo
    form.packageTypeId = row.packageTypeId
    form.remark = row.remark
    form.is = row.is
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
      console.log(form)
      // 请求得到数据
      // const { data } = await xx(form)
      ElMessage.success('操作成功！')
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
  