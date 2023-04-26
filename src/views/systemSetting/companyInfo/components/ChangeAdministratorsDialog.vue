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
        <el-form-item label="新主管理员：" prop="adminId">
          <el-select
            v-model="form.adminId"
            placeholder="请选择新主管理员"
            clearable
            filterable
            @change="selectAdmin($event)"
          >
            <el-option
              v-for="(item, index) in selectData.peopleList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="验证码：" prop="smsCode">
          <el-input v-model="form.smsCode" placeholder="请输入验证码" clearable maxlength="6"></el-input>
          <el-button type="primary" class="ml10" @click="getSmsCode" :disabled="disabled">{{ smsTxt }}</el-button>
          <div style="color: #e6a23c; font-size: 12px">验证码将送法到手机号{{ form.adminPhone }}，点击获取验证码后请注意查收</div>
        </el-form-item>
        <el-form-item :label="`请为原主管理员账号 ${admin} / ${adminPhone} 指定角色：`" prop="newRoleId">
          <el-select v-model="form.newRoleId" placeholder="请选择角色" clearable filterable>
            <el-option
              v-for="(item, index) in selectData.roleList"
              :key="index"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
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
      
<script lang="ts" setup>
// 表单验证规则的类型
import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'
import Apis from '@/api/modules/company'
import { ElMessage } from 'element-plus'
// 接收props数据
const props = defineProps<{
  selectData: {
    peopleList: any[]
    roleList: any[]
  }
}>()
const form: any = reactive({
  admin: null, //新管理员
  adminId: null, //新管理员ID
  adminPhone: null, //新管理员手机号
  newRoleId: null, //老管理员新角色ID
  oldAdminId: null, //老管理员ID
  smsCode: '', //短信验证码
  tenantId: null //租户主键ID
})
const originFormData = JSON.parse(JSON.stringify(form))
const title = ref<String>('')
const admin = ref<String>('')
const adminPhone = ref<String>('')
const smsTxt = ref<String>('获取验证码')
const disabled = ref<boolean>(false)

//校验规则
//验证码校验
const validateCode = (rule, value, callback) => {
  if (value.length === 6) {
    callback()
  } else {
    callback(new Error('请输入6位验证码'))
  }
}
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  newRoleId: [{ required: true, trigger: 'change', message: '必须为原主管理员指定角色' }],
  smsCode: [{ required: true, trigger: 'blur', validator: validateCode }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (row: any) => {
  title.value = '变更主管理员'
  admin.value = row.admin
  adminPhone.value = row.adminPhone
  Object.assign(form, originFormData)
  form.oldAdminId = row.adminId
  form.tenantId = row.id
  dialogVisible.value = true
}
defineExpose({
  open
})
//获取验证码
const getSmsCode = async () => {
  if (!form.adminPhone) {
    return ElMessage.error('手机号不能为空！')
  }
  let params = {
    operateType: 1, //1：更新主管理员 2：更新注册人-新手机号 3:更新注册人-旧手机号
    phone: form.adminPhone,
    tenantId: form.tenantId
  }
  console.log(params)
  // 发送请求
  await Apis.sendSms(params)
  ElMessage.success('验证码已发送，请留意接收验证码的手机号【' + form.adminPhone + '】')
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
}
// 确定变更
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(form)
      // 发送请求
      await Apis.updateAdmin(form)
      emits('getTableData')
      formEl.resetFields()
      dialogVisible.value = false
    }
  })
}
// 取消
const cancelSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
}
// 选择新的主管理员
const selectAdmin = val => {
  props.selectData.peopleList.forEach(item => {
    if (item.id === form.adminId) {
      form.admin = item.name
      form.adminPhone = item.phone
    }
  })
  console.log(val)
}
</script>
      
<style lang="scss" scoped>
</style>
      