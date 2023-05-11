<template>
  <div class="upload-box">
    <el-upload
      v-model:file-list="imageList"
      action="#"
      class="upload"
      list-type="picture-card"
      :class="{ disabled: self_disabled }"
      :multiple="false"
      :limit="limit"
      :disabled="self_disabled"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :on-error="uploadError"
      :accept="fileType.join(',')"
    >
      <div class="upload-empty">
        <slot name="empty">
          <el-icon><Plus /></el-icon>
        </slot>
      </div>
      <template #file="{ file }">
        <el-image :src="file.url" class="upload-image" />
        <div class="upload-handle" @click.stop>
          <div class="handle-icon" @click="handlePicturePreview(file)">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div v-if="!self_disabled" class="handle-icon" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer v-if="imgViewVisible" :url-list="[viewImgUrl]" @close="imgViewVisible = false" />
  </div>
</template>

<script setup>
import { inject, computed, ref } from 'vue'
import { formContextKey, formItemContextKey, ElMessage, ElNotification } from 'element-plus'
import { ZoomIn, Delete } from '@element-plus/icons-vue'
import Http from '@/api'

const props = defineProps({
  imageList: {
    type: Array,
    default: () => []
  },
  api: {
    type: String,
    default: '/upms/client/sys-file/upload'
  },
  params: {
    type: Object,
    default: () => {
      return {}
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 5
  },
  fileSize: {
    type: Number,
    default: 5
  },
  fileType: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/gif']
  },
  width: {
    type: String,
    default: '150px'
  },
  height: {
    type: String,
    default: '150px'
  },
  borderRadius: {
    type: String,
    default: '8px'
  }
})
const emit = defineEmits(['update:imageList', 'check-validate'])

const imageList = ref(props.imageList)
// 查看图片
const imgViewVisible = ref(false)
// 获取 el-form 组件上下文
const formContext = inject(formContextKey)
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey)
// 是否禁用
const self_disabled = computed(() => props.disabled || formContext?.disabled)
const handleHttpUpload = async options => {
  const formData = new FormData()
  formData.append('file', options.file)
  Object.keys(props.params).forEach(key => {
    formData.append(key, props.params[key])
  })
  try {
    const { data } = await Http.post(props.api, formData)
    options.onSuccess(data)
  } catch (error) {
    options.onError(error)
  }
}
const beforeUpload = file => {
  const imgSize = file.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType
  if (!imgType.includes(file.type)) {
    ElMessage.warning('上传图片不符合所需的格式！')
    return false
  }
  if (!imgSize) {
    ElMessage.warning(`上传图片大小不能超过 ${props.fileSize}M！`)
    return false
  }
  return true
}
const uploadSuccess = (response, uploadFile) => {
  if (!response) return
  const imgList = [...props.imageList]
  imgList.push({
    name: uploadFile.name,
    url: response?.url,
    fileId: response?.fileId
  })
  emit('update:imageList', imgList)
  formItemContext?.prop && formContext?.validateField([formItemContext.prop])
  emit('check-validate')
  ElNotification({
    title: '温馨提示',
    message: '图片上传成功！',
    type: 'success'
  })
}
const handleRemove = uploadFile => {
  const imgList = [...props.imageList]
  const removeIndex = imgList.findIndex(item => item.name === uploadFile.name)
  imageList.value.splice(removeIndex, 1)
  imgList.splice(removeIndex, 1)
  emit('update:imageList', imgList)
}
const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片，请移除后上传！`)
}
const uploadError = () => {
  ElNotification({
    title: '温馨提示',
    message: '图片上传失败，请您重新上传！',
    type: 'error'
  })
}
const viewImgUrl = ref('')
const handlePicturePreview = file => {
  viewImgUrl.value = file.url
  imgViewVisible.value = true
}
</script>

<style lang="scss" scoped>
is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);
    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      &:hover {
        border: 1px dashed var(--el-color-primary);
      }
    }
    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }
    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border-radius: v-bind(borderRadius);
    }
    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      transition: var(--el-transition-duration-fast);
      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;
        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }
        span {
          font-size: 100%;
        }
      }
    }
    .el-upload-list__item {
      &:hover {
        .upload-handle {
          opacity: 1;
        }
      }
    }
    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-info);
      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
  }
  .el-upload__tip {
    line-height: 15px;
    text-align: center;
  }
}
</style>
