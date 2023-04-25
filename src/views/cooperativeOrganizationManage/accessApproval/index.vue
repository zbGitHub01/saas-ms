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
          <el-form-item label="注册时间" v-if="approveType !== '2'">
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
          <el-form-item label="准入通过时间" v-if="approveType === '1'">
            <el-date-picker
              v-model="state.accessTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="失效时间" v-if="approveType === '3'">
            <el-date-picker
              v-model="state.lastApplyTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="准入状态" v-if="approveType === '4'">
            <el-select v-model="form.inviteStatus" placeholder="请选择准入状态">
              <el-option
                v-for="item in optionData.inviteStatusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核提交时间" v-if="approveType === '2'">
            <el-date-picker
              v-model="state.submitTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="审核拒绝时间" v-if="approveType === '2'">
            <el-date-picker
              v-model="state.checkTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <!-- <el-form-item label="拒绝原因" v-if="approveType === '2'">
            <el-select v-model="form.rejectId" placeholder="请选择拒绝原因">
              <el-option
                v-for="item in optionData.rejectReasonList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>-->
        </el-form>
      </template>
    </FormWrap>
    <el-table :data="state.tableData">
      <el-table-column label="机构名称" prop="companyName" min-width="150"></el-table-column>
      <el-table-column label="邀请时间" prop="inviteTime" min-width="180"></el-table-column>
      <el-table-column label="准入状态" prop="inviteStatus" min-width="180" v-if="approveType === '4'">
        <template #default="scope">
          <div>{{ inviteStatusText(scope.row.inviteStatus) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="提交审核时间" prop="submitTime" min-width="180"></el-table-column>
      <el-table-column
        label="资料提交截止日"
        prop="endTime"
        min-width="180"
        v-if="approveType === '0' || approveType === '4'"
      ></el-table-column>
      <el-table-column
        label="审批截止日"
        prop="lastApplyTime"
        min-width="180"
        v-if="approveType === '0' || approveType === '4'"
      ></el-table-column>
      <el-table-column label="准入通过时间" prop="checkTime" min-width="180" v-if="approveType === '1'"></el-table-column>
      <el-table-column label="审核拒绝时间" prop="checkTime" min-width="150" v-if="approveType === '2'"></el-table-column>
      <el-table-column label="拒绝原因" prop="refuseReason" min-width="150" v-if="approveType === '2'"></el-table-column>
      <el-table-column label="拒绝人" prop="handlerName" min-width="150" v-if="approveType === '2'"></el-table-column>
      <el-table-column label="失效时间" prop="lastApplyTime" min-width="180" v-if="approveType === '3'"></el-table-column>
      <el-table-column label="注册手机号" prop="phone" min-width="150"></el-table-column>
      <el-table-column label="注册人姓名" prop="username" min-width="150"></el-table-column>
      <el-table-column label="注册邮箱" prop="mail" min-width="150"></el-table-column>
      <el-table-column label="注册时间" prop="registerTime" min-width="180"></el-table-column>
      <el-table-column label="机构类型" prop="orgTypeName" min-width="150"></el-table-column>
      <el-table-column label="邀请人" prop="inviteName" min-width="150"></el-table-column>
      <el-table-column label="委外经理" prop="entrustStaffName" min-width="150"></el-table-column>
      <el-table-column label="审批进度" prop="name" width="110" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="onProgress(scope.row.applyId, 'access')">查看进度</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" width="190" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="onDetail(scope.row.logId)"
          >{{approveType === '0' ? '查看资料并审核' :'查看资料/审批结果'}}</el-button>
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
    <detail-drawer ref="detailDrawerRef" :approve-type="approveType" @get-table-data="getTableData"></detail-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import approvalProgressDialog from '../components/approvalProgressDialog.vue'
import detailDrawer from './components/detailDrawer.vue'
const approveType = ref('0')
const tabPaneData = ref([
  {
    name: '0',
    label: '待我审核'
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
  userList: [],
  rejectReasonList: []
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
  accessTime: [],
  lastApplyTime: [],
  submitTime: [],
  checkTime: []
})
const form = reactive({
  companyName: '',
  username: '',
  phone: '',
  inviteName: '',
  inviteStatus: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const getTableData = async () => {
  const params = handleForm()
  params.approveType = Number(approveType.value)
  const { code, data } = await Apis.registerAuditList({ ...params, ...queryParams })
  if (code !== 200) return
  state.tableData = data.data
  state.total = data.total
}
const inviteStatusText = val => {
  return optionData.inviteStatusOptions.find(item => item.id === val)?.name
}
const handleForm = () => {
  const timeEnum = ['registerTime', 'inviteTime', 'accessTime', 'lastApplyTime', 'submitTime', 'checkTime']
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
  state.accessTime = []
  state.lastApplyTime = []
  state.submitTime = []
  state.checkTime = []
  Object.assign(form, defaultForm)
  getTableData()
}
const onProgress = (id: number, type: string) => {
  approvalProgressDialogRef.value.open(id, type)
}
const onDetail = id => {
  detailDrawerRef.value.open(id)
}
onMounted(async () => {
  getTableData()
})
</script>

<style lang="scss" scoped></style>
