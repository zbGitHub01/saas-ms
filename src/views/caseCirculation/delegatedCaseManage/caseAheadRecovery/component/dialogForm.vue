<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Api from '@/api/modules/caseAheadRecovery'

const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false
  },
  orgList: {
    type: Array,
    default: () => []
  },
  recoverId: {
    type: String,
    default: ''
  }
})

const defaultForm = {
  executeTime: '',
  orgList: '',
  remark: ''
}

const state = reactive({
  productList: [],
  form: {
    executeTime: '',
    orgList: '',
    remark: ''
  },
  taskId: '',
  currCheckProduct: {},
  rules: {
    executeTime: [{ required: true, message: '请选择执行时间', trigger: 'blur' }],
    orgId: [
      {
        required: true,
        message: '请选择收回机构',
        trigger: 'change'
      }
    ]
  }
})

const emit = defineEmits(['update:dialogFormVisible'])

const size = ref('default')
const labelPosition = ref('right')

const checkChange = value => {
  state.currCheckProduct = value
}

const submitForm = async () => {
  const { taskId, currCheckProduct: recoverInfo } = state
  const data = {
    ...state.form,
    taskId,
    recoverInfo,
    recoverId: props?.recoverId
  }
  try {
    await Api.casePreRecoverSave(data)
    resetFormFields()
    ElMessage.success('保存成功')
  } catch (error) {
    console.log(error)
  }
  console.log(data)
}

const resetFormFields = () => {
  state.form = Object.assign({}, defaultForm)
  state.currCheckProduct = {}
  state.productList = []
  emit('update:dialogFormVisible', false)
}

const ruleFormRef = ref()

const cancel = () => {
  resetFormFields()
}

const handleLast = ruleFormRef => {
  if (!ruleFormRef) return
  ruleFormRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        const { data } = await Api.casePreRecoverNext(state.form)
        const tableData = JSON.parse(data.recoverInfo)[0]?.productInfo || []
        state.taskId = data.taskId
        state.productList = tableData
      } catch (error) {
        state.form.orgId = ''
        console.log(error)
      }
    } else {
      state.form.orgId = ''
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <el-dialog
    :model-value="props.dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="预收回"
    @close="cancel"
  >
    <el-form
      ref="ruleFormRef"
      :model="state.form"
      label-width="120px"
      :rules="state.rules"
      :label-position="labelPosition"
      :size="size"
      status-icon
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="执行时间" prop="executeTime">
            <el-date-picker
              v-model="state.form.executeTime"
              class="date_style"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择执行时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收回机构" prop="orgIdList">
            <el-select v-model="state.form.orgId" placeholder="请选择收回机构" filterable @change="handleLast(ruleFormRef)">
              <el-option v-for="item in props.orgList" :key="item.orgId" :label="item.orgName" :value="item.orgId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="state.form.remark" type="textarea"></el-input>
      </el-form-item>
      <div class="line"></div>
    </el-form>
    <div class="title">产品/是否收回</div>
    <div class="under_body">
      <div class="div_fir">
        <ul v-if="state.productList.length > 0">
          <li v-for="(item, index) in state.productList" :key="index">
            <div
              :class="!!state.currCheckProduct && state.currCheckProduct.productId === item.productId ? 'textActive' : null"
              @click="checkChange(item)"
            >
              {{ item.productName }}
            </div>
            <el-switch v-model="item.ischecked" />
          </li>
        </ul>
      </div>
      <div v-if="Object.keys(state.currCheckProduct).length > 0" class="div_sec">
        <div class="title">{{ state.currCheckProduct.text }}回收方案</div>
        <div class="div_info">
          <el-row>
            <el-col :span="12">
              <div>当前载案量：</div>
              <div>{{ state.currCheckProduct.caseNum }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>当前载案量：</div>
              <div>{{ state.currCheckProduct.retainCaseNum }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>留案分期还款计划数（未失效）：</div>
              <div>{{ state.currCheckProduct.retainStagingPlanCount }}</div>
            </el-col>
            <el-col :span="12">
              <div>留案分期计划关联案件数：</div>
              <div>{{ state.currCheckProduct.retainStagingCaseCount }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>普通分期还款计划数（未失效）：</div>
              <div>{{ state.currCheckProduct.stagingPlanCount }}</div>
            </el-col>
            <el-col :span="12">
              <div>普通分期计划关联案件数：</div>
              <div>{{ state.currCheckProduct.stagingCaseCount }}</div>
            </el-col>
          </el-row>
        </div>
        <el-form ref="currForm" v-model="state.currCheckProduct" label-position="top" style="margin-top: 15px">
          <div class="solid_line"></div>
          <el-form-item label="普通留案案件：">
            <el-radio-group v-model="state.currCheckProduct.isRecoverRetain" class="ml-4">
              <el-radio :label="0" size="large">不收回纯留案案件</el-radio>
              <el-radio :label="1" size="large">强制收回纯留案案件</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="solid_line"></div>
          <el-form-item label="留案分期还款案件：">
            <el-radio-group v-model="state.currCheckProduct.retainStagingPlan" class="ml-4">
              <el-radio :label="0" size="large">不收回留案分期还款案件</el-radio>
              <el-radio :label="1" size="large">只收回未签署协议的分期还款案件</el-radio>
              <el-radio :label="3" size="large">强制收回全部留案分期还款案件</el-radio>
            </el-radio-group>
          </el-form-item>
          <div
            v-if="
              Number(state.currCheckProduct.retainStagingPlan) === 1 || Number(state.currCheckProduct.retainStagingPlan) === 3
            "
            class="isShow-warp"
          >
            <el-radio-group v-model="state.currCheckProduct.subRadio">
              <el-radio :label="0">收回后保留分期还款计划</el-radio>
              <el-radio v-if="Number(state.currCheckProduct.retainStagingPlan) === 3" :label="2">
                收回后将未签署分期协议的分期还款计划置为失效
              </el-radio>
            </el-radio-group>
          </div>
          <div class="solid_line"></div>
          <el-form-item label="普通分期还款计划案件：">
            <el-radio-group v-model="state.currCheckProduct.stagingPlan" class="ml-4">
              <el-radio :label="0" size="large">不收回关联案件</el-radio>
              <el-radio :label="1" size="large">强制收回关联案件</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.line {
  border-bottom: 1px dotted rgb(168, 167, 167);
}
.title {
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
}
.under_body {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  width: 100%;
  .div_fir {
    width: 22%;
    ul {
      max-height: 580px;
      border: 1px solid rgb(209, 206, 206);
      border-radius: 5px;
      overflow-y: auto;
      li {
        display: flex;
        padding: 10px 20px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgb(209, 206, 206);
        &:last-child {
          border-bottom: none;
        }
        div {
          font-size: 16px;
          color: #a0a0a0;
          cursor: pointer;
        }
        .textActive {
          color: #3178ff;
        }
      }
    }
  }
  .div_sec {
    width: 76%;
    .div_info {
      padding: 16px;
      border-radius: 10px;
      background: #f2f2f2;
      .el-col {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        padding: 0 10px;
        div {
          color: #707276;
        }
      }
    }
    .solid_line {
      margin-bottom: 15px;
      height: 1px;
      border-bottom: 1px solid #dde0e7;
    }
  }
}
.isShow-warp {
  border-radius: 6px;
  background-color: #f2f2f2;
  padding: 15px 20px;
  margin: 5px;
  margin-bottom: 10px;
  .el-radio-group {
    .el-radio {
      line-height: 20px;
    }
  }
}

.el-input__wrapper {
  width: 140px !important;
}
::-webkit-scrollbar {
  width: 1px;
}
</style>
