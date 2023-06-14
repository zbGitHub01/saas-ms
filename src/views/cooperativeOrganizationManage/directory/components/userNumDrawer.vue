<template>
  <el-drawer v-model="drawer" size="88%" :direction="direction" :before-close="handleClose">
    <template #header>
      <h4>角色权限</h4>
    </template>
    <template #default>
      <el-tabs class="mb16" v-model="tabActive" @tab-click="onSearch">
        <el-tab-pane label="在职员工" name="0"></el-tab-pane>
        <el-tab-pane label="离职员工" name="1"></el-tab-pane>
      </el-tabs>
      <FormWrap @search="onSearch" @reset="onReset">
        <template #default>
          <el-form inline :model="form">
            <el-form-item label="姓名">
              <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="系统工号">
              <el-input v-model="form.sysAccount" placeholder="请输入系统工号"></el-input>
            </el-form-item>
            <el-form-item label="入职日期">
              <el-date-picker
                v-model="state.entryDate"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item label="证件号">
              <el-input v-model="form.idNo" placeholder="请输入证件号"></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-select v-model="form.positionId" placeholder="请选择职位">
                <el-option
                  v-for="item in positionList"
                  :key="item.itemId"
                  :label="item.itemText"
                  :value="item.itemId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色权限">
              <el-select v-model="form.roleId" placeholder="请选择角色权限">
                <el-option
                  v-for="item in roleList"
                  :key="item.itemId"
                  :label="item.itemText"
                  :value="item.itemId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账号状态">
              <el-select v-model="form.isDisable" placeholder="请选择账号状态">
                <el-option label="启用" :value="0"></el-option>
                <el-option label="禁用" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </FormWrap>
      <el-table :data="state.tableData">
        <el-table-column label="系统工号" prop="sysAccount" min-width="150" align="center"></el-table-column>
        <el-table-column label="姓名" prop="name" min-width="150" align="center"></el-table-column>
        <el-table-column label="职位" prop="positionId" min-width="150" align="center">
          <template #default="scope">
            <div>{{ positionText(scope.row.positionId) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" min-width="150" align="center"></el-table-column>
        <el-table-column label="证件号" prop="idNo" min-width="200" align="center"></el-table-column>
        <el-table-column label="角色权限" prop="roleNames" min-width="150" align="center">
          <template #default="scope">
            <div>{{ scope.row.roleNames && scope.row.roleNames.length>0?scope.row.roleNames.join(','):scope.row.roleNames }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否接案" prop="isAcceptCase" min-width="150" align="center">
          <template #default="scope">
            <div>{{ scope.row.isAcceptCase ===0 ? '否':'是' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="sex" min-width="150" align="center"></el-table-column>
        <el-table-column label="入职日期" prop="entryDate" min-width="150" align="center"></el-table-column>
        <el-table-column label="账号状态" prop="isDisable" min-width="150" align="center">
          <template #default="scope">
            <div>{{ scope.row.isDisable ===0?'启用':'禁用' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="钉钉" prop="dingDingName" min-width="150" align="center"></el-table-column>
        <el-table-column label="录入人" prop="inviter" min-width="150" align="center"></el-table-column>
        <el-table-column label="录入时间" prop="inviteTime" min-width="180" align="center"></el-table-column>
        <el-table-column label="修改人" prop="updater" min-width="150" align="center"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime" min-width="180" align="center"></el-table-column>
      </el-table>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import { useCommonStore } from '@/store/modules/common'
const commonStore = useCommonStore()
const tabActive = ref('0')
const drawer = ref(false)
const direction = ref('rtl')
const orgTenantId = ref()
const roleList = computed(() => commonStore.dropdownList.ROLE_LIST)
const positionList = computed(() => commonStore.dropdownList.POSITION_LIST)
const state = reactive({
  tableData: [],
  entryDate: []
})
const form = reactive({
  name: '',
  phone: '',
  sysAccount: '',
  idNo: '',
  positionId: '',
  roleId: '',
  isDisable: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const handleClose = () => {
  drawer.value = false
}

const open = (relationTenantId: number) => {
  orgTenantId.value = relationTenantId
  getTableData()
  drawer.value = true
}
const onSearch = () => {
  nextTick(() => {
    getTableData()
  })
}
const onReset = () => {
  state.entryDate = []
  Object.assign(form, defaultForm)
  getTableData()
}
const positionText = val => {
  return positionList.find(item => item.id === val)?.name
}

const getTableData = async () => {
  if (state.entryDate.length === 0) {
    form.entryDateStart = ''
    form.entryDateEnd = ''
  } else {
    form.entryDateStart = state.entryDate[0]
    form.entryDateEnd = state.entryDate[1]
  }
  const params = {
    ...form,
    relationTenantId: orgTenantId.value,
    isDimission: Number(tabActive.value)
  }
  const { code, data } = await Apis.clientOrgEmployeePage(params)
  if (code !== 200) return
  state.tableData = data.data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
