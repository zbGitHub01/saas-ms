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
          backgroundImage: `url('${modelValue}')`
        }"
      >
        <el-icon @click.stop="clearFiles" class="image-delete-icon" :style="{ height: height, width: width }">
          <Delete />
        </el-icon>
      </div>
      <el-icon v-else class="image-uploader-icon" :style="{ height: height, width: width }"><Plus /></el-icon>
    </div>
  </el-upload>
</template>

<script lang="ts" setup>
import type { UploadProps, UploadInstance, UploadRawFile } from 'element-plus'
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
type ImageFormat = 'GIF' | 'JPEG' | 'PNG'
interface Props {
  modelValue?: string | null
  action?: string
  types?: Array<ImageFormat>
  width?: String
  height?: String
  actionSub?: string
  data?: Object
}

const imageFormatMap: Record<ImageFormat, string> = {
  GIF: 'image/gif',
  JPEG: 'image/jpeg',
  PNG: 'image/png'
}

const props = withDefaults(defineProps<Props>(), {
  action: '/other/file/upload',
  types: () => ['GIF', 'JPEG', 'PNG']
})
const emits = defineEmits(['update:modelValue'])

const upload = ref<UploadInstance>()
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
const handleSuccess: UploadProps['onSuccess'] = response => {
  emits('update:modelValue', response.data.url) //展示需带前缀
}

/**
 * 处理文件的删除
 */
const handleRemove: UploadProps['onRemove'] = () => {
  emits('update:modelValue', '')
}
/**
 * 处理超出限制
 * @param files
 */
const handleOnExceed: UploadProps['onExceed'] = (files: File[], ufs) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

/**
 * 在上传之前校验
 * @param rawFile
 */
const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
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

  .el-icon.image-uploader-icon,
  .el-icon.image-delete-icon {
    font-size: 28px;
    color: #8c939d;
    // width: 80px;
    // height: 80px;
    text-align: center;
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
