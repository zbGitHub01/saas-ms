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
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="form.parentId"
            :options="_deptTree"
            clearable
            :props="{ label: 'name', value: 'id', checkStrictly: true }"
            placeholder="请选择上级部门"
          />
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
import cloneDeep from 'lodash/cloneDeep'
import { getPathByKey } from '@/utils/tree'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  deptTree: {
    type: Array,
    default: () => {}
  },
  deptItem: {
    type: Object || null,
    default: null
  }
})
const emit = defineEmits(['update:dialogVisible', 'change'])

const _deptTree = ref([])
const formRef = ref()
const loading = ref(false)
const form = reactive({
  name: '',
  parentId: [0]
})
const rules = reactive({
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  parentId: [{ required: true, message: '请选择上级部门', trigger: 'change' }]
})
const title = computed(() => (props.deptItem ? '编辑部门' : '添加部门'))

const formatDeptData = () => {
  if (!props.deptItem) {
    return props.deptTree
  }
  const data = cloneDeep(props.deptTree)
  function setData(data) {
    data.forEach((item, index) => {
      if (item.id === props.deptItem.id) {
        data.splice(index, 1)
      }
      if (item.children && item.children.length) {
        setData(item.children)
      }
    })
  }
  setData(data)
  return data
}
const handleOpen = () => {
  if (props.deptItem) {
    _deptTree.value = formatDeptData()
    form.name = props.deptItem.name
    const path = getPathByKey(props.deptItem.parentId, props.deptTree)
    form.parentId = path.map(item => item.id)
  } else {
    _deptTree.value = props.deptTree
  }
}
const beforeClose = () => {
  formRef.value.resetFields()
  emit('update:dialogVisible', false)
}
const onSubmit = async () => {
  const isValid = await formRef.value.validate().catch(() => {})
  if (!isValid) return
  const postData = {
    name: form.name,
    parentId: form.parentId[form.parentId.length - 1]
  }
  let apiFn = Apis.addDept
  if (props.deptItem) {
    apiFn = Apis.editDept
    postData.id = props.deptItem.id
  }
  loading.value = true
  try {
    await apiFn(postData)
    loading.value = false
    emit('change')
    beforeClose()
  } catch (err) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
