<template>
  <el-dialog
    class="dialog"
    title="邀请员工"
    :model-value="props.dialogVisible"
    width="450px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    @open="handleOpen"
  >
    <template #default>
      <el-form class="form">
        <el-form-item label="员工名录">
          <UploadFile />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="btn-box">
        <el-button class="down-template" type="primary" plain @click="downTemplate">导入模板下载</el-button>
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFile } from '@/components/Upload'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:dialogVisible'])

const loading = ref(false)
const downTemplate = () => {}
const handleOpen = () => {
}
const beforeClose = () => {
  emit('update:dialogVisible', false)
}
const onSubmit = () => {}
</script>

<style lang="scss" scoped>
.btn-box {
  display: flex;
}
.form {
  margin-left: 50px;
}
.down-template {
  margin-right: auto;
}
</style>
