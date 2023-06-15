<script setup>
import { reactive, ref, computed } from 'vue'
import moment from 'moment'
import { useGlobalStore } from '@/store'
import deepCopy from '@/utils/deepCopy.js'
import Api, { entrustPub, delEntrust } from '@/api/modules/preCase.js'
import tableColumnList from './config/tableColumnList.js'
import dialogFormFieldsList from './config/dialogFormFieldsList.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const globalState = useGlobalStore()

const defaultRuleForm = {
  operStoreId: '', //分库Id
  entrustStrategy: '', //操作维度 委案操作维度 1：案人 2: 案件 3: 剩余案人
  // categoryCompany: '',
  orgId: '', //目标机构
  entrustType: 1, //委案类型
  isHideHisFollowRecord: '1', //历史处置记录
  recoverDate: moment().endOf('month').format('YYYY-MM-DD'), //委案到期日
  isAutoRecycle: '0', //是否自动收回
  remark: '', //备注
  execTime: '', //执行时间
  entrustFileUrl: []
}

const state = reactive({
  tableData: [],
  pageTotal: 4,
  dialogVisible: false,
  dialogRuleForm: {},
  entrustIds: [], //委案方案发布id集合
  currSelectArr: []
})

//defaultRuleForm初始化数据
state.dialogRuleForm = deepCopy(defaultRuleForm, true)

//列表获取
const getEntrustList = async () => {
  const {
    data: { data }
  } = await Api.entrustList({ entrustBusType: 3 })
  state.tableData = data
}

const formFieldsList = computed(() => {
  dialogFormFieldsList.forEach(item => {
    if (item.prop === 'operStoreId')
      item.options = deepCopy(
        [
          { label: '大额处置库', value: 1 },
          { label: '委外处置库', value: 2 }
        ],
        true
      )
    // if (item.type === 'pairSelect') {
    //   item.childItem.filter(cItem => {
    //     if (cItem.prop === 'orgId')
    //       cItem.options = deepCopy([
    //         { label: 'red', value: 1 },
    //         { label: 'blue', value: 2 }
    //       ])
    //   })
    // }
    if (item.prop === 'entrustFileUrl') {
      item.headers = { Authorization: globalState.token }
      item.action = import.meta.env.VITE_BASE_URL + 'upms/client/sys-file/upload'
      console.log(item.action)
    }
  })
  return dialogFormFieldsList
})

//表单规则rule
const rules = reactive({
  operStoreId: [{ required: true, message: '请选择案件分库', trigger: 'blur' }],
  // categoryCompany: [{ required: true, message: '请选择机构分类', trigger: 'change' }],
  entrustStrategy: [{ required: true, message: '请选择案件操作维度', trigger: 'change' }],
  orgId: [{ required: true, message: '请选择目标机构', trigger: 'change' }],
  entrustType: [{ required: true, message: '请选择委案类型', trigger: 'change' }],
  isHideHisFollowRecord: [{ required: true, message: '请选择历史处置记录', trigger: 'change' }],
  recoverDate: [{ required: true, message: '请选择委案到期日', trigger: 'change' }],
  isAutoRecycle: [{ required: true, message: '请选择是否自动收回', trigger: 'change' }],
  execTime: [{ required: true, message: '请选择执行时间', trigger: 'change' }],
  entrustFileUrl: [{ required: true, message: '请上传委案文件', trigger: 'change' }]
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
    tipDialogVisible.value = false
    ElMessage.success('发布成功')
    //如果是多选操作调取table实例清空多选项
    if (state.currSelectArr.length < 1) return
    tableClass.value.toggleSelection()
  } catch (error) {
    ElMessage.error('发布失败')
    tipDialogVisible.value = false
  }
}

//删除委案方案api
const deleteEntrust = async ids => {
  try {
    await delEntrust(ids)
    ElMessage.success('删除成功')
    getEntrustList()
    //如果是多选操作调取table实例清空多选项
    if (state.currSelectArr.length < 1) return
    tableClass.value.toggleSelection()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

//发布取消
const pubCancel = () => {
  state.entrustIds.length = 0 //清空集合
  tipDialogVisible.value = false
}

const handleUpload = () => {
  state.dialogRuleForm = deepCopy(defaultRuleForm, true)
  state.dialogVisible = true
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

const handleChange = row => {
  console.log(row)
}

//编辑
const handleEdit = (index, row) => {
  const rowObj = { ...row }
  //处理文件回显
  if (rowObj.entrustFileUrl) {
    const entrustFileUrlArr = [{}]
    entrustFileUrlArr[0]['name'] = rowObj.entrustFileUrl.split('/').slice(-1)[0]
    entrustFileUrlArr[0]['url'] = rowObj.entrustFileUrl
    rowObj['entrustFileUrl'] = entrustFileUrlArr
  }
  state.dialogRuleForm = deepCopy(rowObj, true)
  state.dialogVisible = true
}

//table多选操作
const selectChange = obj => {
  state.currSelectArr = obj
  state.entrustIds = obj?.map(item => item.entrustId)
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

//上传的文件
const fileList = ref([])
const fileListSave = file => {
  fileList.value = file
}
//保存编辑及新增
const handleSubmit = async (data, form1) => {
  // delete data['categoryCompany']
  data['entrustFileUrl'] = fileList.value[0]?.url
  try {
    const datas = await Api.entrustSave(data)
    console.log(datas)
    form1.resetFields()
    state.dialogVisible = false
    getEntrustList()
  } catch (error) {
    console.log(error)
  }
}

const handleClick = () => {
  console.log(111)
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
          <el-button type="primary" icon="CirclePlusFilled" @click="handleUpload">上传委案文件</el-button>
          <el-button type="primary" icon="UploadFilled" @click="handleClick">下载导入模板</el-button>
        </template>
      </OperationBar>
      <TableClass
        ref="tableClass"
        :table-data="state.tableData"
        :column-list="tableColumnList"
        :stripe="true"
        :is-selection="true"
        :pagination="false"
        @change-status="handleChange"
        @select-change="selectChange"
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
    <DialogForm
      v-model:dialog-form-visible="state.dialogVisible"
      :rule-form="state.dialogRuleForm"
      title="导入委案"
      :rules="rules"
      :form-fields="formFieldsList"
      @file-list="fileListSave"
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
