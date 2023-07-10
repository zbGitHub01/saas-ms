<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form ref="ruleFormRef" :model="form">
        <el-form-item label="导入文件:" label-width="100px" prop="upload">
          <UploadFile ref="uploadFileRef" v-model:file-list="fileList" accept-type="excel" />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
          
<script setup>
import { reactive, ref } from 'vue'
import { UploadFile } from '@/components/Upload'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/caseManage'
const fileList = ref([])
const form = reactive({})
const importFileType = ref()
const title = ref('')
const uploadFileRef = ref()
const ruleFormRef = ref()
// 打开弹窗
const dialogVisible = ref(false)
const open = async (type, titleSub) => {
  importFileType.value = type
  title.value = titleSub
  fileList.value = []
  dialogVisible.value = true
}
defineExpose({
  open
})

const submitForm = async () => {
  if (!fileList.value[0]) {
    return ElMessage.error('请上传文件！')
  }
  const params = {
    importFileType: importFileType.value,
    importUrl: fileList.value[0].url
  }
  await Apis.caseImport(params)
  cancelSubmit()
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  uploadFileRef.value.clearFiles()
  dialogVisible.value = false
}
</script>
          
<style lang="scss" scoped>
</style>  