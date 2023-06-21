<script setup>
import { ref, reactive, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import Apis, { deleteOrgManage } from '@/api/modules/divisionStrategy'
import dialogFormFields from './config/dialogFormFields.js'

const defaultForm = {
  orgId: null,
  assignAdminId: null
}

const router = useRouter()

const state = reactive({
  tableData: [],
  dialogTitle: '',
  addOrUpdate: 0, // 新增还是修改 默认新增
  dialogForm: {
    orgId: null,
    assignAdminId: null
  }
})

const getList = async () => {
  const { data } = await Apis.divisionStrategyList()
  state.tableData = data
}

getList()

const dialogFormVisible = ref(false)
const instance = getCurrentInstance()?.proxy

const userData = [
  {
    isConnection: 0,
    positionStatus: 1,
    userId: 1,
    userPhone: '17398042048',
    userStatus: 1,
    userName: '超级管理员'
  },
  {
    isConnection: 0,
    positionStatus: 1,
    userId: 102,
    userPhone: '15618930363',
    userStatus: 1,
    userName: '赵光明'
  }
]

const orgData = [
  {
    itemId: 1,
    itemText: '公司名称T79'
  },
  {
    itemId: 136,
    itemText: '测试机构136'
  }
]

watch(
  () => dialogFormVisible.value,
  // eslint-disable-next-line no-unused-vars
  (newVal, oldVal) => {
    if (!newVal) dialogFormFields.map(item => (item.disabled = false))
  }
)

dialogFormFields.map(item => {
  if (item.prop === 'orgId') {
    item.options = orgData
  }
  if (item.prop === 'assignAdminId') {
    item.options = userData
  }
})

const handleEdit = async (va, val) => {
  state.addOrUpdate = 0
  // const data = await Apis.getOrgNameList()
  // const assignData = await Apis.getAssignAdminNameList()
  //清空编辑操作赋的默认值
  Object.keys(state.dialogForm).forEach(key => (state.dialogForm[key] = null))
  state.dialogTitle = '编辑管理机构'
  dialogFormVisible.value = true
  console.log(va, val)
}

//修改负责人
const handleUpdate = obj => {
  state.addOrUpdate = 1
  //编辑操作赋默认值
  // Object.keys(state.dialogForm).forEach(key => (state.dialogForm[key] = obj[key]))
  console.log(obj)
  state.dialogForm = obj
  dialogFormFields.map(item => {
    if (item.prop === 'orgId') item['disabled'] = true
  })
  state.dialogTitle = '修改负责人'
  // state.currUpdateObj = obj
  dialogFormVisible.value = true
}

const rules = reactive({
  assignAdminId: [{ required: true, message: '请选择机构负责人', trigger: 'change' }],
  orgId: [{ required: true, message: '请选择管理机构', trigger: 'change' }]
})

//关闭弹窗
const handleClose = () => {
  state.dialogForm = instance?.$deepCopy(defaultForm, true)
  dialogFormFields.map(item => {
    if (item.prop === 'orgName') item['disabled'] = false
  })
  dialogFormVisible.value = false
}

//实时分案
const handleDivision = val => {
  const { orgId, orgName } = val
  router.push({ name: 'divisionRealStrategy', query: { orgId, orgName } })
}

//CPE持案情况查看
const handleViewSituation = val => {
  router.push({ name: 'divisionSituation', query: { orgName: val.orgName } })
  console.log(val)
}

//移除机构
const handleRemove = row => {
  ElMessageBox.confirm('是否确认移除管理机构?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteOrgManage(row.id)
        ElMessage({
          type: 'success',
          message: '移除成功'
        })
        getList()
      } catch (error) {
        console.log(error)
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '移除取消'
      })
    })
  console.log(row)
}

//新增机构提交
const handleSubmit = async (data, formRef) => {
  const dataObj = { ...data }
  if (data.assignAdminId) dataObj['assignAdminName'] = userData.find(item => item.userId === data.assignAdminId).userName
  if (data.orgId) dataObj['orgName'] = orgData.find(item => item.itemId === data.orgId).itemText
  if (state.addOrUpdate === 0) {
    try {
      await Apis.addOrgManage(dataObj)
      formRef.resetFields()
      dialogFormVisible.value = false
      getList()
      ElMessage.success('新增成功')
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      dataObj['id'] = data.id
      await Apis.updateOrgManage(dataObj)
      formRef.resetFields()
      dialogFormVisible.value = false
      getList()
      ElMessage.success('修改成功')
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<template>
  <div class="card-wrap">
    <div class="opera">
      <el-button type="primary" icon="Edit" @click="handleEdit">新增管理机构</el-button>
    </div>
    <div class="spacing"></div>
    <div class="mt20">
      <div class="dele_table">
        <div class="style-container style">
          <div v-for="item in state.tableData" :key="item.id">
            <div class="division_wrap">
              <div class="division_right">
                <div class="divisionContent_wrap">
                  <div class="divisionContent top">
                    {{ item.orgName }}
                    <span>负责人：{{ item.assignAdminName }}</span>
                  </div>
                </div>
                <div class="divisionContent_wrap" style="height: 66%">
                  <div class="divisionContent bottom">
                    <div>
                      <div class="title">载案金额</div>
                      <div class="num_wrap">
                        <span>已分派：{{ item.existAllotAmount }}</span>
                        <span>未分派：{{ item.unAllotAmount }}</span>
                      </div>
                    </div>
                    <div class="line"></div>
                    <div>
                      <div class="title">载案户数</div>
                      <div class="num_wrap">
                        <span>已分派：{{ item.existAllotUserNum }}</span>
                        <span>未分派：{{ item.unAllotUserNum }}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <el-button type="primary" plain @click="handleDivision(item)">实时分案</el-button>
                    <el-button type="primary" plain @click="handleViewSituation(item)">CPE持案情况</el-button>
                    <el-button type="primary" plain @click="handleUpdate(item)">修改负责人</el-button>
                    <el-button type="danger" plain @click="handleRemove(item)">移除机构</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--编辑新增机构-->
    <DialogForm
      v-model:dialogFormVisible="dialogFormVisible"
      :form-fields="dialogFormFields"
      :rule-form="state.dialogForm"
      :title="state.dialogTitle"
      :rules="rules"
      width="30%"
      @submit="handleSubmit"
      @close="handleClose"
    ></DialogForm>
  </div>
</template>

<style scoped lang="scss">
.dele_table {
  margin: 0;
  .division_wrap {
    width: 100%;
    height: 128px;
    box-shadow: 0px 0px 8px 2px lightgrey;
    display: flex;
    margin-bottom: 20px;
    .division_right {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 0 20px;
      .divisionContent_wrap {
        width: 100%;
        height: 34%;
        line-height: 49px;
        display: flex;
        justify-content: space-between;
        .divisionContent {
          span {
            display: inline-block;
            height: 28px;
            font-size: 14px;
            font-weight: 400;
            color: #666;
            line-height: 28px;
          }
        }
        .top {
          font-size: 20px;
          font-weight: 700;
          span {
            padding: 0 8px;
            margin-left: 10px;
          }
        }
        .bottom {
          width: 65%;
          display: flex;
          justify-content: space-between;
          > div {
            width: 45%;
          }
          .line {
            width: 1px;
            height: 65%;
            margin: auto 0;
            border-left: 1px solid #d7d7d7;
          }
          .title {
            height: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #666;
          }
          span {
            color: #000;
          }
          .num_wrap {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
.opera {
  margin-bottom: 20px;
}
:deep(.el-dialog__body .el-input) {
  width: 100%;
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
