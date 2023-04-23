<template>
  <el-drawer v-model="drawer" size="88%" :direction="direction" :before-close="handleClose">
    <template #header>
      <h4>角色权限</h4>
    </template>
    <template #default>
      <el-tabs class="mb16" v-model="tabActive">
        <el-tab-pane label="在职员工" name="1"></el-tab-pane>
        <el-tab-pane label="离职员工" name="2"></el-tab-pane>
      </el-tabs>
      <FormWrap @search="onSearch" @reset="onReset">
        <template #default>
          <el-form inline :model="form">
            <el-form-item label="姓名">
              <el-input v-model="form.value1" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.value2" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="系统工号">
              <el-input v-model="form.value3" placeholder="请输入系统工号"></el-input>
            </el-form-item>
            <el-form-item label="入职日期">
              <el-date-picker
                v-model="state.value4"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item label="证件号">
              <el-input v-model="form.value5" placeholder="请输入证件号"></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-select v-model="form.value6" placeholder="请选择职位">
                <el-option
                  v-for="item in optionData.value6List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色权限">
              <el-select v-model="form.value7" placeholder="请选择角色权限">
                <el-option
                  v-for="item in optionData.value7List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账号状态">
              <el-select v-model="form.value8" placeholder="请选择账号状态">
                <el-option
                  v-for="item in optionData.value8List"
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
        <el-table-column label="系统工号" prop="name" min-width="150"></el-table-column>
        <el-table-column label="姓名" prop="name" min-width="150"></el-table-column>
        <el-table-column label="职位" prop="name" min-width="150"></el-table-column>
        <el-table-column label="手机号" prop="name" min-width="150"></el-table-column>
        <el-table-column label="证件号" prop="name" min-width="150"></el-table-column>
        <el-table-column label="角色权限" prop="name" min-width="150"></el-table-column>
        <el-table-column label="是否接案" prop="name" min-width="150"></el-table-column>
        <el-table-column label="性别" prop="name" min-width="150"></el-table-column>
        <el-table-column label="入职日期" prop="name" min-width="150"></el-table-column>
        <el-table-column label="账号状态" prop="name" min-width="150"></el-table-column>
        <el-table-column label="钉钉" prop="name" min-width="150"></el-table-column>
        <el-table-column label="录入人" prop="name" min-width="150"></el-table-column>
        <el-table-column label="录入时间" prop="name" min-width="150"></el-table-column>
        <el-table-column label="修改人" prop="name" min-width="150"></el-table-column>
        <el-table-column label="修改时间" prop="name" min-width="150"></el-table-column>
      </el-table>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// import { getUserMenuPermission, addOrUpdateUserMenuPermission } from '@/api/modules/user'
const tabActive = ref('1')
const drawer = ref(false)
const direction = ref('rtl')
interface stateParams {
  [key: string]: any
  detail: any
  tableData: any[]
}
const state = reactive<stateParams>({
  detail: {},
  tableData: [],
  value4: []
})
const optionData = reactive({
  value6List: [],
  value7List: [],
  value8List: []
})
const form: any = reactive({
  value1: '',
  value2: '',
  value3: '',
  value5: '',
  value6: '',
  value7: '',
  value8: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const handleClose = () => {
  drawer.value = false
}
const open = (detail: any) => {
  drawer.value = true
  state.detail = detail
  getUserList()
}
const onSearch = () => {
  getUserList()
}
const onReset = () => {
  state.value4 = []
  Object.assign(form, defaultForm)
  getUserList()
}

const getUserList = async () => {
  if (state.value4.length === 0) {
    form.value4Start = ''
    form.value4End = ''
  } else {
    form.value4Start = state.value4[0]
    form.value4End = state.value4[1]
  }
  // const { code, data } = await getUserMenuPermission({
  //   globalUserUuid: state.detail.globalUserUuid,
  //   roleId: state.detail.roleId
  // })
  // if (code !== 200) return
  const data = Array(10).fill({ name: '东岸科技' })
  state.tableData = data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
