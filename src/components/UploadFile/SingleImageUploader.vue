<template>
  <el-upload
    ref="upload"
    class="image-uploader"
    :action="uploadAction"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :on-exceed="handleOnExceed"
    :style="{ height: height, width: width }"
    :headers="headers"
    :show-file-list="false"
    :data="data"
  >
    <div class="upload-previewer">
      <div
        v-if="modelValue"
        class="preview"
        :style="{
          backgroundImage: `url('${modelValue}')`,
          backgroundSize: fillMode
        }"
      >
        <el-icon class="image-delete-icon" :style="{ height: height, width: width }" @click.stop="clearFiles">
          <Delete />
        </el-icon>
      </div>
      <el-icon v-else class="image-uploader-icon" :style="{ height: height, width: width }">
        <Plus />
        <div v-if="placeholder" class="image-uploader-placeholder">{{ placeholder }}</div>
      </el-icon>
    </div>
  </el-upload>
</template>

<script setup>
import { genFileId, ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useGlobalStore } from '@/store'

import { Plus } from '@element-plus/icons-vue'
const globalState = useGlobalStore()
const headers = computed(() => {
  return {
    Authorization: globalState.token
  }
})
// interface Props {
//   modelValue?: string | null
//   action?: string
//   types?: Array<ImageFormat>
//   width?: String
//   height?: String
//   actionSub?: string
//   data?: Object
//   fillMode?: string;
//   placeholder?: string;
// }

const imageFormatMap = {
  GIF: 'image/gif',
  JPEG: 'image/jpeg',
  PNG: 'image/png'
}

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  action: {
    type: String,
    default: 'other/file/upload'
  },
  types: {
    type: Array,
    default: () => ['GIF', 'JPEG', 'PNG']
  },
  width: {
    type: String,
    default: '80px'
  },
  height: {
    type: String,
    default: '80px'
  },
  actionSub: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  },
  fillMode: {
    type: String,
    default: 'contain'
  },
  placeholder: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:modelValue'])

const upload = ref()
const uploadAction = computed(() => {
  // const baseUrl = (import.meta.env.VITE_BASE_URL || '').replace(/\/+$/, '')
  // return `${baseUrl}${((props.action || '') + '/').replace(/\/{2,}/g, '/')}`
  const baseUrl = import.meta.env.VITE_BASE_URL
  const suffix = props.actionSub || '/'
  const url = (baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`) + (suffix.startsWith('/') ? suffix.slice(1) : suffix)
  return url
})
const allowedTypes = computed(() => {
  return props.types.map(type => imageFormatMap[type])
})

/**
 * 处理上传成功
 * @param response
 */
const handleSuccess = response => {
  emits('update:modelValue', response.data.url) //展示需带前缀
}

/**
 * 处理文件的删除
 */
const handleRemove = () => {
  emits('update:modelValue', '')
}
/**
 * 处理超出限制
 * @param files
 */
const handleOnExceed = files => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

/**
 * 在上传之前校验
 * @param rawFile
 */
const beforeUpload = rawFile => {
  if (!allowedTypes.value.includes(rawFile.type)) {
    ElMessage.error(`仅支持${props.types.join('、')}格式图片!`)
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('文件大小不超过1M!')
    return false
  }
  return true
}

/**
 * 清除已添加的文件列表
 */
function clearFiles() {
  // upload.value?.clearFiles()
  emits('update:modelValue', '')
}
</script>

<style lang="scss">
.image-uploader {
  // width: 80px;
  // height: 80px;
  border: 1px dashed var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }

  .preview {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .upload-previewer,
  .el-upload.el-upload--text {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-icon.image-uploader-icon,
  .el-icon.image-delete-icon {
    font-size: 28px;
    color: #8c939d;
    // width: 80px;
    // height: 80px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-placeholder {
    font-size: 12px;
    color: #8c939d;
    margin-top: 10px;
  }

  // 删除按钮， hover 时显示
  .el-icon.image-delete-icon {
    background-color: rgba(255, 255, 255, 0.9);
    opacity: 0;
    visibility: hidden;
    transition: var(--el-transition-duration-fast);
  }
  &:hover .el-icon.image-delete-icon {
    opacity: 1;
    visibility: visible;
  }
}
</style>