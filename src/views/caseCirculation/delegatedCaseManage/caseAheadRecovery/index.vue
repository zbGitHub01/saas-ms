<script setup>
import { reactive, ref, computed, getCurrentInstance } from 'vue'
import Api from '@/api/modules/caseAheadRecovery'
import { ElMessage, ElMessageBox } from 'element-plus'
import DialogForm from './component/dialogForm.vue'
import tableColumnList from './config/tableColumnList.js'
import dialogFormFieldsList from './config/dialogFormFieldsList.js'

const state = reactive({
  tableData: [],
  dialogVisible: false,
  drawerVisible: false,
  recoverBatchIdList: [], //预收回方案发布id集合
  currSelectArr: [],
  orgList: [] //机构列表
})

//获取列表数据
const getList = async () => {
  try {
    const { data } = await Api.getPreRecoverList()
    state.tableData = data.data
  } catch (error) {
    console.log(error)
  }
}

getList()

state.orgList = [{ orgId: 1, orgName: 'test' }]

const instance = getCurrentInstance()?.proxy
const formFieldsList = computed(() => {
  dialogFormFieldsList.forEach(item => {
    if (item.prop === 'case')
      item.options = instance?.$deepCopy(
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
    if (item.type === 'pairSelect') {
      item.childItem.filter(cItem => {
        if (cItem.prop === 'aimCompany')
          cItem.options = instance?.$deepCopy([
            {
              label: 'red',
              value: 1
            },
            {
              label: 'blue',
              value: 2
            }
          ])
      })
    }
    if (item.prop === 'opera')
      item.radioList = instance?.$deepCopy(
        [
          {
            label: '案人'
          },
          {
            label: '案件'
          },
          {
            label: '库内剩余共债'
          }
        ],
        true
      )
  })
  return dialogFormFieldsList
})

const tipDialogVisible = ref(false)
const tableClass = ref(null)
const dialog = ref(null)

//table多选操作
const selectChange = obj => {
  state.currSelectArr = obj
}

//批量发布预收回方案
const handleBatchPub = () => {
  if (state.currSelectArr.length < 1) {
    ElMessage({ message: '请选择操作对象.', type: 'warning' })
    return
  }
  state.recoverBatchIdList = state.currSelectArr.map(item => item.recoverId)
  tipDialogVisible.value = true
}

//发布委案确认
const handlePubConfirm = async () => {
  try {
    const data = {
      operateType: 1,
      recoverBatchIdList: state.recoverBatchIdList
    }
    await Api.preRecoverPublish(data)
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

//发布取消
const pubCancel = () => {
  state.recoverBatchIdList.length = 0 //清空集合
  tipDialogVisible.value = false
}

const handlePub = (index, row) => {
  state.recoverBatchIdList = [row.recoverId]
  tipDialogVisible.value = true
}
const handleUpload = (index, row) => {
  state.dialogVisible = true
  console.log(index, row)
}

//删除预收回方案
const handleDel = (index, row) => {
  if (!row && state.currSelectArr.length < 1) {
    ElMessage({ message: '请选择操作对象.', type: 'warning' })
    return
  }
  ElMessageBox.confirm('确认删除预收回方案?', '注意', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let data = {}
      if (row) data = { operateType: 1, recoverBatchIdList: [row.recoverId] }
      else data = { operateType: 1, recoverBatchIdList: state.recoverBatchIdList }
      deleteEntrust(data)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

//删除委案方案api
const deleteEntrust = async data => {
  try {
    await Api.preRecoverDelete(data)
    //如果是多选操作调取table实例清空多选项
    ElMessage.success('删除成功')
    getList()
    if (state.currSelectArr.length < 1) return
    tableClass.value.toggleSelection()
  } catch (error) {
    console.log(error)
  }
}

const handleEdit = async row => {
  state.currEditRow = row
  state.dialogVisible = true
}

const handleCancel = () => {
  state.currEditRow = {}
  state.dialogVisible = false
}
const handleSubmit = () => {
  getList()
  state.currEditRow = {}
  state.dialogVisible = false
}
</script>

<template>
  <div class="card-wrap">
    <div>
      <OperationBar>
        <template #default>
          <el-button type="primary" plain icon="CirclePlusFilled" @click="handleBatchPub">批量发布方案</el-button>
          <el-button type="primary" plain icon="CircleCloseFilled" @click="handleDel">删除收回方案</el-button>
        </template>
        <template #tool>
          <el-button type="primary" icon="CirclePlusFilled" @click="handleUpload">添加收回方案</el-button>
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
        @select-change="selectChange"
      >
        <template #operation>
          <el-table-column align="center" fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" link @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="primary" size="small" link @click="handlePub(scope.$index, scope.row)">确认发布</el-button>
              <el-button type="danger" size="small" link @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </TableClass>
    </div>
    <!--编辑新增form弹框-->
    <DialogForm
      ref="dialog"
      v-model:dialog-form-visible="state.dialogVisible"
      :curr-edit-row="state.currEditRow"
      :org-list="state.orgList"
      :form-fields="formFieldsList"
      @cancel="handleCancel"
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
:deep(.el-date-picker .el-input__wrapper) {
  width: 146px !important;
  height: 32px;
}
</style>
