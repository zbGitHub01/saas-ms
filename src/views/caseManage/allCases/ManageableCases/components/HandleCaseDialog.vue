<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" ref="ruleFormRef" :rules="rules" label-width="110px" label-position="right">
        <el-form-item v-if="typeSub === 1" label="关闭原因:" prop="caseStatus">
          <el-select clearable v-model="form.caseStatus" placeholder="请选择关闭原因">
            <el-option v-for="(item, index) in closeReason" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.caseStatus === 15" label="特殊原因备注:" prop="caseStatusRemark">
          <el-input clearable v-model="form.caseStatusRemark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <div v-if="typeSub === 2">
          <el-form-item label="暂停原因:" prop="reasonId">
            <el-select clearable v-model="form.reasonId" placeholder="请选择暂停原因" @change="changeStopReasonId">
              <el-option v-for="(item, index) in selectData.StopReasonList" :key="index" :label="item.reason" :value="item.id" />
            </el-select>
            <div style="color: #999; font-size: 14px; line-height: 20px">
              已选暂停原因最多可暂停
              <span style="color: #ff9921">{{ StopFormData.pauseDay }}</span>
              日
            </div>
          </el-form-item>
          <el-form-item label="暂停至" v-if="form.reasonId !== 25" prop="pauseEndTime">
            <el-date-picker
              v-model="form.pauseEndTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="date"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="暂停备注" prop="caseStatusRemark">
            <el-input clearable v-model="form.caseStatusRemark" type="textarea" placeholder="请输入备注" style="width: 220px" />
          </el-form-item>
          <el-form-item label="凭证附件" v-if="form.reasonId !== 25" :prop="StopFormData.isMust ? 'pauseUrl' : ''">
            <UploadFile ref="uploadFileRef" v-model:file-list="form.pauseUrl" :limit="100" />
            <div>请上传相关凭证或附件文档</div>
          </el-form-item>
        </div>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import { UploadFile } from '@/components/Upload'
const form = reactive({
  caseStatus: null, //关闭原因
  caseStatusRemark: '', //原因备注
  reasonId: null, //暂停原因
  pauseEndTime: null,
  pauseUrl: []
})
const originFormData = JSON.parse(JSON.stringify(form))
const typeSub = ref(1)
const title = ref('')
const uploadFileRef = ref()
const selectData = reactive({
  StopReasonList: [] //暂停原因列表
})
const StopFormData = reactive({
  pauseDay: 0,
  isMust: true
})
const originStopFormData = JSON.parse(JSON.stringify(StopFormData))
const emits = defineEmits(['submitForm'])
// 校验规则
// 校验暂停截至时间(从当天开始算，与StopFormData.pauseDay比)
const validaterPauseEndTime = (rule, value, callback) => {
  const pauseEndTime = form.pauseEndTime
  const temTime = Date.parse(pauseEndTime) / 1000
  const nowTime = Date.parse(new Date()) / 1000
  const pauseDayTime = StopFormData.pauseDay * 24 * 3600
  if (temTime > pauseDayTime + nowTime) {
    return callback(new Error('已超出暂停时长允许范围'))
  }
  callback()
}
const ruleFormRef = ref()
const rules = reactive({
  caseStatus: [{ required: true, message: '请选择原因', trigger: 'change' }],
  caseStatusRemark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
  reasonId: [{ required: true, message: '请选择暂停原因', trigger: 'change' }],
  pauseEndTime: [
    { required: true, message: '请选择暂停截至时间', trigger: 'change' },
    { validator: validaterPauseEndTime, trigger: 'change' }
  ],
  pauseUrl: [{ required: true, message: '请上传凭证附件', trigger: 'change' }]
})
const closeReason = [
  {
    value: 10,
    label: '已结清'
  },
  {
    value: 15,
    label: '特殊原因'
  },
  {
    value: 16,
    label: '关闭|资产已转让'
  },
  {
    value: 17,
    label: '关闭|呆账/坏账'
  }
]
// 打开弹窗
const dialogVisible = ref(false)
const open = type => {
  if (type === 1) {
    title.value = '关闭案件'
  } else if (type === 2) {
    title.value = '暂停案件'
    getSelecData()
  }
  typeSub.value = type
  Object.assign(form, originFormData)
  Object.assign(StopFormData, originStopFormData)
  dialogVisible.value = true
}
defineExpose({
  open
})

// 确认
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (typeSub.value === 1) {
        let paramsSub = {
          caseStatus: form.caseStatus
        }
        form.caseStatus === 15 ? (paramsSub['caseStatusRemark'] = form.caseStatusRemark) : null
        emits('submitForm', paramsSub)
      } else if (typeSub.value === 2) {
        // 处理凭证的数据格式
        const pauseUrl = []
        const temPauseUrl = JSON.parse(JSON.stringify(form.pauseUrl))
        temPauseUrl.forEach(item => {
          const temItem = {
            fileName: item.name,
            fileUrl: item.url
          }
          pauseUrl.push(temItem)
        })
        let paramsSub = {
          caseStatus: form.caseStatus,
          caseStatusRemark: form.caseStatusRemark,
          reasonId: form.reasonId
        }
        if (form.caseStatus !== 25) {
          paramsSub['pauseEndTime'] = form.pauseEndTime
          paramsSub['pauseUrl'] = JSON.stringify(pauseUrl)
        }
        emits('submitForm', paramsSub)
      }
      cancelSubmit()
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
const getSelecData = async () => {
  // 请求得到数据
  let params = {
    page: 1,
    pageSize: 10000
  }
  // const { data } = await caseStatePauseConfigList(params)
  // let temData = JSON.parse(JSON.stringify(data.data));
  // temData = temData.filter((item) => item.state === 0);
  // temData = temData.filter((item) => item.id !== 20 && item.id !== 30);
  // selectData.StopReasonList = JSON.parse(JSON.stringify(temData));
  selectData.StopReasonList = [
    {
      id: 25,
      isMust: 1,
      parentId: 0,
      pauseDay: 0,
      reason: '暂停|特殊原因',
      remark: null,
      state: 0
    },
    {
      id: 31,
      isMust: 1,
      parentId: 30,
      pauseDay: 12,
      reason: '暂停0020',
      remark: '最大12天',
      state: 0
    },
    {
      id: 32,
      isMust: 0,
      parentId: 30,
      pauseDay: 30,
      reason: '暂停0030',
      remark: '最大30天',
      state: 0
    },
    {
      id: 33,
      isMust: 1,
      parentId: 30,
      pauseDay: 10,
      reason: '投诉使用十天内',
      remark: '3级一下投诉',
      state: 0
    },
    {
      id: 34,
      isMust: 0,
      parentId: 30,
      pauseDay: 365,
      reason: '重大投诉-1年内',
      remark: '2级以上的投诉',
      state: 0
    },
    {
      id: 35,
      isMust: 0,
      parentId: 30,
      pauseDay: 2,
      reason: 'test',
      remark: '222',
      state: 0
    },
    {
      id: 36,
      isMust: 0,
      parentId: 30,
      pauseDay: 33,
      reason: 'tetttt',
      remark: '333',
      state: 0
    }
  ]
}
const changeStopReasonId = () => {
  if (form.reasonId) {
    const temItemData = selectData.StopReasonList.filter(item => item.id === form.reasonId)[0]
    StopFormData.pauseDay = temItemData.pauseDay
    StopFormData.isMust = temItemData.isMust === 0
    form.caseStatus = form.reasonId === 25 ? 25 : 30
  } else {
    Object.assign(StopFormData, originStopFormData)
    form.caseStatus = null
  }
}
</script>
  
<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  width: 146px !important;
}
</style>