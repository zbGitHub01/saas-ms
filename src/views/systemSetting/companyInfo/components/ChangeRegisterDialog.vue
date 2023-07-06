<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="430px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="top" label-width="100px">
        <el-form-item v-if="title === '变更注册手机号'">原注册手机号: {{ form.oldPhone }}</el-form-item>
        <el-form-item label="验证码：" prop="oldPhoneSmsCode">
          <el-input v-model="form.oldPhoneSmsCode" placeholder="请输入验证码" clearable maxlength="6"></el-input>
          <el-button type="primary" class="ml10" @click="getSmsCode(1)" :disabled="disabled">{{ smsTxt }}</el-button>
          <div style="color: #e6a23c; font-size: 12px">验证码将发送到手机号{{ form.oldPhone }}，点击获取验证码后请注意查收</div>
        </el-form-item>
        <el-form-item label="新注册手机号：" prop="newPhone">
          <el-input v-model="form.newPhone" placeholder="请输入新注册手机号" clearable maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="newPhoneSmsCode">
          <el-input v-model="form.newPhoneSmsCode" placeholder="请输入验证码" clearable maxlength="6"></el-input>
          <el-button type="primary" class="ml10" @click="getSmsCode(2)" :disabled="disabledSub">{{ smsTxtSub }}</el-button>
          <div style="color: #e6a23c; font-size: 12px">验证码将发送到手机号{{ form.newPhone }}，点击获取验证码后请注意查收</div>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定变更</el-button>
      </span>
    </template>
  </el-dialog>
</template>
      
<script setup>
import { ref, reactive } from 'vue'
import Apis from '@/api/modules/company'
import { ElMessage } from 'element-plus'
const form = reactive({
  newPhone: '', //新手机号
  newPhoneSmsCode: '', //新手机号验证码
  oldPhone: '', //旧手机号
  oldPhoneSmsCode: '', //旧手机号验证码
  tenantId: null //租户主键ID
})
const originFormData = JSON.parse(JSON.stringify(form))
const title = ref('')
const smsTxt = ref('获取验证码')
const smsTxtSub = ref('获取验证码')
const disabled = ref(false)
const disabledSub = ref(false)

//校验规则
//账号，密码验证码校验
const validateUsername = (rule, value, callback) => {
  if (value.length === 11) {
    callback()
  } else if (value === '^1\\d{10}$') {
    callback()
  } else {
    callback(new Error('请输入正确的号码'))
  }
}
const validateCode = (rule, value, callback) => {
  if (value.length === 6) {
    callback()
  } else {
    callback(new Error('请输入6位验证码'))
  }
}
const ruleFormRef = ref()
const rules = reactive({
  newPhoneSmsCode: [{ required: true, trigger: 'blur', validator: validateCode }],
  oldPhoneSmsCode: [{ required: true, trigger: 'blur', validator: validateCode }],
  newPhone: [{ required: true, trigger: 'blur', validator: validateUsername }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = row => {
  title.value = '变更注册手机号'
  Object.assign(form, originFormData)
  form.oldPhone = row.registerPhone
  form.tenantId = row.id
  dialogVisible.value = true
}
defineExpose({
  open
})
//获取验证码 1为原手机号验证码 2新手机号验证码
const getSmsCode = async type => {
  if (type === 1) {
    if (!form.oldPhone) {
      return ElMessage.error('手机号不能为空！')
    }
    let params = {
      operateType: 3, //1：更新主管理员 2：更新注册人-新手机号 3:更新注册人-旧手机号
      phone: form.oldPhone,
      tenantId: form.tenantId
    }
    await Apis.sendSms(params)
    ElMessage.success('验证码已发送，请留意接收验证码的手机号【' + form.oldPhone + '】')
    disabled.value = true
    //倒计时
    let min = 60
    var t = setInterval(function () {
      smsTxt.value = min-- + '秒后重新获取'
      if (min === 0) {
        smsTxt.value = '获取验证码'
        disabled.value = false
        clearInterval(t)
      }
    }, 1000)
  } else if (type === 2) {
    if (form.newPhone.length !== 11 && form.newPhone.length !== '^1\\d{10}$') {
      return ElMessage.error('请输入正确的号码')
    }
    let params = {
      operateType: 2, //1：更新主管理员 2：更新注册人-新手机号 3:更新注册人-旧手机号
      phone: form.newPhone,
      tenantId: form.tenantId
    }
    await Apis.sendSms(params)
    ElMessage.success('验证码已发送，请留意接收验证码的手机号【' + form.newPhone + '】')
    disabledSub.value = true
    //倒计时
    let min = 60
    var h = setInterval(function () {
      smsTxtSub.value = min-- + '秒后重新获取'
      if (min === 0) {
        smsTxtSub.value = '获取验证码'
        disabledSub.value = false
        clearInterval(h)
      }
    }, 1000)
  }
}
// 确定变更
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      await Apis.updateRegister(form)
      emits('getTableData')
      formEl.resetFields()
      dialogVisible.value = false
    }
  })
}
// 取消
const cancelSubmit = formEl => {
  formEl?.resetFields()
  dialogVisible.value = false
}
</script>
      
<style lang="scss" scoped>
</style>
      