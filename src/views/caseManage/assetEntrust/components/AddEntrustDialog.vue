<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增委托"
    width="550px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="right" label-width="120px">
        <el-form-item label="委托产品：" prop="productId">
          <el-select v-model="form.productId" placeholder="请选择委托产品" clearable filterable @change="changeProduct">
            <el-option
              v-for="(item, index) in selectData.productList"
              :key="index"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债权方：" prop="zhaiquanfangId">
          <el-select v-model="form.zhaiquanfangId" placeholder="请选择债权方" clearable filterable :disabled="true">
            <el-option v-for="(item, index) in selectData.orgList" :key="index" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方：" prop="weituofangId">
          {{ form.weituofangId }}
        </el-form-item>
        <el-form-item label="受托方：" prop="shoutuofangId">
          <el-select v-model="form.shoutuofangId" placeholder="请选择受托方" clearable filterable>
            <el-option v-for="(item, index) in selectData.orgList" :key="index" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托时效：" prop="deadline">
          <el-radio-group v-model="form.deadline">
            <el-radio :label="'永久'">永久</el-radio>
            <el-radio :label="time">截止时间</el-radio>
          </el-radio-group>
          <el-date-picker
            v-model="time"
            type="date"
            placeholder="请选择截止时间"
            @change="changeDate"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="委托协议：" prop="xieyi">
          <UploadFile ref="uploadFileRef" v-model:file-list="form.xieyi" accept-type="excel" />
          <!-- <el-upload
            ref="upload"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
          >
            <template #trigger>
              <el-button type="primary">上传</el-button>
            </template>
          </el-upload> -->
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { reactive, ref } from 'vue'
import { UploadFile } from '@/components/Upload'
// 上传
const upload = ref()
const uploadFileRef = ref()
// 上传超过一个，覆盖原文件
const handleExceed = files => {
  if (!upload.value) return
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
  // console.log(upload.value!, file, URL.createObjectURL(file))
  form.xieyi = URL.createObjectURL(file)
}
// 上传成功
const handleSuccess = (response, uploadFile) => {
  // console.log(upload.value!, response, uploadFile)
  form.xieyi = URL.createObjectURL(uploadFile.raw)
}
// 删除文件
const handleRemove = (file, uploadFiles) => {
  form.xieyi = ''
}
const form = reactive({
  productId: null,
  zhaiquanfangId: null,
  weituofangId: null,
  shoutuofangId: null,
  deadline: '',
  xieyi: [] //协议
})
const time = ref('')
// 接收props数据
// const props = defineProps<{
//   selectData: {
//     productList: any[]
//     orgList: any[]
//   }
// }>()
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  productId: [{ required: true, trigger: 'change', message: '委托产品不能为空' }],
  zhaiquanfangId: [{ required: true, trigger: 'change', message: '债权方不能为空' }],
  shoutuofangId: [{ required: true, trigger: 'change', message: '受托方不能为空' }],
  deadline: [{ required: true, trigger: 'change', message: '委托时效不能为空' }],
  xieyi: [{ required: true, trigger: 'change', message: '委托协议不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = () => {
  // 委托方数据从哪来？
  form.weituofangId = 1
  dialogVisible.value = true
}
defineExpose({
  open
})
// 添加委托
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(form)
      // 请求得到数据
      // const { data } = await xx(form)
      ElMessage.success('操作成功！')
      emits('getTableData')
      formEl.resetFields()
      dialogVisible.value = false
    }
  })
}
const changeDate = val => {
  form.deadline = val
}
// 根据选择的产品，自动生成对应的债权方id
const changeProduct = a => {
  form.zhaiquanfangId = a
}
// 取消
const cancelSubmit = () => {
  upload.value?.clearFiles()
  ruleFormRef.value?.resetFields()
  time.value = ''
  dialogVisible.value = false
}
</script>
  
<style lang="scss" scoped>
.center {
  text-align: center;
  font-size: 18px;
}
</style>
  