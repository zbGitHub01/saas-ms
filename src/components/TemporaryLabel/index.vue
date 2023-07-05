<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="360px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-form-item v-if="typeSub === 1" label="临时标签：" prop="tempTagName">
          <el-input clearable v-model="form.tempTagName" type="text" placeholder="请输入临时标签" />
        </el-form-item>
        <el-form-item v-if="typeSub === 2" label="临时标签:" prop="tempTagName">
          <el-select v-model="form.tempTagName" filterable clearable placeholder="请选择临时标签">
            <el-option v-for="item in state.tagList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="typeSub === 2" label="从所有案件中删除此标签：" prop="isDeleteAllRelationTag">
          <el-switch v-model="form.isDeleteAllRelationTag"></el-switch>
        </el-form-item>
        <el-form-item v-if="typeSub === 3">
          <UploadFile ref="uploadFileRef" accept-type="excel" v-model:file-list="fileList" />
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="typeSub === 3" link type="primary" @click="downloadHandle" style="float: left">点击下载模板</el-button>
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import Apis from '@/api/modules/caseManage'
import { ElMessage } from 'element-plus'
import { UploadFile } from '@/components/Upload'
const form = reactive({
  tempTagName: null, //临时标签名字
  isDeleteAllRelationTag: false //是否操作所有案件中删除
})
const originFormData = JSON.parse(JSON.stringify(form))
const state = reactive({
  params: {},
  tagList: [] //临时标签列表
})
const fileList = ref([])
const typeSub = ref(1)
const title = ref('')
const isOrg = ref(false)
const uploadFileRef = ref()
const url = ref()
const emits = defineEmits(['getTableData'])
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  tempTagName: [{ required: true, message: '请选择临时标签', trigger: 'blur' }],
  isDeleteAllRelationTag: [{ required: true, message: '请选择状态', trigger: 'change' }]
})
// 打开弹窗
const dialogVisible = ref(false)
const open = (type, params, isOrgSub) => {
  if (type === 1) {
    title.value = '添加临时标签'
  } else if (type === 2) {
    title.value = '删除临时标签'
    getSelecData()
  } else if (type === 3) {
    title.value = '导入批量添加标签'
    getModel()
  }
  isOrg.value = isOrgSub
  state.params = params
  typeSub.value = type
  Object.assign(form, originFormData)
  dialogVisible.value = true
}
defineExpose({
  open
})
// 确认
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (typeSub.value === 1) {
        state.params.tempTagName = form.tempTagName
        isOrg.value ? await Apis.orgTagTempAdd(state.params) : await Apis.tagTempAdd(state.params)
      } else if (typeSub.value === 2) {
        state.params.tempTagName = form.tempTagName
        state.params.isDeleteAllRelationTag = form.isDeleteAllRelationTag === true ? 1 : 0
        isOrg.value ? await Apis.orgTagTempDelete(state.params) : await Apis.tagTempDelete(state.params)
      } else if (typeSub.value === 3) {
        if (!fileList.value[0]) {
          return ElMessage.error('请上传文件！')
        }
        const params = {
          importFileType: 201,
          importUrl: fileList.value[0].url
        }
        await Apis.caseImport(params)
      }
      ElMessage.success('操作成功！')
      emits('getTableData')
      cancelSubmit()
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
const getSelecData = async () => {
  const { data } = isOrg.value ? await Apis.orgTagTempList() : await Apis.tagTempList()
  state.tagList = data
}
//点击下载模板
const downloadHandle = () => {
  window.open(
    // 'https://asfile.donganzichan.cn/assets/tmpl/%E4%B8%B4%E6%97%B6%E6%A0%87%E7%AD%BE%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
    url.value
  )
}
// 获取下载模版
const getModel = async() => {
  const { data } = await Apis.importExcelPath()
  url.value = data.tagTemplateUrl
}
</script>
  
<style lang="scss" scoped>
</style>
  