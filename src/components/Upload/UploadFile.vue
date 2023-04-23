<template>
  <el-upload
    :action="uploadUrl"
    :limit="limit"
    :show-file-list="true"
    :before-upload="beforeUpload"
    :accept="accept"
    :on-exceed="handleExceed"
    :on-success="uploadSuccess"
  >
    <el-button type="primary" :loading="loading">{{ btnText }}</el-button>
    <template #tip>
      <div class="el-upload__tip">{{ props.tip }}</div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const props = defineProps({
  tip: {
    type: String,
    default: ''
  },
  btnText: {
    type: String,
    default: '上传文件'
  },
  limit: {
    type: Number,
    default: 1
  },
  maxSize: {
    type: Number,
    default: 5
  },
  accept: {
    type: String,
    default: ''
  }
})
const uploadUrl = import.meta.env.VITE_UPLOAD_URL
const loading = ref(false)

const beforeUpload = file => {
  const fileSize = file.size / 1024 / 1024 < props.maxSize
  return fileSize
}
const handleExceed = () => {
  ElMessage.warning(`最多只能上传${props.limit}个文件！`)
}
const uploadSuccess = () => {
}
const excelUploadError = () => {
  ElMessage.error('上传失败！')
}
</script>

<style lang="scss" scoped></style>
