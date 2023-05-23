<template>
  <el-dialog
    :title="title + '员工'"
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
        <el-form-item label="员工" prop="employeeIds">
          <el-select v-if="!props.employeeItem" v-model="form.employeeIds" multiple clearable placeholder="请选择员工">
            <el-option v-for="item in employeeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <span v-else>{{ props.employeeItem.name }}</span>
        </el-form-item>
        <el-form-item label="任职职位" prop="positionId">
          <el-select v-model="form.positionId" :disabled="!props.employeeItem" placeholder="请选择任职职位">
            <el-option v-for="item in props.positionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
import Apis from '@/api/modules/systemSetting'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  positionList: {
    type: Array,
    default: () => {}
  },
  positionItem: {
    type: Object || null,
    default: null
  },
  employeeItem: {
    type: Object || null,
    default: null
  }
})
const emit = defineEmits(['update:dialogVisible', 'change'])

const formRef = ref()
const loading = ref(false)
const form = reactive({
  employeeIds: [],
  positionId: null
})
const rules = reactive({
  employeeIds: [{ required: true, message: '请选择员工', trigger: 'change' }],
  positionId: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
})
const title = computed(() => (props.employeeItem ? '编辑' : '添加'))
const employeeList = ref([])

const handleOpen = () => {
  if (props.employeeItem) {
    form.employeeIds = [props.employeeItem.id]
  } else {
    fetchEmployeeList()
  }
  if (props.positionItem) {
    form.positionId = props.positionItem.id
  }
}
const beforeClose = () => {
  formRef.value.resetFields()
  emit('update:dialogVisible', false)
}
const fetchEmployeeList = async () => {
  const { data } = await Apis.findNonPositionEmployee()
  employeeList.value = data
}
const onSubmit = async () => {
  const isValid = await formRef.value.validate().catch(() => {})
  if (!isValid) return
  const postData = {
    ...form
  }
  loading.value = true
  try {
    await Apis.editPositionEmployee(postData)
    loading.value = false
    emit('change')
    ElMessage.success(title.value + '成功')
    beforeClose()
  } catch (err) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
