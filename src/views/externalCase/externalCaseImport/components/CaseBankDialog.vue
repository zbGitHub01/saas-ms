<template>
  <el-dialog
    v-model="dialogVisible"
    title="新案入库"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef">
        <el-form-item label="产品:" label-width="100px" prop="productId">
          <el-select clearable v-model="form.productId" filterable placeholder="请选择产品" style="width: 300px">
            <el-option
              v-for="item in selectData.productList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库批次:" label-width="100px" prop="batchId">
          <el-select clearable v-model="form.batchId" filterable placeholder="请选择入库批次" style="width: 300px">
            <el-option
              v-for="item in selectData.batchList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债权方:" label-width="100px" prop="creditorId">
          <el-select clearable v-model="form.creditorId" filterable placeholder="请选择债权方" style="width: 300px">
            <el-option
              v-for="item in selectData.creditorList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入文件:" label-width="100px" prop="upload">
          <!-- 平台端action="/caseCenter/caseImport/import" 还有tokens 绑定的值是upload-->
          <!-- 这里用的公共组件有默认action 且无tokens 绑定的是数组 -->
          <!-- check-validate绑定的函数是文件上传成功后执行 -->
          <UploadFile ref="uploadFileRef" v-model:file-list="fileList" accept-type="excel" />
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
import { reactive, ref } from 'vue'
import { UploadFile } from '@/components/Upload'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/caseManage'
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
const form = reactive({
  productId: null,
  batchId: null,
  creditorId: null,
  importFileType: 101
})
const originFormData = JSON.parse(JSON.stringify(form))
const fileList = ref([])
const uploadFileRef = ref()
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  productId: [{ required: true, trigger: 'change', message: '请选择产品' }],
  batchId: [{ required: true, trigger: 'change', message: '请选择入库批次' }],
  creditorId: [{ required: true, trigger: 'change', message: '请选择债权方' }]
})
// 打开弹窗
const dialogVisible = ref(false)
const open = async () => {
  Object.assign(form, originFormData)
  fileList.value = []
  dialogVisible.value = true
}
defineExpose({
  open
})

const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (!fileList.value[0]) {
        return ElMessage.error('请上传文件！')
      }
      const params = {
        ...form,
        importUrl: fileList.value[0].url
      }
      console.log(params)
      // 文件手动上传
      // uploadFileRef.value.uploadSubmit()
      await Apis.caseImport(params)
      ElMessage.success('导入成功！')
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
</style>  