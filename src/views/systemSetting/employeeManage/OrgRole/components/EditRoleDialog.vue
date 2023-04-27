<template>
  <el-dialog
    :title="title + '机构角色'"
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
        <el-form-item label="授权部门" prop="deptIds">
          <el-cascader v-model="form.deptIds" :options="deptTree" :props="cascaderProps" clearable placeholder="请选择授权部门" />
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
import { ElMessage } from 'element-plus'
import { useCommonStore } from '@/store/modules/common'
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
const cascaderProps = {
  label: 'name',
  value: 'id',
  checkStrictly: true,
  multiple: true
}
const commonStore = useCommonStore()
const formRef = ref()
const loading = ref(false)
const form = reactive({
  name: '',
  deptIds: [],
  remark: ''
})
const rules = reactive({
  name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  deptIds: [{ required: true, message: '请选择授权部门', trigger: 'change' }]
})
const title = computed(() => (props.positionItem ? '编辑' : '添加'))

const deptTree = computed(() => commonStore.deptTree)
const handleOpen = () => {
  if (props.positionItem) {
    form.name = props.positionItem.name
    form.remark = props.positionItem.remark
    fetchRoleDeptList()
  }
}
const beforeClose = () => {
  formRef.value.resetFields()
  emit('update:dialogVisible', false)
}
const fetchRoleDeptList = async () => {
  const { code, data } = await Apis.findRoleDeptList({ roleId: props.positionItem.id })
  if (code === 200) {
    form.deptIds = data.map(item => item.id)
  }
}
const onSubmit = async () => {
  const isValid = await formRef.value.validate().catch(() => {})
  if (!isValid) return
  const postData = { ...form }
  postData.deptIds = form.deptIds.map(item => item[item.length - 1])
  if (props.positionItem) {
    postData.id = props.positionItem.id
  }
  loading.value = true
  const { code } = await Apis.editRole(postData)
  loading.value = false
  if (code === 200) {
    emit('change')
    ElMessage.success(title.value + '成功')
    beforeClose()
  }
}
</script>

<style lang="scss" scoped></style>
