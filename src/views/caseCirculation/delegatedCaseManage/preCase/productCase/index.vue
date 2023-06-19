<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Api, { entrustPub, delEntrust } from '@/api/modules/preCase.js'
import deepCopy from '@/utils/deepCopy.js'
import moment from 'moment'
import DrawerForm from './component/DrawerForm.vue'
import tableColumnList from './config/tableColumnList.js'
import dialogFormFieldsList from './config/dialogFormFieldsList.js'

const defaultRuleForm = {
  operStoreId: '', //分库Id
  entrustStrategy: '', //操作维度 委案操作维度 1：案人 2: 案件 3: 剩余案人
  productId: '', //委案产品
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
  dialogRuleForm: {},
  entrustIds: [], //委案方案发布id集合
  currSelectArr: [],
  currEntrustInfo: {} //当前配置的行数据
})

//defaultRuleForm初始化数据
state.dialogRuleForm = deepCopy(defaultRuleForm, true)

//列表获取
const getEntrustList = async () => {
  const {
    data: { data }
  } = await Api.entrustList({ entrustBusType: 2 })
  state.tableData = data
}

//机构数组
const orgList = [
  {
    orgName: '杭州温泽企业管理有限公司贵阳分公司',
    orgId: 22,
    adjustNum: 8000,
    area: []
  },
  {
    orgName: '前海中英投（深圳）投资有限公司',
    orgId: 11,
    adjustNum: 8000,
    area: []
  }
]

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
  })
  return dialogFormFieldsList
})

const rules = reactive({
  operStoreId: [{ required: true, message: '请选择案件分库', trigger: 'blur' }],
  productId: [{ required: true, message: '请选择委案产品', trigger: 'change' }],
  entrustType: [{ required: true, message: '请选择委案类型', trigger: 'change' }],
  isHideHisFollowRecord: [{ required: true, message: '请选择历史处置记录', trigger: 'change' }],
  recoverDate: [{ required: true, message: '请选择委案到期日', trigger: 'change' }],
  isAutoRecycle: [{ required: true, message: '请选择是否自动收回', trigger: 'change' }],
  execTime: [{ required: true, message: '请选择执行时间', trigger: 'change' }]
})

getEntrustList()

const tableClass = ref(null)
const tipDialogVisible = ref(false)

const handlePub = (index, row) => {
  tipDialogVisible.value = true
  state.entrustIds = [row.entrustId]
  console.log(index, row)
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

//发布取消
const pubCancel = () => {
  state.entrustIds.length = 0 //清空集合
  tipDialogVisible.value = false
}

const handleUpload = () => {
  state.dialogVisible = true
  state.dialogRuleForm = deepCopy(defaultRuleForm, true)
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

//table多选操作
const selectChange = obj => {
  state.currSelectArr = obj
}

//批量发布委案方案
const handleBatchPub = () => {
  if (state.currSelectArr.length < 1) {
    ElMessage({ message: '请选择操作对象.', type: 'warning' })
    return
  }
  state.entrustIds = state.currSelectArr.map(item => item.entrustId)
  tipDialogVisible.value = true
}

const handleChange = row => {
  console.log(row)
}
const handleEdit = (index, row) => {
  const rowObj = { ...row }
  //处理文件回显
  state.dialogRuleForm = deepCopy(rowObj, true)
  state.dialogVisible = true
}
//保存编辑及新增
const handleSubmit = async (data, form1) => {
  try {
    await Api.proEntrustSave(data)
    ElMessage.success('操作成功')
    form1.resetFields()
    state.dialogVisible = false
    getEntrustList()
  } catch (error) {
    console.log(error)
  }
}

//委案配置保存
const saveCaseCfgSave = async data => {
  try {
    await Api.casePreEntrustCfg(data)
    ElMessage.success('配置保存成功')
  } catch (error) {
    console.log(error)
  }
}

//配置
const operaClick = async data => {
  try {
    const { data: dataObj } = await Api.entrustListInfo({ entrustId: data.entrustId })
    state.currEntrustInfo = { ...dataObj, entrustId: data.entrustId }
    state.drawerVisible = true
    console.log(state.currEntrustInfo)
  } catch (error) {
    console.log(error)
  }
  //假数据
  state.currEntrustInfo.storeName = '委外处置库'
  state.currEntrustInfo.productList = [
    '“360”借条',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟'
  ]
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
          <el-button type="primary" icon="CirclePlusFilled" @click="handleUpload">添加委案方案</el-button>
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
      title="产品委案"
      :rules="rules"
      :form-fields="formFieldsList"
      @submit="handleSubmit"
    />
    <!--发布委案方案提示弹框-->
    <el-dialog v-model="tipDialogVisible" title="提示" width="30%" @close="pubCancel">
      <div style="margin-left: 50px">
        <el-icon><QuestionFilled /></el-icon>
        是否确认发布委案方案？
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
</style>
