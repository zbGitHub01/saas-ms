<template>
  <div class="mt16">
    <el-radio-group class="mb20" v-model="type">
      <el-radio :label="0">在职员工</el-radio>
      <el-radio :label="1">离职员工</el-radio>
    </el-radio-group>
    <FormWrap @search="onSearch" @reset="onReset">
      <template #default>
        <el-form :model="searchForm" inline>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="searchForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="账号状态" prop="userStatus">
            <el-select v-model="searchForm.userStatus" placeholder="请选择账号状态">
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="department">
            <el-cascader
              v-model="searchForm.department"
              :options="[]"
              :props="{ checkStrictly: true }"
              clearable
              placeholder="请选择所属部门"
            />
          </el-form-item>
          <el-form-item label="部门角色" prop="role">
            <el-select v-model="searchForm.role" placeholder="请选择部门角色">
              <el-option label="角色1" value="1" />
              <el-option label="角色2" value="0" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <OperationBar>
      <template #default>
        <el-button type="primary" :icon="Plus" @click="inviteEmployeesShow = true">邀请员工</el-button>
        <el-button type="primary" :icon="Plus">添加员工</el-button>
      </template>
    </OperationBar>
    <el-table :data="tableData">
      <el-table-column label="员工ID" prop="name" min-width="150"></el-table-column>
      <el-table-column label="姓名" prop="name" min-width="150"></el-table-column>
      <el-table-column label="手机" prop="name" width="160"></el-table-column>
      <el-table-column label="证件号" prop="name" width="180"></el-table-column>
      <el-table-column label="性别" prop="name" width="120"></el-table-column>
      <el-table-column label="账号状态" prop="name" width="150"></el-table-column>
      <el-table-column label="入职日期" prop="name" width="160"></el-table-column>
      <el-table-column label="所属部门" prop="name" min-width="150"></el-table-column>
      <el-table-column label="部门角色" prop="name" min-width="150"></el-table-column>
      <el-table-column label="邀请人" prop="name" min-width="150"></el-table-column>
      <el-table-column label="邀请时间" prop="name" min-width="150"></el-table-column>
      <el-table-column label="操作" prop="name" width="150" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="handleClick(scope.row)">启用</el-button>
          <el-button type="primary" link @click="handleClick(scope.row)">离职</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <InviteEmployeesDialog v-model:dialog-visible="inviteEmployeesShow" />
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import InviteEmployeesDialog from './components/InviteEmployeesDialog.vue'

const type = ref(1)
const searchForm = reactive({
  name: null,
  mobile: null,
  userStatus: null,
  department: null,
  role: null
})
const onSearch = () => {}
const onReset = () => {}
const tableData = ref([{ name: '张兮兮' }])
const inviteEmployeesShow = ref(false)
const handleClick = (row) => {}
</script>

<style lang="scss" scoped>

</style>
