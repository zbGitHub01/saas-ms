<template>
  <el-dialog
    v-model="dialogVisible"
    title="新案入库"
    width="510px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef">
        <el-form-item label="产品:" label-width="125px" prop="productId">
          <el-select clearable v-model="form.productId" filterable placeholder="请选择产品" style="width: 300px">
            <el-option
              v-for="item in selectData.productList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库批次:" label-width="125px" prop="batchId">
          <el-select clearable v-model="form.batchId" filterable placeholder="请选择入库批次" style="width: 300px">
            <el-option
              v-for="item in selectData.batchList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债权方:" label-width="125px" prop="creditorId">
          <el-select
            clearable
            v-model="form.creditorId"
            filterable
            placeholder="请选择债权方"
            style="width: 300px"
            @change="changeCreditor"
          >
            <el-option
              v-for="item in selectData.creditorList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入文件:" label-width="125px">
          <UploadFile ref="uploadFileRef" v-model:file-list="fileList" accept-type="excel" />
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item
          label="委托起始日期："
          label-width="125px"
          prop="proxyStartTime"
          v-if="importCaseType === 2"
        >
          <el-date-picker v-model="form.proxyStartTime" type="date" placeholder="请选择委托起始日期" value-format="YYYY-MM-DD" :disabled-date="disabledDate"/>
        </el-form-item>
        <el-form-item label="委托时效：" label-width="125px" prop="proxyEndTime" class="timeRadio" v-if="importCaseType === 2">
          <el-radio-group v-model="form.proxyEndTime">
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
        <el-form-item label="委托协议:" label-width="125px" v-if="importCaseType === 2">
          <UploadFile ref="uploadFileRefSub" v-model:file-list="fileListSub" accept-type="excel" />
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
import { reactive, ref } from 'vue'
import { UploadFile } from '@/components/Upload'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/caseManage'
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
const form = reactive({
  productId: null,
  batchId: null,
  creditorId: null,
  importFileType: 101,
  proxyStartTime: '',
  proxyEndTime: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
const importCaseType = ref()
const time = ref('')
const fileList = ref([])
const fileListSub = ref([])
const uploadFileRef = ref()
const uploadFileRefSub = ref()
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  productId: [{ required: true, trigger: 'change', message: '请选择产品' }],
  batchId: [{ required: true, trigger: 'change', message: '请选择入库批次' }],
  creditorId: [{ required: true, trigger: 'change', message: '请选择债权方' }],
  proxyStartTime: [{ required: true, trigger: 'change', message: '请选择委托起始日期' }],
  proxyEndTime: [{ required: true, trigger: 'change', message: '委托时效不能为空' }]
})
// 打开弹窗
const dialogVisible = ref(false)
const open = async () => {
  importCaseType.value = null
  Object.assign(form, originFormData)
  fileList.value = []
  fileListSub.value = []
  dialogVisible.value = true
}
defineExpose({
  open
})

const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (!fileList.value[0]) {
        return ElMessage.error('请上传文件！')
      }
      const params = {
        ...form,
        importUrl: fileList.value[0].url,
        importCaseType: importCaseType.value
      }
      if (importCaseType.value === 1) {
        delete params.proxyStartTime
        delete params.proxyEndTime
      } else if (importCaseType.value === 2) {
        if (!fileListSub.value[0]) {
          return ElMessage.error('请上传协议！')
        }
        params.proxyAgreement = fileListSub.value[0].url
        if (params.proxyEndTime === '永久') {
          params.proxyDurationType = 1
          params.proxyEndTime = null
        } else {
          params.proxyDurationType = 2
        }
      }
      console.log(params)
      await Apis.caseImport(params)
      ElMessage.success('导入成功！')
      cancelSubmit()
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
  time.value = ''
}
// 判断债权方的性质 1: 导入债权方为租户本身的案件 2: 导入债权方非本租户的案件
const changeCreditor = val => {
  if (val) {
    props.selectData.creditorList.forEach(item => {
      if (item.itemId === val) {
        importCaseType.value = item.importCaseType
      }
    })
  } else {
    importCaseType.value = null
  }
  form.proxyStartTime = ''
  form.proxyEndTime = ''
  time.value = ''
  fileListSub.value = []
}
const changeDate = val => {
  form.proxyEndTime = val
}
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
</script>
    
<style lang="scss" scoped>
.timeRadio {
  :deep(.el-form-item__content) {
    display: block;
  }
}
:deep(.el-radio-group) {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
}
</style>  