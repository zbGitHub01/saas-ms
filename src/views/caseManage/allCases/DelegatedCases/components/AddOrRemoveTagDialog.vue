<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="25%"
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
            <el-option v-for="item in selectData.tagList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="typeSub === 2" label="从所有案件中删除此标签：" prop="isDeleteAllRelationTag">
          <el-switch v-model="form.isDeleteAllRelationTag"></el-switch>
        </el-form-item>
        <el-form-item v-if="typeSub === 3">
          <UploadFile
            ref="uploadFileRef"
            accept-type="excel"
            :auto-upload="false"
          />
          <!-- <el-upload
          ref="upload"
          action="/caseCenter/case/orgTagTemp/import"
          :limit="1"
          :auto-upload="false"
          :on-change="onChangeFiel"
          :on-success="onSuccess"
        >
          <span>上传文件：</span>
          <el-button type="primary" size="small">点击上传</el-button>
        </el-upload> -->
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
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { UploadFile } from '@/components/Upload'
const form: any = reactive({
  tempTagName: null, //临时标签
  isDeleteAllRelationTag: false //是否操作所有案件中删除
})
const originFormData = JSON.parse(JSON.stringify(form))
const typeSub = ref(1)
const title = ref('')
const upload = ref()
const uploadFileRef = ref()
const selectData = reactive({
  tagList: [] as any[] //临时标签列表
})
const emits = defineEmits(['submitForm', 'getTableData'])
// 校验规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  tempTagName: [{ required: true, message: '请选择临时标签', trigger: 'blur' }],
  isDeleteAllRelationTag: [{ required: true, message: '请选择状态', trigger: 'change' }]
})
// 打开弹窗
const dialogVisible = ref(false)
const open = type => {
  if (type === 1) {
    title.value = '添加临时标签'
  } else if (type === 2) {
    title.value = '删除临时标签'
    getSelecData()
  }else if(type == 3){
    title.value = '导入批量添加标签'
  }
  typeSub.value = type
  Object.assign(form, originFormData)
  dialogVisible.value = true
}
defineExpose({
  open
})
// 确认
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (typeSub.value === 1) {
        emits('submitForm', form.tempTagName, 1)
      } else if (typeSub.value === 2) {
        emits('submitForm', form.tempTagName, 2, form.isDeleteAllRelationTag)
      }else if(typeSub.value === 3){
        // 只要上传文件即可
        // upload.value.submit()
        uploadFileRef.value.uploadSubmit()
        emits('getTableData')
      }
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
  // 请求得到数据
  // const { data } = await xx(params)
  selectData.tagList = ['111', '116', 'test1', 'test', '99', 'jjj', '测试']
}
const onChangeFiel = (files, fileList) => {}
//上传成功
const onSuccess = res => {
  if (res.code === 200) {
    dialogVisible.value = false
  } else if (res.code === 500) {
    ElMessage.error('上传文档格式错误')
  }
}
//点击下载模板
const downloadHandle = () => {
  window.open(
    'https://asfile.donganzichan.cn/assets/tmpl/%E4%B8%B4%E6%97%B6%E6%A0%87%E7%AD%BE%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
  )
}
</script>
  
<style lang="scss" scoped>
</style>
  