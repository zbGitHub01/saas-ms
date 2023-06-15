<script setup>
import { reactive, ref, computed } from 'vue'
import Api, { entrustPub, delEntrust } from '@/api/modules/preCase.js'
import moment from 'moment'
import deepCopy from '@/utils/deepCopy.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import DrawerForm from './component/DrawerForm.vue'
import tableColumnList from './config/tableColumnList.js'
import dialogFormFieldsList from './config/dialogFormFieldsList.js'

const defaultRuleForm = {
  operStoreId: '', //分库Id
  entrustStrategy: '', //操作维度 委案操作维度 1：案人 2: 案件 3: 剩余案人
  modelArr: [], //案人模型集合
  productArr: [], //产品集合
  backupModelArr: [], //备用模型集合
  entrustType: 1, //委案类型
  isHideHisFollowRecord: '1', //历史处置记录
  recoverDate: moment().endOf('month').format('YYYY-MM-DD'), //委案到期日
  isAutoRecycle: '0', //是否自动收回
  remark: '', //备注
  execTime: '' //执行时间
}

const state = reactive({
  tableData: [],
  queryNewData: {},
  dialogVisible: false,
  drawerVisible: false,
  dialogRuleForm: [],
  entrustIds: [], //委案方案发布id集合
  currSelectArr: [],
  currEntrustInfo: {}, //当前配置的行数据
  strategyParams: {
    modelArr: [
      {
        modelName: '测试模型',
        modelId: 123124
      }
    ],
    productArr: [
      {
        productId: 64,
        productName: '测试产品'
      },
      {
        productId: 62,
        productName: 'dddd产品'
      }
    ]
  }
})

//机构数组
const orgList = [
  {
    orgName: '杭州温泽企业管理有限公司贵阳分公司',
    orgId: 22,
    adjustNum: 8000
  },
  {
    orgName: '前海中英投（深圳）投资有限公司',
    orgId: 11,
    adjustNum: 8000
  }
]

//defaultRuleForm初始化数据
state.dialogRuleForm = deepCopy(defaultRuleForm, true)

//列表获取
const getEntrustList = async () => {
  const {
    data: { data }
  } = await Api.entrustList({ entrustBusType: 4 })
  state.tableData = data
}

getEntrustList()

const formFieldsList = computed(() => {
  dialogFormFieldsList.forEach(item => {
    if (item.prop === 'operStoreId')
      item.options = deepCopy(
        [
          {
            label: 'red',
            value: 1
          },
          {
            label: 'blue',
            value: 2
          }
        ],
        true
      )
    if (item.prop === 'modelArr') {
      item.options = state.strategyParams.modelArr
    }
    if (item.prop === 'backupModelArr') {
      item.options = state.strategyParams.modelArr
    }
    if (item.prop === 'productArr') {
      item.checkList = state.strategyParams.productArr
    }
  })
  return dialogFormFieldsList
})

const rules = reactive({
  operStoreId: [{ required: true, message: '请选择案件分库', trigger: 'blur' }],
  modelArr: [{ required: true, message: '请选择案人模型', trigger: 'change' }],
  productArr: [{ type: 'array', required: true, message: '请选择委案产品', trigger: 'change' }],
  entrustType: [{ required: true, message: '请选择委案类型', trigger: 'change' }],
  isHideHisFollowRecord: [{ required: true, message: '请选择历史处置记录', trigger: 'change' }],
  recoverDate: [{ required: true, message: '请选择委案到期日', trigger: 'change' }],
  isAutoRecycle: [{ required: true, message: '请选择是否自动收回', trigger: 'change' }],
  execTime: [{ required: true, message: '请选择执行时间', trigger: 'change' }]
})

const tableClass = ref(null)
const tipDialogVisible = ref(false)

//批量发布委案方案
const handleBatchPub = () => {
  if (state.currSelectArr.length < 1) {
    ElMessage({ message: '请选择操作对象.', type: 'warning' })
    return
  }
  state.entrustIds = state.currSelectArr.map(item => item.entrustId)
  tipDialogVisible.value = true
}

const handlePub = (index, row) => {
  tipDialogVisible.value = true
  state.entrustIds = [row.entrustId]
  console.log(index, row)
}

const handleAdd = () => {
  state.dialogVisible = true
  state.dialogRuleForm = deepCopy(defaultRuleForm, true)
}

//发布取消
const pubCancel = () => {
  state.entrustIds.length = 0 //清空集合
  tipDialogVisible.value = false
}

//发布委案确认
const handlePubConfirm = () => {
  pubEntrust(state.entrustIds)
}

//发布委案api
const pubEntrust = async ids => {
  try {
    await entrustPub(ids)
    ElMessage.success('发布成功')
    tipDialogVisible.value = false
    //如果是多选操作调取table实例清空多选项
    if (state.currSelectArr.length < 1) return
    tableClass.value.toggleSelection()
  } catch (error) {
    tipDialogVisible.value = false
  }
}

