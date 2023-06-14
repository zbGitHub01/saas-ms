<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'

const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  productList: [],
  form: {
    user: '',
    region: '',
    notes: ''
  },
  childForm: {
    radio1: '1',
    radio2: '1',
    radio3: '1',
    radio4: '1'
  },
  rules: {
    user: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
    ],
    region: [
      {
        required: true,
        message: 'Please select Activity zone',
        trigger: 'change'
      }
    ]
  }
})

const emit = defineEmits(['update:dialogFormVisible'])

const size = ref('default')
const labelPosition = ref('right')

const handleClose = () => {
  emit('update:dialogFormVisible', false)
}

const currCheckProduct = ref(null)
console.log(currCheckProduct.value)

const checkChange = value => {
  currCheckProduct.value = value
}

const submitForm = () => {
  const data = {
    ...state.form,
    ...state.childForm
  }
  console.log(data)
}

const instance = getCurrentInstance()?.proxy

const resetFormFields = () => {
  const defaultChildForm = {
    radio1: '1',
    radio2: '1',
    radio3: '1',
    radio4: '1'
  }
  const defaultForm = {
    user: '',
    region: '',
    notes: ''
  }
  state.form = instance?.$deepCopy(defaultForm, true)
  state.childForm = instance?.$deepCopy(defaultChildForm, true)
  emit('update:dialogFormVisible', false)
}

const ruleFormRef = ref()

const resetForm = ruleFormRef => {
  resetFormFields()
  ruleFormRef.resetFields()
}

state.productList = [
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true },
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true },
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true },
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true },
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true },
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true },
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true },
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true },
  { text: '来分期', value: true },
  { text: '去分期', value: true },
  { text: '走分期', value: true },
  { text: '跑分期', value: true }
]
</script>

<template>
  <el-dialog
    :model-value="props.dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="预收回"
    @close="handleClose(ruleFormRef)"
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
          <el-form-item label="执行时间" prop="user">
            <el-input v-model="state.form.user" placeholder="Approved by" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收回机构" prop="region">
            <el-select v-model="state.form.region" placeholder="Activity zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="notes">
        <el-input v-model="state.form.notes" type="textarea"></el-input>
      </el-form-item>
      <div class="line"></div>
    </el-form>
    <div class="title">产品/是否收回</div>
    <div class="under_body">
      <div class="div_fir">
        <ul>
          <li v-for="(item, index) in state.productList" :key="index">
            <div
              :class="!!currCheckProduct && currCheckProduct.text === item.text ? 'textActive' : null"
              @click="checkChange(item)"
            >
              {{ item.text }}
            </div>
            <el-switch v-model="item.value" />
          </li>
        </ul>
      </div>
      <div v-if="!!currCheckProduct" class="div_sec">
        <div class="title">{{ currCheckProduct.text }}回收方案</div>
        <div class="div_info">
          <el-row>
            <el-col :span="12">
              <div>当前载案量：</div>
              <div>620065</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>当前载案量：</div>
              <div>21219</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>留案分期还款计划数（未失效）：</div>
              <div>0</div>
            </el-col>
            <el-col :span="12">
              <div>留案分期计划关联案件数：</div>
              <div>0</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>普通分期还款计划数（未失效）：</div>
              <div>0</div>
            </el-col>
            <el-col :span="12">
              <div>普通分期计划关联案件数：</div>
              <div>0</div>
            </el-col>
          </el-row>
        </div>
        <el-form :model="state.childForm" label-position="top" style="margin-top: 15px">
          <el-form-item label="操作维度：">
            <el-radio-group v-model="state.childForm.radio1" class="ml-4">
              <el-radio label="1" size="small">案人</el-radio>
              <el-radio label="2" size="small">案件</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="solid_line"></div>
          <el-form-item label="普通留案案件：">
            <el-radio-group v-model="state.childForm.radio2" class="ml-4">
              <el-radio label="1" size="large">不收回纯留案案件</el-radio>
              <el-radio label="2" size="large">强制收回纯留案案件</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="solid_line"></div>
          <el-form-item label="留案分期还款案件：">
            <el-radio-group v-model="state.childForm.radio3" class="ml-4">
              <el-radio label="1" size="large">不收回留案分期还款案件</el-radio>
              <el-radio label="2" size="large">只收回未签署协议的分期还款案件</el-radio>
              <el-radio label="3" size="large">强制收回全部留案分期还款案件</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="solid_line"></div>
          <el-form-item label="普通分期还款计划案件：">
            <el-radio-group v-model="state.childForm.radio4" class="ml-4">
              <el-radio label="1" size="large">不收回关联案件</el-radio>
              <el-radio label="2" size="large">强制收回关联案件</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
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
::-webkit-scrollbar {
  width: 1px;
}
</style>
