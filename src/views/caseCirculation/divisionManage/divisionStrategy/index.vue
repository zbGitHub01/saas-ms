<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import Apis from '@/api/modules/divisionStrategy'
import dialogFormFields from './config/dialogFormFields.js'

const defaultForm = {
  orgName: null,
  assignAdminName: null
}

const router = useRouter()

const state = reactive({
  tableData: [],
  dialogTitle: '',
  dialogForm: {
    orgName: null,
    assignAdminName: null
  }
})

const getList = async () => {
  const { data } = await Apis.divisionStrategyList()
  state.tableData = data
}

getList()

const dialogFormVisible = ref(false)
const { proxy } = getCurrentInstance()

const handleEdit = async (va, val) => {
  const data = await Apis.getOrgNameList()
  const assignData = await Apis.getAssignAdminNameList()
  dialogFormFields.map(item => {
    if (item.prop === 'orgName') {
      item.options = data.data.map(cItem => {
        let obj = {}
        obj['value'] = cItem.id
        obj['label'] = cItem.orgName
        return obj
      })
    }
    if (item.prop === 'assignAdminName') {
      item.options = assignData.data.map(cItem => {
        let obj = {}
        obj['value'] = cItem.id
        obj['label'] = cItem.assignAdminName
        return obj
      })
    }
  })
  //清空编辑操作赋的默认值
  Object.keys(state.dialogForm).forEach(key => (state.dialogForm[key] = null))
  state.dialogTitle = '编辑管理机构'
  dialogFormVisible.value = true
  console.log(va, val)
}

//修改负责人
const handleUpdate = obj => {
  //编辑操作赋默认值
  Object.keys(state.dialogForm).forEach(key => (state.dialogForm[key] = obj[key]))
  dialogFormFields.map(item => {
    if (item.prop === 'orgName') item['disabled'] = true
  })
  state.dialogTitle = '修改负责人'
  dialogFormVisible.value = true
  console.log(obj)
}

//关闭弹窗
const handleClose = () => {
  state.dialogForm = proxy.$deepCopy(defaultForm, true)
  dialogFormFields.map(item => {
    if (item.prop === 'orgName') item['disabled'] = false
  })
  dialogFormVisible.value = false
}

//CPE持案情况查看
const handleViewSituation = val => {
  router.push({ name: 'divisionSituation' })
  console.log(val)
}

//移除机构
const handleRemove = row => {
  ElMessageBox.confirm('是否确认移除管理机构?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '移除成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '移除取消'
      })
    })
  console.log(row)
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
                        <span>已分派：{{ item.assignCaseAmount }}</span>
                        <span>未分派：{{ item.unAssignCaseAmount }}</span>
                      </div>
                    </div>
                    <div class="line"></div>
                    <div>
                      <div class="title">载案户数</div>
                      <div class="num_wrap">
                        <span>已分派：{{ item.assignCaseNumber }}</span>
                        <span>未分派：{{ item.unAssignCaseNumber }}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <el-button type="primary" plain @click="goRouter(item)">实时分案</el-button>
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
      width="30%"
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
