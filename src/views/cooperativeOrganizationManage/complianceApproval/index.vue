<template>
  <div class="card-wrap">
    <el-tabs class="mb12" v-model="approveType" @tab-click="onSearch">
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
          <el-form-item label="注册手机号">
            <el-input v-model="form.phone" placeholder="请输入注册手机号"></el-input>
          </el-form-item>
          <el-form-item label="邀请人">
            <el-input v-model="form.inviteName" placeholder="请输入邀请人"></el-input>
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
          <el-form-item label="准入邀请时间">
            <el-date-picker
              v-model="state.inviteTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="委外经理">
            <el-input v-model="form.entrustStaffName" placeholder="请输入委外经理"></el-input>
          </el-form-item>
          <el-form-item label="合规审批提交时间" v-if="approveType !== '0'">
            <el-date-picker
              v-model="state.submitTime"
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
      <el-table-column label="机构注册ID" prop="logId" min-width="150" align="center"></el-table-column>
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
      <el-table-column label="注册人姓名" prop="username" min-width="150" align="center"></el-table-column>
      <el-table-column label="对接邮箱" prop="mail" min-width="180" align="center"></el-table-column>
      <el-table-column label="注册手机号" prop="phone" min-width="150" align="center"></el-table-column>
      <el-table-column label="注册时间" prop="registerTime" min-width="180" align="center"></el-table-column>
      <el-table-column label="审批截止日" prop="lastApplyTime" min-width="180" align="center"></el-table-column>
      <el-table-column label="邀请人" prop="inviteName" min-width="150" align="center"></el-table-column>
      <el-table-column label="委外经理" prop="entrustStaffName" min-width="150" align="center"></el-table-column>
      <el-table-column
        label="合规审批提交时间"
        prop="submitTime"
        min-width="180"
        v-if="approveType !== '0'"
        align="center"
      ></el-table-column>
      <el-table-column label="审批进度" prop="name" width="110" fixed="right" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="onProgress(scope.row.applyId, 'compliance')">查看进度</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" width="150" fixed="right" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="onDetail(scope.row.logId)"
          >{{ approveType === '0' ? '查看资料并审核' : '查看资料/审核结果' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="state.total"
      v-model:page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      @pagination="getTableData"
    />
    <approval-progress-dialog ref="approvalProgressDialogRef"></approval-progress-dialog>
    <risk-dialog ref="riskDialogRef"></risk-dialog>
    <detail-drawer ref="detailDrawerRef" :approve-type="approveType" @get-table-data="getTableData"></detail-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import approvalProgressDialog from '../components/approvalProgressDialog.vue'
import riskDialog from '../components/riskDialog.vue'
import detailDrawer from './components/detailDrawer.vue'
const approveType = ref('0')
const tabPaneData = ref([
  {
    name: '0',
    label: '待审批'
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
const queryParams = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  total: 0,
  tableData: [],
  registerTime: [],
  inviteTime: [],
  submitTime: []
})
const form = reactive({
  companyName: '',
  username: '',
  phone: '',
  inviteName: '',
  entrustStaffName: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const getTableData = async () => {
  const params = handleForm()
  params.approveType = Number(approveType.value)
  const { code, data } = await Apis.registerAuditComplianceList({ ...params, ...queryParams })
  if (code !== 200) return
  state.tableData = data.data
  state.total = data.total
}
const handleForm = () => {
  const timeEnum = ['registerTime', 'inviteTime', 'submitTime']
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
const onReset = () => {
  state.registerTime = []
  state.inviteTime = []
  state.submitTime = []
  Object.assign(form, defaultForm)
  getTableData()
}
const approvalProgressDialogRef = ref()
const onProgress = (id: number, type: string) => {
  approvalProgressDialogRef.value.open(id, type)
}
const detailDrawerRef = ref()
const onDetail = id => {
  detailDrawerRef.value.open(id)
}
const riskDialogRef = ref()
const onRisk = id => {
  riskDialogRef.value.open(id)
}
onMounted(async () => {
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
