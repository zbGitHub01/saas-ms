<template>
  <el-drawer
    class="drawer"
    title="员工详情"
    :model-value="props.drawerVisible"
    size="1000px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    @open="handleOpen"
  >
    <template #default>
      <el-descriptions :column="4">
        <el-descriptions-item label="姓名">{{ employeeInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ employeeInfo.sex }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ employeeInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="证件号">{{ employeeInfo.idNo }}</el-descriptions-item>
        <el-descriptions-item label="邮箱" :span="2">{{ employeeInfo.mail }}</el-descriptions-item>
        <el-descriptions-item label="钉钉">{{ employeeInfo.dingdingName }}</el-descriptions-item>
        <el-descriptions-item label="系统工号">{{ employeeInfo.sysAccount }}</el-descriptions-item>
      </el-descriptions>
      <EmployeeInfo v-if="!isEdit" v-model="tabActive" :employee-info="employeeInfo" :other-info="otherInfo" />
      <EmployeeForm v-else ref="employeeFormRef" v-model="tabActive" :employee-info="employeeInfo" :other-info="otherInfo" />
    </template>
    <template #footer>
      <template v-if="!isEdit">
        <el-button @click="beforeClose">关 闭</el-button>
        <el-button type="primary" @click="onEdit">编 辑</el-button>
      </template>
      <template v-else>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">保 存</el-button>
      </template>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import EmployeeInfo from './EmployeeInfo.vue'
import EmployeeForm from './EmployeeForm.vue'
import Apis from '@/api/modules/systemSetting'

const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false,
    required: true
  },
  row: {
    type: Object,
    default: () => {
      return {}
    },
    required: true
  }
})
const emit = defineEmits(['update:drawerVisible'])

const isEdit = ref(false)
const loading = ref(false)
const tabActive = ref('1')
const employeeFormRef = ref()
const employeeInfo = ref({})
const otherInfo = ref({
  personalData: [
    {
      label: '户籍地址',
      formType: 'text',
      span: 3,
      value: null
    },
    {
      label: '现居地址',
      formType: 'text',
      span: 3,
      value: null
    },
    {
      label: '出生日期',
      formType: 'date',
      width: '33%',
      value: null
    },
    {
      label: '婚姻状况',
      formType: 'select',
      data: [
        { label: '未婚', value: 0 },
        { label: '已婚', value: 1 },
        { label: '离异', value: 2 }
      ],
      value: null
    },
    {
      label: '紧急联系人',
      formType: 'text',
      value: null
    },
    {
      label: '联系人电话',
      formType: 'text',
      value: null
    },
    {
      label: '工资卡卡号',
      formType: 'text',
      value: null
    },
    {
      label: '工资卡开户行',
      formType: 'text',
      value: null
    },
    {
      label: '毕业院校',
      formType: 'text',
      value: null
    },
    {
      label: '学历',
      formType: 'text',
      value: null
    },
    {
      label: '专业',
      formType: 'text',
      value: null
    }
  ],
  interviewEvaluation: [
    {
      label: '人力来源',
      width: '33%',
      value: null
    },
    {
      label: '推荐人',
      value: null
    },
    {
      label: '面试批次',
      value: null
    },
    {
      label: '面试官',
      value: null
    },
    {
      label: '面试结果',
      value: null
    },
    {
      label: '表达能力',
      value: null
    },
    {
      label: '逻辑思维',
      value: null
    },
    {
      label: '责任心、进取心',
      labelClassName: 'w100',
      value: null
    },
    {
      label: '创新及应变',
      value: null
    },
    {
      label: '胜任力情况',
      value: null
    },
    {
      label: '综合考评',
      value: null
    },
    {
      label: '综合得分',
      value: null
    }
  ],
  orientation: [
    {
      label: '是否参加培训',
      width: '33%',
      formType: 'text',
      value: null
    },
    {
      label: '培训师',
      formType: 'text',
      value: null
    },
    {
      label: '进组日期',
      formType: 'date',
      value: null
    },
    {
      label: '是否合格',
      formType: 'text',
      value: null
    },
    {
      label: '是否补考',
      formType: 'text',
      value: null
    },
    {
      label: '最终成绩',
      formType: 'text',
      value: null
    },
    {
      label: '话术成绩',
      formType: 'text',
      value: null
    },
    {
      label: '系统成绩',
      formType: 'text',
      value: null
    },
    {
      label: '综合成绩',
      formType: 'text',
      value: null
    },
    {
      label: '态度成绩',
      formType: 'text',
      value: null
    }
  ],
  caseRecordFile: [
    {
      label: '身份证正面',
      type: 'image',
      value: []
    },
    {
      label: '身份证反面',
      type: 'image',
      value: []
    },
    {
      label: '应聘面试登记表',
      type: 'file',
      value: []
    },
    {
      label: '应聘人员问卷调查表',
      type: 'file',
      value: []
    },
    {
      label: '面试评估表',
      type: 'file',
      value: []
    },
    {
      label: '入职登记表',
      type: 'file',
      value: []
    },
    {
      label: '工资卡确认单',
      type: 'file',
      value: []
    },
    {
      label: '薪资确认单',
      type: 'file',
      value: []
    },
    {
      label: '承诺书',
      type: 'file',
      value: []
    },
    {
      label: '劳动合同',
      type: 'file',
      value: []
    },
    {
      label: '保密协议',
      type: 'file',
      value: []
    },
    {
      label: '签收单',
      type: 'file',
      value: []
    },
    {
      label: '员工行为守则',
      type: 'file',
      value: []
    },
    {
      label: '质量管理责任制度',
      type: 'file',
      value: []
    },
    {
      label: '近一年的社保缴纳记录/工资流水',
      type: 'file',
      value: []
    },
    {
      label: '征信报告',
      type: 'file',
      value: []
    },
    {
      label: '离职证明',
      type: 'file',
      value: []
    },
    {
      label: '体检报告',
      type: 'file',
      value: []
    }
  ]
})

const fetchEmployeeInfo = async () => {
  const { data } = await Apis.findEmployeeInfo({ employeeId: props.row.employeeId })
  employeeInfo.value = data
  Object.keys(otherInfo.value).forEach(key => {
    otherInfo.value[key].forEach(item => {
      item.value = data[key][item.label]
    })
  })
}

const handleOpen = () => {
  fetchEmployeeInfo()
}
const beforeClose = () => {
  tabActive.value = '1'
  emit('update:drawerVisible', false)
}
const onEdit = () => {
  isEdit.value = true
  nextTick(() => {
    employeeFormRef.value.setForm()
  })
}
const onCancel = () => {
  fetchEmployeeInfo()
  isEdit.value = false
}
const onSubmit = async () => {
  const postData = {
    ...employeeInfo.value,
    ...employeeFormRef.value.form
  }
  if (postData.deptId.length) {
    postData.deptId = postData.deptId[postData.deptId.length - 1]
  }
  Object.keys(otherInfo.value).forEach(key => {
    otherInfo.value[key].forEach(item => {
      postData[key][item.label] = item.value
    })
  })
  console.log(postData, '------postData')
  loading.value = true
  try {
    await Apis.editEmployeeInfo(postData)
    loading.value = false
    isEdit.value = false
    await fetchEmployeeInfo()
  } catch (err) {
    loading.value = false
    console.log(err)
  }
}
</script>

<style lang="scss" scoped></style>