//删除委案方案
const handleDel = (index, row) => {
  if (!row && state.currSelectArr.length < 1) {
    ElMessage({ message: '请选择操作对象.', type: 'warning' })
    return
  }
  ElMessageBox.confirm('确认删除委案方案?', '注意', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      if (row) deleteEntrust(row.entrustId)
      else deleteEntrust(state.entrustIds)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

//删除委案方案api
const deleteEntrust = async ids => {
  try {
    await delEntrust(ids)
    //如果是多选操作调取table实例清空多选项
    ElMessage.success('删除成功')
    getEntrustList()
    if (state.currSelectArr.length < 1) return
    tableClass.value.toggleSelection()
  } catch (error) {
    console.log(error)
  }
}

//table多选操作
const selectChange = obj => {
  state.currSelectArr = obj
  state.entrustIds = obj?.map(item => item.entrustId)
}

const handleChange = row => {
  console.log(row)
}
const handleEdit = (index, row) => {
  const rowObj = { ...row }
  //数据处理
  if (rowObj.modelList.length > 0) {
    rowObj['modelArr'] = rowObj.modelList.map(item => item.modelId)
  }
  if (rowObj.modelList.length > 0) {
    rowObj['productArr'] = rowObj.productList.map(item => item.productName)
  }
  //处理文件回显
  state.dialogRuleForm = deepCopy(rowObj, true)
  state.dialogVisible = true
}
const handleSubmit = async (data, form1) => {
  // 重组模型对象
  if (data.modelArr.length > 0) {
    const newModelArr = []
    state.strategyParams.modelArr.forEach(item => {
      data.modelArr.map(cItemId => {
        if (item.modelId === cItemId) newModelArr.push(item)
      })
    })
    data.modelArr = newModelArr
  }
  // 重组备用模型对象
  if (data.modelArr.length > 0) {
    const newModelArr = []
    state.strategyParams.modelArr.forEach(item => {
      data.backupModelArr.map(cItemId => {
        if (item.modelId === cItemId) newModelArr.push(item)
      })
    })
    data.backupModelArr = newModelArr
  }
  // 重组产品对象
  if (data.modelArr.length > 0) {
    const newProductArr = []
    state.strategyParams.productArr.forEach(item => {
      data.productArr.map(cItemName => {
        if (item.productName === cItemName) newProductArr.push(item)
      })
    })
    data.productArr = newProductArr
  }
  try {
    await Api.caseModelEntrustSave(data)
    ElMessage.success('操作成功')
    form1.resetFields()
    state.dialogVisible = false
    getEntrustList()
  } catch (error) {
    console.log(error)
  }
}

const operaClick = async data => {
  try {
    const { data: dataObj } = await Api.entrustListInfo({ entrustId: data.entrustId })
    state.currEntrustInfo = { ...dataObj, entrustId: data.entrustId }
    state.drawerVisible = true
  } catch (error) {
    console.log(error)
  }
  //假数据
  state.currEntrustInfo.storeName = '委外处置库'
  state.currEntrustInfo.resource = '综合委案'
}

//委案配置保存
const saveCaseCfgSave = async data => {
  try {
    await Api.caseModelEntrustCfg(data)
    ElMessage.success('配置保存成功')
  } catch (error) {
    console.log(error)
  }
}

const handleBtnClick = () => {
  console.log('点我了')
}
</script>

<template>
  <div class="card-wrap">
    <div>
      <OperationBar>
        <template #default>
          <el-button type="primary" plain icon="CirclePlusFilled" @click="handleBatchPub">批量发布方案</el-button>
          <el-button type="primary" plain icon="CircleCloseFilled" @click="handleDel">删除委案方案</el-button>
        </template>
        <template #tool>
          <el-button type="primary" icon="CirclePlusFilled" @click="handleAdd">添加委案方案</el-button>
        </template>
      </OperationBar>
      <!--table-->
      <TableClass
        ref="tableClass"
        :table-data="state.tableData"
        :column-list="tableColumnList"
        :stripe="true"
        :is-selection="true"
        :pagination="false"
        @change-status="handleChange"
        @select-change="selectChange"
        @opera-click="operaClick"
      >
        <template #operation>
          <el-table-column align="center" fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" link @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="primary" size="small" link @click="handlePub(scope.$index, scope.row)">确认发布</el-button>
              <el-button type="danger" size="small" link @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </TableClass>
    </div>
    <!--编辑新增form弹框-->
    <DialogForm
      v-model:dialog-form-visible="state.dialogVisible"
      :rule-form="state.dialogRuleForm"
      title="模型委案"
      :rules="rules"
      :form-fields="formFieldsList"
      @btn-click="handleBtnClick"
      @submit="handleSubmit"
    />
    <!--发布委案方案提示弹框-->
    <el-dialog v-model="tipDialogVisible" title="提示" width="30%">
      <div style="margin-left: 50px">
        <el-icon><QuestionFilled /></el-icon>
        是否确认发布该委案方案？
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="pubCancel">取消</el-button>
          <el-button type="primary" @click="handlePubConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!--配置drawerForm-->
    <DrawerForm
      v-model:drawer-form-visible="state.drawerVisible"
      :table-data="orgList"
      :size-form="state.currEntrustInfo"
      @case-cfg-save="saveCaseCfgSave"
    />
  </div>
</template>

<style scoped lang="scss">
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
:deep(.el-button > span) {
  display: inline-block;
  margin-top: 2px;
}
:deep(.el-input__wrapper) {
  height: 32px;
}
:deep(.el-dialog__body .el-select) {
  .el-input {
    width: 100%;
  }
}
</style>
