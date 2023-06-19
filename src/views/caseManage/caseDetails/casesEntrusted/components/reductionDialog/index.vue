<script setup>
import { reactive, ref, computed } from 'vue'
import { reductionDialogFormFields } from './config/dialogFormFields.js'
import tableHead from './config/tableHead.js'

const props = defineProps({
  reductionDialogVisible: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  reductionTableData: [],
  selectData: [],
  reductionRuleForm: {
    caseNoList: [], // 申请减免案件
    promiseTime: null,
    reductionMoney: null,
    attachment: [],
    reductionReasonId: null,
    reductionType: 2,
    refundName: null,
    refundPhone: null,
    relation: null,
    remark: null
  }
})

state.reductionTableData = [
  {
    caseNo: 'MSD-JHKED-072',
    storeName: '待分配库',
    orgTitle: '测试机构136',
    residueAmount: 120227.17,
    caseStatusText: '暂停|特殊原因'
  },
  { caseNo: 'BE-BQ-0001001', storeName: '委外处置库', orgTitle: '测试机构28888', residueAmount: 20, caseStatusText: '正常' }
]

const rules = reactive({
  caseNoList: [{ required: true, message: '请选择减免案件', trigger: 'blur' }],
  refundName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  reductionType: [{ required: true, message: '请选择减免类型', trigger: 'change' }],
  reductionMoney: [{ required: true, message: '请输入减免额度', trigger: 'blur' }],
  reductionReasonId: [
    {
      required: true,
      message: '请选择减免原因',
      trigger: 'change'
    }
  ],
  promiseTime: [
    {
      required: true,
      message: '请选择日期',
      trigger: 'change'
    }
  ],
  refundPhone: [{ required: true, message: '请输入还款人电话', trigger: 'blur' }],
  relation: [{ required: true, message: '请选择与案人关系', trigger: 'change' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
  attachment: [{ required: true, message: '请上传附件', trigger: 'blur' }]
})

const innerVisible = ref(false)
const reductionDialogVisible = ref(false)

const reliefCaseList = computed(() => {
  console.log(state.reductionRuleForm.caseNoList.join('、'))
  return state.reductionRuleForm.caseNoList.join('、')
})

const onReductionCase = () => {
  innerVisible.value = true
  console.log(innerVisible.value)
}

const watchChange = val => {
  state.reductionRuleForm.reductionType = val
}

const handleReductionSubmit = data => {
  console.log('formData', data.case)
}

const handleReductionClose = () => {
  reductionDialogVisible.value = false
}

const selectable = row => {
  return row.residueAmount > 0
}
const handleSelectionChange = val => {
  state.selectData = val
}

//减免案件选择确认
const reductionConfirm = () => {
  state.reductionRuleForm.reductionMoney = null
  state.reductionRuleForm.caseNoList = state.selectData.map(item => item.caseNo)
  console.log('caseNoList', state.reductionRuleForm.caseNoList)
  state.selectData.forEach(item => {
    state.reductionRuleForm.reductionMoney = state.reductionRuleForm.reductionMoney += item.residueAmount
  }) // 剩余待还总和
  innerVisible.value = false
}
</script>

<template>
  <DialogForm
    :model-value="props.reductionDialogVisible"
    :form-fields="reductionDialogFormFields"
    :rule-form="state.reductionRuleForm"
    :rules="rules"
    label-width="150"
    watch-item="reductionType"
    title="申请减免"
    width="40%"
    @close="handleReductionClose"
    @submit="handleReductionSubmit"
    @watch-change="watchChange"
  >
    <template #validator>
      <el-form-item label="减免案件" prop="caseNoList" class="special">
        <div>{{ reliefCaseList }}</div>
        <el-button type="primary" plain @click="onReductionCase">选择减免案件</el-button>
      </el-form-item>
      <el-form-item v-if="state.reductionRuleForm.reductionType === 1" label="承诺结清日期：" prop="promiseTime">
        <el-date-picker
          v-model="state.reductionRuleForm.promiseTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择承诺结清日期"
        ></el-date-picker>
        &nbsp;
        <div style="color: red">需在承诺日期17:00之前还款，否则当日无法入账，减免将失效</div>
      </el-form-item>
    </template>
    <template #default>
      <!--选择减免案件-->
      <el-dialog v-model="innerVisible" title="选择减免案件" width="55%" append-to-body :show-close="false">
        <el-table ref="multipleTable" :data="state.reductionTableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" :selectable="selectable" fixed align="center" width="55" />
          <el-table-column
            v-for="(item, index) in tableHead"
            :key="index"
            :property="item.value"
            :label="item.label"
            :width="item.width"
            :formatter="item.formatter"
            align="center"
          />
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="innerVisible = false">取消</el-button>
            <el-button type="primary" @click="reductionConfirm">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </DialogForm>
</template>
<style scoped lang="scss">
.special {
  :deep(.el-form-item__content) {
    display: block;
  }
}
</style>
