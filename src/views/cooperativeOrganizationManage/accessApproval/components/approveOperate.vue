<template>
  <el-dialog
    v-model="dialogVisible"
    :title="operateType === 0 ? '审批通过' : '审批拒绝'"
    width="450px"
    :before-close="handleClose"
  >
    <div style="margin: 0 50px">
      <div class="dialog-text">{{ operateType === 0 ? '确定审核通过吗？' : '确定审核拒绝吗？' }}</div>
      <div v-if="operateType === 0 && isBlacklistHit" class="tips">主要人员命中黑名单，确定通过吗？</div>
      <div v-if="operateType === 0 && isSensitiveOrgHit" class="tips">该机构命中敏感机构信息，确认予以通过吗？</div>
      <el-form
        v-if="infoData.pageHandlerResult === 0 && operateType === 0"
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        :size="formSize"
        label-width="94px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="机构类型：" prop="orgTypeId">
          <el-select clearable v-model="form.orgTypeId" filterable placeholder="请选择机构类型">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业模式：" prop="orgModelId">
          <el-select clearable v-model="form.orgModelId" filterable placeholder="请选择作业模式">
            <el-option
              v-for="item in taskModelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
const emits = defineEmits(['update:isVisible', 'getTableData'])
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const isSensitiveOrgHit = ref(true)
const isBlacklistHit = ref(true)
const infoData = reactive({
  pageHandlerResult: 0,
  registerId: ''
})
const operateType = ref()
const categoryList = ref([])
const taskModelList = ref([])
const form = reactive({
  orgTypeId: '',
  orgModelId: ''
})
const rules = reactive<FormRules>({
  orgTypeId: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
  orgModelId: [{ required: true, message: '请选择作业模式', trigger: 'change' }]
})
const open = (type: number, data: any, hitList: []) => {
  form.orgTypeId = ''
  form.orgModelId = ''
  infoData.pageHandlerResult = data.pageHandlerResult
  infoData.registerId = data.registerId
  isBlacklistHit.value = !!hitList.length
  fetchSensitiveOrgHit()
  getSelectList()
  operateType.value = type
  dialogVisible.value = true
}
// 第一个审批
const otherRegisterApproveFirst = async (params: any) => {
  const { code } = await Apis.otherRegisterApproveFirst(params)
  if (code !== 200) return
  emits('update:isVisible', false)
  emits('getTableData')
  ElMessage.success('操作成功')
  handleClose()
}
// 第三个及其以后的所有审批
const otherRegisterApproveCommon = async (params: any) => {
  const { code } = await Apis.otherRegisterApproveCommon(params)
  if (code !== 200) return
  emits('update:isVisible', false)
  emits('getTableData')
  ElMessage.success('操作成功')
  handleClose()
}
// 查询是否命中敏感库
const fetchSensitiveOrgHit = async () => {
  const { code, data } = await Apis.findSensitiveOrgHit({ registerId: infoData.registerId })
  isSensitiveOrgHit.value = !!(code == 200 && data.length)
}
const doSave = () => {
  const temData = categoryList.value.filter((item: any) => item.itemId === form.orgTypeId)[0]
  const temModelData = taskModelList.value.filter((item: any) => item.itemId === form.orgModelId)[0]
  const params = {
    accessType: operateType.value,
    orgTypeId: temData.itemId,
    orgTypeName: temData.itemText,
    orgModelId: temModelData.itemId,
    orgModelName: temModelData.itemText,
    registerId: infoData.registerId
  }
  otherRegisterApproveFirst(params)
}
const handleClose = () => {
  if (infoData.pageHandlerResult === 0 && operateType.value === 0) {
    ruleFormRef.value?.resetFields()
  }
  dialogVisible.value = false
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (infoData.pageHandlerResult === 0) {
    if (operateType.value === 0) {
      if (!formEl) return
      await formEl.validate(valid => {
        if (valid) {
          doSave()
        }
      })
    } else {
      const params = {
        accessType: operateType.value,
        registerId: infoData.registerId
      }
      await otherRegisterApproveFirst(params)
    }
  } else {
    const params = {
      accessType: operateType.value,
      registerId: infoData.registerId
    }
    await otherRegisterApproveCommon(params)
  }
}
//获取列表数据
const getSelectList = async () => {
  let param = {
    codes: 'ORG_CATEGORY,ORG_TASK_MODEL'
  }
  const { code, data } = await Apis.optionList(param)
  if (code !== 200) return
  categoryList.value = data?.ORG_CATEGORY ?? []
  taskModelList.value = data?.ORG_TASK_MODEL ?? []
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.w300 {
  width: 300px !important;
}
.dialog-text {
  text-align: center;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.tips {
  color: #f56c6c;
  line-height: 22px;
  font-size: 12px;
  text-align: center;
  margin-bottom: 8px;
}
</style>
