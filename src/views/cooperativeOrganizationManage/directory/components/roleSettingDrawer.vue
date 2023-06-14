<template>
  <el-drawer v-model="drawer" size="88%" :direction="direction" :before-close="handleClose">
    <template #header>
      <h4>角色设置</h4>
    </template>
    <template #default>
      <el-table :data="state.tableData">
        <el-table-column label="角色名称" prop="name" min-width="150" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="remark" min-width="150" align="center"></el-table-column>
        <el-table-column label="使用人数" prop="employeeCount" min-width="150" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="150" align="center"></el-table-column>
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
  orgRoleDetail(relationTenantId)
  drawer.value = true
}

const orgRoleDetail = async relationTenantId => {
  const { code, data } = await Apis.clientOrgRoleDetail({
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
