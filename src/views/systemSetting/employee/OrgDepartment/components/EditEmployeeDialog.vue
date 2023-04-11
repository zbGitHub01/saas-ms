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
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="form.employeeId">
            <el-option label="员工1" value="1"></el-option>
            <el-option label="员工2" value="2"></el-option>
          </el-select>
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
import Apis from '@/api/modules/systemSetting'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  deptTree: {
    type: Array,
    default: () => {}
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
  employeeId: null,
  deptId: [0]
})
const rules = reactive({
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  deptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
})
const title = computed(() => (props.employeeItem ? '编辑员工' : '添加员工'))

const handleOpen = () => {}
const beforeClose = () => {
  formRef.value.resetFields()
  emit('update:dialogVisible', false)
}
const onSubmit = async () => {
  console.log(form)
  const isValid = await formRef.value.validate().catch(() => {})
  if (!isValid) return
  // const postData = {
  //   name: form.name,
  //   parentId: form.parentId.pop()
  // }
  // if (props.employeeItem) {
  //   postData.id = props.employeeItem.id
  // }
  // const { code } = await Apis.addDept(postData)
  // if (code === 200) {
  //   emit('change')
  // }
}
</script>

<style lang="scss" scoped></style>
