<template>
  <el-drawer v-model="drawer" size="88%" :direction="direction" :before-close="handleClose">
    <template #header>
      <h4>角色权限</h4>
    </template>
    <template #default>
      <el-table :data="state.tableData" row-key="id" border>
        <el-table-column label="组织架构" prop="name" min-width="150" align="left"></el-table-column>
        <el-table-column label="员工数量" prop="employeeCount" min-width="150" align="center"></el-table-column>
      </el-table>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
const drawer = ref(false)
const direction = ref('rtl')
const state = reactive({
  tableData: []
})
const handleClose = () => {
  drawer.value = false
}
const open = relationTenantId => {
  getOrgDeptDetail(relationTenantId)
  drawer.value = true
}

const getOrgDeptDetail = async relationTenantId => {
  const { code, data } = await Apis.clientOrgDeptDetail({
    relationTenantId
  })
  if (code !== 200) return
  state.tableData = data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
