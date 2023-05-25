<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="630px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="right" label-width="125px">
        <el-form-item label="公司名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司名称" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="社会信用码：" prop="code">
          <el-input v-model="form.code" placeholder="请输入社会信用码" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="法人证照：" prop="picture">
          <SingleImageUploader
            v-model="form.picture1"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
          />
          <SingleImageUploader
            v-model="form.picture2"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
            class="ml19"
          />
        </el-form-item>
        <el-form-item label="经营地址：" prop="addressSub">
          <el-cascader
            v-model="form.addressSub"
            :options="selectData.areaList"
            placeholder="请选择区域"
            clearable
            :props="selectData.optionsProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人：" prop="people">
          <el-input v-model="form.people" placeholder="请输入法定代表人" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="法人代表证件号：" prop="caseId">
          <el-input v-model="form.caseId" placeholder="请输入法人代表证件号" clearable style="width: 300px" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="法人代表手机号：" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入法人代表手机号" clearable style="width: 300px" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="法人代表证照：" prop="picture">
          <SingleImageUploader
            v-model="form.picture3"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
          />
          <SingleImageUploader
            v-model="form.picture4"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
            class="ml19"
          />
          <SingleImageUploader
            v-model="form.picture5"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
            class="ml19"
          />
        </el-form-item>
        <el-form-item label="是否启用：" prop="isUse">
          <el-radio-group v-model="form.isUse">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">不启用</el-radio>
          </el-radio-group>
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
  
<script lang="ts" setup>
// 表单验证规则的类型
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import Apis from '@/api/modules/common'
import SingleImageUploader from '@/components/UploadFile/SingleImageUploader.vue'
const form: any = reactive({
  name: '', //公司名称
  zhaiquanfangId: null,
  code: '', //社会信用码
  picture1: '', //营业执照
  picture2: '', //法人公章
  picture3: '', //身份证正面
  picture4: '', //身份证反面
  picture5: '', //身份证明
  address: '', //详细地址
  addressSub: [], //省市区
  people: '', //法定代表人
  caseId: '', //法人代表证件号
  phone: '', //法人代表手机号
  isUse: null, //是否启用
})
const originFormData = JSON.parse(JSON.stringify(form))
const selectData = reactive({
  areaList: [] as any[], //省市区
  optionsProps: {
    value: 'id',
    label: 'name',
    children: 'children',
    checkStrictly: true,
    expandTrigger: 'hover' as const,
  }
})
const title = ref<String>('')
// 校验规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [{ required: true, trigger: 'blur', message: '公司名称不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = async(row: any, type: number) => {
  const { data } = await Apis.areaTree()
  selectData.areaList = data
  if (type === 1) {
    title.value = '新增购包主体'
  } else if (type === 2) {
    title.value = '编辑购包主体'
    form.zhaiquanfangId = row.zhaiquanfangId
    form.name = row.zhaiquanfang
    form.code = row.code
    form.picture1 = row.picture1
    form.picture2 = row.picture2
    form.picture3 = row.picture3
    form.picture4 = row.picture4
    form.picture5 = row.picture5
    form.address = row.address
    form.addressSub = row.addressSub
    form.people = row.people
    form.caseId = row.caseId
    form.phone = row.phone
    form.isUse = Number(row.isUse)
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
// 添加/编辑
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(form)
      // 请求得到数据
      // const { data } = await xx(form)
      ElMessage.success('操作成功！')
      emits('getTableData')
      formEl.resetFields()
      dialogVisible.value = false
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  Object.assign(form, originFormData)
  dialogVisible.value = false
}
</script>
  
<style lang="scss" scoped>
.center {
  text-align: center;
  font-size: 18px;
}
</style>
  