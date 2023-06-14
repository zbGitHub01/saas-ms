<template>
  <el-dialog
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
      <el-form v-if="!link" ref="formRef" class="form" :model="form" :rules="rules" label-width="100">
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="员工手机" prop="phone">
          <el-input v-model="form.phone" :maxlength="11" placeholder="请输入员工手机"></el-input>
        </el-form-item>
        <el-form-item label="入职部门" prop="deptId">
          <el-cascader
            v-model="form.deptId"
            :options="deptTree"
            :props="{ label: 'itemText', value: 'itemId', checkStrictly: true }"
            clearable
            placeholder="请选择入职部门"
          />
        </el-form-item>
        <el-form-item label="任职职位" prop="positionId">
          <el-select v-model="form.positionId" placeholder="请选择任职职位">
            <el-option v-for="item in positionList" :key="item.itemId" :label="item.itemText" :value="item.itemId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-else class="success-wrap">
        <el-result icon="success" title="邀请成功" sub-title="邀请链接已生成，链接地址：">
          <template #extra>
            <a class="link" :href="link" target="_blank">{{ link }}</a>
            <div class="btn">
              <el-button v-copy="link" type="primary">复制链接</el-button>
            </div>
          </template>
        </el-result>
      </div>
    </template>
    <template v-if="!link" #footer>
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">生成邀请链接</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed, reactive, ref} from 'vue'
import {phoneReg} from '@/utils/validate'
import {useCommonStore} from '@/store/modules/common'
import Apis from '@/api/modules/systemSetting'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:dialogVisible'])

const commonStore = useCommonStore()
const formRef = ref()
const deptTree = computed(() => commonStore.dropdownList.DEPT_TREE)
const positionList = computed(() => commonStore.dropdownList.POSITION_LIST)
const form = reactive({
  name: '',
  phone: '',
  deptId: null,
  positionId: null
})
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入员工手机'))
  }
  if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  }
  callback()
}
const rules = reactive({
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择入职部门', trigger: 'change' }],
  positionId: [{ required: true, message: '请选择任职职位', trigger: 'change' }]
})
const loading = ref(false)
const link = ref('')

const fetchOptions = () => {
  commonStore.fetchItemList('DEPT_LIST,DEPT_TREE,POSITION_LIST')
}
const handleOpen = () => {
  fetchOptions()
}
const beforeClose = () => {
  formRef.value?.resetFields()
  emit('update:dialogVisible', false)
}
const successMounted = code => {
  const { origin, pathname } = window.location
  link.value = `${origin + pathname}#/loginInvite?code=${code}`
}
const onSubmit = async () => {
  const isValidate = await formRef.value.validate().catch(() => {})
  if (!isValidate) return
  const postData = {
    ...form,
    deptId: form.deptId[form.deptId.length - 1]
  }
  loading.value = true
  try {
    const { data } = await Apis.inviteEmployee(postData)
    loading.value = false
    successMounted(data)
  } catch (err) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin-left: 30px;
}
.el-input {
  width: 220px;
}
.success-wrap {
  .el-result {
    padding: 0;
    :deep(.el-result__extra) {
      margin-top: 16px;
    }
  }
  .link {
    color: var(--el-color-primary);
  }
  .btn {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
