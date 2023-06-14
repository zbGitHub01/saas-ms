<template>
  <div class="mt16">
    <el-radio-group v-model="isDimission" @change="fetchAllEmployees" class="mb20">
      <el-radio :label="0">在职员工</el-radio>
      <el-radio :label="1">离职员工</el-radio>
    </el-radio-group>
    <FormWrap @search="fetchAllEmployees" @reset="onReset">
      <template #default>
        <el-form :model="searchForm" inline>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="账号状态" prop="isDisable">
            <el-select v-model="searchForm.isDisable" clearable placeholder="请选择账号状态">
              <el-option label="启用" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="deptId">
            <el-cascader
              v-model="searchForm.deptId"
              :options="deptTree"
              :props="{ checkStrictly: true, label: 'itemText', value: 'itemId' }"
              clearable
              placeholder="请选择所属部门"
            />
          </el-form-item>
          <el-form-item label="部门角色" prop="roleId">
            <el-select v-model="searchForm.roleId" clearable placeholder="请选择部门角色">
              <el-option v-for="item in roleList" :key="item.id" :label="item.itemText" :value="item.itemId" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <OperationBar>
      <template #default>
        <el-button v-auth="'ALL_EMPLOYEE_ADD'" type="primary" :icon="Plus" @click="inviteEmployeesShow = true">
          邀请员工
        </el-button>
        <el-button type="primary" :icon="Upload" @click="batchImportVisible = true">批量导入</el-button>
      </template>
    </OperationBar>
    <el-table :data="employeeList">
      <el-table-column label="员工ID" prop="employeeId" min-width="150"></el-table-column>
      <el-table-column label="姓名" prop="name" min-width="150"></el-table-column>
      <el-table-column label="手机" prop="phone" width="160"></el-table-column>
      <el-table-column label="证件号" prop="idNo" width="180"></el-table-column>
      <el-table-column label="性别" prop="sex" width="120"></el-table-column>
      <el-table-column label="账号状态" prop="isDisable" width="150">
        <template #default="scope">
          <span :class="[scope.row.isDisable ? 'danger' : 'success']">{{ scope.row.isDisable ? '禁用' : '启用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职日期" prop="entryDate" width="160"></el-table-column>
      <el-table-column label="所属部门" prop="deptName" min-width="150"></el-table-column>
      <el-table-column label="部门角色" prop="roleNames" min-width="150"></el-table-column>
      <el-table-column label="邀请人" prop="inviter" min-width="150"></el-table-column>
      <el-table-column label="邀请时间" prop="inviteTime" min-width="200"></el-table-column>
      <el-table-column label="操作" prop="name" width="200" align="center" fixed="right">
        <template #default="scope">
          <el-button :type="scope.row.isDisable ? 'success' : 'danger'" link @click="setStatus(scope.row)">
            {{ scope.row.isDisable ? '启用' : '禁用' }}
          </el-button>
          <el-button type="primary" link @click="setDimission(scope.row)">离职</el-button>
          <el-button type="primary" link @click="editEmployee(scope.row)">查看/编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-model:page-size="pageSize" v-model:page="page" :total="total" @pagination="fetchAllEmployees" />
  </div>
  <InviteEmployeesDialog v-model:dialog-visible="inviteEmployeesShow" />
  <BatchImportDialog v-model:dialog-visible="batchImportVisible" />
  <EditEmployeeDialog v-model:drawer-visible="editEmployeeVisible" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import Apis from '@/api/modules/systemSetting'
import InviteEmployeesDialog from './components/InviteEmployeesDialog.vue'
import BatchImportDialog from './components/BatchImportDialog.vue'
import EditEmployeeDialog from './components/EditEmployeeDrawer/index.vue'
import { ElMessageBox } from 'element-plus'
import { useCommonStore } from '@/store/modules/common'

const commonStore = useCommonStore()
const isDimission = ref(0)
const searchForm = reactive({
  name: null,
  phone: null,
  isDisable: null,
  deptId: [],
  roleId: null
})
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

const onReset = () => {}
const employeeList = ref([])
const roleList = computed(() => commonStore.dropdownList.ROLE_LIST)
const deptTree = computed(() => commonStore.dropdownList.DEPT_TREE)
const inviteEmployeesShow = ref(false)
const batchImportVisible = ref(false)
const editEmployeeVisible = ref(false)
const fetchAllEmployees = async () => {
  const deptId = searchForm.deptId
  const params = {
    ...searchForm,
    isDisable: typeof searchForm.isDisable === 'number' ? searchForm.isDisable : null,
    deptId: deptId.length ? deptId[deptId.length - 1] : null,
    isDimission: isDimission.value,
    page: page.value,
    pageSize: pageSize.value
  }
  const { data } = await Apis.findAllEmployeeList(params)
  employeeList.value = data.data.map(item => {
    item.roleNames = item.roleNames && item.roleNames.length ? item.roleNames.join(',') : ''
    return {
      ...item
    }
  })
  total.value = Number(data.total)
}
const setStatus = async row => {
  const isDisable = !row.isDisable
  const isConfirm = await ElMessageBox.confirm(`是否确认${isDisable ? '禁用' : '启用'}该员工吗？`, '提示', {
    type: 'warning'
  }).catch(() => {})
  if (!isConfirm) return
  await Apis.updateEmployeeStatus({ employeeId: row.employeeId, isDisable: Number(isDisable) })
  await fetchAllEmployees()
}
const setDimission = async row => {
  const isConfirm = await ElMessageBox.confirm(`是否确认离职该员工吗？`, '提示', { type: 'warning' }).catch(() => {})
  if (!isConfirm) return
  await Apis.updateEmployeeDimission({ employeeId: row.employeeId, isDimission: 1 })
  await fetchAllEmployees()
}
const editEmployee = row => {
  console.log(row)
  editEmployeeVisible.value = true
}
fetchAllEmployees()
</script>

<style lang="scss" scoped>
.success {
  color: var(--el-color-success);
}
.danger {
  color: var(--el-color-danger);
}
</style>
