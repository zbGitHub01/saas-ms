<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    action="#"
    class="upload"
    :limit="limit"
    show-file-list
    :auto-upload="props.autoUpload"
    :http-request="handleHttpUpload"
    :before-upload="beforeUpload"
    :accept="accept"
    :on-exceed="handleExceed"
    :on-success="uploadSuccess"
    :on-remove="uploadRemove"
    :on-error="uploadError"
  >
    <slot>
      <el-button type="primary">上传文件</el-button>
    </slot>
    <template #tip>
      <div class="el-upload__tip">
        <slot name="tip"></slot>
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { formContextKey, formItemContextKey, ElMessage, ElNotification } from 'element-plus'
import Http from '@/api'
const props = defineProps({
  fileList: {
    type: Array,
    default: () => []
  },
  api: {
    type: String,
    default: '/upms/client/sys-file/upload'
  },
  // 其他参数
  params: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 上传文件个数
  limit: {
    type: Number,
    default: 1
  },
  // 上传文件大小
  fileSize: {
    type: Number,
    default: 5
  },
  // 格式类型：all | media | word | excel
  acceptType: {
    type: String,
    default: 'all'
  },
  autoUpload: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:fileList', 'check-validate'])

const acceptConfig = {
  all: '',
  media: 'audio/*,video/*',
  word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
}
const uploadRef = ref()
const accept = computed(() => acceptConfig[props.acceptType] || '')
const fileList = ref(props.fileList)
// 获取 el-form 组件上下文
const formContext = inject(formContextKey)
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey)
const handleHttpUpload = async options => {
  const formData = new FormData()
  formData.append('file', options.file)
  Object.keys(props.params).forEach(key => {
    formData.append(key, props.params[key])
  })
  try {
    const { data } = await Http.post(props.api, formData)
    return data
  } catch (error) {
    options.onError(error)
  }
}
const beforeUpload = file => {
  const fileSize = file.size / 1024 / 1024 < props.fileSize
  let fileType = file.type
  if (props.acceptType === 'media') {
    fileType = file.type.split('/')[0]
  }
  if (!accept.value.includes(fileType) && props.acceptType !== 'all') {
    ElMessage.warning('上传文件不符合所需的格式！')
    return false
  }
  if (!fileSize) {
    ElMessage.warning(`上传文件大小不能超过 ${props.fileSize}M！`)
    return false
  }
  return true
}
const handleExceed = () => {
  ElMessage.warning(`最多只能上传${props.limit}个文件！`)
}
const uploadSuccess = (response, uploadFile) => {
  const fileData = [...props.fileList]
  fileData.push({
    name: uploadFile.name,
    url: response?.url,
    fileId: response?.fileId
  })
  emit('update:fileList', fileData)
  formItemContext?.prop && formContext?.validateField([formItemContext.prop])
  emit('check-validate')
  if (props.autoUpload) {
    ElNotification({
      title: '温馨提示',
      message: '文件上传成功！',
      type: 'success'
    })
  }
}
const uploadRemove = uploadFile => {
  const fileData = [...props.fileList]
  const removeIndex = fileData.findIndex(item => item.name === uploadFile.name)
  fileData.splice(removeIndex, 1)
  emit('update:fileList', fileData)
}
const uploadError = () => {
  ElMessage.error('上传失败！')
}
const uploadSubmit = () => {
  uploadRef.value.submit()
}

const clearFiles = () => {
  uploadRef.value.clearFiles()
}

defineExpose({ uploadSubmit, clearFiles })
</script>

<style lang="scss" scoped>
.upload {
  width: 100%;
}
</style>
