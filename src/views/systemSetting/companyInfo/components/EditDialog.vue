<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="450px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="top" label-width="100px">
        <el-form-item label="新主管理员：" prop="peopleId" v-if="title === '变更主管理员'">
          <el-select v-model="form.peopleId" placeholder="请从员工账号中选择新主管理员" clearable filterable style="width: 290px">
            <el-option
              v-for="(item, index) in selectData.peopleList"
              :key="index"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="title === '变更注册手机号'">原注册手机号: {{ phone }}</el-form-item>
        <el-form-item label="验证码：" prop="oldCode">
          <el-input v-model="form.oldCode" placeholder="请输入验证码" clearable style="width: 180px"></el-input>
          <el-button type="primary" class="ml10" @click="getSmsCode(1)" :disabled="disabled">{{ smsTxt }}</el-button>
          <div style="color: #e6a23c">验证码将送法到手机号{{ phone }}，点击获取验证码后请注意查收</div>
        </el-form-item>
        <el-form-item label="新注册手机号：" prop="newPhone" v-if="title === '变更注册手机号'">
          <el-input v-model="form.newPhone" placeholder="请输入新注册手机号" clearable style="width: 290px"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="newCode" v-if="title === '变更注册手机号'">
          <el-input v-model="form.newCode" placeholder="请输入验证码" clearable style="width: 180px"></el-input>
          <el-button type="primary" class="ml10" @click="getSmsCode(2)" :disabled="disabledSub">{{ smsTxtSub }}</el-button>
          <div style="color: #e6a23c">验证码将送法到手机号{{ form.newPhone }}，点击获取验证码后请注意查收</div>
        </el-form-item>
        <el-form-item
          :label="`请为原主管理员账号${peopleName} / ${phone}指定角色：`"
          prop="roleId"
          v-if="title === '变更主管理员'"
        >
          <el-select v-model="form.roleId" placeholder="请选择角色" clearable filterable style="width: 290px">
            <el-option v-for="(item, index) in selectData.roleList" :key="index" :label="item.text" :value="item.id"></el-option>
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
import { ElMessage } from 'element-plus'
// 接收props数据
const props = defineProps<{
  selectData: {
    peopleList: any[]
    roleList: any[]
  }
}>()
const form: any = reactive({
  peopleId: null,
  roleId: null,
  oldCode: '',
  newCode: '',
  newPhone: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
const phone = ref<String>('')
const title = ref<String>('')
const peopleName = ref<String>('')
const smsTxt = ref<String>('获取验证码')
const smsTxtSub = ref<String>('获取验证码')

const disabled = ref<boolean>(false)
const disabledSub = ref<boolean>(false)

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
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  roleId: [{ required: true, trigger: 'change', message: '必须为原主管理员指定角色' }],
  oldCode: [{ required: true, trigger: 'blur', validator: validateCode }],
  newCode: [{ required: true, trigger: 'blur', validator: validateCode }],
  newPhone: [{ required: true, trigger: 'blur', validator: validateUsername }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (row: any, type: number) => {
  if (type === 1) {
    title.value = '变更主管理员'
  } else if (type === 2) {
    title.value = '变更注册手机号'
  }
  peopleName.value = row.peopleName
  phone.value = row.phone
  Object.assign(form, originFormData)
  dialogVisible.value = true
}
defineExpose({
  open
})
//获取验证码 1为原手机号验证码 2新手机号验证码
const getSmsCode = async (type: number) => {
  if (type === 1) {
    let params = {
      phone: phone.value
    }
    // 发送请求
    // const { code, data, msg } = await xx(params)
    // if (code !== 200) {
    ElMessage.success('验证码已发送，请留意接收验证码的手机号【' + phone.value + '】')
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
    let params = {
      phone: form.newPhone
    }
    if (form.newPhone.length !== 11 && form.newPhone.length !== '^1\\d{10}$') {
      return ElMessage.error('请输入正确的号码')
    }
    // 发送请求
    // const { code, data, msg } = await xx(params)
    // if (code !== 200) {
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
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(form)
      // 发送请求
      // const { code, data, msg } = await xx(form)
      // if(code !== 200){
      //   return ElMessage.error(msg)
      // }
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
</script>
      
<style lang="scss" scoped>
</style>
      