<template>
  <div class="card-wrap">
    <el-tabs v-model="approveType" class="mb12" @tab-click="onSearch">
      <el-tab-pane
        v-for="item in tabPaneData"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      ></el-tab-pane>
    </el-tabs>
    <FormWrap @search="onSearch" @reset="onReset">
      <template #default>
        <el-form inline :model="form">
          <el-form-item label="机构名称">
            <el-input v-model="form.companyName" placeholder="请输入机构名称"></el-input>
          </el-form-item>
          <el-form-item label="注册人姓名">
            <el-input v-model="form.username" placeholder="请输入注册人姓名"></el-input>
          </el-form-item>
          <el-form-item v-if="approveType === '3'" label="业务运营负责人">
            <el-input v-model="form.bussinessOperator" placeholder="请输入业务运营负责人"></el-input>
          </el-form-item>
          <el-form-item label="注册手机号">
            <el-input v-model="form.phone" placeholder="请输入注册手机号"></el-input>
          </el-form-item>
          <el-form-item v-if="approveType !== '3'" label="邀请人">
            <el-input v-model="form.inviteName" placeholder="请输入邀请人"></el-input>
          </el-form-item>
          <el-form-item v-if="approveType !== '3'" label="注册时间">
            <el-date-picker
              v-model="state.registerTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="邀请时间">
            <el-date-picker
              v-model="state.inviteTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="准入提交时间">
            <el-date-picker
              v-model="state.submitTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item v-if="approveType === 'all' || approveType === '4'" label="准入状态">
            <el-select v-model="form.inviteStatus" placeholder="请选择准入状态">
              <el-option
                v-for="item in optionData.inviteStatusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="approveType === 'all' || approveType === '1'" label="准入通过时间">
            <el-date-picker
              v-model="state.accessTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item v-if="approveType === '3'" label="失效时间">
            <el-date-picker
              v-model="state.lastApplyTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item v-if="approveType === '2'" label="拒绝人">
            <el-select v-model="form.employeeId" placeholder="请选择拒绝人">
              <el-option
                v-for="item in optionData.userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <el-table :data="state.tableData">
      <el-table-column label="机构名称" prop="companyName" width="210" align="center">
        <template #default="scope">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-tooltip
              v-if="scope.row.companyName.length > 10"
              effect="dark"
              :content="scope.row.companyName"
              placement="top"
            >
              <div>{{ scope.row.companyName.substring(0, 10) + '...' }}</div>
            </el-tooltip>
            <div v-else>{{ scope.row.companyName }}</div>
            <svg-icon
              v-if="scope.row.isRisk === 1"
              class="risk-icon"
              name="risk"
              @click="onRisk(scope.row.logId)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="邀请时间" prop="inviteTime" min-width="180" align="center"></el-table-column>
      <el-table-column label="提交审核时间" prop="submitTime" min-width="180" align="center"></el-table-column>
      <el-table-column
        v-if="approveType === '1'"
        label="准入通过时间"
        prop="checkTime"
        min-width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        v-if="approveType === 'all' || approveType === '4'"
        label="准入状态"
        prop="inviteStatus"
        min-width="150"
        align="center"
      >
        <template #default="scope">
          <div>{{ inviteStatusText(scope.row.inviteStatus) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="注册手机号" prop="phone" min-width="150" align="center"></el-table-column>
      <el-table-column label="注册人姓名" prop="username" min-width="150" align="center"></el-table-column>
      <el-table-column label="注册邮箱" prop="mail" min-width="150" align="center"></el-table-column>
      <el-table-column label="注册时间" prop="registerTime" min-width="180" align="center"></el-table-column>
      <el-table-column label="机构类型" prop="orgCategoryName" min-width="150" align="center"></el-table-column>
      <el-table-column label="邀请人" prop="inviteName" min-width="150" align="center"></el-table-column>
      <el-table-column
        v-if="approveType === '3'"
        label="失效时间"
        prop="lastApplyTime"
        min-width="180"
        align="center"
      ></el-table-column>
      <el-table-column label="委外经理" prop="entrustStaffName" min-width="150" align="center"></el-table-column>
      <el-table-column label="审批进度" prop="name" width="110" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="onProgress(scope.row.applyId, 'all')">查看进度</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" width="190" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="onDetail(scope.row.logId)">查看资料/合规审批结果</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-model:page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      :total="state.total"
      @pagination="getTableData"
    />
    <approval-progress-dialog ref="approvalProgressDialogRef"></approval-progress-dialog>
    <risk-dialog ref="riskDialogRef"></risk-dialog>
    <detail-drawer ref="detailDrawerRef" :approve-type="approveType" @get-table-data="getTableData"></detail-drawer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import approvalProgressDialog from '../components/approvalProgressDialog.vue'
import riskDialog from '../components/riskDialog.vue'
import detailDrawer from './components/detailDrawer.vue'
const approveType = ref('all')
const tabPaneData = ref([
  {
    name: 'all',
    label: '全部'
  },
  {
    name: '4',
    label: '审核中'
  },
  {
    name: '1',
    label: '已通过'
  },
  {
    name: '2',
    label: '已拒绝'
  },
  {
    name: '3',
    label: '已失效'
  }
])
const approvalProgressDialogRef = ref()
const detailDrawerRef = ref()
const optionData = reactive({
  inviteStatusOptions: [
    { id: 0, name: '待企业认证' },
    { id: 1, name: '待提交准入审核' },
    { id: 2, name: '审核中-待邀请人审核' },
    { id: 3, name: '审核中-待合规审核' },
    { id: 4, name: '审核中-待最终审核' },
    { id: 5, name: '审核通过' },
    { id: 6, name: '审核未通过' },
    { id: 7, name: '失效' }
  ],
  userList: []
})
const queryParams = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  total: 0,
  tableData: [],
  registerTime: [],
  inviteTime: [],
  submitTime: [],
  accessTime: [],
  lastApplyTime: []
})
const form = reactive({
  companyName: '',
  username: '',
  bussinessOperator: '',
  phone: '',
  inviteName: '',
  inviteStatus: '',
  employeeId: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const getTableData = async () => {
  const params = handleForm()
  params.approveType = approveType.value === 'all' ? '' : Number(approveType.value)
  const { code, data } = await Apis.registerAuditAllList({ ...params, ...queryParams })
  if (code !== 200) return
  state.tableData = data.data
  state.total = data.total
}
const inviteStatusText = val => {
  return optionData.inviteStatusOptions.find(item => item.id === val)?.name
}
const handleForm = () => {
  const timeEnum = ['registerTime', 'inviteTime', 'submitTime', 'accessTime', 'lastApplyTime']
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
const onSearch = () => {
  nextTick(() => {
    getTableData()
  })
}
const employeeList = async () => {
  const { code, data } = await Apis.clientEmployeeList()
  if (code !== 200) return
  optionData.userList = data
}
const onReset = () => {
  state.registerTime = []
  state.inviteTime = []
  state.submitTime = []
  state.accessTime = []
  state.lastApplyTime = []
  Object.assign(form, defaultForm)
  getTableData()
}
const onProgress = (id, type) => {
  approvalProgressDialogRef.value.open(id, type)
}
const onDetail = logId => {
  detailDrawerRef.value.open(logId)
}
const riskDialogRef = ref()
const onRisk = id => {
  riskDialogRef.value.open(id)
}
onMounted(async () => {
  employeeList()
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
