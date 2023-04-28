<template>
  <el-dialog v-model="dialogVisible" title="终止合作" width="700px" :before-close="handleClose">
    <div style="margin: 0 40px">
      <div class="ft-align text-weight mb12">确认与该处置机构终止合作吗？</div>
      <div
        class="ft-align mb30"
        v-if="orgDetail.orgNum >0"
      >终止合作后该公司账号下的个{{ orgDetail.orgNum }}案件将被收回至平台委外处置库。</div>
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        :size="formSize"
        label-width="120px"
        label-position="top"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="退出原因：" prop="reasonId">
          <el-select v-model="form.reasonId" placeholder="请选择退出原因">
            <el-option
              v-for="item in reasonList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入退出备注原因"
          />
        </el-form-item>
        <el-form-item label="是否将本机构的相关信息收录至机构敏感信息库" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是，选择敏感信息</el-radio>
          </el-radio-group>
          <el-form-item v-if="form.state === 1" label prop="riskTypes">
            <el-checkbox-group v-model="form.riskTypes">
              <el-checkbox
                v-for="(item, index) in sensitiveOptions"
                :key="index"
                :label="item.id"
                :disabled="item.disabled"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
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
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const orgDetail = ref({})
const reasonList = ref<any[]>([])
const sensitiveOptions = ref<any[]>([
  {
    id: 8,
    name: '统一社会信用代码',
    disabled: true
  },
  {
    id: 0,
    name: '机构名称',
    disabled: true
  },
  {
    id: 1,
    name: '法定代表人身份证号'
  },
  {
    id: 2,
    name: '实际控制人身份证号'
  },
  {
    id: 3,
    name: '企业经营负责人身份证号'
  },
  {
    id: 4,
    name: '业务对接人身份证号'
  },
  {
    id: 6,
    name: '注册人手机号'
  },
  {
    id: 7,
    name: '对公银行账户'
  },
  {
    id: 5,
    name: '税务登记号'
  }
])
const form = reactive({
  reasonId: '',
  remark: '',
  riskTypes: [8, 0],
  state: 0
})
const rules = reactive<FormRules>({
  reasonId: [{ required: true, message: '请选择退出原因', trigger: 'change' }],
  state: [{ required: true, message: '请选择', trigger: 'change' }],
  riskTypes: [{ required: true, message: '请选择敏感信息', trigger: 'change' }]
})
const emits = defineEmits(['getTableData'])
const open = (row: any) => {
  orgDetail.value = row
  dialogVisible.value = true
  nextTick(() => {
    getSelectList()
  })
}
const doSave = async () => {
  const params = {
    relationTenantId: orgDetail.value.relationTenantId,
    ...form
  }
  params.reasonContent = reasonList.value.filter((item: any) => item.id === params.reasonId)[0].name
  const { code, data } = await Apis.clientOrgTerminateCooperation(params)
  if (code !== 200) return
  emits('getTableData')
  handleClose()
  if (data.data === 0) {
    ElMessage.success('操作成功')
  } else {
    ElMessage.success('数据量较大请稍候')
  }
}
const handleClose = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      doSave()
    }
  })
}
//获取下拉数据
const getSelectList = async () => {
  const option2 = await Apis.configList({
    optionId: orgDetail.value.orgCategoryId,
    type: 2
  })
  if (option2.code !== 200) return
  reasonList.value = option2.data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.ft-align {
  font-size: 16px;
  text-align: center;
}
.text-weight {
  font-weight: bold;
}
</style>
