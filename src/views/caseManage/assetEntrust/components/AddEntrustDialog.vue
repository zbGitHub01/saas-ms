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
              v-for="(item, index) in selectData.productAndCreList"
              :key="index"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债权方：" prop="creditorId">
          <el-select v-model="form.creditorId" placeholder="请选择债权方" clearable filterable :disabled="true">
            <el-option v-for="(item, index) in selectData.productAndCreList" :key="index" :label="item.creditorName" :value="item.creditorId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托方：" prop="tenantId">
          {{ tenantInfo.tenantName }}
        </el-form-item>
        <el-form-item label="受托方：" prop="trusteeId">
          <el-select v-model="form.trusteeId" placeholder="请选择受托方" clearable filterable>
            <el-option v-for="(item, index) in selectData.trustList" :key="index" :label="item.itemText" :value="item.itemId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托时效：" prop="proxyEndTime" class="timeRadio">
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
        <el-form-item label="委托协议：" prop="fileList">
          <UploadFile ref="uploadFileRef" v-model:file-list="form.fileList" accept-type="excel" />
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
import { ElMessage, genFileId } from 'element-plus'
import { reactive, ref, computed } from 'vue'
import { UploadFile } from '@/components/Upload'
import { useGlobalStore } from '@/store/index'
import Apis from '@/api/modules/caseManage'
const globalStore = useGlobalStore()
const tenantInfo = computed(() => globalStore.tenantInfo)
const uploadFileRef = ref()
const form = reactive({
  productId: null,
  creditorId: null,
  tenantId: null,
  trusteeId: null,
  proxyEndTime: '',
  fileList: []
})
const originFormData = JSON.parse(JSON.stringify(form))
const time = ref('')
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
  creditorId: [{ required: true, trigger: 'change', message: '债权方不能为空' }],
  trusteeId: [{ required: true, trigger: 'change', message: '受托方不能为空' }],
  proxyEndTime: [{ required: true, trigger: 'change', message: '委托时效不能为空' }],
  fileList: [{ required: true, trigger: 'change', message: '委托协议不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = () => {
  Object.assign(form, originFormData)
  form.tenantId = tenantInfo.value.tenantId
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
      // 请求得到数据
      const params = {
        ...form,
        proxyAgreement: form.fileList[0].url
      }
      delete params.fileList
      if (params.proxyEndTime === '永久') {
        params.proxyDurationType = 1
        params.proxyEndTime = null
      } else {
        params.proxyDurationType = 2
      }
      await Apis.proxyCreate(params)
      ElMessage.success('操作成功！')
      emits('getTableData')
      cancelSubmit()
    }
  })
}
const changeDate = val => {
  form.proxyEndTime = val
}
// 根据选择的产品，匹配对应的债权方
const changeProduct = productId => {
  props.selectData.productAndCreList.forEach(item=>{
    if(item.productId === productId){
      form.creditorId = item.creditorId
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  time.value = ''
  dialogVisible.value = false
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
