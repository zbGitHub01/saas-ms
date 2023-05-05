<template>
  <el-dialog v-model="dialogVisible" title="邀请链接" width="450px" :before-close="handleClose">
    <div style="margin: 0 54px">
      <el-form
        v-if="link.type === 1"
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        :size="formSize"
        label-width="120px"
        label-position="top"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="被邀请方手机号：" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入被邀请方手机号"
            class="w300"
            @change="changePhone"
          />
          <span
            class="tip-text"
          >如被邀请合作方已在东岸资管SaaS注册，请填写对方机构的注册手机号，如未在东岸资管SaaS注册，请填写对方合理人员的手机号，只有被邀请的手机号码才能注册；</span>
        </el-form-item>
        <el-form-item label="请选择被邀请机构：" prop="orgId" v-if="optionData.orgList.length > 0">
          <el-select v-model="form.orgId" placeholder="请选择被邀请机构" class="w300">
            <el-option
              v-for="item in optionData.orgList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="被邀请机构类型：" prop="orgCategoryId">
          <el-select v-model="form.orgCategoryId" placeholder="请选择被邀请机构类型" class="w300">
            <el-option
              v-for="item in optionData.categoryData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐人（推荐机构）：" prop="recommendName">
          <el-select v-model="form.recommendName" placeholder="请选择被邀请机构的推荐人" class="w300">
            <el-option
              v-for="item in optionData.recommendData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="link.type === 2">
        <div>邀请链接已生成，链接地址：</div>
        <div style="color: #3178ff; word-wrap: break-word">{{ link.url }}</div>
        <div>
          该链接已关联邀请人：
          <span class="color-f00">{{ userInfo.username }}</span>
        </div>
        <div class="mt30 color-ff9921">
          请告知被邀请方注册并完成企业认证后，即可进入与
          <span class="color-f00">{{ tenantInfo.tenantName }}</span>
          的准入流程
        </div>
      </div>
      <div v-if="link.type === 3">
        <div>
          请告知被邀请方,
          <span class="color-f00">{{ tenantInfo.tenantName }}</span>
          的准入邀请已准备完成，登录后即可提交准入资料（登录作业系统也可完成准入提交）
        </div>
        <div class="mt12">
          已关联邀请人：
          <span class="color-f00">{{ userInfo.username }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <template v-if="link.type === 1">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确认邀请</el-button>
        </template>
        <template v-if="link.type === 2">
          <el-button type="primary" v-copy="link.url">复制邀请链接</el-button>
        </template>
        <template v-if="link.type === 3">
          <el-button type="primary" v-copy="link.url">复制准入提交页面地址</el-button>
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import type { FormInstance, FormRules } from 'element-plus'
import { phoneReg } from '@/utils/validate'
import { useGlobalStore } from '@/store/index'
const GlobalStore = useGlobalStore()

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const link = reactive({
  type: 1,
  url: ''
})
const optionData = reactive({
  orgList: [],
  categoryData: [],
  recommendData: []
})
const form = reactive({
  phone: '',
  orgId: '',
  orgCategoryId: '',
  recommendName: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const rules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入被邀请方手机号', trigger: 'blur' },
    { pattern: phoneReg, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  orgId: [{ required: true, message: '请选择被邀请机构', trigger: 'change' }],
  orgCategoryId: [{ required: true, message: '请选择被邀请机构类型', trigger: 'change' }]
})
const open = () => {
  getOptionList()
  link.type = 1
  Object.assign(form, defaultForm)
  dialogVisible.value = true
}
const doSave = async () => {
  const params = {
    ...form,
    url: import.meta.env.VITE_APP_BASE_institutionsH5Url
  }
  const { code, data } = await Apis.registerCreateUrl(params)
  if (code !== 200) return
  link.type = data.isRegister ? 3 : 2
  link.url = data.url
}
const changePhone = () => {
  if (phoneReg.test(form.phone)) {
    registerTenant()
  }
}
const registerTenant = async () => {
  const { code, data } = await Apis.registerTenantGetByPhone({ phone: form.phone })
  if (code !== 200) return
  optionData.orgList = data ?? []
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
// 机构类型
const getOptionList = async () => {
  const { code, data } = await Apis.optionList({ codes: 'ORG_CATEGORY' })
  if (code !== 200) return
  optionData.categoryData = data?.ORG_CATEGORY ?? []
  const recommendData = await Apis.registerTenantGetRecommendOrg()
  if (recommendData.code !== 200) return
  optionData.recommendData = recommendData.data ?? []
}
defineExpose({
  open
})
const userInfo = computed(() => GlobalStore.userInfo)
const tenantInfo = computed(() => GlobalStore.tenantInfo)
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.color-ff9921 {
  color: #ff9921;
}
.color-f00 {
  color: #f00;
}
.tip-text {
  display: inline-block;
  font-size: 12px;
  color: #ff9921;
  line-height: 16px;
  width: 300px;
}
.w300 {
  width: 300px !important;
}
.data {
  :deep(.el-input) {
    width: 100% !important;
  }
}
</style>
