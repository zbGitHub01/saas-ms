<script setup>
import { reactive, ref, computed, getCurrentInstance } from 'vue'
import tableColumnList from './config/tableColumnList.js'
import dialogFormFieldsList from './config/dialogFormFieldsList.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const state = reactive({
  tableData: [],
  pageTotal: 4,
  queryNewData: {},
  dialogVisible: false,
  monthList: [],
  dialogRuleForm: {
    case: '',
    opera: '',
    categoryCompany: '',
    aimCompany: '',
    caseType: '',
    history: '',
    date: '',
    isAuto: '',
    notes: '',
    datetime: '',
    checkTest: [],
    fileList: [
      {
        name: 'element-plus-logo.svg',
        url: 'https://element-plus.org/images/element-plus-logo.svg'
      },
      {
        name: 'element-plus-logo2.svg',
        url: 'https://element-plus.org/images/element-plus-logo.svg'
      }
    ]
  }
})

const getOrderListAgain = (pageSize, pageNum) => {
  const pageInfo = {
    ...state.queryNewData,
    pageNum,
    pageSize
  }
  console.log(pageInfo)
  // getOrderList(pageInfo).then(res => {
  //   state.tableData = res.data.records
  //   state.pageTotal = res.data.total
  // })
}

const { proxy } = getCurrentInstance()
const formFieldsList = computed(() => {
  dialogFormFieldsList.forEach(item => {
    if (item.prop === 'case')
      item.options = proxy.$deepCopy(
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
          cItem.options = proxy.$deepCopy([
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
      item.radioList = proxy.$deepCopy(
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

const rules = reactive({
  case: [{ required: true, message: '请选择案件分库', trigger: 'blur' }],
  categoryCompany: [{ required: true, message: '请选择机构分类', trigger: 'change' }],
  aimCompany: [{ required: true, message: '请选择目标机构', trigger: 'change' }],
  caseType: [{ required: true, message: '请选择委案类型', trigger: 'change' }],
  history: [{ required: true, message: '请选择历史处置记录', trigger: 'change' }],
  date: [{ required: true, message: '请选择委案到期日', trigger: 'change' }],
  isAuto: [{ required: true, message: '请选择是否自动收回', trigger: 'change' }],
  datetime: [{ required: true, message: '请选择执行时间', trigger: 'change' }],
  checkTest: [{ required: true, message: '请选择执行时间', trigger: 'change' }],
  fileList: [{ required: true, message: '请上传委案文件', trigger: 'change' }]
})

state.monthList = Array(20).fill({ label: '2021-01', name: Math.floor(Math.random(0, 1) * 10) })

getOrderListAgain()

//formClass实例

// const total = ref(0)
// const page = ref(1)
// const pageSize = ref(10)
// state.tableData = Array(10).fill({ orderNo: 'test' })
state.tableData = [
  { orderNo: 'test', isEnable: false, isOpen: true },
  { orderNo: '111', isEnable: true, isOpen: false },
  { orderNo: 'te222st', isEnable: true, isOpen: true },
  { orderNo: 't3333est', isEnable: false, isOpen: true }
]

const tipDialogVisible = ref(false)

//api获取
// const queryList = computed(() => {
//   const apiList = [
//     {
//       code: 'PRODUCT_LIST',
//       data: [],
//       isShow: 0,
//       key: 'caseId',
//       title: '案件ID',
//       type: 'input'
//     },
//     {
//       code: 'PRODUCT_LIST',
//       data: [],
//       isShow: 1,
//       key: 'product',
//       title: '产品',
//       type: 'select'
//     },
//     {
//       code: 'PRODUCT_LIST',
//       data: [],
//       isShow: 1,
//       key: 'date',
//       title: '日期',
//       type: 'daterange'
//     },
//     {
//       code: 'PRODUCT_LIST',
//       data: [],
//       isShow: 1,
//       key: 'area',
//       title: '区域',
//       type: 'area-select'
//     }
//   ]
//   apiList.forEach(item => {
//     item['property'] = item.key
//     item['name'] = item.title
//     delete item['key']
//     delete item['title']
//   })
//   return apiList
// })
// console.log(queryList)

const handlePub = (index, row) => {
  tipDialogVisible.value = true
  console.log(index, row)
}
const handleUpload = (index, row) => {
  state.dialogVisible = true
  console.log(index, row)
}
const handleDel = (index, row) => {
  ElMessageBox.confirm('proxy will permanently delete the file. Continue?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
  console.log(index, row)
}
const handleChange = row => {
  console.log(row)
}
const handleEdit = () => {
  state.dialogVisible = true
}
const handleSubmit = data => {
  console.log('formData', data.case)
}
</script>

<template>
  <div class="card-wrap">
    <div>
      <OperationBar>
        <template #default>
          <el-button type="primary" icon="CirclePlusFilled" @click="handleClick">批量发布方案</el-button>
          <el-button type="primary" icon="CircleCloseFilled" @click="handleClick">删除委案方案</el-button>
        </template>
        <template #tool>
          <el-button type="primary" icon="CirclePlusFilled" @click="handleUpload">上传委案文件</el-button>
          <el-button type="primary" icon="UploadFilled" @click="handleClick">下载导入模板</el-button>
        </template>
      </OperationBar>
      <TableClass
        :table-data="state.tableData"
        :column-list="tableColumnList"
        :stripe="true"
        :is-selection="true"
        :pagination="false"
        @change-status="handleChange"
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
          <el-button @click="tipDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="tipDialogVisible = false">Confirm</el-button>
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
