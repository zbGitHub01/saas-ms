<template>
  <el-dialog v-model="dialogVisible" title="基础合作信息" width="800px" :before-close="handleClose">
    <div style="margin: 0 40px">
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
        <div style="display: flex">
          <div>
            <el-form-item label="机构分类：" prop="orgCategoryId">
              <el-select v-model="form.orgCategoryId" placeholder="请选择机构分类" class="w280">
                <el-option
                  v-for="item in orgCategoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="委外经理：" prop="entrustStaffId">
              <el-select v-model="form.entrustStaffId" placeholder="请选择委外经理" class="w280">
                <el-option
                  v-for="item in entrustStaffList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="对接邮箱：" prop="mail">
              <el-input v-model="form.mail" placeholder="请输入对接邮箱" class="w280" />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input
                class="w280"
                v-model="form.remark"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入备注"
              />
            </el-form-item>
          </div>
          <div style="padding-left: 60px">
            <el-form-item label="机构作业模式：" prop="orgModelId">
              <el-select v-model="form.orgModelId" placeholder="请选择机构作业模式" class="w280">
                <el-option
                  v-for="item in taskModelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="限制IP地址：" prop="isWhiteIp">
              <div class="w320 tip-text">指限制合作机构访问我方委派案件相关数据的网络固定IP； 即只有在限制的IP范围内该合作机构才可查看相关数据</div>
              <el-radio-group v-model="form.isWhiteIp">
                <el-radio :label="1">限制IP</el-radio>
                <el-radio :label="0">不限制</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label prop="whiteIp">
              <el-input
                class="w320"
                v-model="form.whiteIp"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="必须为固定IP地址，不可提供动态IP地址；如设置多个IP请用逗号区分"
              />
            </el-form-item>
          </div>
        </div>
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
const orgCategoryList = ref<any[]>([])
const taskModelList = ref<any[]>([])
const entrustStaffList = ref<any[]>([])
const form = reactive({
  orgCategoryId: '',
  entrustStaffId: '',
  orgModelId: '',
  mail: '',
  remark: '',
  isWhiteIp: 0,
  whiteIp: ''
})
const rules = reactive<FormRules>({
  orgCategoryId: [{ required: true, message: '请选择机构分类', trigger: 'change' }],
  entrustStaffId: [{ required: true, message: '请选择委外经理', trigger: 'change' }],
  mail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  orgModelId: [{ required: true, message: '请选择机构作业模式', trigger: 'change' }],
  isWhiteIp: [{ required: true, message: '请选择是否限制IP地址', trigger: 'change' }]
})
const emits = defineEmits(['getOrgDetail'])
const open = data => {
  getSelectList()
  nextTick(() => {
    Object.assign(form, data)
  })
  dialogVisible.value = true
}
const doSave = async () => {
  const params = {
    ...form
  }
  const { code } = await Apis.clientOrgDetailUpdate(params)
  if (code !== 200) return
  ElMessage.success('操作成功')
  emits('getOrgDetail')
  handleClose()
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
//获取列表数据
const getSelectList = async () => {
  let param = {
    codes: 'ORG_CATEGORY,ORG_TASK_MODEL'
  }
  const { code, data } = await Apis.optionList(param)
  if (code !== 200) return
  orgCategoryList.value = data?.ORG_CATEGORY ?? []
  taskModelList.value = data?.ORG_TASK_MODEL ?? []
  const userData = await Apis.clientEmployeeList()
  if (userData.code !== 200) return
  entrustStaffList.value = userData.data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.w280 {
  width: 280px;
}
.w300 {
  width: 320px;
}
.text-weight {
  font-weight: bold;
}
.tip-text {
  background-color: rgba(250, 245, 206, 1);
  box-sizing: border-box;
  border: 1px solid rgba(255, 187, 113, 1);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #ff9921;
  line-height: 18px;
}
</style>
