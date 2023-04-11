<template>
  <el-dialog
    :title="title"
    :model-value="props.dialogVisible"
    width="450px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    @open="handleOpen"
  >
    <template #default>
      <el-form ref="formRef" class="form" :model="form" :rules="rules" label-width="100">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入职位名称"></el-input>
        </el-form-item>
        <el-form-item label="职位描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入职位描述"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Apis from '@/api/modules/systemSetting'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  positionItem: {
    type: Object || null,
    default: null
  }
})
const emit = defineEmits(['update:dialogVisible', 'change'])

const formRef = ref()
const loading = ref(false)
const form = reactive({
  name: '',
  remark: ''
})
const rules = reactive({
  name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
})
const title = computed(() => (props.deptItem ? '编辑机构职位' : '添加机构职位'))

const handleOpen = () => {}
const beforeClose = () => {
  formRef.value.resetFields()
  emit('update:dialogVisible', false)
}
const onSubmit = async () => {
  const isValid = await formRef.value.validate().catch(() => {})
  if (!isValid) return
  loading.value = true
  const postData = { ...form }
  if (props.deptItem) {
    postData.id = props.positionItem.id
  }
  const { code } = await Apis.addPosition(postData)
  loading.value = false
  if (code === 200) {
    emit('change')
    beforeClose()
  }
}
</script>

<style lang="scss" scoped></style>
