
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
      <el-form :model="Fdata" ref="ruleFormRef">
        <el-form-item label="导入文件:" label-width="100px" prop="upload">
          <!-- 平台端action="/caseCenter/caseImport/import" 还有tokens 绑定的值是upload-->
          <!-- 这里用的公共组件有默认action 且无tokens 绑定的是数组 -->
          <!-- check-validate绑定的函数是文件上传成功后执行 -->
          <UploadFile
            ref="uploadFileRef"
            v-model:file-list="fileList"
            accept-type="excel"
            :auto-upload="false"
            @check-validate="cancelSubmit"
            :api="'/caseCenter/case/ext/addition/lawsuit/tag/import'"
          />
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
const Fdata = reactive({})
const originFormData = JSON.parse(JSON.stringify(Fdata))
const fileList = ref([])
const title = ref('')
const uploadFileRef = ref()
const ruleFormRef = ref()
// 打开弹窗
const dialogVisible = ref(false)
const open = async titleSub => {
  Object.assign(Fdata, originFormData)
  title.value = titleSub
  fileList.value = []
  dialogVisible.value = true
}
defineExpose({
  open
})

const submitForm = () => {
  // 文件手动上传
  uploadFileRef.value.uploadSubmit()
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  fileList.value = []
  uploadFileRef.value.clearFiles()
  dialogVisible.value = false
}
</script>
        
<style lang="scss" scoped>
</style>  