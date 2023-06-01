<template>
  <el-dialog
    title="添加员工"
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
        <el-form-item label="所属部门">
          <span>{{ props.deptItem.name }}</span>
        </el-form-item>
        <el-form-item label="添加角色">
          <span>{{ props.roleItem.name }}</span>
        </el-form-item>
        <el-form-item label="员工" prop="employeeIds">
          <el-select v-model="form.employeeIds" placeholder="请选择员工" multiple>
            <el-option v-for="item in employeeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/systemSetting'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  deptItem: {
    type: Object,
    default: () => {
      return {}
    }
  },
  roleItem: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['update:dialogVisible', 'change'])

const formRef = ref()
const loading = ref(false)
const form = reactive({
  employeeIds: [],
})
const rules = reactive({
  employeeIds: [{ required: true, message: '请选择员工', trigger: 'change' }]
})
const employeeList = ref([])
const findNonRoleList = async () => {
  const { data } = await Apis.findNonRoleList({ deptId: props.deptItem.id, roleId: props.roleItem.id })
  employeeList.value = data
}

const handleOpen = () => {
  findNonRoleList()
}
const beforeClose = () => {
  formRef.value.resetFields()
  emit('update:dialogVisible', false)
}
const onSubmit = async () => {
  const isValid = await formRef.value.validate().catch(() => {})
  if (!isValid) return
  const postData = {
    employeeIds: form.employeeIds,
    roleId: props.roleItem.id
  }
  loading.value = true
  try {
    await Apis.addRoleEmployee(postData)
    loading.value = false
    ElMessage.success('添加成功')
    beforeClose()
    emit('change')
  } catch (err) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
