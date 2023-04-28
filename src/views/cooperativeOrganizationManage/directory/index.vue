<template>
  <div class="card-wrap">
    <el-button type="primary" :icon="Plus" @click="onInviteLink" class="mb20">生成邀请链接</el-button>
    <FormWrap @search="onSearch" @reset="onReset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="机构名称">
            <el-input v-model="form.orgTitle" placeholder="请输入机构名称"></el-input>
          </el-form-item>
          <el-form-item label="委外经理">
            <el-input v-model="form.entrustStaffName" placeholder="请输入委外经理"></el-input>
          </el-form-item>
          <el-form-item label="合作状态">
            <el-select v-model="form.accessStatus" placeholder="请选择合作状态">
              <el-option
                v-for="item in optionData.accessOptions"
                :key="item.itemValue"
                :label="item.itemText"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构类型">
            <el-select v-model="form.orgCategoryId" placeholder="请选择机构类型">
              <el-option
                v-for="item in optionData.orgTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务负责人">
            <el-input v-model="form.bussinessOperator" placeholder="请输入业务负责人"></el-input>
          </el-form-item>
          <el-form-item label="负责人手机号">
            <el-input v-model="form.bussinessOperatorPhone" placeholder="请输入负责人手机号"></el-input>
          </el-form-item>
          <el-form-item label="首次准入时间">
            <el-date-picker
              v-model="state.firstAccessTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="最近准入时间">
            <el-date-picker
              v-model="state.accessTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="作业模式">
            <el-select v-model="form.orgModelId" placeholder="请选择作业模式">
              <el-option
                v-for="item in optionData.orgModelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="state.registerTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <el-table :data="state.tableData">
      <el-table-column label="机构名称" prop="companyName" width="210" align="center">
        <template #default="scope">
          <div style="display:flex;align-items:center;justify-content: center;">
            <el-tooltip
              effect="dark"
              v-if="scope.row.companyName.length>10"
              :content="scope.row.companyName"
              placement="top"
            >
              <div>{{scope.row.companyName.substring(0,10)+'...'}}</div>
            </el-tooltip>
            <div v-else>{{scope.row.companyName}}</div>
            <svg-icon
              v-if="scope.row.isRisk === 1"
              class="risk-icon"
              name="risk"
              @click="onRisk(scope.row.logId)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="合作状态" prop="accessStatus" min-width="150" align="center">
        <template #default="scope">
          <div>{{ accessStatusText(scope.row.accessStatus) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="委外经理" prop="entrustStaffName" min-width="150" align="center"></el-table-column>
      <el-table-column label="邀请人" prop="inviteName" min-width="150" align="center"></el-table-column>
      <el-table-column label="员工数" prop="employeeNum" min-width="150" align="center"></el-table-column>
      <el-table-column label="业务运营负责人" prop="bussinessOperator" min-width="150" align="center"></el-table-column>
      <el-table-column
        label="运营负责人手机号"
        prop="bussinessOperatorPhone"
        min-width="150"
        align="center"
      ></el-table-column>
      <el-table-column label="最近准入时间" prop="accessTime" min-width="180" align="center"></el-table-column>
      <el-table-column label="对接邮箱" prop="mail" min-width="150" align="center"></el-table-column>
      <el-table-column label="机构类型" prop="orgCategoryName" min-width="150" align="center"></el-table-column>
      <!-- TODO：后期加入 -->
      <!-- <el-table-column label="风险等级" prop="level" min-width="150" align="center"></el-table-column> -->
      <el-table-column label="机构注册人" prop="username" min-width="150" align="center"></el-table-column>
      <el-table-column label="注册手机号" prop="phone" min-width="150" align="center"></el-table-column>
      <el-table-column label="注册时间" prop="registerTime" min-width="180" align="center"></el-table-column>
      <el-table-column label="组织架构" prop="name" min-width="150" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="onOrgStructureDrawer(scope.row.relationTenantId)"
          >查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="角色设置" prop="name" min-width="150" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="onRoleSettingDrawer(scope.row.relationTenantId)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" width="400" fixed="right" align="center">
        <template #default="scope">
          <!-- <el-button type="primary" link @click="onOrgDetail(scope.row.relationTenantId)">查看/编辑</el-button> -->
          <!-- TODO -->
          <!-- <el-button
            type="danger"
            v-if="scope.row.accessStatus !== 4"
            link
            @click="onStopComDialog(scope.row)"
          >终止合作</el-button>-->
          <!-- TODO：缺少reasonContent、remark字段，后期加入 -->
          <el-button
            type="success"
            v-if="scope.row.accessStatus === 4"
            link
            @click="onOpenComDialog(scope.row)"
          >开启合作</el-button>
          <!-- <el-button
            type="warning"
            link
            @click="onReadmissionDialog(scope.row)"
            :disabled="scope.row.accessStatus === 3"
          >重新准入</el-button>-->
          <el-button
            type="danger"
            v-if="scope.row.isStopJob === 0"
            :disabled="scope.row.accessStatus === 4"
            link
            @click="onSuspendOperationDialog(scope.row.relationTenantId, 'suspend')"
          >暂停作业</el-button>
          <el-button
            type="warning"
            v-if="scope.row.isStopJob === 1"
            link
            @click="onSuspendOperationDialog(scope.row.relationTenantId, 'restore')"
          >恢复作业</el-button>
          <!-- TODO -->
          <!-- <el-button type="primary" link @click="onUserNumDrawer(scope.row.relationTenantId)">员工明细</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="state.total"
      v-model:page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      @pagination="getTableData"
    />
    <org-detail-drawer ref="orgDetailDrawerRef" @getTableData="getTableData"></org-detail-drawer>
    <invite-link-dialog ref="inviteLinkDialogRef"></invite-link-dialog>
    <user-num-drawer ref="userNumDrawerRef"></user-num-drawer>
    <org-structure-drawer ref="orgStructureDrawerRef"></org-structure-drawer>
    <role-setting-drawer ref="roleSettingDrawerRef"></role-setting-drawer>
    <readmission-dialog ref="readmissionDialogRef" @getTableData="getTableData"></readmission-dialog>
    <suspend-operation-dialog ref="suspendOperationDialogRef" @getTableData="getTableData"></suspend-operation-dialog>
    <open-com-dialog ref="openComDialogRef" @getTableData="getTableData"></open-com-dialog>
    <stop-com-dialog ref="stopComDialogRef" @getTableData="getTableData"></stop-com-dialog>
    <risk-dialog ref="riskDialogRef"></risk-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useConfirm } from '@/hooks/useConfirm'
import { ElMessageBox } from 'element-plus'
import orgDetailDrawer from './components/orgDetailDrawer.vue'
import inviteLinkDialog from './components/inviteLinkDialog.vue'
import userNumDrawer from './components/userNumDrawer.vue'
import orgStructureDrawer from './components/orgStructureDrawer.vue'
import roleSettingDrawer from './components/roleSettingDrawer.vue'
import readmissionDialog from './components/readmissionDialog.vue'
import suspendOperationDialog from './components/suspendOperationDialog.vue'
import openComDialog from './components/openComDialog.vue'
import stopComDialog from './components/stopComDialog.vue'
import Apis from '@/api/modules/cooperativeOrganization'
import ApisCommon from '@/api/modules/common'
const optionData = reactive({
  accessOptions: [],
  orgTypeList: [],
  orgModelList: []
})
const queryParams = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  total: 0,
  tableData: [],
  firstAccessTime: [],
  accessTime: [],
  registerTime: []
})
const form = reactive({
  orgTitle: '',
  entrustStaffName: '',
  accessStatus: '',
  orgCategoryId: '',
  bussinessOperator: '',
  bussinessOperatorPhone: '',
  orgModelId: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const getTableData = async () => {
  const params = handleForm()
  const { code, data } = await Apis.clientOrgList({ ...params, ...queryParams })
  if (code !== 200) return
  state.tableData = data.data
  state.total = data.total
}
const handleForm = () => {
  const timeEnum = ['firstAccessTime', 'accessTime', 'registerTime']
  timeEnum.forEach(item => {
    if (state[item].length === 0) {
      form[`${item}Start`] = ''
      form[`${item}End`] = ''
    } else {
      form[`${item}Start`] = state[item][0]
      form[`${item}End`] = state[item][1]
    }
  })
  return form
}
const accessStatusText = val => {
  return optionData.accessOptions.find(item => item.itemValue === val)?.itemText
}
const onSearch = () => {
  getTableData()
}
const onReset = () => {
  state.firstAccessTime = []
  state.accessTime = []
  state.registerTime = []
  Object.assign(form, defaultForm)
  getTableData()
}

const orgDetailDrawerRef = ref()
const onOrgDetail = (relationTenantId: number) => {
  orgDetailDrawerRef.value.open(relationTenantId)
}
const inviteLinkDialogRef = ref()
const onInviteLink = () => {
  inviteLinkDialogRef.value.open()
}
const userNumDrawerRef = ref()
const onUserNumDrawer = (relationTenantId: number) => {
  userNumDrawerRef.value.open(relationTenantId)
}
const orgStructureDrawerRef = ref()
const onOrgStructureDrawer = (relationTenantId: number) => {
  orgStructureDrawerRef.value.open(relationTenantId)
}
const roleSettingDrawerRef = ref()
const onRoleSettingDrawer = (relationTenantId: number) => {
  roleSettingDrawerRef.value.open(relationTenantId)
}
const readmissionDialogRef = ref()
const onReadmissionDialog = (row: any) => {
  if (row.username) {
    readmissionDialogRef.value.open(row)
  } else {
    ElMessageBox.confirm('当前机构不存在机构负责人，请先为机构设置负责人', '无法重新准入！', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {})
  }
}
const suspendOperationDialogRef = ref()
const onSuspendOperationDialog = (relationTenantId: number, type: string) => {
  suspendOperationDialogRef.value.open(relationTenantId, type)
}
const openComDialogRef = ref()
const onOpenComDialog = (row: any) => {
  openComDialogRef.value.open(row)
}
const stopComDialogRef = ref()
const onStopComDialog = async (row: any) => {
  const params = {
    relationTenantId: row.relationTenantId
  }
  // TODO:后续接入caseNum接口
  // const { code, data } = await Apis.caseNum(params)
  // if (code !== 200) return
  const temRow = {
    ...row,
    // orgNum: data || 0
    orgNum: 0
  }
  stopComDialogRef.value.open(temRow)
}
//获取下拉数据
const getSelectList = async () => {
  const option1 = await Apis.optionList({ codes: 'ORG_CATEGORY,ORG_TASK_MODEL' })
  if (option1.code !== 200) return
  optionData.orgTypeList = option1.data?.ORG_CATEGORY ?? []
  optionData.orgModelList = option1.data?.ORG_TASK_MODEL ?? []
  const option2 = await ApisCommon.findItemList({ codes: 'COOPERATION_STATUS' })
  if (option2.code !== 200) return
  optionData.accessOptions = option2.data?.COOPERATION_STATUS ?? []
}
const riskDialogRef = ref()
const onRisk = id => {
  riskDialogRef.value.open(id)
}
onMounted(async () => {
  getSelectList()
  getTableData()
})
</script>

<style lang="scss" scoped>
.risk-icon {
  font-size: 24px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
