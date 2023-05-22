<template>
  <h1 class="title">{{ inviteInfo.name }}，你好！</h1>
  <h2>{{ inviteInfo.tenantName }}邀请您加入公司！</h2>
  <div class="cell">
    <div class="label">任职部门：</div>
    <div class="value">{{ inviteInfo.deptName }}</div>
  </div>
  <div class="cell">
    <div class="label">担任职位：</div>
    <div class="value">{{ inviteInfo.positionName }}</div>
  </div>
  <el-form ref="formRef" class="form" :model="form" :rules="rules" hide-required-asterisk size="large">
    <el-form-item prop="username">
      <el-input v-model="form.username" :maxlength="11" placeholder="请输入手机号码">
        <template #prefix>
          <el-icon class="input-icon"><Iphone /></el-icon>
        </template>
      </el-input>
      <p class="tip">请输入您的员工登记手机号码：{{ inviteInfo.phone }}</p>
    </el-form-item>
    <el-form-item prop="code">
      <div class="input-box">
        <el-input v-model="form.code" class="append-btn" placeholder="请输入验证码">
          <template #prefix>
            <el-icon class="input-icon"><Lock /></el-icon>
          </template>
        </el-input>
        <el-button class="code-btn mr10" type="primary" link :disabled="gapTime !== 61" @click="sendSMS">
          {{ verifyContent }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button class="btn" type="primary" @click="onSubmit">登 录</el-button>
    </el-form-item>
    <div class="tips">
      <span>完成登录即代表成功加入企业</span>
    </div>
  </el-form>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Apis from '@/api/modules/systemSetting'
import { phoneReg } from '@/utils/validate'
import { useGlobalStore } from '@/store'
import { sendSmsCode } from '@/api/modules/user'

const emit = defineEmits(['change'])
const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()
const inviteInfo = ref({})
const formRef = ref()
const form = reactive({
  username: '',
  code: ''
})
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号码'))
  }
  if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  }
  callback(undefined)
}
const rules = reactive({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const gapTime = ref(61)
const verifyContent = computed(() => (gapTime.value < 61 && gapTime.value > 0 ? `${gapTime.value}秒后重新获取` : '获取验证码'))

const fetchInviteUserInfo = async () => {
  const userCode = route.query.code
  if (!userCode) {
    return
  }
  const { data } = await Apis.findInviteUserInfo({ code: userCode })
  inviteInfo.value = data
}
const sendSMS = async () => {
  if (gapTime.value < 61 && gapTime.value > 0) {
    return
  }
  const isValidate = await formRef.value?.validateField('username').catch(() => false)
  if (!isValidate) return
  const result = await fetchSendSmsCode()
  if (result) {
    gapTime.value -= 1
    cutDownTime()
  }
}
const cutDownTime = () => {
  const timer = window.setInterval(() => {
    gapTime.value -= 1
    if (gapTime.value <= 0) {
      clearInterval(timer)
      gapTime.value = 61
    }
  }, 1000)
}
const fetchSendSmsCode = async () => {
  const { code } = await sendSmsCode(form.username)
  return code === 200
}
const acceptInvite = async () => {
  const userCode = route.query.code
  if (!userCode) {
    return
  }
  const data = await globalStore.acceptInvite(userCode)
  if (data) {
    if (data.isSetPassword === 0) {
      emit('change', 0)
    } else {
      await router.replace('/')
    }
  }
}
const onSubmit = async () => {
  const isValidate = await formRef.value?.validate().catch(() => false)
  if (!isValidate) return
  const postData = {
    grant_type: 'SMS',
    mobile: `SMS@${form.username}`,
    code: form.code
  }
  const result = await globalStore.login(postData)
  if (result) {
    await globalStore.fetchUserInfo()
    await acceptInvite()
  }
}

fetchInviteUserInfo()
</script>

<style lang="scss" scoped>
h1,
h2,
.cell {
  width: 400px;
  text-align: left;
}
.title {
  font-size: 36px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-bottom: 10px;
}
h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
.cell {
  display: flex;
  font-size: 18px;
  .value {
    font-weight: bold;
  }
}
:deep(.el-input__wrapper) {
  width: 400px;
  height: 46px;
  box-shadow: none;
  border: 1px solid #ced2d9;
}
.form {
  width: 400px;
  margin-top: 60px;
  :deep(.el-input__wrapper) {
    //width: 400px;
    height: 46px;
    box-shadow: none;
    border: 1px solid #ced2d9;
  }
  .input-box {
    border: 1px solid #ced2d9;
    border-radius: 4px;
    background-color: white;
    box-sizing: border-box;
    :deep(.el-input__wrapper) {
      border: none;
      width: 312px;
      height: 44px;
    }
  }
  .append-btn {
    width: 268px;
  }
  .code-btn {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
}
.btn {
  width: 100%;
  height: 46px;
  box-shadow: 0px 10px 20px 0px rgba(49, 120, 255, 0.35);
}
.tips {
  position: relative;
  margin-top: 36px;
  font-size: 12px;
  color: #666;
  line-height: 26px;
  text-align: center;
  &:after {
    position: absolute;
    left: 40px;
    right: 40px;
    top: 14px;
    z-index: 0;
    content: '';
    height: 1px;
    background-color: #ccc;
  }
  span {
    position: relative;
    padding: 0 10px;
    z-index: 2;
    background-color: #eaf3ff;
  }
}
.tip {
  font-size: 12px;
  color: var(--el-color-warning);
}
</style>
