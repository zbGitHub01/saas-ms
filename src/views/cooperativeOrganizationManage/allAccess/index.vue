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
          <el-form-item label="注册人姓名" v-if="approveType !== '3'">
            <el-select v-model="form.value5" placeholder="请选择注册人姓名">
              <el-option
                v-for="item in optionData.userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务运营负责人" v-if="approveType === '3'">
            <el-input v-model="form.value6" placeholder="请输入业务运营负责人"></el-input>
          </el-form-item>
          <el-form-item label="注册手机号">
            <el-input v-model="form.value6" placeholder="请输入注册手机号"></el-input>
          </el-form-item>
          <el-form-item label="邀请人" v-if="approveType !== '3'">
            <el-input v-model="form.entrustStaffId" placeholder="请输入邀请人"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" v-if="approveType !== '3'">
            <el-date-picker
              v-model="state.createTime"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="邀请时间">
            <el-date-picker
              v-model="state.value8"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="准入提交时间">
            <el-date-picker
              v-model="state.value11"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="准入状态" v-if="approveType === 'all' || approveType === '0'">
            <el-select v-model="form.accessStatus" placeholder="请选择准入状态">
              <el-option
                v-for="item in optionData.accessOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="准入通过时间" v-if="approveType === 'all' || approveType === '1'">
            <el-date-picker
              v-model="state.value11"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="失效时间" v-if="approveType === '3'">
            <el-date-picker
              v-model="state.value11"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="拒绝人" v-if="approveType === '2'">
            <el-select v-model="form.value5" placeholder="请选择拒绝人">
              <el-option
                v-for="item in optionData.userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <el-table :data="state.tableData">
      <el-table-column label="机构名称" prop="companyName" min-width="150"></el-table-column>
      <el-table-column label="邀请时间" prop="name" min-width="180"></el-table-column>
      <el-table-column label="提交审核时间" prop="submitTime" min-width="180"></el-table-column>
      <el-table-column label="准入通过时间" prop="name" min-width="180" v-if="approveType === '1'"></el-table-column>
      <el-table-column
        label="准入状态"
        prop="name"
        min-width="150"
        v-if="approveType === 'all' || approveType === '0'"
      ></el-table-column>
      <el-table-column label="注册手机号" prop="phone" min-width="150"></el-table-column>
      <el-table-column label="注册人姓名" prop="username" min-width="150"></el-table-column>
      <el-table-column label="注册邮箱" prop="mail" min-width="150"></el-table-column>
      <el-table-column label="注册时间" prop="createTime" min-width="180"></el-table-column>
      <el-table-column label="机构类型" prop="name" min-width="150"></el-table-column>
      <el-table-column label="邀请人" prop="inviteName" min-width="150"></el-table-column>
      <el-table-column label="失效时间" prop="name" min-width="180" v-if="approveType === '3'"></el-table-column>
      <el-table-column label="委外经理" prop="name" min-width="150"></el-table-column>
      <el-table-column label="审批进度" prop="name" width="110" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="onProgress(scope.row.applyId, 'all')">查看进度</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" width="190" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="onDetail(scope.row.logId)">查看资料/合规审批结果</el-button>
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
import { reactive, ref, onMounted } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import approvalProgressDialog from '../components/approvalProgressDialog.vue'
import detailDrawer from './components/detailDrawer.vue'
const approveType = ref('all')
const tabPaneData = ref([
  {
    name: 'all',
    label: '全部'
  },
  {
    name: '0',
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
  value8: [],
  value11: []
})
const form: any = reactive({
  companyName: '',
  entrustStaffId: '',
  accessStatus: '',
  orgLevelId: '',
  value5: '',
  value6: '',
  value9: '',
  value10: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const getTableData = async () => {
  state.tableData = [
    {
      id: 22
    }
  ]
  // const params = handleForm()
  // const { code, data, total } = await Apis.registerAuditList({ ...params, ...queryParams })
  // if (code !== 200) return
  // state.tableData = data
  // state.total = total
}
const getOptionList = async () => {
  // const { code, data } = await Apis.registerAuditUserList()
  // if (code !== 200) return
  // optionData.userList = data
}
const handleForm = () => {
  const timeEnum = ['createTime', 'value8', 'value11']
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
  getTableData()
}
const onReset = () => {
  state.createTime = []
  state.value8 = []
  state.value11 = []
  Object.assign(form, defaultForm)
  getTableData()
}
const onProgress = (id: number, type: string) => {
  approvalProgressDialogRef.value.open(id, type)
}
const onDetail = (logId: any) => {
  detailDrawerRef.value.open(logId)
}
onMounted(async () => {
  getOptionList()
  getTableData()
})
</script>

<style lang="scss" scoped></style>
