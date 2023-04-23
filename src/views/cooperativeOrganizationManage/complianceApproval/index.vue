<template>
  <div class="card-wrap">
    <el-tabs class="mb12" v-model="approveType">
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
            <el-select v-model="form.registerId" placeholder="请选择注册人姓名">
              <el-option
                v-for="item in optionData.userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册手机号">
            <el-input v-model="form.phone" placeholder="请输入注册手机号"></el-input>
          </el-form-item>
          <el-form-item label="邀请人">
            <el-input v-model="form.inviteName" placeholder="请输入邀请人"></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="state.createTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <!-- TODO -->
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
          <!-- TODO -->
          <el-form-item label="委外经理">
            <el-input v-model="form.entrustStaffId" placeholder="请输入委外经理"></el-input>
          </el-form-item>
          <!-- TODO -->
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
      <el-table-column label="机构注册ID" prop="logId" min-width="150"></el-table-column>
      <el-table-column label="机构名称" prop="companyName" min-width="150"></el-table-column>
      <el-table-column label="注册人姓名" prop="username" min-width="150"></el-table-column>
      <el-table-column label="对接邮箱" prop="mail" min-width="150"></el-table-column>
      <el-table-column label="注册手机号" prop="phone" min-width="150"></el-table-column>
      <el-table-column label="注册时间" prop="createTime" min-width="150"></el-table-column>
      <el-table-column label="审批截止日" prop="lastApplyTime" min-width="150"></el-table-column>
      <!-- TODO -->
      <el-table-column label="邮箱" prop="name" min-width="150"></el-table-column>
      <el-table-column label="邀请人" prop="inviteName" min-width="150"></el-table-column>
      <!-- TODO -->
      <el-table-column label="委外经理" prop="name" min-width="150"></el-table-column>
      <el-table-column
        label="合规审批提交时间"
        prop="submitTime"
        min-width="150"
        v-if="approveType !== '0'"
      ></el-table-column>
      <el-table-column label="审批进度" prop="name" width="110" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="onProgress(scope.row.applyId, 'compliance')">查看进度</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" width="150" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="onDetail(scope.row)"
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
    <detail-drawer ref="detailDrawerRef" :approve-type="approveType"></detail-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import approvalProgressDialog from '../components/approvalProgressDialog.vue'
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
interface stateParams {
  [key: string]: any
  total: number
  tableData: any[]
}
const optionData = reactive({
  accessOptions: [],
  userList: []
})
const queryParams = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive<stateParams>({
  total: 0,
  tableData: [],
  createTime: [],
  inviteTime: [],
  submitTime: []
})
const form: any = reactive({
  companyName: '',
  registerId: '',
  phone: '',
  inviteName: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const getTableData = async () => {
  const params = handleForm()
  const { code, data } = await Apis.registerAuditComplianceList({ ...params, ...queryParams })
  if (code !== 200) return
  state.tableData = data.data
  state.total = data.total
}
const getOptionList = async () => {
  const { code, data } = await Apis.registerAuditComplianceUserList()
  if (code !== 200) return
  optionData.userList = data ?? []
}
const handleForm = () => {
  const timeEnum = ['createTime', 'inviteTime', 'submitTime']
  timeEnum.forEach(item => {
    if (state[item].length === 0) {
      form[`${item}Str`] = ''
      form[`${item}End`] = ''
    } else {
      form[`${item}Str`] = state[item][0]
      form[`${item}End`] = state[item][1]
    }
  })
  return form
}
const onSearch = () => {
  getTableData()
}
const onReset = () => {
  state.createTime = []
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
const onDetail = (row: any) => {
  detailDrawerRef.value.open(row)
}
onMounted(async () => {
  getOptionList()
  getTableData()
})
</script>

<style lang="scss" scoped></style>
