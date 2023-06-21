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
        <el-form-item label="社会信用码：" prop="socialCreditCode">
          <el-input
            v-model="form.socialCreditCode"
            placeholder="请输入社会信用码"
            clearable
            style="width: 300px"
            maxlength="18"
          ></el-input>
        </el-form-item>
        <el-form-item label="法人证照：" prop="businessLicense">
          <!-- 营业执照 -->
          <SingleImageUploader
            v-model="form.businessLicense"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
          />
          <!-- 法人公章 -->
          <SingleImageUploader
            v-model="form.legalPersonSeal"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
            class="ml19"
          />
        </el-form-item>
        <el-form-item label="经营地址：" prop="addressSub">
          <el-cascader
            v-model="state.addressSub"
            :options="state.areaList"
            placeholder="请选择区域"
            clearable
            :props="state.optionsProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人：" prop="legalPerson">
          <el-input v-model="form.legalPerson" placeholder="请输入法定代表人" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="法人代表证件号：" prop="legalPersonIdNo">
          <el-input
            v-model="form.legalPersonIdNo"
            placeholder="请输入法人代表证件号"
            clearable
            style="width: 300px"
            maxlength="18"
          ></el-input>
        </el-form-item>
        <el-form-item label="法人代表手机号：" prop="legalPersonPhone">
          <el-input
            v-model="form.legalPersonPhone"
            placeholder="请输入法人代表手机号"
            clearable
            style="width: 300px"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="法人代表证照：" prop="legalPersonFrontUrl">
          <!-- 正面 -->
          <SingleImageUploader
            v-model="form.legalPersonFrontUrl"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
          />
          <!-- 反面 -->
          <SingleImageUploader
            v-model="form.legalPersonBackUrl"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
            class="ml19"
          />
          <!-- 证明 -->
          <SingleImageUploader
            v-model="form.legalPersonIdCert"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'140px'"
            :height="'140px'"
            class="ml19"
          />
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="form.status">
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
  
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import Apis from '@/api/modules/company'
import SingleImageUploader from '@/components/UploadFile/SingleImageUploader.vue'
import { useCommonStore } from '@/store/modules/common'
import { traverseDown } from '@/utils/traverse'
const commonStore = useCommonStore()
const form = reactive({
  relationId: null,
  name: '', //公司名称
  socialCreditCode: '', //社会信用码
  businessLicense: '', //营业执照
  legalPersonSeal: '', //法人公章
  legalPersonFrontUrl: '', //身份证正面
  legalPersonBackUrl: '', //身份证反面
  legalPersonIdCert: '', //身份证明
  address: '', //详细地址
  legalPerson: '', //法定代表人
  legalPersonIdNo: '', //法人代表证件号
  legalPersonPhone: '', //法人代表手机号
  status: null, //是否启用
  provinceId: null, //省
  provinceName: '',
  cityId: null, //市
  cityName: '',
  areaId: null, //区
  address: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
const state = reactive({
  areaList: [], //省市区下拉
  addressSub: [], //选择的省市区
  optionsProps: {
    value: 'pin',
    label: 'name',
    children: 'children',
    checkStrictly: true,
    expandTrigger: 'hover'
  }
})
const title = ref('')
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  name: [{ required: true, trigger: 'blur', message: '公司名称不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = async (row, type) => {
  getArea()
  if (type === 1) {
    title.value = '新增购包主体'
  } else if (type === 2) {
    title.value = '编辑购包主体'
    const { data } = await Apis.creditorDetail({ id: row.id })
    Object.assign(form, data)
    state.addressSub = [
      (form.provinceId || '') + ',' + (form.provinceName || ''),
      (form.cityId || '') + ',' + (form.cityName || '')
    ]
    form.areaId ? state.addressSub.push((form.areaId || '') + ',' + (form.areaName || '')) : null
    form.relationId = form.id
    delete form.tenantId
    delete form.id
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
// 添加/编辑
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      const params = { ...form }
      state.addressSub = state.addressSub ? state.addressSub : []
      params.provinceId = Number((state.addressSub[0] || '').split(',')[0]) || null
      params.provinceName = state.addressSub[0]?.split(',')[1] || undefined
      params.cityId = Number((state.addressSub[1] || '').split(',')[0]) || null
      params.cityName = state.addressSub[1]?.split(',')[1] || undefined
      params.areaId = Number((state.addressSub[2] || '').split(',')[0]) || null
      params.areaName = state.addressSub[2]?.split(',')[1] || undefined
      console.log(params)
      // 请求得到数据
      title.value === '新增购包主体' ? await Apis.creditorAdd(params) : await Apis.creditorEdit(params)
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
  state.addressSub = []
  dialogVisible.value = false
}
// 获取省市区
const getArea = () => {
  const regionData = JSON.parse(JSON.stringify(commonStore.regionData))
  traverseDown(
    regionData,
    node => {
      node.pin = node.id + ',' + node.name
    },
    null
  )
  state.areaList = regionData
}
</script>
  
<style lang="scss" scoped>
.center {
  text-align: center;
  font-size: 18px;
}
</style>
  