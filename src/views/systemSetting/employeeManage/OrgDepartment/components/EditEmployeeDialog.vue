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
        <el-form-item label="员工">
          <span>{{ props.employeeItem?.name }}</span>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader
            v-model="form.deptId"
            :options="deptTree"
            clearable
            :props="{ label: 'name', value: 'id', checkStrictly: true }"
            placeholder="请选择所属部门"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useCommonStore } from '@/store/modules/common'
import Apis from '@/api/modules/systemSetting'
import { getPathByKey } from '@/utils/tree'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  employeeItem: {
    type: Object || null,
    default: null
  },
  deptItem: {
    type: Object || null,
    default: null
  }
})
const emit = defineEmits(['update:dialogVisible', 'change'])
const commonStore = useCommonStore()

const formRef = ref()
const loading = ref(false)
const form = reactive({
  deptId: []
})
const rules = reactive({
  deptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
})
const title = computed(() => (props.employeeItem ? '编辑员工' : '添加员工'))
const deptTree = computed(() => commonStore.deptTree)

const handleOpen = () => {
  form.deptId = getPathByKey(props.deptItem.id, deptTree.value).map(item => item.id)
}
const beforeClose = () => {
  formRef.value.resetFields()
  emit('update:dialogVisible', false)
}
const onSubmit = async () => {
  const isValid = await formRef.value.validate().catch(() => {})
  if (!isValid) return
  const postData = {
    employeeId: props.employeeItem.id,
    deptId: form.deptId[form.deptId.length - 1]
  }
  loading.value = true
  try {
    await Apis.updateDeptEmployee(postData)
    loading.value = false
    emit('change')
    ElMessage.success('修改成功')
    beforeClose()
  } catch (err) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
